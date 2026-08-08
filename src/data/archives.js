/**
 * Les Archives : l'inventaire narratif de Liam.
 *
 * Chaque archive a deux vies. Dans l'appartement c'est un souvenir qu'on ramasse
 * et qu'on lit. En combat, c'est une action : se rappeler qu'on a compte pour
 * quelqu'un, c'est ce qui fait reculer l'anxiete.
 */

export const ARCHIVES = {
  photo_parents: {
    titre: 'Photo - été 2019',
    icone: '▣',
    texte:
      "Eux trois devant la maison de Jambes. Papa fait sa tête de quelqu'un qui déteste les photos. " +
      "Je l'ai gardée dans le tiroir parce que sur le bureau, je la regardais trop.",
    combat: {
      libelle: 'Photo - été 2019',
      effet: "Ils ont existé. Ça, personne ne peut le supprimer.",
      degats: 22,
      stabilite: 8
    }
  },

  premier_message: {
    titre: 'Premier message de Clara',
    icone: '✉',
    texte:
      '« slt, t\'es le seul du serveur à avoir compris ma blague pourrie sur Omori. ' +
      'je te garde. » - 3 novembre, 01h14.',
    combat: {
      libelle: 'Premier message de Clara',
      effet: "Quelqu'un t'a choisi, un jour, sans raison particulière.",
      degats: 26,
      stabilite: 10
    }
  },

  vocal_nuit: {
    titre: 'Vocal de 4h du matin',
    icone: '♪',
    texte:
      "Six heures de vocal, presque sans parler. Elle révisait, je dessinais. " +
      "On avait juste laissé le micro ouvert. C'est la nuit où j'ai le mieux dormi cette année.",
    combat: {
      libelle: 'Vocal de 4h du matin',
      effet: 'Le silence à deux, ce n’est pas le même silence.',
      degats: 20,
      stabilite: 14
    }
  },

  carnet_croquis: {
    titre: 'Carnet de croquis',
    icone: '✎',
    texte:
      "Trente pages, puis plus rien depuis février. La dernière page, c'est elle, " +
      "de mémoire, d'après un appel vidéo. Je n'ai jamais osé lui montrer.",
    combat: {
      libelle: 'Carnet de croquis',
      effet: 'Il reste quelque chose que tu sais faire.',
      degats: 24,
      stabilite: 6
    }
  }
}

/**
 * Ressources ESI derriere les QR-codes muraux. Dans le jeu final ces QR-codes
 * sont reellement scannables a l'ecran et renvoient vers les pages officielles.
 */
export const RESSOURCES_QR = {
  esi_campus: {
    titre: 'Service Inclusif - HEAJ',
    sous_titre: 'QR-code du couloir C',
    lignes: [
      "Accompagnement gratuit et confidentiel pour tous les étudiants.",
      "Aménagements, écoute, orientation vers un professionnel.",
      "Aucun dossier médical n'est exigé pour venir parler."
    ],
    note: 'Ressource affichée dans le prototype à titre d’exemple.'
  },
  ligne_ecoute: {
    titre: 'Parler à quelqu’un, maintenant',
    sous_titre: 'QR-code de la chambre',
    lignes: [
      'Belgique - Centre de prévention du suicide : 0800 32 123 (24h/24, gratuit)',
      'Belgique - Télé-Accueil : 107 (24h/24, anonyme)',
      'France - 3114, numéro national de prévention du suicide (24h/24, gratuit)'
    ],
    note: 'Numéros réels. Le reste de ce prototype est une fiction.'
  }
}
