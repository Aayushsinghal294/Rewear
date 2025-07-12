import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className='flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 bg-[url("assets/rewear-bg.jpg")] bg-cover bg-center h-screen text-white'>
      <div className='mt-20'>
        <img src={assets.logo} alt="ReWear Logo" className='h-12 md:h-14' />
      </div>

      <h1 className='text-4xl md:text-6xl font-bold leading-tight max-w-3xl'>
        Give Clothes a <span className="text-yellow-300">Second Life</span>
      </h1>

      <p className='max-w-xl text-base md:text-lg text-gray-100'>
        Join the movement towards sustainable fashion by exchanging your unused clothes.
        Swap directly with others or redeem items using eco points. Every swap saves a garment from landfills.
      </p>

      <div className='flex gap-4'>
        <button 
          onClick={() => navigate('/browse')} 
          className='flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 transition text-white text-sm rounded-full font-medium'
        >
          Start Swapping <ArrowRight className='w-5 h-5' />
        </button>

        <button 
          onClick={() => navigate('/list-item')} 
          className='flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition text-white text-sm rounded-full font-medium'
        >
          List an Item
        </button>
      </div>
    </section>
  )
}

export default HeroSection
