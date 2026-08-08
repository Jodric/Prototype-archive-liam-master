/**
 * Resolution des fichiers du dossier `public/`.
 *
 * Le prototype n'est pas forcement servi a la racine d'un domaine : en ligne il
 * vit dans /projets/mtfa/. Un chemin relatif ("personnages/liam-4.png") casserait
 * des que l'URL est appelee sans slash final. On prefixe donc toujours par la
 * base injectee au build (`vite.config.js` -> `base`).
 */
export function fichier(chemin) {
  return import.meta.env.BASE_URL + chemin.replace(/^\//, '')
}
