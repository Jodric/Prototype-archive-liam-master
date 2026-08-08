import { useEffect } from 'react'
import { useGame, ECRAN } from './store/useGame'
import Titre from './ui/Titre'
import Prologue from './ui/Prologue'
import PhaserMount from './ui/PhaserMount'
import Conversation from './ui/Conversation'
import Combat from './ui/Combat'
import Epilogue from './ui/Epilogue'
import HUD from './ui/HUD'
import Panneau from './ui/Panneau'
import Notifications from './ui/Notifications'
import Tactile from './ui/Tactile'
import Rotation from './ui/Rotation'
import PleinEcran from './ui/PleinEcran'
import { useEchelle } from './ui/useEchelle'
import { sfx } from './audio/sfx'

export default function App() {
  const ecran = useGame((s) => s.ecran)
  const notifier = useGame((s) => s.notifier)

  // Adapte le cadre 1280x720 a la fenetre, quelle qu'elle soit.
  useEchelle()

  // Notification d'arrivee sur la map : c'est elle qui pousse vers l'ordinateur.
  useEffect(() => {
    if (ecran !== ECRAN.APPARTEMENT) return
    const t = setTimeout(() => {
      sfx.notification()
      notifier({
        titre: 'Discord - Clara',
        corps: 'Clara a rejoint « la cabane ». Elle n’a rien écrit.',
        type: 'info'
      })
    }, 1800)
    return () => clearTimeout(t)
  }, [ecran, notifier])

  return (
    <div className={`app app--${ecran}`}>
      <div className="cadre">
        {ecran === ECRAN.TITRE && <Titre />}
        {ecran === ECRAN.PROLOGUE && <Prologue />}

        {ecran === ECRAN.APPARTEMENT && (
          <>
            <PhaserMount />
            <HUD />
            <Tactile />
          </>
        )}

        {ecran === ECRAN.CONVERSATION && <Conversation />}
        {ecran === ECRAN.COMBAT && <Combat />}
        {ecran === ECRAN.EPILOGUE && <Epilogue />}

        <Panneau />
        <Notifications />
        {ecran === ECRAN.TITRE && <PleinEcran />}
      </div>

      {/* Hors du cadre : en portrait, le cadre lui-meme est masque. */}
      <Rotation />
    </div>
  )
}
