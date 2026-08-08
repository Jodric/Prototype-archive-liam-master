/**
 * Sprites pixel art definis directement en code.
 *
 * Le dossier prevoit un pipeline Photoshop -> Tiled -> Phaser pour les vrais
 * assets. En attendant qu'ils existent, on genere les textures a la volee :
 * le prototype reste jouable sans aucun fichier graphique de map.
 *
 *   . transparent   K noir   W blanc   G gris   L gris clair
 */

const PALETTE = {
  '.': null,
  K: '#000000',
  W: '#ffffff',
  G: '#7a7a7a',
  L: '#c9c9c9'
}

/** Convertit un tableau de chaines en texture Phaser. */
export function creerTexture(scene, cle, lignes) {
  const largeur = Math.max(...lignes.map((l) => l.length))
  const hauteur = lignes.length
  const texture = scene.textures.createCanvas(cle, largeur, hauteur)
  const ctx = texture.getContext()
  ctx.clearRect(0, 0, largeur, hauteur)

  for (let y = 0; y < hauteur; y++) {
    const ligne = lignes[y].padEnd(largeur, '.')
    for (let x = 0; x < largeur; x++) {
      const couleur = PALETTE[ligne[x]]
      if (!couleur) continue
      ctx.fillStyle = couleur
      ctx.fillRect(x, y, 1, 1)
    }
  }
  texture.refresh()
  return texture
}

/* ------------------------------------------------------------------ */
/* Liam - 16 x 24, trois orientations, deux frames de marche            */
/* ------------------------------------------------------------------ */

const TETE_FACE = [
  '................',
  '.....KKKKKK.....',
  '....KKKKKKKK....',
  '...KKKKKKKKKK...',
  '...KKKKKKKKKK...',
  '...KWWWWWWWWK...',
  '...KWKWWWWKWK...',
  '...KWWWWWWWWK...',
  '...KWWWKKWWWK...',
  '....KWWWWWWK....',
  '.....KKKKKK.....'
]

const TETE_DOS = [
  '................',
  '.....KKKKKK.....',
  '....KKKKKKKK....',
  '...KKKKKKKKKK...',
  '...KKKKKKKKKK...',
  '...KKKKKKKKKK...',
  '...KKKKKKKKKK...',
  '...KKKKKKKKKK...',
  '...KKKKKKKKKK...',
  '....KKKKKKKK....',
  '.....KKKKKK.....'
]

const TETE_PROFIL = [
  '................',
  '.....KKKKKK.....',
  '....KKKKKKKKK...',
  '...KKKKKKKKKKK..',
  '...KKKKKKKKKKK..',
  '...KKKKKWWWWWK..',
  '...KKKKKWKWWWK..',
  '...KKKKWWWWWWK..',
  '....KKKWWWKWWK..',
  '.....KKWWWWWK...',
  '.....KKKKKK.....'
]

const TORSE = [
  '...KKGGGGGGKK...',
  '..KKGGGGGGGGKK..',
  '..KGGGGGGGGGGK..',
  '..KGGGGGGGGGGK..',
  '..KGGGGGGGGGGK..',
  '..KKGGGGGGGGKK..',
  '...KGGGGGGGGK...',
  '....KKKKKKKK....'
]

const JAMBES_REPOS = [
  '....KKKK.KKKK...',
  '....KKKK.KKKK...',
  '....KKKK.KKKK...',
  '...KKKKK.KKKKK..',
  '................'
]

const JAMBES_MARCHE = [
  '...KKKK...KKKK..',
  '...KKKK...KKKK..',
  '..KKKK.....KKKK.',
  '.KKKKK.....KKKKK',
  '................'
]

function assembler(tete, jambes) {
  return [...tete, ...TORSE, ...jambes]
}

export const SPRITES_LIAM = {
  'liam-bas-0': assembler(TETE_FACE, JAMBES_REPOS),
  'liam-bas-1': assembler(TETE_FACE, JAMBES_MARCHE),
  'liam-haut-0': assembler(TETE_DOS, JAMBES_REPOS),
  'liam-haut-1': assembler(TETE_DOS, JAMBES_MARCHE),
  'liam-cote-0': assembler(TETE_PROFIL, JAMBES_REPOS),
  'liam-cote-1': assembler(TETE_PROFIL, JAMBES_MARCHE)
}

/* ------------------------------------------------------------------ */
/* Petits objets                                                        */
/* ------------------------------------------------------------------ */

export const SPRITE_QR = [
  'KKKKKKKKKKKKKKKK',
  'KWWWWWWWWWWWWWWK',
  'KWKKKWKWKWKKKWWK',
  'KWKWKWKKWWKWKWWK',
  'KWKWKWWKKWKWKWWK',
  'KWKKKWKWKWKKKWWK',
  'KWWWWWKKWWWWWWWK',
  'KWKWKKWKKKWKKWWK',
  'KWWKKWWWKWWKWKWK',
  'KWKWKKKWKKWWKKWK',
  'KWWWWWWKWKWKWWWK',
  'KWKKKWKKWWKKKWWK',
  'KWKWKWWKKWWKWKWK',
  'KWKWKWKWKKWWWWWK',
  'KWKKKWWKWKWKKWWK',
  'KKKKKKKKKKKKKKKK'
]

export const SPRITE_ETINCELLE = [
  '..K..',
  '..K..',
  'KKKKK',
  '..K..',
  '..K..'
]
