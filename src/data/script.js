/**
 * Script narratif de la vertical slice.
 *
 * Les expressions correspondent aux planches fournies :
 *   Liam  1 inquiet · 2 surpris · 3 triste · 4 neutre · 5 hesitant · 6 sourire
 *   Clara 1 exclame · 2 ferme   · 3 tendre · 4 triste · 5 parle   · 6 mal a l'aise
 *   Mere  1 inquiete · 2 neutre · 3 sourire · 4 parle · 5 pensive · 6 genee
 */

export const EMOTIONS = {
  liam: { inquiet: 1, surpris: 2, triste: 3, neutre: 4, hesitant: 5, sourire: 6 },
  clara: { exclame: 1, ferme: 2, tendre: 3, triste: 4, parle: 5, malaise: 6 },
  mere: { inquiete: 1, neutre: 2, sourire: 3, parle: 4, pensive: 5, genee: 6 }
}

export const PERSONNAGES = {
  liam: { nom: 'Liam', dossier: 'liam' },
  clara: { nom: 'Clara', dossier: 'clara' },
  mere: { nom: 'La mère de Clara', dossier: 'mere' }
}

/* ------------------------------------------------------------------ */
/* Prologue - avant de prendre le controle de Liam                      */
/* ------------------------------------------------------------------ */

export const PROLOGUE = [
  {
    narration: "Namur. 23h04. Il pleut depuis mardi.",
    fond: 'nuit'
  },
  {
    perso: 'liam',
    emotion: 'neutre',
    texte:
      "Salut. Moi c'est Liam. J'ai 19 ans, je suis en technique graphique à la HEAJ."
  },
  {
    perso: 'liam',
    emotion: 'hesitant',
    texte:
      "Si vous me croisez dans les couloirs, vous ne me remarquerez pas. Je reste dans mon coin. C'est plus simple."
  },
  {
    perso: 'liam',
    emotion: 'triste',
    texte:
      "Depuis que mes parents ne sont plus là, l'appartement est devenu beaucoup trop grand. Il n'y a plus que le frigo qui fait du bruit."
  },
  {
    perso: 'liam',
    emotion: 'sourire',
    texte:
      "Et puis il y a Clara. On s'est rencontrés sur un serveur Discord. Au début c'était juste pour entendre une voix."
  },
  {
    perso: 'liam',
    emotion: 'inquiet',
    texte:
      "Maintenant c'est devenu tout. Sauf qu'elle habite en France, et qu'elle veut qu'on se voie. Pour de vrai."
  },
  {
    narration:
      "Ce soir, elle est connectée depuis vingt minutes et elle n'a rien écrit.",
    fond: 'nuit'
  },
  {
    narration:
      "Déplacez-vous avec les flèches ou ZQSD. Espace pour interagir.\nL'ordinateur est allumé au fond de la pièce.",
    fond: 'consigne'
  }
]

/* ------------------------------------------------------------------ */
/* La conversation - coeur du visual novel                              */
/* ------------------------------------------------------------------ */

export const CONVERSATION = {
  depart: 'c1',

  c1: {
    perso: 'clara',
    emotion: 'malaise',
    texte: "Salut. J'attendais que tu te connectes.",
    suite: 'c2'
  },

  c2: {
    perso: 'clara',
    emotion: 'triste',
    texte:
      "Je vais pas tourner autour du pot. Ça fait sept mois qu'on se parle tous les soirs et je ne t'ai jamais touché.",
    suite: 'c3'
  },

  c3: {
    perso: 'liam',
    emotion: 'surpris',
    texte: "Clara…",
    suite: 'c4'
  },

  c4: {
    perso: 'clara',
    emotion: 'parle',
    texte:
      "Non, laisse-moi finir. J'ai regardé les trains. Il y en a un le 14. Tu serais là pour les vacances.",
    suite: 'c5'
  },

  c5: {
    perso: 'clara',
    emotion: 'exclame',
    texte:
      "Ma mère est d'accord. Elle a préparé la chambre du haut. Elle t'a même acheté du pain d'épices parce que je lui ai dit que t'aimais ça.",
    suite: 'c6'
  },

  c6: {
    narration:
      "Une porte s'ouvre derrière elle. On entend une voix, en retrait, mal captée par le micro."
  , suite: 'c7' },

  c7: {
    perso: 'mere',
    emotion: 'parle',
    texte: "Clara, tu descends manger ? … Ah pardon, tu es en appel. Bonsoir Liam.",
    suite: 'c8'
  },

  c8: {
    perso: 'mere',
    emotion: 'sourire',
    texte:
      "On a hâte de te rencontrer, tu sais. Clara parle de toi tout le temps.",
    suite: 'c9'
  },

  c9: {
    narration:
      "La porte se referme. Il reste le bruit de la pluie sur ta fenêtre, et le ventilateur de ton ordinateur.",
    suite: 'c10'
  },

  c10: {
    perso: 'liam',
    emotion: 'inquiet',
    texte:
      "Elle a préparé une chambre. Il y a une chambre qui m'attend quelque part.",
    suite: 'choix1'
  },

  /* ---------------- premier choix ---------------- */

  choix1: {
    perso: 'clara',
    emotion: 'ferme',
    texte: "Alors ? Tu dis rien.",
    choix: [
      {
        texte: "« Je vais venir. Le 14. »",
        stabilite: +6,
        note: 'promesse',
        suite: 'p_promesse'
      },
      {
        texte: "« J'ai peur, Clara. »",
        stabilite: +2,
        note: 'aveu',
        suite: 'p_aveu'
      },
      {
        texte: "« Pourquoi tu me mets la pression ? »",
        stabilite: -8,
        note: 'defense',
        suite: 'p_defense'
      },
      {
        texte: "…ne rien répondre.",
        stabilite: -12,
        note: 'silence',
        suite: 'p_silence'
      }
    ]
  },

  p_promesse: {
    perso: 'clara',
    emotion: 'tendre',
    texte:
      "Tu dis ça sérieusement ? … Liam, si tu le dis juste pour que j'arrête, c'est pire.",
    suite: 'c11'
  },

  p_aveu: {
    perso: 'clara',
    emotion: 'triste',
    texte:
      "Peur de quoi ? De moi ? … D'accord. Au moins tu me dis quelque chose de vrai.",
    suite: 'c11'
  },

  p_defense: {
    perso: 'clara',
    emotion: 'exclame',
    texte:
      "De la pression ? Je te demande d'exister en dehors d'un écran, Liam. Une fois.",
    suite: 'c11'
  },

  p_silence: {
    narration:
      "Douze secondes. Sur Discord, douze secondes de silence, ça s'entend.",
    suite: 'p_silence2'
  },

  p_silence2: {
    perso: 'clara',
    emotion: 'triste',
    texte: "Ok. C'est ce que je pensais.",
    suite: 'c11'
  },

  /* ---------------- montée ---------------- */

  c11: {
    perso: 'liam',
    emotion: 'hesitant',
    texte:
      "Je voudrais lui expliquer. Que partir d'ici, c'est admettre qu'il n'y a plus rien à garder.",
    suite: 'c12'
  },

  c12: {
    perso: 'liam',
    emotion: 'triste',
    texte:
      "Que si je rate mon année, je perds l'appart, et l'appart c'est le dernier endroit où ils ont été vivants.",
    suite: 'choix2'
  },

  /* ---------------- second choix ---------------- */

  choix2: {
    perso: 'clara',
    emotion: 'malaise',
    texte:
      "Dis-moi juste un truc. Est-ce que je suis quelqu'un pour toi, ou est-ce que je suis un endroit où tu te caches ?",
    choix: [
      {
        texte: "Lui parler de ses parents. Vraiment.",
        stabilite: +10,
        note: 'ouverture',
        suite: 'p_ouverture',
        requiert: 'photo_parents',
        indice: 'Nécessite la photo - été 2019'
      },
      {
        texte: "« Tu es la seule chose qui tienne debout. »",
        stabilite: +4,
        note: 'attachement',
        suite: 'p_attachement'
      },
      {
        texte: "Fermer l'ordinateur.",
        stabilite: -18,
        note: 'fuite',
        suite: 'p_fuite'
      }
    ]
  },

  p_ouverture: {
    perso: 'clara',
    emotion: 'tendre',
    texte:
      "Tu ne m'avais jamais raconté ça. Pas comme ça. … Merci de me l'avoir dit.",
    suite: 'c13'
  },

  p_attachement: {
    perso: 'clara',
    emotion: 'triste',
    texte:
      "C'est trop lourd, Liam. Je ne peux pas être le seul truc qui tient debout. Personne ne peut.",
    suite: 'c13'
  },

  p_fuite: {
    narration: "Vous fermez le portable. L'écran s'éteint. La pièce redevient noire.",
    suite: 'p_fuite2'
  },

  p_fuite2: {
    perso: 'liam',
    emotion: 'inquiet',
    texte:
      "Voilà. Le silence est revenu. C'est exactement ce que je voulais et je ne l'ai jamais autant détesté.",
    suite: 'c13'
  },

  /* ---------------- bascule vers le combat ---------------- */

  c13: {
    narration:
      "Quelque chose se serre. Ça commence toujours pareil : la respiration qui raccourcit, et cette chose qui prend toute la place."
  , suite: 'c14' },

  c14: {
    perso: 'liam',
    emotion: 'inquiet',
    texte: "Non. Pas maintenant. Pas ce soir.",
    suite: null // -> combat
  }
}

/* ------------------------------------------------------------------ */
/* Epilogue - message final de Liam                                     */
/* ------------------------------------------------------------------ */

export const EPILOGUE = {
  victoire: {
    titre: 'Message vocal - 02h41',
    duree: '0:47',
    emotion: 'sourire',
    lignes: [
      "Je sais pas si tu écouteras ça. Je l'enregistre surtout pour moi, en vrai.",
      "Ce soir j'ai failli fermer l'ordi et laisser la chose gagner. C'est ce que je fais d'habitude. Je m'isole, je me dis que ça protège.",
      "Ça ne protège pas. Ça rend juste la pièce plus grande.",
      "J'ai pas décidé pour le 14. Mais demain je passe au Service Inclusif. C'est un tout petit truc. C'est un truc."
    ]
  },
  defaite: {
    titre: 'Message vocal - non envoyé',
    duree: '0:31',
    emotion: 'triste',
    lignes: [
      "Je l'ai enregistré trois fois. Je vais pas l'envoyer, mais je le garde.",
      "Ce soir j'ai pas réussi. La chose a pris toute la place et je l'ai laissée faire, parce que c'était plus simple que de demander.",
      "Sauf que demander, c'était possible. Il y avait quelqu'un au bout du fil et j'ai pas cliqué.",
      "Demain, peut-être. C'est déjà une phrase que je n'aurais pas dite il y a six mois."
    ]
  }
}
