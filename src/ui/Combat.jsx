import { useCallback, useEffect, useRef, useState } from 'react'
import Anxiete from './Anxiete'
import Coeur from './Coeur'
import { useGame, ECRAN, STABILITE_MAX } from '../store/useGame'
import { ARCHIVES } from '../data/archives'
import {
  AFFRONTER, ATTAQUES, ATTAQUES_APRES_REPLI, CONTACTS, EMPRISE_MAX, ISOLER
} from '../data/combat'
import { sfx } from '../audio/sfx'

const hasard = (t) => t[Math.floor(Math.random() * t.length)]

export default function Combat() {
  const {
    stabilite, modifierStabilite, replis, ajouterRepli,
    archivesDisponibles, consommerArchive, qrScannes,
    allerA, terminerCombat, notifier
  } = useGame()

  const [emprise, setEmprise] = useState(EMPRISE_MAX)
  const [menu, setMenu] = useState('racine')
  const [tour, setTour] = useState('joueur')
  const [journal, setJournal] = useState([
    { ton: 'systeme', texte: 'La chose prend toute la place dans la pièce.' }
  ])
  const [contactsUtilises, setContactsUtilises] = useState([])
  const [protege, setProtege] = useState(false)
  const [touchee, setTouchee] = useState(false)
  const [secousse, setSecousse] = useState(false)

  const finRef = useRef(null)
  const disponibles = archivesDisponibles()

  useEffect(() => {
    sfx.demarrerCoeur()
    return () => sfx.arreterCoeur()
  }, [])

  useEffect(() => { sfx.reglerCoeur(stabilite) }, [stabilite])
  useEffect(() => { finRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [journal])

  const ecrire = useCallback((ton, texte) => {
    setJournal((j) => [...j, { ton, texte }])
  }, [])

  /* ---------------------------------------------------------------- */
  /* Tour de l'Anxiete                                                 */
  /* ---------------------------------------------------------------- */

  const tourEnnemi = (etaitProtege, nouveauxReplis) => {
    const table = etaitProtege ? ATTAQUES_APRES_REPLI : ATTAQUES
    const attaque = hasard(table)
    // Chaque repli rend ses coups un peu plus lourds, definitivement.
    const degats = attaque.degats + nouveauxReplis * 3

    setTimeout(() => {
      ecrire('ennemi', attaque.texte)

      setTimeout(() => {
        if (etaitProtege) {
          ecrire('neutre', 'Vous n’avez rien entendu. Elle attendra demain.')
          sfx.isoler()
        } else {
          modifierStabilite(-degats)
          ecrire('degats', `Stabilité −${degats}`)
          sfx.encaisser()
          setSecousse(true)
          setTimeout(() => setSecousse(false), 420)
        }

        setTimeout(() => {
          const restante = useGame.getState().stabilite
          if (restante <= 0) return conclure('defaite')
          setProtege(false)
          setTour('joueur')
        }, 700)
      }, 900)
    }, 600)
  }

  const conclure = (resultat) => {
    setTour('fin')
    sfx.arreterCoeur()
    terminerCombat(resultat)
    ecrire(
      'systeme',
      resultat === 'victoire'
        ? 'La pièce reprend sa taille normale. Il est 2h41.'
        : 'Vous vous endormez habillé, la lumière allumée. La nuit passe quand même.'
    )
    setTimeout(() => allerA(ECRAN.EPILOGUE), 2600)
  }

  const frapper = (degats, texteEffet, gainStabilite = 0) => {
    const reste = Math.max(0, emprise - degats)
    setEmprise(reste)
    setTouchee(true)
    sfx.frapper()
    setTimeout(() => setTouchee(false), 380)
    if (gainStabilite) {
      modifierStabilite(gainStabilite)
      sfx.soin()
    }
    ecrire('joueur', texteEffet)
    ecrire('effet', `Emprise −${degats}${gainStabilite ? ` · Stabilité +${gainStabilite}` : ''}`)
    return reste
  }

  const finirTourJoueur = (empriseRestante, etaitProtege = false, nouveauxReplis = replis) => {
    if (empriseRestante <= 0) return conclure('victoire')
    setTour('ennemi')
    setMenu('racine')
    tourEnnemi(etaitProtege, nouveauxReplis)
  }

  /* ---------------------------------------------------------------- */
  /* Actions du joueur                                                 */
  /* ---------------------------------------------------------------- */

  const actionAffronter = () => {
    const d = entier(AFFRONTER.degatsMin, AFFRONTER.degatsMax)
    modifierStabilite(-AFFRONTER.cout)
    const reste = frapper(d, hasard(AFFRONTER.repliques))
    ecrire('degats', `Stabilité −${AFFRONTER.cout} - ça coûte de regarder les choses en face.`)
    if (useGame.getState().stabilite <= 0) return conclure('defaite')
    finirTourJoueur(reste)
  }

  const actionArchive = (id) => {
    const a = ARCHIVES[id]
    consommerArchive(id)
    const reste = frapper(a.combat.degats, a.combat.effet, a.combat.stabilite)
    finirTourJoueur(reste)
  }

  const actionContact = (cle) => {
    const c = CONTACTS[cle]
    setContactsUtilises((v) => [...v, cle])
    // Avoir lu la ressource sur le mur rend la demarche moins couteuse.
    const bonus = cle === 'esi' && qrScannes.includes('esi_campus') ? c.bonusSiQR : 0
    if (bonus) ecrire('neutre', 'Vous aviez noté le contact vu sur l’affiche du couloir.')
    const reste = frapper(c.degats + bonus, c.replique, c.stabilite + bonus)
    finirTourJoueur(reste)
  }

  const actionIsoler = () => {
    ajouterRepli()
    const nouveaux = replis + 1

    // Le soulagement s'emousse a chaque fois, et au bout de deux replis il ne
    // protege plus du tout : s'isoler cesse de marcher avant de cesser d'attirer.
    const gain = Math.max(0, ISOLER.stabilite - replis * ISOLER.decroissance)
    const protegeCeTour = nouveaux <= ISOLER.protectionsMax

    if (gain) modifierStabilite(gain)
    setProtege(protegeCeTour)
    const nouvelleEmprise = Math.min(EMPRISE_MAX, emprise + ISOLER.empriseGagnee)
    setEmprise(nouvelleEmprise)
    sfx.isoler()

    ecrire('joueur', protegeCeTour ? ISOLER.replique : ISOLER.epuise)
    ecrire(
      'effet',
      protegeCeTour
        ? `Stabilité +${gain} · aucun dégât ce tour-ci`
        : `Stabilité +${gain} · le repli ne protège plus`
    )
    ecrire('piege', `Emprise +${ISOLER.empriseGagnee}. ${ISOLER.consequence}`)
    notifier({ titre: 'Repli', corps: `${nouveaux}× cette nuit`, type: 'alerte' })
    finirTourJoueur(nouvelleEmprise, protegeCeTour, nouveaux)
  }

  /* ---------------------------------------------------------------- */

  const actif = tour === 'joueur'

  return (
    <div className={`combat ${secousse ? 'combat--secousse' : ''}`}>
      <div
        className="combat__vide"
        style={{ opacity: 1 - Math.min(1, stabilite / STABILITE_MAX) }}
      />

      <div className="combat__arene">
        <Anxiete emprise={emprise} tremble={touchee} />

        <div className="combat__jauges">
          <Jauge
            libelle="EMPRISE"
            valeur={emprise}
            max={EMPRISE_MAX}
            variante="emprise"
          />
          <Jauge
            libelle="STABILITÉ"
            valeur={stabilite}
            max={STABILITE_MAX}
            variante="stabilite"
            icone={<Coeur taille={13} />}
          />
          {replis > 0 && (
            <div className="combat__replis">
              Replis : {'●'.repeat(replis)} <span>(ses coups font +{replis * 3})</span>
            </div>
          )}
        </div>
      </div>

      <div className="combat__bas">
        <div className="journal">
          {journal.map((l, i) => (
            <p key={i} className={`journal__ligne journal__ligne--${l.ton}`}>{l.texte}</p>
          ))}
          <div ref={finRef} />
        </div>

        <div className="actions">
          {menu === 'racine' && (
            <>
              <Action libelle="AFFRONTER" aide="Nommer ce qui se passe" actif={actif}
                onClick={actionAffronter} />
              <Action libelle="ARCHIVES" aide={`${disponibles.length} souvenir(s)`}
                actif={actif && disponibles.length > 0}
                onClick={() => { sfx.survol(); setMenu('archives') }} />
              <Action libelle="CONTACTS" aide="Demander de l’aide" actif={actif}
                onClick={() => { sfx.survol(); setMenu('contacts') }} />
              <Action libelle="S’ISOLER" aide="Ne plus rien entendre" actif={actif}
                variante="isoler" onClick={actionIsoler} />
            </>
          )}

          {menu === 'archives' && (
            <div className="sous-menu">
              {disponibles.map((id) => (
                <button key={id} className="sous-menu__item" disabled={!actif}
                  onMouseEnter={() => sfx.survol()} onClick={() => actionArchive(id)}>
                  <span className="sous-menu__icone">{ARCHIVES[id].icone}</span>
                  <span>{ARCHIVES[id].combat.libelle}</span>
                  <em>usage unique</em>
                </button>
              ))}
              {disponibles.length === 0 && (
                <p className="sous-menu__vide">
                  Plus rien. Vous auriez dû fouiller l’appartement.
                </p>
              )}
              <button className="sous-menu__retour" onClick={() => setMenu('racine')}>
                ‹ Retour
              </button>
            </div>
          )}

          {menu === 'contacts' && (
            <div className="sous-menu">
              {Object.entries(CONTACTS).map(([cle, c]) => {
                const fait = contactsUtilises.includes(cle)
                return (
                  <button key={cle} className="sous-menu__item" disabled={!actif || fait}
                    onMouseEnter={() => !fait && sfx.survol()} onClick={() => actionContact(cle)}>
                    <span className="sous-menu__icone">{fait ? '✓' : '☎'}</span>
                    <span>{c.nom}</span>
                    <em>{fait ? 'déjà fait' : c.detail}</em>
                  </button>
                )
              })}
              <button className="sous-menu__retour" onClick={() => setMenu('racine')}>
                ‹ Retour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- */

/** Entier aleatoire inclusif. */
function entier(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function Jauge({ libelle, valeur, max, variante, icone }) {
  const pct = Math.max(0, Math.min(100, (valeur / max) * 100))
  return (
    <div className={`jauge jauge--${variante}`}>
      <span className="jauge__libelle">
        {icone && <b className="jauge__icone">{icone}</b>} {libelle}
      </span>
      <div className="jauge__piste">
        <div className="jauge__remplissage" style={{ width: `${pct}%` }} />
      </div>
      <span className="jauge__valeur">{Math.round(valeur)}</span>
    </div>
  )
}

function Action({ libelle, aide, onClick, actif, variante }) {
  return (
    <button
      className={`action ${variante ? `action--${variante}` : ''}`}
      disabled={!actif}
      onMouseEnter={() => actif && sfx.survol()}
      onClick={onClick}
    >
      <span className="action__libelle">{libelle}</span>
      <span className="action__aide">{aide}</span>
    </button>
  )
}
