import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import Landing from './Landing.jsx'
import App from './App.jsx'
import Plans from './Plans.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={typeof window !== "undefined" && window.location.pathname.startsWith("/ma") ? "/ma" : import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/welcome" element={<Landing />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
