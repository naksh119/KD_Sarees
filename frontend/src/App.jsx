import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import GudiPadwaHero from './components/GudiPadwaHero'
import FeaturesStrip from './components/FeaturesStrip'
import TopCategories from './components/TopCategories'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <TopCategories />
        <GudiPadwaHero />
      </main>
    </>
  )
}

export default App
