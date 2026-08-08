import { useGame, ECRAN } from '../store/useGame'
import { debloquerAudio, sfx } from '../audio/sfx'

export default function Titre() {
  const allerA = useGame((s) => s.allerA)

  const demarrer = () => {
    debloquerAudio() // le son a besoin d'un geste utilisateur
    sfx.valider()
    allerA(ECRAN.PROLOGUE)
  }

  return (
    <div className="titre">
      <div className="titre__bruit" />

      <div className="titre__bloc">
        <h1 className="titre__logo" data-texte="ARCHIVE //">ARCHIVE //</h1>
        <p className="titre__nom">LIAM</p>
        <p className="titre__accroche">
          Un récit sur la solitude, le deuil,<br />et ce que valent les liens qu’on tisse en ligne.
        </p>

        <button className="titre__start" onClick={demarrer}>START</button>

        <p className="titre__commandes si-clavier">
          Flèches / ZQSD pour se déplacer · Espace pour interagir
        </p>
        <p className="titre__commandes si-doigt">
          Croix directionnelle pour se déplacer · OK pour interagir
        </p>
      </div>

      <div className="titre__avertissement">
        <strong>Avant de commencer.</strong> Ce prototype parle d’isolement, de deuil et
        d’anxiété. Rien n’y est graphique, mais si le sujet vous touche de près, vous
        pouvez arrêter à tout moment. Des ressources réelles sont rappelées à la fin.
      </div>

      <div className="titre__pied">
        Prototype jouable · HEAJ - Master Architecture Transmédia
      </div>
    </div>
  )
}
