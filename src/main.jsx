import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App.jsx'
import About from './components/About.jsx'
import Archives from './components/Archives.jsx'
import Playground from "./components/Playground";
import HoverSound from "./components/HoverSound";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><App /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/archives" element={<PageTransition><Archives /></PageTransition>} />
        <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <HoverSound />
      <AnimatedRoutes />
    </BrowserRouter>
  </StrictMode>,
)