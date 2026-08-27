(function () {
  "use strict";

  // ---------- Firebase init ----------
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const dareCollection = db.collection("couples").doc(COUPLE_ID).collection("dares");

  // ---------- State ----------
  let currentUser = null;       // "moi" | "crush"
  let selectedWho = null;       // picked on the login screen before password check
  let selectedLevel = null;     // level object currently open in the picker
  let allDares = [];            // live cache from Firestore, newest first
  let unsubscribe = null;

  const otherUser = (u) => (u === "moi" ? "crush" : "moi");

  // ---------- DOM refs ----------
  const screenLogin = document.getElementById("screen-login");
  const screenApp = document.getElementById("screen-app");
  const whoBtns = document.querySelectorAll(".who-btn");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");
  const whoamiBadge = document.getElementById("whoami-badge");
  const logoutBtn = document.getElementById("logout-btn");

  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const badgeRecus = document.getElementById("badge-recus");

  const levelsList = document.getElementById("levels-list");
  const darePicker = document.getElementById("dare-picker");
  const darePickerTitle = document.getElementById("dare-picker-title");
  const dareList = document.getElementById("dare-list");
  const backToLevels = document.getElementById("back-to-levels");
  const customDareInput = document.getElementById("custom-dare-input");

  const recusList = document.getElementById("recus-list");
  const recusEmpty = document.getElementById("recus-empty");
  const historiqueList = document.getElementById("historique-list");
  const historiqueEmpty = document.getElementById("historique-empty");

  const sendModal = document.getElementById("send-modal");
  const sendModalText = document.getElementById("send-modal-text");
  const sendModalLevel = document.querySelector(".modal-level");
  const sendCancel = document.getElementById("send-cancel");
  const sendConfirm = document.getElementById("send-confirm");

  const toastEl = document.getElementById("toast");

  let pendingSend = null; // { level, text }

  // ---------- Toast ----------
  let toastTimer = null;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 2400);
  }

  // ---------- Login screen ----------
  whoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      whoBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedWho = btn.dataset.who;
      loginError.textContent = "";
    });
  });

  function attemptLogin() {
    if (!selectedWho) {
      loginError.textContent = "Choisis d'abord qui tu es.";
      return;
    }
    const entered = passwordInput.value;
    if (entered && entered === PASSWORDS[selectedWho]) {
      currentUser = selectedWho;
      localStorage.setItem("dad_currentUser", currentUser);
      enterApp();
    } else {
      loginError.textContent = "Mot de passe incorrect.";
    }
  }

  loginBtn.addEventListener("click", attemptLogin);
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptLogin();
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("dad_currentUser");
    currentUser = null;
    if (unsubscribe) unsubscribe();
    passwordInput.value = "";
    screenApp.classList.add("hidden");
    screenLogin.classList.remove("hidden");
  });

  // auto-login if already remembered on this device
  const remembered = localStorage.getItem("dad_currentUser");
  if (remembered === "moi" || remembered === "crush") {
    currentUser = remembered;
    enterApp();
  }

  function enterApp() {
    screenLogin.classList.add("hidden");
    screenApp.classList.remove("hidden");
    whoamiBadge.textContent = currentUser === "moi" ? "Toi" : "fille";
    renderLevels();
    subscribeToDares();
  }

  // ---------- Tabs ----------
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    });
  });

  // ---------- Levels & dare picker ----------
  function renderLevels() {
    levelsList.innerHTML = "";
    LEVELS.forEach((level) => {
      const card = document.createElement("button");
      card.className = "level-card lv-" + level.id;
      card.innerHTML = `
        <div class="level-flame" style="background:${level.color}">${level.id}</div>
        <div>
          <div class="level-name">${level.name}</div>
          <div class="level-desc">${level.desc}</div>
        </div>
        <div class="level-dots">${dotsHtml(level.id)}</div>
      `;
      card.addEventListener("click", () => openLevel(level));
      levelsList.appendChild(card);
    });
  }

  function dotsHtml(n) {
    let html = "";
    for (let i = 1; i <= 5; i++) html += `<span class="${i <= n ? "on" : ""}"></span>`;
    return html;
  }

  function openLevel(level) {
    selectedLevel = level;
    darePickerTitle.textContent = level.name;
    darePickerTitle.style.color = level.color;
    dareList.innerHTML = "";
    level.dares.forEach((text) => {
      const item = document.createElement("button");
      item.className = "dare-item";
      item.textContent = text;
      item.addEventListener("click", () => openSendModal(level, text));
      dareList.appendChild(item);
    });
    customDareInput.value = "";
    levelsList.classList.add("hidden");
    darePicker.classList.remove("hidden");
  }

  backToLevels.addEventListener("click", () => {
    darePicker.classList.add("hidden");
    levelsList.classList.remove("hidden");
  });

  customDareInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && customDareInput.value.trim()) {
      openSendModal(selectedLevel, customDareInput.value.trim());
    }
  });

  // ---------- Send confirmation modal ----------
  function openSendModal(level, text) {
    pendingSend = { level, text };
    sendModalLevel.textContent = "Niveau " + level.id + " · " + level.name;
    sendModalText.textContent = text;
    sendModal.classList.remove("hidden");
  }

  sendCancel.addEventListener("click", () => {
    sendModal.classList.add("hidden");
    pendingSend = null;
  });

  sendConfirm.addEventListener("click", async () => {
    if (!pendingSend) return;
    sendConfirm.disabled = true;
    try {
      await dareCollection.add({
        levelId: pendingSend.level.id,
        levelName: pendingSend.level.name,
        levelColor: pendingSend.level.color,
        text: pendingSend.text,
        sender: currentUser,
        status: "envoye",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      sendModal.classList.add("hidden");
      darePicker.classList.add("hidden");
      levelsList.classList.remove("hidden");
      showToast("Défi envoyé ✉");
    } catch (err) {
      showToast("Oups, l'envoi a échoué. Vérifie ta config Firebase.");
      console.error(err);
    } finally {
      sendConfirm.disabled = false;
      pendingSend = null;
    }
  });

  // ---------- Firestore live sync ----------
  function subscribeToDares() {
    if (unsubscribe) unsubscribe();
    unsubscribe = dareCollection
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snap) => {
          allDares = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          renderRecus();
          renderHistorique();
        },
        (err) => {
          console.error(err);
          showToast("Connexion à la base impossible — vérifie firebase-config.js");
        }
      );
  }

  function fmtTime(ts) {
    if (!ts || !ts.toDate) return "à l'instant";
    const d = ts.toDate();
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) +
      " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  function renderRecus() {
    const mine = allDares.filter((d) => d.sender === otherUser(currentUser));
    const pending = mine.filter((d) => d.status !== "fait");

    badgeRecus.textContent = pending.length;
    badgeRecus.classList.toggle("hidden", pending.length === 0);

    recusList.innerHTML = "";
    recusEmpty.classList.toggle("hidden", mine.length > 0);

    mine.forEach((d) => {
      const card = document.createElement("div");
      card.className = "feed-card";
      card.innerHTML = `
        <div class="feed-meta">
          <span class="feed-level-tag" style="background:${d.levelColor}">${d.levelName}</span>
          <span class="feed-time">${fmtTime(d.createdAt)}</span>
        </div>
        <div class="feed-text">${escapeHtml(d.text)}</div>
        ${d.status === "fait"
          ? `<div class="feed-status done">✓ Marqué comme fait</div>`
          : `<div class="feed-actions"><button class="accept-btn">Marquer comme fait ✅</button></div>`
        }
      `;
      if (d.status !== "fait") {
        card.querySelector(".accept-btn").addEventListener("click", () => markDone(d.id));
      }
      recusList.appendChild(card);
    });
  }

  function renderHistorique() {
    historiqueList.innerHTML = "";
    historiqueEmpty.classList.toggle("hidden", allDares.length > 0);

    allDares.forEach((d) => {
      const mineSent = d.sender === currentUser;
      const card = document.createElement("div");
      card.className = "feed-card";
      card.innerHTML = `
        <div class="feed-meta">
          <span class="feed-level-tag" style="background:${d.levelColor}">${d.levelName}</span>
          <span class="feed-time">${fmtTime(d.createdAt)}</span>
        </div>
        <div class="feed-text">${escapeHtml(d.text)}</div>
        <div class="feed-status ${d.status === "fait" ? "done" : ""}">
          ${mineSent ? "Envoyé par toi" : "Envoyé par ton crush"} ·
          ${d.status === "fait" ? "fait ✓" : "en attente"}
        </div>
      `;
      historiqueList.appendChild(card);
    });
  }

  async function markDone(id) {
    try {
      await dareCollection.doc(id).update({
        status: "fait",
        doneAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showToast("Noté comme fait ✓");
    } catch (err) {
      console.error(err);
      showToast("Impossible de mettre à jour — réessaie.");
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
