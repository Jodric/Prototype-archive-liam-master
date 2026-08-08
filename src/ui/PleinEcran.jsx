import { useEffect, useState } from 'react'
import { sfx } from '../audio/sfx'

/**
 * Bascule plein ecran, proposee uniquement sur ecran tactile.
 *
 * Sur telephone en paysage, la barre d'adresse mange une bande de hauteur — et
 * comme le cadre est mis a l'echelle sur la plus petite dimension, c'est tout
 * le jeu qui rapetisse. Le plein ecran change beaucoup l'experience.
 */
export default function PleinEcran() {
  const [actif, setActif] = useState(false)

  useEffect(() => {
    const suivre = () => setActif(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', suivre)
    return () => document.removeEventListener('fullscreenchange', suivre)
  }, [])

  const basculer = async () => {
    sfx.survol()
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
        // Sans effet sur iOS, qui ne gere pas l'orientation verrouillee.
        await screen.orientation?.lock?.('landscape').catch(() => {})
      }
    } catch {
      /* refuse par le navigateur : on n'insiste pas */
    }
  }

  return (
    <button className="plein-ecran" onClick={basculer}>
      {actif ? '⤡ QUITTER' : '⤢ PLEIN ÉCRAN'}
    </button>
  )
}
