import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage.jsx'
import Login from './components/pages/Login.jsx'
import About from './components/pages/About.jsx'
import Features from './components/pages/Features.jsx'
import Pricing from './components/pages/Pricing.jsx'
import Contact from './components/pages/Contact.jsx'
import Dashboard from './components/pages/Dashboard.jsx'
import Room from './components/pages/Room.jsx'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About/>} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/login" element={<Login />} />  

      {/* Protected routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/room/:roomId" element={<Room />} />
      
    </Routes>

    <Toaster richColors closeButton position="top-center" />
    </>
    
  )
}

export default App