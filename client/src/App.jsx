import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import GudiPadwaHero from './components/GudiPadwaHero'
import FeaturesStrip from './components/FeaturesStrip'
import TopCategories from './components/TopCategories'
import SareeStoreSection from './components/SareeStoreSection'
import SilkSareeSection from './components/SilkSareeSection'
import ProductSection from './components/ProductSection'
import BestsellerSareesSection from './components/BestsellerSareesSection'
import StoryLookbookSection from './components/StoryLookbookSection'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <TopCategories />
        <GudiPadwaHero />
        <ProductSection />
        <SareeStoreSection />
        <SilkSareeSection />
        <BestsellerSareesSection />
        <StoryLookbookSection />
      </main>
    </>
  )
}

export default App
