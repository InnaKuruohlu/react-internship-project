import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { searchMovies } from './services/omdbMovieService'

searchMovies('batman')
  .then((movies) => console.log('[OMDb test] Success:', movies))
  .catch((error) => console.error('[OMDb test] Failed:', error))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
