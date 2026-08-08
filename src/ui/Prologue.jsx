import { useState } from 'react'
import SceneVN from './SceneVN'
import { PROLOGUE } from '../data/script'
import { useGame, ECRAN } from '../store/useGame'

export default function Prologue() {
  const [i, setI] = useState(0)
  const allerA = useGame((s) => s.allerA)

  const suivant = () => {
    if (i + 1 < PROLOGUE.length) setI(i + 1)
    else allerA(ECRAN.APPARTEMENT)
  }

  return <SceneVN noeud={PROLOGUE[i]} onSuivant={suivant} onChoix={() => {}} />
}
