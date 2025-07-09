import HeroSection from "@/components/landing/HeroSection"
import InsuranceSection from "@/components/landing/InsuranceSection"
import ClaimsProcess from "@/components/landing/ClaimsProcess"
import MemorialServicesSection from "@/components/landing/MemorialServicesSection"
import LocalPartnersSection from "@/components/landing/LocalPartnersSection"
import CommunityImpactEvents from "@/components/landing/CommunityImpactEvents"
import AboutSection from "@/components/landing/AboutSection"
import Testimonials from "@/components/landing/Testimonials"
import TeamSection from "@/components/landing/TeamSection"
import FinalCTA from "@/components/landing/FinalCTA"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <InsuranceSection />
      <ClaimsProcess />
      <MemorialServicesSection />
      <LocalPartnersSection />
      <CommunityImpactEvents />
      <AboutSection />
      <Testimonials />
      <TeamSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
