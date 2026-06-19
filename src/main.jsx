import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import About from './components/About.jsx'
import Archives from './components/Archives.jsx'
import Playground from "./components/Playground";
import HoverSound from "./components/HoverSound";
import ScrollToTop from "./components/ScrollToTop";   // ← add

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />        {/* ← resets scroll on every route change */}
      <HoverSound />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)