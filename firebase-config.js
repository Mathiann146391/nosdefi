// ============================================================
// À REMPLIR PAR TOI — voir le README pour les instructions pas-à-pas.
// Rien de tout ça n'est un vrai système de sécurité : c'est juste
// assez pour que vous deux seuls puissiez utiliser le site facilement.
// Ne mets jamais d'informations sensibles (vraies, importantes) ici.
// ============================================================

// 1) Configuration de ton projet Firebase (Firestore).
//    Tu la récupères dans la console Firebase > Paramètres du projet.
const firebaseConfig = {
  apiKey: "AIzaSyATINFxwrm53Tid-Skj8M_LU-1kL9yRQYc",
  authDomain: "nos-defi.firebaseapp.com",
  projectId: "nos-defi",
  storageBucket: "nos-defi.firebasestorage.app",
  messagingSenderId: "570456496577",
  appId: "1:570456496577:web:d4331643e1d8d43e2eb740"
};

// 2) Identifiant unique de votre couple (sert à isoler vos données
//    des autres personnes qui utiliseraient le même projet Firebase).
//    Mets n'importe quel mot secret, le même pour vous deux.
const COUPLE_ID = "notre-histoire";

// 3) Les deux mots de passe (choisis ce que tu veux).
const PASSWORDS = {
  moi: "mat",
  crush: "juju"
};
