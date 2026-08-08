import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import ApartmentScene, { LARGEUR, HAUTEUR } from '../game/ApartmentScene'

/**
 * Monte le jeu Phaser dans le DOM React.
 *
 * C'est le point de contact entre les deux couches : Phaser gere le
 * deplacement, React se superpose (HUD, panneaux, VN) et lit le meme store.
 */
export default function PhaserMount() {
  const conteneur = useRef(null)
  const jeu = useRef(null)

  useEffect(() => {
    if (jeu.current) return

    jeu.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: conteneur.current,
      width: LARGEUR,
      height: HAUTEUR,
      backgroundColor: '#000000',
      pixelArt: true,
      roundPixels: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
      scene: [ApartmentScene]
    })

    return () => {
      jeu.current?.destroy(true)
      jeu.current = null
    }
  }, [])

  return <div className="phaser" ref={conteneur} />
}
