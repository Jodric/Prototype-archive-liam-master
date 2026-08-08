import { useEffect } from 'react'
import { useGame } from '../store/useGame'
import { ARCHIVES } from '../data/archives'
import { sfx } from '../audio/sfx'

/** Fenetres superposees : examen d'objet, journal des archives, ressource QR. */
export default function Panneau() {
  const { panneau, fermerPanneau, archives } = useGame()

  useEffect(() => {
    if (!panneau) return
    const onKey = (e) => {
      if (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        sfx.survol()
        fermerPanneau()
      }
    }
    // capture : on ferme avant que la scene Phaser ne recoive la touche
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [panneau, fermerPanneau])

  if (!panneau) return null

  return (
    <div className="voile" onClick={fermerPanneau}>
      <div className="fiche" onClick={(e) => e.stopPropagation()}>
        {panneau.type === 'texte' && (
          <>
            <h2 className="fiche__titre">{panneau.titre}</h2>
            {panneau.intro && <p className="fiche__intro">{panneau.intro}</p>}
            <p className="fiche__corps">{panneau.corps}</p>
            {panneau.badge && <span className="fiche__badge">{panneau.badge}</span>}
          </>
        )}

        {panneau.type === 'qr' && (
          <>
            <div className="fiche__scan">QR-CODE SCANNÉ</div>
            <h2 className="fiche__titre">{panneau.ressource.titre}</h2>
            <p className="fiche__sous">{panneau.ressource.sous_titre}</p>
            <ul className="fiche__liste">
              {panneau.ressource.lignes.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
            <p className="fiche__note">{panneau.ressource.note}</p>
          </>
        )}

        {panneau.type === 'journal' && (
          <>
            <h2 className="fiche__titre">Archives</h2>
            <p className="fiche__sous">
              Ce que Liam a gardé. Utilisable pendant les moments difficiles.
            </p>
            <div className="journal-archives">
              {Object.entries(ARCHIVES).map(([id, a]) => {
                const eu = archives.includes(id)
                return (
                  <div key={id} className={`carte ${eu ? '' : 'carte--vide'}`}>
                    <span className="carte__icone">{eu ? a.icone : '?'}</span>
                    <div>
                      <strong>{eu ? a.titre : 'Souvenir non retrouvé'}</strong>
                      <p>{eu ? a.texte : 'Quelque part dans l’appartement.'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <button className="fiche__fermer" onClick={fermerPanneau}>Fermer</button>
      </div>
    </div>
  )
}
