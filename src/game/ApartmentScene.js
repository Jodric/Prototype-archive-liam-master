import Phaser from 'phaser'
import { creerTexture, SPRITES_LIAM, SPRITE_QR } from './pixels'
import { useGame, ECRAN } from '../store/useGame'
import { ARCHIVES, RESSOURCES_QR } from '../data/archives'
import { tactile, reinitialiserTactile } from './tactile'
import { sfx } from '../audio/sfx'

export const LARGEUR = 960
export const HAUTEUR = 544

const VITESSE = 130
const PORTEE_INTERACTION = 66

/**
 * L'appartement de Liam, en vue top-down.
 *
 * Tout le decor est dessine au trait (Graphics) plutot que charge depuis un
 * tileset : c'est un placeholder assume, qui respecte la charte noir et blanc
 * en attendant les vraies maps Tiled.
 */
export default class ApartmentScene extends Phaser.Scene {
  constructor() {
    super('appartement')
  }

  preload() {
    Object.entries(SPRITES_LIAM).forEach(([cle, lignes]) => {
      if (!this.textures.exists(cle)) creerTexture(this, cle, lignes)
    })
    if (!this.textures.exists('qr')) creerTexture(this, 'qr', SPRITE_QR)
    this.creerVignette()
  }

  create() {
    this.direction = 'bas'
    this.frame_ = 0
    this.horlogeMarche = 0
    this.interactionCourante = null

    this.dessinerDecor()
    this.creerInteractifs()
    this.creerJoueur()
    this.creerVignetteSprite()

    this.clavier = this.input.keyboard.addKeys({
      haut: Phaser.Input.Keyboard.KeyCodes.UP,
      bas: Phaser.Input.Keyboard.KeyCodes.DOWN,
      gauche: Phaser.Input.Keyboard.KeyCodes.LEFT,
      droite: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      espace: Phaser.Input.Keyboard.KeyCodes.SPACE,
      entree: Phaser.Input.Keyboard.KeyCodes.ENTER
    })

    this.clavier.espace.on('down', () => this.declencher())
    this.clavier.entree.on('down', () => this.declencher())

    // Le bouton d'action tactile passe par ici.
    tactile.declencher = () => this.declencher()

    sfx.demarrerAmbiance()
    this.events.once('shutdown', () => {
      sfx.arreterAmbiance()
      tactile.declencher = null
      reinitialiserTactile()
    })
  }

  /* ---------------------------------------------------------------- */
  /* Decor                                                             */
  /* ---------------------------------------------------------------- */

  dessinerDecor() {
    const g = this.add.graphics()

    // Sol carrele blanc, comme dans les maquettes du couloir.
    g.fillStyle(0xffffff, 1).fillRect(0, 0, LARGEUR, HAUTEUR)
    g.lineStyle(1, 0xcccccc, 1)
    for (let x = 0; x <= LARGEUR; x += 48) g.lineBetween(x, 96, x, HAUTEUR)
    for (let y = 96; y <= HAUTEUR; y += 48) g.lineBetween(0, y, LARGEUR, y)

    // Bandeau de mur noir en haut + briques blanches.
    g.fillStyle(0x000000, 1).fillRect(0, 0, LARGEUR, 96)
    g.lineStyle(2, 0xffffff, 0.85)
    for (let y = 12; y < 96; y += 20) {
      g.lineBetween(0, y, LARGEUR, y)
      const decalage = ((y / 20) % 2) * 30
      for (let x = decalage; x < LARGEUR; x += 60) g.lineBetween(x, y, x, y + 20)
    }

    // Murs lateraux et bas.
    g.fillStyle(0x000000, 1)
    g.fillRect(0, 96, 24, HAUTEUR - 96)
    g.fillRect(LARGEUR - 24, 96, 24, HAUTEUR - 96)
    g.fillRect(0, HAUTEUR - 28, LARGEUR, 28)

    this.decor = this.add.graphics()
    this.dessinerMobilier(this.decor)
  }

  /** Petit helper : rectangle blanc a gros contour noir, facon lineart. */
  boite(g, x, y, w, h, remplissage = 0xffffff) {
    g.fillStyle(remplissage, 1).fillRect(x, y, w, h)
    g.lineStyle(3, 0x000000, 1).strokeRect(x, y, w, h)
  }

  dessinerMobilier(g) {
    // Lit : sommier blanc, oreiller, couverture a plis
    this.boite(g, 40, 130, 132, 200)
    this.boite(g, 50, 138, 112, 52) // oreiller
    this.boite(g, 44, 200, 124, 126, 0xbfbfbf) // couverture
    g.lineStyle(2, 0x000000, 1)
    for (let y = 220; y < 320; y += 22) g.lineBetween(50, y, 162, y)
    // Telephone pose sur la couverture
    this.boite(g, 98, 246, 22, 38, 0x000000)
    g.fillStyle(0xffffff, 1).fillRect(102, 252, 14, 26)

    // Commode
    this.boite(g, 220, 120, 118, 66)
    g.lineStyle(2, 0x000000, 1).lineBetween(220, 153, 338, 153)
    g.fillStyle(0x000000, 1).fillRect(268, 134, 22, 6).fillRect(268, 167, 22, 6)

    // Carnet de croquis, tombe par terre
    this.boite(g, 412, 418, 48, 34)
    g.lineStyle(2, 0x000000, 1)
      .lineBetween(424, 426, 450, 426)
      .lineBetween(424, 434, 444, 434)
      .lineBetween(424, 442, 452, 442)

    // Fenetre dans le mur du fond
    this.boite(g, 452, 14, 190, 68, 0x000000)
    g.lineStyle(3, 0xffffff, 1).strokeRect(452, 14, 190, 68)
    g.lineBetween(547, 14, 547, 82).lineBetween(452, 48, 642, 48)
    // Traits de pluie
    g.lineStyle(1, 0xffffff, 0.55)
    for (let i = 0; i < 22; i++) {
      const x = 456 + Math.random() * 180
      const y = 18 + Math.random() * 58
      g.lineBetween(x, y, x - 4, y + 9)
    }

    // Bureau + ordinateur
    this.boite(g, 700, 120, 212, 84)
    g.lineStyle(2, 0x000000, 1).lineBetween(700, 186, 912, 186)
    this.boite(g, 762, 96, 92, 62, 0x000000) // ecran, allume
    g.fillStyle(0xffffff, 1).fillRect(768, 102, 80, 50)
    g.fillStyle(0x000000, 1)
    for (let i = 0; i < 5; i++) g.fillRect(774, 110 + i * 8, 40 + i * 7, 3)
    this.boite(g, 742, 168, 130, 26) // clavier

    // Chaise + casque. Elle est poussee sur le cote : ca degage la voie d'acces
    // a l'ordinateur, et une chaise repoussee raconte deja quelque chose.
    this.boite(g, 694, 258, 66, 66)
    g.lineStyle(3, 0x000000, 1).strokeRect(706, 270, 42, 42)
    g.lineStyle(4, 0x000000, 1).beginPath()
    g.arc(727, 284, 18, Math.PI, 0)
    g.strokePath()

    // Frigo
    this.boite(g, 40, 372, 92, 128)
    g.lineStyle(2, 0x000000, 1).lineBetween(40, 416, 132, 416)
    g.fillStyle(0x000000, 1).fillRect(118, 396, 6, 26)

    // Affiche + QR sur le mur
    this.boite(g, 190, 14, 76, 70)
    this.add.image(228, 44, 'qr').setDisplaySize(48, 48).setDepth(1)
    this.boite(g, 664, 16, 44, 44)
    this.add.image(686, 38, 'qr').setDisplaySize(32, 32).setDepth(1)
  }

  /* ---------------------------------------------------------------- */
  /* Interactifs                                                       */
  /* ---------------------------------------------------------------- */

  creerInteractifs() {
    const jeu = useGame.getState()

    this.interactifs = [
      {
        id: 'ordinateur',
        x: 806,
        y: 214,
        label: 'L’ordinateur - Clara est en ligne',
        principal: true,
        action: () => {
          sfx.valider()
          jeu.allerA(ECRAN.CONVERSATION)
        }
      },
      {
        id: 'commode',
        x: 279,
        y: 196,
        label: 'Le tiroir de la commode',
        action: () => this.ramasser('photo_parents', "Vous ouvrez le tiroir du bas.")
      },
      {
        id: 'telephone',
        x: 107,
        y: 296,
        label: 'Ton téléphone, sur le lit',
        action: () =>
          this.ramasser('premier_message', 'Vous remontez la conversation jusqu’au tout début.')
      },
      {
        id: 'carnet',
        x: 436,
        y: 460,
        label: 'Un carnet, par terre',
        action: () => this.ramasser('carnet_croquis', 'Vous ramassez le carnet.')
      },
      {
        id: 'casque',
        x: 727,
        y: 332,
        label: 'Le casque, sur la chaise',
        action: () => this.ramasser('vocal_nuit', 'Le casque est encore branché.')
      },
      {
        id: 'lit',
        x: 106,
        y: 340,
        label: 'Le lit',
        action: () =>
          this.examiner(
            'Le lit',
            'Fait ce matin. Vous ne vous êtes pas couché dedans depuis trois jours - le canapé est plus près de l’ordinateur.'
          )
      },
      {
        id: 'frigo',
        x: 86,
        y: 510,
        label: 'Le frigo',
        action: () =>
          this.examiner(
            'Le frigo',
            'Il bourdonne. Il y a un yaourt, de la moutarde, et un post-it de votre mère avec une liste de courses de 2023. Vous ne l’avez jamais enlevé.'
          )
      },
      {
        id: 'fenetre',
        x: 547,
        y: 110,
        label: 'La fenêtre',
        action: () =>
          this.examiner(
            'La fenêtre',
            'Namur sous la pluie. En bas, quelqu’un rentre chez lui. Les fenêtres d’en face sont allumées. C’est étrange de se sentir seul avec autant de lumière autour.'
          )
      },
      {
        id: 'qr_esi',
        x: 228,
        y: 104,
        label: 'Affiche - QR-code',
        action: () => this.ouvrirQR('esi_campus')
      },
      {
        id: 'qr_ecoute',
        x: 686,
        y: 80,
        label: 'Un QR-code punaisé au mur',
        action: () => this.ouvrirQR('ligne_ecoute')
      }
    ]

    // Marqueur sur chaque point d'interet. Au-dessus de la vignette, sinon
    // l'obscurite les rendrait introuvables.
    this.marqueurs = this.interactifs.map((it) => {
      const m = this.add.text(it.x, it.y - 10, '+', {
        fontFamily: 'monospace',
        fontSize: it.principal ? '26px' : '18px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      })
      m.setOrigin(0.5).setDepth(12)
      this.tweens.add({
        targets: m,
        alpha: { from: 0.25, to: 1 },
        duration: it.principal ? 700 : 1200,
        yoyo: true,
        repeat: -1
      })
      return m
    })
  }

  ramasser(id, intro) {
    const jeu = useGame.getState()
    const archive = ARCHIVES[id]
    const nouvelle = jeu.collecterArchive(id)
    if (nouvelle) sfx.ramasser()
    else sfx.survol()
    jeu.ouvrirPanneau({
      type: 'texte',
      titre: archive.titre,
      intro,
      corps: archive.texte,
      badge: nouvelle ? 'Ajouté aux Archives' : 'Déjà dans les Archives'
    })
  }

  examiner(titre, corps) {
    sfx.survol()
    useGame.getState().ouvrirPanneau({ type: 'texte', titre, corps })
  }

  ouvrirQR(id) {
    const jeu = useGame.getState()
    jeu.scannerQR(id)
    sfx.notification()
    jeu.ouvrirPanneau({ type: 'qr', ressource: RESSOURCES_QR[id] })
  }

  /* ---------------------------------------------------------------- */
  /* Joueur                                                            */
  /* ---------------------------------------------------------------- */

  creerJoueur() {
    this.joueur = this.physics.add.sprite(480, 400, 'liam-bas-0')
    this.joueur.setScale(2.4)
    this.joueur.setDepth(4)
    this.joueur.body.setSize(10, 8).setOffset(3, 16)

    // Obstacles : murs + mobilier.
    this.obstacles = this.physics.add.staticGroup()
    const bloc = (x, y, w, h) => {
      const r = this.add.rectangle(x + w / 2, y + h / 2, w, h)
      this.physics.add.existing(r, true)
      this.obstacles.add(r)
    }
    bloc(0, 0, LARGEUR, 100) // mur du fond
    bloc(0, 96, 26, HAUTEUR) // mur gauche
    bloc(LARGEUR - 26, 96, 26, HAUTEUR) // mur droit
    bloc(0, HAUTEUR - 30, LARGEUR, 30) // mur bas
    bloc(40, 130, 132, 200) // lit
    bloc(220, 120, 118, 66) // commode
    bloc(700, 120, 212, 84) // bureau
    bloc(694, 258, 66, 66) // chaise
    bloc(40, 372, 92, 128) // frigo

    this.physics.add.collider(this.joueur, this.obstacles)
  }

  /* ---------------------------------------------------------------- */
  /* Vignette - la piece s'assombrit quand la Stabilite baisse          */
  /* ---------------------------------------------------------------- */

  /** Halo generique : un degrade radial reutilisable pour l'ombre et la lumiere. */
  degradeRadial(cle, couleur, arrets) {
    if (this.textures.exists(cle)) return
    const taille = 1024
    const t = this.textures.createCanvas(cle, taille, taille)
    const ctx = t.getContext()
    const grad = ctx.createRadialGradient(
      taille / 2, taille / 2, 0,
      taille / 2, taille / 2, taille / 2
    )
    arrets.forEach(([pos, alpha]) => grad.addColorStop(pos, `rgba(${couleur},${alpha})`))
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, taille, taille)
    t.refresh()
  }

  creerVignette() {
    // L'ombre. Elle est affichee tres grande (2600px) pour couvrir le cadre ou
    // que Liam se trouve, donc la flaque de lumiere doit occuper une fraction
    // minuscule du rayon : ~50px clairs, noir complet au-dela de ~200px.
    this.degradeRadial('vignette', '0,0,0', [
      [0, 0], [0.038, 0], [0.08, 0.45], [0.115, 0.8], [0.155, 1], [1, 1]
    ])
    // La lumiere de l'ecran, qui doit passer par-dessus l'ombre.
    this.degradeRadial('lueur', '255,255,255', [
      [0, 0.9], [0.22, 0.45], [0.5, 0.12], [1, 0]
    ])
  }

  creerVignetteSprite() {
    // Taille fixe et large : ou que soit Liam, l'image couvre tout le cadre.
    // C'est l'opacite, pas la taille, qui traduit la Stabilite.
    this.vignette = this.add
      .image(LARGEUR / 2, HAUTEUR / 2, 'vignette')
      .setDisplaySize(2600, 2600)
      .setDepth(10)

    // L'ecran allume reste net meme quand le reste s'efface - c'est le point
    // de fuite du personnage, et le dossier insiste dessus.
    this.lueurEcran = this.add
      .image(806, 150, 'lueur')
      .setDisplaySize(430, 430)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.5)
      .setDepth(11)

    this.tweens.add({
      targets: this.lueurEcran,
      alpha: { from: 0.42, to: 0.62 },
      duration: 2400,
      yoyo: true,
      repeat: -1
    })
  }

  /* ---------------------------------------------------------------- */
  /* Boucle                                                            */
  /* ---------------------------------------------------------------- */

  declencher() {
    const jeu = useGame.getState()
    if (jeu.panneau || jeu.ecran !== ECRAN.APPARTEMENT) return
    if (this.interactionCourante) this.interactionCourante.action()
  }

  update(_, delta) {
    const jeu = useGame.getState()
    const bloque = !!jeu.panneau || jeu.ecran !== ECRAN.APPARTEMENT

    const k = this.clavier
    let vx = 0
    let vy = 0
    if (!bloque) {
      if (k.gauche.isDown || k.q.isDown || k.a.isDown) vx -= 1
      if (k.droite.isDown || k.d.isDown) vx += 1
      if (k.haut.isDown || k.z.isDown || k.w.isDown) vy -= 1
      if (k.bas.isDown || k.s.isDown) vy += 1
      vx += tactile.x
      vy += tactile.y
      vx = Phaser.Math.Clamp(vx, -1, 1)
      vy = Phaser.Math.Clamp(vy, -1, 1)
    }

    const norme = Math.hypot(vx, vy) || 1
    this.joueur.setVelocity((vx / norme) * VITESSE, (vy / norme) * VITESSE)

    if (vx !== 0 || vy !== 0) {
      if (Math.abs(vx) > Math.abs(vy)) {
        this.direction = 'cote'
        this.joueur.setFlipX(vx < 0)
      } else {
        this.direction = vy < 0 ? 'haut' : 'bas'
        this.joueur.setFlipX(false)
      }
      this.horlogeMarche += delta
      if (this.horlogeMarche > 170) {
        this.horlogeMarche = 0
        this.frame_ = this.frame_ ? 0 : 1
      }
    } else {
      this.frame_ = 0
    }
    this.joueur.setTexture(`liam-${this.direction}-${this.frame_}`)

    // Interaction la plus proche.
    let proche = null
    let meilleure = PORTEE_INTERACTION
    for (const it of this.interactifs) {
      const d = Phaser.Math.Distance.Between(this.joueur.x, this.joueur.y, it.x, it.y)
      if (d < meilleure) {
        meilleure = d
        proche = it
      }
    }
    if (proche?.id !== this.interactionCourante?.id) {
      this.interactionCourante = proche
      jeu.definirInteraction(proche ? { id: proche.id, label: proche.label } : null)
      if (proche) sfx.survol()
    }

    // La piece se referme a mesure que la Stabilite tombe.
    this.vignette.setPosition(this.joueur.x, this.joueur.y)
    this.vignette.setAlpha(0.5 + (1 - jeu.stabilite / 100) * 0.45)
  }
}
