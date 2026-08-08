import { useEffect } from 'react'

/** Dimensions de reference : toute l'interface est dessinee pour ce cadre. */
export const LARGEUR_REF = 1280
export const HAUTEUR_REF = 720

/**
 * Met le cadre du jeu a l'echelle de la fenetre.
 *
 * Toute l'interface est composee en pixels absolus pour un cadre 1280x720 :
 * la boite de dialogue, les jauges, la police pixel. Plutot que de rendre
 * chaque valeur responsive, on garde la composition intacte et on redimensionne
 * l'ensemble — c'est la methode classique en jeu video, et elle garantit que
 * les proportions restent celles qui ont ete validees, du telephone en paysage
 * au videoprojecteur du jury.
 */
export function useEchelle() {
  useEffect(() => {
    const calculer = () => {
      const largeur = window.innerWidth
      // innerHeight suit la barre d'adresse mobile, contrairement a 100vh.
      const hauteur = window.innerHeight
      const echelle = Math.min(
        largeur / LARGEUR_REF,
        hauteur / HAUTEUR_REF,
        2 // au-dela, on grossit sans rien gagner
      )
      document.documentElement.style.setProperty('--echelle', echelle)
    }

    calculer()
    window.addEventListener('resize', calculer)
    window.addEventListener('orientationchange', calculer)
    return () => {
      window.removeEventListener('resize', calculer)
      window.removeEventListener('orientationchange', calculer)
    }
  }, [])
}
