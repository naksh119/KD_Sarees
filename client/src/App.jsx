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
import CustomerReviewsSection from './components/CustomerReviewsSection'
import Footer from './components/footer/Footer'

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
        <CustomerReviewsSection />
      </main>
      <Footer />
    </>
  )
}

export default App
