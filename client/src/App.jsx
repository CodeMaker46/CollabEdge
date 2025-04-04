import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />   */}
    </Routes>
  )
}

export default App