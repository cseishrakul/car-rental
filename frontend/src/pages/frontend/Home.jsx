import React from 'react'
import Hero from '../../components/frontend/Hero'
import FeaturedSection from '../../components/frontend/FeaturedSection'
import Banner from '../../components/frontend/Banner'
import Newsletter from '../../components/frontend/Newsletter'

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedSection />
      <Banner />
      <Newsletter />
    </div>
  )
}

export default Home