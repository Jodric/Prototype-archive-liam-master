/**
 * Donnees du combat contre l'Anxiete Depressive.
 *
 * Regle de design centrale : « S'Isoler » est la seule action qui soulage
 * immediatement et qui empeche de perdre de la Stabilite ce tour-ci. C'est
 * aussi la seule qui rend l'adversaire durablement plus fort. Le joueur doit
 * pouvoir tomber dans le piege tout seul, puis le comprendre.
 */

export const EMPRISE_MAX = 100

export const CONTACTS = {
  clara: {
    nom: 'Clara',
    detail: 'Lui écrire, même maintenant',
    degats: 16,
    stabilite: 18,
    replique: 'Vous tapez : « je vais pas bien ». Vous l’envoyez avant de vous relire.'
  },
  esi: {
    nom: 'Service Inclusif - HEAJ',
    detail: 'Demander un rendez-vous',
    degats: 22,
    stabilite: 22,
    bonusSiQR: 10,
    replique:
      'Le formulaire fait quatre lignes. Vous mettez onze minutes à cliquer sur « Envoyer ».'
  },
  camarade: {
    nom: 'Nathan, de votre promo',
    detail: 'Répondre à son message d’il y a deux semaines',
    degats: 12,
    stabilite: 14,
    replique:
      '« désolé j’ai vu ton message super tard ». Il répond en trente secondes : « tqt. ça va toi ? »'
  }
}

/** Ce que l'Anxiete dit. Le ton reste celui d'une pensee, jamais d'une menace. */
export const ATTAQUES = [
  { texte: 'Elle finira par se lasser. Tout le monde se lasse.', degats: 11 },
  { texte: 'Si tu pars là-bas, tu perds ton année. Et l’appartement.', degats: 13 },
  { texte: 'Tu n’as personne d’autre. C’est pour ça que tu tiens tant à elle.', degats: 14 },
  { texte: 'Personne au campus ne remarquerait ton absence pendant une semaine.', degats: 12 },
  { texte: 'Tu ne sais pas être avec les gens. Tu sais juste être en ligne.', degats: 13 }
]

/** Ce qu'elle dit apres un repli - elle en profite, et elle le dit gentiment. */
export const ATTAQUES_APRES_REPLI = [
  { texte: 'Tu vois ? On est mieux comme ça. Juste toi et moi.', degats: 9 },
  { texte: 'Reste. Dehors c’est fatigant.', degats: 10 }
]

export const AFFRONTER = {
  degatsMin: 12,
  degatsMax: 19,
  cout: 6,
  repliques: [
    'Vous dites le mot à voix haute, dans la pièce vide : « angoisse ».',
    'Vous respirez. Quatre secondes. Sept secondes. Huit.',
    'Vous vous asseyez par terre et vous attendez que ça passe, sans lutter.',
    'Vous écrivez ce que vous ressentez, en vrac, sans vous relire.'
  ]
}

export const ISOLER = {
  stabilite: 9,
  empriseGagnee: 12,
  // Le repli protege les deux premieres fois, puis cesse de fonctionner : sans
  // ca, le joueur pourrait s'isoler indefiniment sans jamais rien risquer, et
  // le jeu dirait exactement le contraire de ce qu'il veut dire.
  protectionsMax: 2,
  decroissance: 4,
  replique: 'Casque sur les oreilles. Volume au maximum. Le silence devient supportable.',
  consequence: 'Ça va mieux. C’est bien ça, le problème.',
  epuise: 'Le casque ne suffit plus. Vous l’entendez à travers la musique.'
}
