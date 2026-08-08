import { useEffect } from 'react'
import { PERSONNAGES, EMOTIONS } from '../data/script'
import { fichier } from '../chemins'
import { useTypewriter } from './useTypewriter'
import { sfx } from '../audio/sfx'

/**
 * Rendu d'un noeud de dialogue. Partage par le prologue et la conversation
 * pour que les deux aient exactement la meme grammaire visuelle.
 */
export default function SceneVN({ noeud, onSuivant, onChoix, entete, archives = [] }) {
  const estNarration = !noeud.perso
  const { affiche, fini, complet } = useTypewriter(noeud.texte || noeud.narration)

  const avancer = () => {
    if (!fini) return complet()
    if (noeud.choix) return
    sfx.survol()
    onSuivant()
  }

  // Espace / Entree pour derouler, comme sur la map.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        avancer()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const perso = noeud.perso ? PERSONNAGES[noeud.perso] : null
  const numero = perso ? EMOTIONS[noeud.perso][noeud.emotion] || 4 : null
  const cote = noeud.perso === 'liam' ? 'gauche' : 'droite'

  return (
    <div className="vn" onClick={avancer}>
      {entete}

      <div className="vn__scene">
        {perso && (
          <img
            key={`${noeud.perso}-${numero}`}
            className={`vn__perso vn__perso--${cote}`}
            src={fichier(`personnages/${perso.dossier}-${numero}.png`)}
            alt={perso.nom}
          />
        )}
      </div>

      <div className={`vn__boite ${estNarration ? 'vn__boite--narration' : ''}`}>
        {perso && <div className="vn__nom">{perso.nom}</div>}
        <p className="vn__texte">
          {affiche}
          {!fini && <span className="vn__curseur">▌</span>}
        </p>

        {fini && !noeud.choix && <div className="vn__suivant">▼</div>}
      </div>

      {fini && noeud.choix && (
        <div className="vn__choix" onClick={(e) => e.stopPropagation()}>
          {noeud.choix.map((c, i) => {
            const verrouille = c.requiert && !archives.includes(c.requiert)
            return (
              <button
                key={i}
                className={`choix ${verrouille ? 'choix--verrouille' : ''}`}
                disabled={verrouille}
                onMouseEnter={() => !verrouille && sfx.survol()}
                onClick={() => {
                  sfx.valider()
                  onChoix(c)
                }}
              >
                <span className="choix__puce">›</span>
                <span className="choix__texte">{c.texte}</span>
                {verrouille && <span className="choix__indice">🔒 {c.indice}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
