import { useEffect, useRef, useState } from 'react'
import { sfx } from '../audio/sfx'

/**
 * Fait apparaitre le texte caractere par caractere.
 * `complet()` permet d'afficher tout d'un coup au premier clic - un standard
 * du genre, et une necessite d'accessibilite pour qui lit vite.
 */
export function useTypewriter(texte, vitesse = 22) {
  const [affiche, setAffiche] = useState('')
  const [fini, setFini] = useState(false)
  const minuteur = useRef(null)

  useEffect(() => {
    setAffiche('')
    setFini(false)
    if (!texte) {
      setFini(true)
      return
    }
    let i = 0
    const avancer = () => {
      i += 1
      setAffiche(texte.slice(0, i))
      if (i % 2 === 0) sfx.typewriter()
      if (i >= texte.length) {
        setFini(true)
        return
      }
      // Petite pause sur la ponctuation : ca donne du rythme a la lecture.
      const c = texte[i - 1]
      const pause = '.…!?'.includes(c) ? vitesse * 9 : ',;:'.includes(c) ? vitesse * 4 : vitesse
      minuteur.current = setTimeout(avancer, pause)
    }
    minuteur.current = setTimeout(avancer, vitesse)
    return () => clearTimeout(minuteur.current)
  }, [texte, vitesse])

  const complet = () => {
    clearTimeout(minuteur.current)
    setAffiche(texte || '')
    setFini(true)
  }

  return { affiche, fini, complet }
}
