# ARCHIVE // LIAM - prototype jouable

Projet transmédia de sensibilisation à l'isolement et au mal-être étudiant.
Liam, 19 ans, orphelin, étudiant à la HEAJ, vit une relation à distance avec
Clara sur Discord. Elle lui demande de venir en France. Le joueur traverse une
nuit de sa vie et décide de ce qu'il en fait.

Travail de fin d'études- Master Architecture Transmédia, Haute École Albert
Jacquard (Namur). Hicham El Bahri · Jodrick Mounga Tchamo ·
Jordan Ngangmo Mkuingang · Evan Depauw.

**Jouable en ligne : <https://jodrickmounga.be/projets/mtfa/>**

Ce dépôt contient un prototype de démonstration du visual novel hybride décrit
dans le dossier de production. Il n'a qu'un but : rendre l'idée **jouable**
pour qu'on puisse la montrer, la discuter et la corriger avant de produire le
vrai jeu.

## Lancer le prototype

```bash
npm install
```

```bash
npm run dev
```

Puis ouvrir <http://localhost:5173>.

## Mettre en ligne

Le prototype est configuré pour vivre à l'adresse
**<https://jodrickmounga.be/projets/mtfa/>**. C'est un site statique : pas de
base de données, pas de PHP, pas de Node côté serveur. Un simple dossier de
fichiers.

```bash
npm run build
```

Le résultat est dans `dist/`. **Uploader tout le contenu de `dist/`** (pas le
dossier lui-même) dans `/projets/mtfa/` sur le serveur.

Arborescence attendue sur le serveur :

```
httpdocs/projets/mtfa/
  index.html
  assets/       ← js, css
  personnages/  ← les 18 planches
```

### Déploiement sur le VPS (Plesk + nginx)

1. `npm run build` en local.
2. Plesk → **Sites web & domaines** → `jodrickmounga.be` → **Fichiers**.
3. Déposer le contenu de `dist/` dans `httpdocs/projets/mtfa/`, en écrasant.
   Le plus rapide passe par un zip du contenu de `dist/`, uploadé puis
   « Extraire les fichiers ».

Rien à configurer côté serveur : **Brotli est déjà actif** sur cet
hébergement, ce qui ramène le moteur de jeu de 1,5 Mo à environ 340 Ko.
Vérification :

```bash
curl -sI -H "Accept-Encoding: br" https://jodrickmounga.be/projets/mtfa/ | grep -i content-encoding
```

Chaque build produit des noms de fichiers avec un nouveau hash. Les anciens
fichiers de `assets/` restés sur le serveur ne sont plus référencés : ils ne
cassent rien, mais autant les supprimer de temps en temps.

Le fichier `.htaccess` livré dans `dist/` ne sert que sur un hébergement
Apache. Sur nginx il est simplement ignoré- on le garde pour que le prototype
reste déployable ailleurs sans reconfiguration.

**Changer d'adresse** se fait sans toucher au code- la base est injectée au
build :

```bash
VITE_BASE=/autre/chemin/ npm run build
```

Pour un vrai sous-domaine (`mtfa.jodrickmounga.be`), la base redevient la
racine :

```bash
VITE_BASE=/ npm run build
```

Attention : le chemin doit finir par un slash. C'est cette URL que pointera le
QR-code physique.

## Ce que le prototype couvre

Une **vertical slice** : une seule nuit, mais qui traverse les trois couches du
jeu et l'aboutissement transmédia.

| Étape | Couche | Ce qu'on y démontre |
|---|---|---|
| Écran titre | React | Identité, logo glitché, avertissement de contenu |
| Prologue | Visual Novel | Portraits, boîte de dialogue, machine à écrire |
| L'appartement | **Phaser** | Déplacement top-down, collisions, interactions, QR-codes muraux |
| La conversation | Visual Novel | Choix narratifs, impact sur la Stabilité, choix verrouillé par une Archive |
| L'Anxiété Dépressive | Combat | Les 4 actions, la jauge de Stabilité, le piège du repli |
| Résolution | React | Message vocal de Liam, code communauté généré, ressources réelles |

Commandes : **flèches / ZQSD** pour se déplacer, **Espace** pour interagir et
pour dérouler les dialogues, **Échap** pour fermer un panneau.

## Écrans et formats

Toute l'interface est composée en pixels absolus pour un cadre fixe de
**1280 × 720**, que `useEchelle` redimensionne pour remplir la fenêtre. C'est la
méthode classique en jeu vidéo : les proportions validées restent identiques
partout, du téléphone au vidéoprojecteur, sans rendre chaque valeur responsive.

Sur **écran tactile** (`@media (pointer: coarse)`) :

- en **portrait**, le jeu est masqué au profit d'un écran « Tournez votre
  téléphone »- le 16:9 n'est pas lisible dans ce format ;
- en **paysage**, une croix directionnelle et un bouton `OK` apparaissent pour
  la phase de déplacement, seule partie qui exigeait un clavier. Ils sont
  dimensionnés pour rester au-dessus de 44 px réels **après** mise à l'échelle
  (~0,54 sur un téléphone) ;
- un bouton **plein écran** est proposé sur l'écran titre : en paysage, la barre
  d'adresse ampute la hauteur, donc l'échelle, donc tout le jeu.

Les libellés de commandes s'adaptent via les utilitaires `.si-clavier` et
`.si-doigt` : les deux variantes sont rendues, le CSS tranche. Aucun test du
tactile en JavaScript, pour que les appareils hybrides restent corrects.

## Les deux mécaniques à regarder de près

**La Stabilité** remplace les points de vie. Elle est lue par les deux couches :
React l'affiche et la modifie, Phaser s'en sert pour assombrir l'appartement -
plus elle est basse, plus la pièce se referme autour de Liam. En combat, elle
règle aussi le tempo des battements de cœur.

**Le piège du repli.** « S'Isoler » est la seule action qui soulage
immédiatement *et* empêche de perdre de la Stabilité. C'est aussi la seule qui
renforce durablement l'adversaire (+12 d'Emprise, et +3 de dégâts sur tous ses
coups suivants, définitivement). Au bout de deux replis, elle cesse même de
protéger. Le joueur doit pouvoir tomber dans le piège tout seul, puis le
comprendre - c'est là que passe le message, pas dans un texte explicatif.

Testé : s'isoler en boucle mène toujours à la défaite ; un parcours mêlant
Contacts, Archives et Affronter se gagne confortablement.

**Les Archives** font le lien entre exploration et narration. Les quatre
souvenirs cachés dans l'appartement débloquent une réplique de la conversation
(« Lui parler de ses parents ») et servent d'actions de combat à usage unique.
Ne rien fouiller reste jouable, mais nettement plus dur - et le code final est
différent.

## Ce qui est **placeholder** et devra être remplacé

- **Les décors de la map** sont dessinés au trait dans le code
  (`src/game/ApartmentScene.js`), pas chargés depuis un tileset. Le pipeline
  prévu par le dossier reste Photoshop → Tiled → Phaser : quand les tilesets
  existeront, seule la méthode `dessinerMobilier` disparaît.
- **Le sprite de Liam** est un pixel art défini en chaînes de caractères dans
  `src/game/pixels.js`. Trois orientations, deux frames. À remplacer par une
  vraie spritesheet.
- **L'Anxiété Dépressive** est une masse d'encre animée en SVG
  (`src/ui/Anxiete.jsx`), en attendant l'illustration prévue.
- **Le son** est entièrement synthétisé en Web Audio (`src/audio/sfx.js`) :
  aucun fichier audio. À remplacer par les vraies musiques et la voix off.
- **Le message vocal final** est du texte qui se dévoile au rythme d'une lecture
  simulée. Dans le jeu final, c'est un vrai enregistrement.
- **Le code communauté** est calculé côté client à partir du parcours. Dans le
  jeu final il devra être validé côté serveur avant de donner accès au Discord.
- **Les deux autres zones** (le Chemin, l'École) ne sont pas dans la slice.

## Points ouverts pour l'équipe

- **La mère de Clara** existe en 6 expressions mais n'apparaît nulle part dans
  le dossier. Elle a ici un rôle bref - elle passe derrière Clara pendant
  l'appel et rend la France concrète. À valider ou à réécrire.
- **Le ton des dialogues** doit passer par le Service Inclusif, comme prévu dans
  le partenariat. Tout le texte est isolé dans `src/data/script.js` et
  `src/data/combat.js` : il se relit et se corrige sans toucher au code.
- **L'équilibrage du combat** est dans `src/data/combat.js` (dégâts, coûts,
  décroissance du repli). Tout se règle là.
- **Format mobile** : le choix actuel est d'inviter à tourner l'écran. Une vraie
  mise en page portrait (personnage en haut, dialogue en bas, actions de combat
  empilées) serait plus fidèle au dossier, qui décrit une expérience vécue
  « à travers l'écran d'un smartphone ». À trancher pour le jeu final.

## Structure

```
src/
  data/       script.js, combat.js, archives.js   ← tout le contenu éditorial
  store/      useGame.js                          ← Stabilité, Archives, progression
  game/       ApartmentScene.js, pixels.js        ← couche Phaser
  ui/         SceneVN, Conversation, Combat…      ← couche React
  audio/      sfx.js                              ← Web Audio
  styles/     partiels SASS                       ← charte noir et blanc
```

Le pont entre les deux couches est le store : Phaser le lit, React le modifie.
Quand Liam déclenche un événement sur la map, React prend le dessus avec la
scène correspondante.

En développement, `window.__jeu` expose le store : `__jeu.getState().allerA('combat')`
saute directement à une scène, pratique pour tester sans rejouer.

## Avertissement

Le sujet est sensible. Un écran d'avertissement précède le jeu, l'issue
« défaite » n'est jamais présentée comme une punition, et de vraies ressources
d'aide sont rappelées à la fin. Ces choix ne sont pas décoratifs : ils doivent
être maintenus dans toute évolution du prototype.
