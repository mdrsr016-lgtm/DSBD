import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Apply saved theme on startup
const savedTheme = localStorage.getItem('dsbd-theme')
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme)
    document.documentElement.setAttribute('data-theme', parsed?.state?.theme ?? 'light')
  } catch {
    // ignore
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
