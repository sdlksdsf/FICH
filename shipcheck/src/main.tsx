import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import SharedReport from './components/SharedReport'
import { decodeReport } from './scan'
import './styles.css'

// A shared report is a link to #r=<token>. It is decoded locally, so a shared
// report needs no backend and no storage — and the sharer's code never travels.
const hash = window.location.hash
const shared = hash.startsWith('#r=') ? decodeReport(hash.slice(3)) : null

createRoot(document.getElementById('root')!).render(
  <StrictMode>{shared ? <SharedReport report={shared} /> : <App />}</StrictMode>,
)
