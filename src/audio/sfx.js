/**
 * Identite sonore minimale, entierement synthetisee (aucun fichier audio).
 *
 * Le dossier decrit quatre familles de sons : notifications Discord, ambiance
 * realiste (pluie, frigo), sons psychologiques (battements de coeur) et petits
 * bips electroniques. On les approxime ici avec l'API Web Audio.
 */

let ctx = null
let ambiance = null
let coeur = null

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Le navigateur exige un geste utilisateur avant de laisser jouer du son.
export function debloquerAudio() {
  audio()
}

function bip(freq, duree, { type = 'square', gain = 0.05, delai = 0 } = {}) {
  const c = audio()
  const osc = c.createOscillator()
  const vol = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t = c.currentTime + delai
  vol.gain.setValueAtTime(0, t)
  vol.gain.linearRampToValueAtTime(gain, t + 0.008)
  vol.gain.exponentialRampToValueAtTime(0.0001, t + duree)
  osc.connect(vol).connect(c.destination)
  osc.start(t)
  osc.stop(t + duree + 0.02)
}

export const sfx = {
  // Le doublet ascendant caracteristique d'une notification.
  notification() {
    bip(880, 0.09, { type: 'sine', gain: 0.07 })
    bip(1174, 0.16, { type: 'sine', gain: 0.07, delai: 0.09 })
  },

  // Bip discret joue a chaque caractere du texte qui s'ecrit.
  typewriter() {
    bip(1600 + Math.random() * 200, 0.012, { type: 'square', gain: 0.012 })
  },

  survol() {
    bip(660, 0.03, { type: 'square', gain: 0.025 })
  },

  valider() {
    bip(523, 0.05, { type: 'square', gain: 0.05 })
    bip(784, 0.09, { type: 'square', gain: 0.05, delai: 0.05 })
  },

  ramasser() {
    bip(659, 0.05, { type: 'triangle', gain: 0.05 })
    bip(988, 0.12, { type: 'triangle', gain: 0.05, delai: 0.05 })
  },

  // Coup porte a l'anxiete.
  frapper() {
    const c = audio()
    const buf = c.createBuffer(1, c.sampleRate * 0.18, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3)
    }
    const src = c.createBufferSource()
    const filtre = c.createBiquadFilter()
    const vol = c.createGain()
    filtre.type = 'lowpass'
    filtre.frequency.value = 900
    vol.gain.value = 0.16
    src.buffer = buf
    src.connect(filtre).connect(vol).connect(c.destination)
    src.start()
  },

  // Coup encaisse : plus grave, plus sourd.
  encaisser() {
    bip(110, 0.22, { type: 'sawtooth', gain: 0.07 })
    bip(82, 0.3, { type: 'sine', gain: 0.09, delai: 0.02 })
  },

  // Le repli sur soi : un son etouffe, presque agreable. C'est le piege.
  isoler() {
    bip(196, 0.5, { type: 'sine', gain: 0.06 })
    bip(147, 0.7, { type: 'sine', gain: 0.05, delai: 0.06 })
  },

  soin() {
    bip(659, 0.08, { type: 'sine', gain: 0.05 })
    bip(880, 0.08, { type: 'sine', gain: 0.05, delai: 0.07 })
    bip(1318, 0.2, { type: 'sine', gain: 0.05, delai: 0.14 })
  },

  /* -- boucles -- */

  // Bourdonnement du frigo + pluie : le bruit de fond de l'appartement vide.
  demarrerAmbiance() {
    if (ambiance) return
    const c = audio()
    const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const pluie = c.createBufferSource()
    pluie.buffer = buf
    pluie.loop = true
    const hp = c.createBiquadFilter()
    hp.type = 'bandpass'
    hp.frequency.value = 2400
    hp.Q.value = 0.4
    const volPluie = c.createGain()
    volPluie.gain.value = 0.02

    const frigo = c.createOscillator()
    frigo.type = 'sine'
    frigo.frequency.value = 58
    const volFrigo = c.createGain()
    volFrigo.gain.value = 0.03

    pluie.connect(hp).connect(volPluie).connect(c.destination)
    frigo.connect(volFrigo).connect(c.destination)
    pluie.start()
    frigo.start()
    ambiance = { pluie, frigo, volPluie, volFrigo }
  },

  arreterAmbiance() {
    if (!ambiance) return
    try {
      ambiance.pluie.stop()
      ambiance.frigo.stop()
    } catch (e) {
      /* deja arrete */
    }
    ambiance = null
  },

  // Battements de coeur pendant le combat. Le tempo suit la Stabilite :
  // plus elle est basse, plus ca bat vite.
  demarrerCoeur() {
    if (coeur) return
    coeur = { intervalle: null, bpm: 70 }
    const battre = () => {
      bip(64, 0.13, { type: 'sine', gain: 0.09 })
      bip(58, 0.16, { type: 'sine', gain: 0.07, delai: 0.16 })
    }
    const planifier = () => {
      if (!coeur) return
      coeur.intervalle = setTimeout(() => {
        battre()
        planifier()
      }, 60000 / coeur.bpm)
    }
    planifier()
  },

  reglerCoeur(stabilite) {
    if (!coeur) return
    // 100 de stabilite -> 62 bpm ; 0 -> 132 bpm
    coeur.bpm = 62 + (1 - stabilite / 100) * 70
  },

  arreterCoeur() {
    if (!coeur) return
    clearTimeout(coeur.intervalle)
    coeur = null
  }
}
