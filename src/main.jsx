import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { useGame } from './store/useGame'
import './styles/main.scss'

// Confort de dev : permet de sauter a une scene depuis la console du navigateur,
// par exemple `__jeu.getState().allerA('combat')`.
if (import.meta.env.DEV) window.__jeu = useGame

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
