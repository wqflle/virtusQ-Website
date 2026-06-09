import type { Metadata } from 'next'
import DownloadHero from '@/components/sections/download/DownloadHero'
import DownloadSkills from '@/components/sections/download/DownloadSkills'
import DownloadScreenshots from '@/components/sections/download/DownloadScreenshots'
import SocialProof from '@/components/sections/SocialProof'
import PricingSection from '@/components/sections/PricingSection'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata: Metadata = {
  title: 'Download — VirtusQ',
  description: 'Download VirtusQ on the App Store. AI volleyball coach that analyzes your passing and setting technique. Objective 0–100 score and exact coaching fixes. Free to start.',
}

export default function DownloadPage() {
  return (
    <>
      <DownloadHero />
      <DownloadSkills />
      <DownloadScreenshots />
      <SocialProof />
      <PricingSection />
      <FinalCTA />
    </>
  )
}
