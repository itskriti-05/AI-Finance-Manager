import React from 'react'
import Navbar from '../components/LandingPage/Navbar'
import Hero from '../components/LandingPage/Hero'
import Features from '../components/LandingPage/Features'
import Workflow from '../components/LandingPage/Workflow'
import Footer from '../components/LandingPage/Footer'

const LandingPage = () => {
  return (
    // <main className="min-h-screen bg-background">
    <>
      <Navbar />

      <Hero />
      <Features/>
      <Workflow/>
      <Footer/>
      </>
    // </main>
  )
}

export default LandingPage