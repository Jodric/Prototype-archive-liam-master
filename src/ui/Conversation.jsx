import { useEffect, useState } from 'react'
import SceneVN from './SceneVN'
import { CONVERSATION } from '../data/script'
import { useGame, ECRAN } from '../store/useGame'
import { sfx } from '../audio/sfx'

/** Compteur d'appel vocal, purement decoratif - mais c'est lui qui installe le lieu. */
function Chrono() {
  const [s, setS] = useState(8043)
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const h = String(Math.floor(s / 3600)).padStart(2, '0')
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const sec = String(s % 60).padStart(2, '0')
  return <span className="vocal__chrono">{h}:{m}:{sec}</span>
}

export default function Conversation() {
  const [id, setId] = useState(CONVERSATION.depart)
  const { allerA, modifierStabilite, enregistrerChoix, archives } = useGame()

  useEffect(() => {
    sfx.notification()
  }, [])

  const noeud = CONVERSATION[id]

  const suivant = () => {
    if (noeud.suite) setId(noeud.suite)
    else allerA(ECRAN.COMBAT)
  }

  const choisir = (c) => {
    modifierStabilite(c.stabilite)
    enregistrerChoix({ noeud: id, note: c.note, texte: c.texte, stabilite: c.stabilite })
    setId(c.suite)
  }

  const entete = (
    <div className="vocal">
      <span className="vocal__point" />
      <span className="vocal__salon">Salon vocal - « la cabane »</span>
      <span className="vocal__sep">·</span>
      <span className="vocal__membres">Liam, Clara</span>
      <Chrono />
    </div>
  )

  return (
    <SceneVN
      noeud={noeud}
      onSuivant={suivant}
      onChoix={choisir}
      entete={entete}
      archives={archives}
    />
  )
}
