import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import CategoryHighlights from "../components/landing/CategoryHighlights";
import FeaturedProducts from "../components/landing/FeaturedProducts";
import ValueProps from "../components/landing/ValueProps";
import AboutSection from "../components/landing/AboutSection"
import PromoBanner from "../components/landing/PromoBanner";
import Newsletter from "../components/landing/Newsletter";
import Footer from "../components/landing/Footer";
import NewArrivals from "../components/landing/NewArrivals";

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <CategoryHighlights />
      <FeaturedProducts />
      <NewArrivals />
      <AboutSection />
      <ValueProps />
      <PromoBanner />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default LandingPage;
