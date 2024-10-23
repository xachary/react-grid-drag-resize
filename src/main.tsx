import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './demo/App.tsx'
// import App from './demo/Test.tsx'
import './demo/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
