import Hero from '@/components/home/Hero'
import CredibilityStrip from '@/components/home/CredibilityStrip'
import Problem from '@/components/home/Problem'
import HowItWorks from '@/components/home/HowItWorks'
import Features from '@/components/home/Features'
import DemoSection from '@/components/home/DemoSection'
import Testimonials from '@/components/home/Testimonials'
import PricingSection from '@/components/home/PricingSection'
import FinalCTA from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CredibilityStrip />
      <Problem />
      <HowItWorks />
      <div id="features">
        <Features />
      </div>
      <DemoSection />
      <Testimonials />
      <div id="pricing">
        <PricingSection />
      </div>
      <FinalCTA />
    </main>
  )
}
