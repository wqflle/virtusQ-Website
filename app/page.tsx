import Hero from '@/components/sections/Hero'
import ProblemSection from '@/components/sections/ProblemSection'
import HowItWorks from '@/components/sections/HowItWorks'
import AIEngine from '@/components/sections/AIEngine'
import FeatureGrid from '@/components/sections/FeatureGrid'
import VisualDemo from '@/components/sections/VisualDemo'
import SocialProof from '@/components/sections/SocialProof'
import PricingSection from '@/components/sections/PricingSection'
import FinalCTA from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <AIEngine />
      <FeatureGrid />
      <VisualDemo />
      <SocialProof />
      <div id="pricing">
        <PricingSection />
      </div>
      <FinalCTA />
    </>
  )
}
