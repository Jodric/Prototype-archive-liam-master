/**
 * Pont entre les commandes tactiles (React) et la scene Phaser.
 *
 * Un simple objet mutable plutot qu'un store : il est lu a chaque frame par
 * `update()`, et le faire passer par un state React provoquerait un rendu par
 * image de jeu pour rien.
 */
export const tactile = {
  x: 0,
  y: 0,
  /** Rempli par la scene : permet au bouton d'action de declencher l'interaction. */
  declencher: null
}

export function reinitialiserTactile() {
  tactile.x = 0
  tactile.y = 0
}
