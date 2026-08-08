import { useEffect, useState } from 'react'
import { useGame, genererCode, ECRAN } from '../store/useGame'
import { EPILOGUE, EMOTIONS } from '../data/script'
import { ARCHIVES } from '../data/archives'
import { fichier } from '../chemins'
import { sfx } from '../audio/sfx'

/**
 * Resolution : le message audio final de Liam, puis le code communaute.
 *
 * Le message est ici « joue » sous forme de texte qui se devoile au rythme d'une
 * lecture audio simulee - dans le jeu final, c'est un vrai fichier avec la voix off.
 */
export default function Epilogue() {
  const etat = useGame()
  const { resultatCombat, stabilite, replis, archives, choix, recommencer, allerA, notifier } = etat

  const contenu = EPILOGUE[resultatCombat === 'victoire' ? 'victoire' : 'defaite']
  const code = genererCode({ stabilite, replis, archives, resultatCombat })

  const [lu, setLu] = useState(0)
  const [lecture, setLecture] = useState(false)
  const [copie, setCopie] = useState(false)

  useEffect(() => {
    if (!lecture) return
    if (lu >= contenu.lignes.length) return
    const t = setTimeout(() => setLu((v) => v + 1), lu === 0 ? 600 : 3400)
    return () => clearTimeout(t)
  }, [lecture, lu, contenu.lignes.length])

  const termine = lu >= contenu.lignes.length
  const numero = EMOTIONS.liam[contenu.emotion]

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopie(true)
      sfx.valider()
      setTimeout(() => setCopie(false), 2000)
    } catch {
      notifier({ titre: 'Copie impossible', corps: 'Sélectionnez le code à la main.' })
    }
  }

  return (
    <div className="epilogue">
      <header className="epilogue__entete">
        <span className="epilogue__marque">ARCHIVE //</span>
        <span className="epilogue__sous">Résolution</span>
      </header>

      <div className="epilogue__grille">
        {/* ---- le message vocal ---- */}
        <section className="vocal-final">
          <img className="vocal-final__portrait" src={fichier(`personnages/liam-${numero}.png`)} alt="Liam" />

          <div className="vocal-final__corps">
            <div className="vocal-final__meta">
              <strong>{contenu.titre}</strong>
              <span>{contenu.duree}</span>
            </div>

            <button
              className="lecteur"
              onClick={() => { sfx.valider(); setLecture(true) }}
              disabled={lecture}
            >
              <span className="lecteur__bouton">{lecture ? '❚❚' : '▶'}</span>
              <span className="lecteur__onde">
                {Array.from({ length: 42 }).map((_, i) => (
                  <i key={i} style={{ height: `${18 + Math.abs(Math.sin(i * 0.7)) * 26}px`,
                    opacity: lecture ? 1 : 0.35 }} />
                ))}
              </span>
            </button>

            <div className="vocal-final__transcript">
              {contenu.lignes.slice(0, lu).map((l, i) => (
                <p key={i}>{l}</p>
              ))}
              {!lecture && <p className="vocal-final__invite">Lancez la lecture.</p>}
            </div>
          </div>
        </section>

        {/* ---- la recompense ---- */}
        <aside className={`recompense ${termine ? '' : 'recompense--verrouillee'}`}>
          {!termine && <div className="recompense__voile">Écoutez le message pour débloquer</div>}

          <h2>Code communauté</h2>
          <p className="recompense__intro">
            Votre parcours vous donne un code unique. Il ouvre le serveur Discord
            d’ARCHIVE // LIAM : ressources du Service Inclusif, témoignages, entraide.
          </p>

          <button className="code" onClick={copier} disabled={!termine}>
            <span>{code}</span>
            <em>{copie ? 'copié ✓' : 'copier'}</em>
          </button>

          <div className="recompense__bilan">
            <Ligne libelle="Stabilité finale" valeur={`${Math.round(stabilite)} / 100`} />
            <Ligne libelle="Archives retrouvées" valeur={`${archives.length} / 4`} />
            <Ligne libelle="Replis sur soi" valeur={replis} />
            <Ligne
              libelle="Issue de la nuit"
              valeur={resultatCombat === 'victoire' ? 'Traversée' : 'Encaissée'}
            />
          </div>

          {archives.length < 4 && (
            <p className="recompense__note">
              Il restait {4 - archives.length} souvenir(s) dans l’appartement. Une autre
              partie ne raconte pas la même nuit.
            </p>
          )}
        </aside>
      </div>

      {/* ---- rappel des choix ---- */}
      {choix.length > 0 && (
        <section className="rappel">
          <h3>Ce que vous avez choisi</h3>
          <ul>
            {choix.map((c, i) => (
              <li key={i}>
                <span>{c.texte}</span>
                <em className={c.stabilite >= 0 ? 'positif' : 'negatif'}>
                  {c.stabilite >= 0 ? '+' : ''}{c.stabilite} stabilité
                </em>
              </li>
            ))}
          </ul>
        </section>
      )}

      {archives.length > 0 && (
        <section className="rappel">
          <h3>Vos archives</h3>
          <ul>
            {archives.map((id) => (
              <li key={id}>
                <span>{ARCHIVES[id].icone} {ARCHIVES[id].titre}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="epilogue__pied">
        <p className="avertissement">
          Prototype de démonstration. ARCHIVE // LIAM est une fiction - mais si quelque chose
          de tout ça vous parle : <strong>Belgique 107</strong> (Télé-Accueil) ·
          <strong> 0800 32 123</strong> (Prévention du suicide) · <strong>France 3114</strong>.
          Le Service Inclusif de votre école est gratuit et confidentiel.
        </p>
        <button className="bouton" onClick={() => { sfx.valider(); recommencer(); allerA(ECRAN.TITRE) }}>
          Rejouer autrement
        </button>
      </footer>
    </div>
  )
}

function Ligne({ libelle, valeur }) {
  return (
    <div className="bilan__ligne">
      <span>{libelle}</span>
      <strong>{valeur}</strong>
    </div>
  )
}
