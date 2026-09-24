import Header from '@/components/atoms/Header/Header'
import HowItWorks from '@/components/atoms/HowItWorks/HowItWorks'
import HeroSection from '@/components/molecules/HeroSection/HeroSection'
import React from 'react'

const Landing = () => {
  return (
    <div className='min-h-screen flex flex-col justify-between bg-black text-white relative'>
      <Header />
      <HeroSection />
      <HowItWorks />
    </div>
  )
}

export default Landing