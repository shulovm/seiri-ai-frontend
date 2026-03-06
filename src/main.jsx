import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import Plans from './Plans.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/ma">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/plans" element={<Plans />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
