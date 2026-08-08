/**
 * « L'Anxiété Dépressive ».
 *
 * Le dossier prevoit une illustration dediee. En attendant, on la represente
 * par une masse d'encre animee : c'est fidele a la charte noir et blanc, et ca
 * evite de lui donner un visage - elle n'est pas un monstre, c'est un etat.
 */
export default function Anxiete({ emprise, tremble }) {
  // Elle se retracte a mesure qu'on la fait reculer.
  const echelle = 0.62 + (emprise / 100) * 0.38

  return (
    <div
      className={`anxiete ${tremble ? 'anxiete--touchee' : ''}`}
      style={{ transform: `scale(${echelle})` }}
    >
      <svg viewBox="0 0 320 320" className="anxiete__svg" aria-label="L’Anxiété Dépressive">
        <defs>
          <filter id="encre">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="7">
              <animate
                attributeName="baseFrequency"
                dur="14s"
                values="0.012;0.022;0.012"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="34" />
          </filter>
        </defs>

        <g filter="url(#encre)">
          <circle cx="160" cy="150" r="86" fill="#000" />
          <circle cx="106" cy="188" r="52" fill="#000" />
          <circle cx="214" cy="184" r="56" fill="#000" />
          <circle cx="160" cy="86" r="46" fill="#000" />
          <circle cx="160" cy="236" r="44" fill="#000" opacity="0.85" />
        </g>

        {/* Deux vides clairs, pas des yeux : juste ce qu'elle laisse en creux. */}
        <ellipse cx="132" cy="140" rx="11" ry="17" fill="#fff" opacity="0.9" />
        <ellipse cx="190" cy="146" rx="11" ry="17" fill="#fff" opacity="0.9" />
      </svg>

      <div className="anxiete__nom">L’ANXIÉTÉ DÉPRESSIVE</div>
    </div>
  )
}
