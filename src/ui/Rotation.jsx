/**
 * Ecran affiche quand un telephone est tenu en portrait.
 *
 * Le prototype est composé en 16:9. Plutôt que de le tasser dans une bande
 * illisible, on demande la rotation — c'est le point d'entrée réel du projet
 * (un QR-code scanné au téléphone), donc ce premier écran fait partie de
 * l'expérience et doit être aux couleurs du reste.
 *
 * Affiché uniquement en portrait sur écran tactile, via CSS.
 */
export default function Rotation() {
  return (
    <div className="rotation">
      <div className="rotation__telephone">
        <span className="rotation__ecran" />
      </div>
      <p className="rotation__titre">ARCHIVE //</p>
      <p className="rotation__texte">
        Tournez votre téléphone.<br />
        L’histoire de Liam se lit à l’horizontale.
      </p>
    </div>
  )
}
