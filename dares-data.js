// Contenu des défis, du plus tranquille au plus intense.
// Tu peux librement modifier, retirer ou ajouter des lignes ici,
// ou utiliser le champ "défi personnalisé" directement dans l'app.

const LEVELS = [
  {
    id: 1,
    name: "Tendre",
    desc: "Doux et mignon — pour dire bonjour",
    color: "#a9c9b8",
    dares: [
      "Envoie un vocal « bonjour » avec la voix la plus douce que tu as.",
      "Envoie une photo de ce que tu vois par ta fenêtre là, maintenant.",
      "Décris ta journée en 3 emojis seulement.",
      "Envoie une photo de ta boisson chaude (ou froide) du moment.",
      "Raconte le tout premier souvenir qui te vient en pensant à moi.",
      "Envoie une chanson qui te fait penser à moi, sans explication.",
      "Fais-moi un compliment sincère que tu ne m'as jamais dit.",
      "Envoie un selfie avec ton sourire le plus naturel.",
      "Dis-moi une chose pour laquelle tu es reconnaissant·e aujourd'hui, à propos de nous."
    ]
  },
  {
    id: 2,
    name: "Complice",
    desc: "Un peu plus taquin, toujours léger",
    color: "#d3c48a",
    dares: [
      "Envoie un vocal où tu racontes un souvenir marrant de nous deux.",
      "Décris en 5 mots exactement ce que tu ressens là, maintenant.",
      "Envoie une photo de toi en train de faire un truc banal du quotidien.",
      "Raconte ce qu'on ferait ensemble si tu débarquais chez moi dans 10 minutes.",
      "Envoie ta chanson « je pense à toi » du moment, avec un mot en légende.",
      "Imite ma façon de parler dans un vocal de 15 secondes.",
      "Fais un dessin ou un griffonnage rapide de nous deux et envoie la photo.",
      "Envoie 3 mots qui décrivent ce que tu préfères chez moi côté caractère.",
      "Raconte ton fantasme de rendez-vous parfait avec moi, version sage."
    ]
  },
  {
    id: 3,
    name: "Charmeur",
    desc: "Séduction assumée, encore tout public",
    color: "#dba15c",
    dares: [
      "Envoie un vocal où tu me dis ce que tu préfères chez moi physiquement.",
      "Décris la première chose que tu ferais si on se retrouvait dans 5 minutes.",
      "Envoie une photo de toi dans une tenue que tu sais que j'aime bien.",
      "Raconte le rêve le plus romantique que tu as fait de nous deux.",
      "Envoie un vocal chuchoté avec un mot doux.",
      "Décris en mots ton endroit préféré pour un câlin.",
      "Envoie une photo avec ton regard le plus charmeur.",
      "Raconte le moment où tu as su que tu craquais pour moi.",
      "Envoie-moi une lettre d'amour de 3 phrases, écrite maintenant."
    ]
  },
  {
    id: 4,
    name: "Brûlant",
    desc: "Ça chauffe — à faire si vous êtes tous les deux à l'aise",
    color: "#cf6d5e",
    dares: [
      "Envoie un vocal où tu me dis ce qui te manque le plus de moi physiquement.",
      "Décris avec des mots ce que tu ferais en premier si on se retrouvait ce soir.",
      "Envoie une photo suggestive que tu es vraiment à l'aise de partager.",
      "Raconte un fantasme que tu n'as encore jamais partagé avec moi.",
      "Envoie un vocal où tu me dis un mot un peu coquin à l'oreille.",
      "Décris la tenue que tu portes en ce moment, façon aguicheuse.",
      "Raconte le compliment le plus osé que tu aies envie de me faire.",
      "Envoie une photo de ta main / ton bras / ton cou, prise sous un bon angle."
    ]
  },
  {
    id: 5,
    name: "Sans limites",
    desc: "Le plus intense — à personnaliser vous-mêmes, ce sont des pistes",
    color: "#c65b6c",
    dares: [
      "Décris en détail, avec des mots seulement, ce que tu me ferais si j'étais avec toi ce soir.",
      "Envoie un vocal sans filtre sur ce dont tu as vraiment envie ce soir.",
      "Partage ton fantasme le plus intime, celui que tu gardes d'habitude pour toi.",
      "Envoie la photo la plus intime que tu es prêt·e à envoyer, à ton rythme.",
      "Décris minute par minute la soirée que tu imagines si on se retrouvait là.",
      "Réponds honnêtement : quelle est la chose que tu meurs d'envie qu'on fasse ensemble bientôt ?",
      "Ajoutez ici vos propres défis les plus personnels — ce niveau est fait pour être réécrit à deux."
    ]
  }
];
