import { useGame, STABILITE_MAX } from '../store/useGame'
import { ARCHIVES } from '../data/archives'
import Coeur from './Coeur'
import { sfx } from '../audio/sfx'

/** Barre superposee a la map : Stabilite, archives, invite d'interaction. */
export default function HUD() {
  const { stabilite, archives, interaction, ouvrirPanneau } = useGame()
  const pct = Math.max(0, Math.min(100, (stabilite / STABILITE_MAX) * 100))

  return (
    <>
      <div className="hud">
        <div className="hud__stab">
          <span className="hud__coeur"><Coeur taille={16} /></span>
          <div className="hud__piste">
            <div className="hud__remplissage" style={{ width: `${pct}%` }} />
          </div>
          <span className="hud__valeur">{Math.round(stabilite)}</span>
        </div>

        <button
          className="hud__archives"
          onMouseEnter={() => sfx.survol()}
          onClick={() => {
            sfx.survol()
            ouvrirPanneau({ type: 'journal' })
          }}
        >
          ARCHIVES <b>{archives.length}</b>/{Object.keys(ARCHIVES).length}
        </button>
      </div>

      {interaction && (
        <div className="invite">
          {/* La touche annoncée dépend du support : les deux sont rendues, le CSS
              n'en montre qu'une selon la finesse du pointeur. */}
          <kbd className="si-clavier">Espace</kbd>
          <kbd className="si-doigt">OK</kbd>
          <span>{interaction.label}</span>
        </div>
      )}
    </>
  )
}
