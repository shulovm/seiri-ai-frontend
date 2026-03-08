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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ma" element={<App />} />
        <Route path="/ma/" element={<App />} />
        <Route path="/ma/plans" element={<Plans />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)
