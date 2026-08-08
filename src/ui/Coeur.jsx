/**
 * Coeur dessine en SVG plutot qu'en caractere ♥ : les polices pixel du projet
 * n'ont pas ce glyphe, et le rendu variait d'un poste a l'autre.
 */
export default function Coeur({ taille = 14 }) {
  return (
    <svg
      className="coeur"
      width={taille}
      height={taille}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      {/* Trace en marches d'escalier : lisible comme un sprite pixel. */}
      <path
        fill="currentColor"
        d="M2 3h4v1h1v1h2V4h1V3h4v1h1v4h-1v2h-1v1h-1v1h-1v1h-1v1h-1v1H8v-1H7v-1H6v-1H5v-1H4v-1H3V8H2V4h0z"
      />
    </svg>
  )
}
