import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lxgw-wenkai-webfont/style.css'
import './index.css'
import App from './App.tsx'

import { createSimpleIme } from 'simple-ime'
createSimpleIme().turnOn()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
