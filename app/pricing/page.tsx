import type { Metadata } from 'next'
import PricingSection from '@/components/sections/PricingSection'
import FinalCTA from '@/components/sections/FinalCTA'
import PricingHero from '@/components/sections/pricing/PricingHero'
import PricingFAQ from '@/components/sections/pricing/PricingFAQ'

export const metadata: Metadata = {
  title: 'Pricing — VirtusQ',
  description: 'Start free. Scale when ready. Pro at $15/mo, Elite at $25/mo, Club teams at $200/mo.',
}

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingSection />
      <PricingFAQ />
      <FinalCTA />
    </>
  )
}
