import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * En ligne, le prototype vit dans un sous-dossier du site de Jodrick :
 * https://jodrickmounga.be/projets/mtfa/
 *
 * Vite doit le savoir au build pour ecrire les bons chemins vers le JS, le CSS
 * et les images. En developpement local on reste a la racine.
 *
 * Pour deployer ailleurs, surcharger sans toucher au fichier :
 *   VITE_BASE=/autre/chemin/ npm run build
 */
const BASE_EN_LIGNE = process.env.VITE_BASE || '/projets/mtfa/'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? BASE_EN_LIGNE : '/',
  server: { port: 5173, open: true },
  build: {
    // Phaser pese a lui seul les trois quarts du bundle et ne bouge jamais.
    // L'isoler permet au navigateur de le garder en cache entre deux mises a
    // jour du jeu, et de le telecharger en parallele du reste.
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          react: ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1500
  }
}))
