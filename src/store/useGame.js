import { create } from 'zustand'
import { ARCHIVES } from '../data/archives'

/**
 * Etat global du jeu.
 *
 * C'est le pont entre Phaser (la couche deplacement) et React (VN, combat, menus) :
 * Phaser lit `stabilite` pour ses effets visuels, React la modifie lors des choix
 * narratifs et des combats.
 */

export const STABILITE_MAX = 100

// Les ecrans qui se succedent dans cette vertical slice.
export const ECRAN = {
  TITRE: 'titre',
  PROLOGUE: 'prologue',
  APPARTEMENT: 'appartement',
  CONVERSATION: 'conversation',
  COMBAT: 'combat',
  EPILOGUE: 'epilogue'
}

const etatInitial = {
  ecran: ECRAN.TITRE,

  // Mecanique centrale : remplace les points de vie classiques.
  stabilite: 72,

  // Compteur de repli sur soi. Chaque "S'Isoler" l'incremente et le malus est
  // cumulatif : c'est le message du jeu traduit en regle.
  replis: 0,

  // Archives ramassees dans l'appartement. Double usage : debloquer du dialogue
  // et servir d'actions en combat.
  archives: [],
  archivesUtilisees: [],

  // Traces des choix, relues dans l'epilogue.
  choix: [],

  // Ressources ESI decouvertes via les QR-codes muraux (couche transmedia).
  qrScannes: [],

  // Panneaux superposes (journal des archives, ressources ESI).
  panneau: null,

  // Point d'interet a portee de Liam sur la map, affiche par React.
  interaction: null,

  // File de notifications facon smartphone.
  notifications: [],

  resultatCombat: null
}

let idNotif = 0

export const useGame = create((set, get) => ({
  ...etatInitial,

  allerA: (ecran) => set({ ecran, panneau: null }),

  modifierStabilite: (delta) =>
    set((s) => ({
      stabilite: Math.max(0, Math.min(STABILITE_MAX, s.stabilite + delta))
    })),

  ajouterRepli: () => set((s) => ({ replis: s.replis + 1 })),

  collecterArchive: (id) => {
    if (get().archives.includes(id)) return false
    const archive = ARCHIVES[id]
    set((s) => ({ archives: [...s.archives, id] }))
    get().notifier({
      titre: 'Archive récupérée',
      corps: archive ? archive.titre : id,
      type: 'archive'
    })
    return true
  },

  consommerArchive: (id) =>
    set((s) => ({ archivesUtilisees: [...s.archivesUtilisees, id] })),

  // Les archives encore disponibles comme action de combat.
  archivesDisponibles: () => {
    const { archives, archivesUtilisees } = get()
    return archives.filter((id) => !archivesUtilisees.includes(id))
  },

  enregistrerChoix: (choix) => set((s) => ({ choix: [...s.choix, choix] })),

  scannerQR: (id) => {
    if (get().qrScannes.includes(id)) return
    set((s) => ({ qrScannes: [...s.qrScannes, id] }))
  },

  ouvrirPanneau: (panneau) => set({ panneau }),
  fermerPanneau: () => set({ panneau: null }),

  definirInteraction: (interaction) => set({ interaction }),

  notifier: (notif) => {
    const id = ++idNotif
    set((s) => ({ notifications: [...s.notifications, { ...notif, id }] }))
    setTimeout(() => {
      set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }))
    }, 4200)
  },

  terminerCombat: (resultat) => set({ resultatCombat: resultat }),

  recommencer: () => set({ ...etatInitial, notifications: [] })
}))

/**
 * Code communaute genere a la fin. Il depend du parcours : deux joueurs
 * n'obtiennent pas le meme code, ce qui rend la recompense personnelle.
 * (Dans le jeu final ce serait valide cote serveur avant l'acces au Discord.)
 */
export function genererCode({ stabilite, replis, archives, resultatCombat }) {
  const socle = resultatCombat === 'victoire' ? 'LIAM' : 'ECHO'
  const a = String(archives.length).padStart(2, '0')
  const b = String(Math.round(stabilite)).padStart(2, '0')
  const c = String(replis).padStart(2, '0')
  return `${socle}-${a}${b}-${c}${resultatCombat === 'victoire' ? 'A' : 'B'}`
}
