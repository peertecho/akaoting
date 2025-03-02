import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/app'

const element = document.getElementById('app')
if (!element) {
  throw new Error('element not found')
}

const root = createRoot(element)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
