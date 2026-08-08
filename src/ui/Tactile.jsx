import { tactile, reinitialiserTactile } from '../game/tactile'
import { sfx } from '../audio/sfx'

/**
 * Croix directionnelle et bouton d'action pour la phase de deplacement.
 *
 * Masques par CSS sur les appareils a pointeur fin : au clavier ils ne servent
 * a rien et encombreraient l'image.
 */

const DIRECTIONS = [
  { cle: 'haut', x: 0, y: -1, signe: '▲', zone: 'h' },
  { cle: 'gauche', x: -1, y: 0, signe: '◀', zone: 'g' },
  { cle: 'droite', x: 1, y: 0, signe: '▶', zone: 'd' },
  { cle: 'bas', x: 0, y: 1, signe: '▼', zone: 'b' }
]

export default function Tactile() {
  const presser = (d) => (e) => {
    e.preventDefault()
    tactile.x = d.x
    tactile.y = d.y
  }

  // Relacher remet a zero sans condition : si un doigt glisse hors du bouton,
  // on preferera toujours un personnage arrete a un personnage qui part seul.
  const relacher = (e) => {
    e.preventDefault()
    reinitialiserTactile()
  }

  return (
    <div className="tactile">
      <div className="dpad">
        {DIRECTIONS.map((d) => (
          <button
            key={d.cle}
            className={`dpad__b dpad__b--${d.zone}`}
            aria-label={d.cle}
            onPointerDown={presser(d)}
            onPointerUp={relacher}
            onPointerLeave={relacher}
            onPointerCancel={relacher}
            onContextMenu={(e) => e.preventDefault()}
          >
            {d.signe}
          </button>
        ))}
        <span className="dpad__centre" />
      </div>

      <button
        className="tactile__action"
        aria-label="Interagir"
        onPointerDown={(e) => {
          e.preventDefault()
          sfx.survol()
          tactile.declencher?.()
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        OK
      </button>
    </div>
  )
}
