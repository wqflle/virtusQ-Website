import type { Metadata } from 'next'
import FeaturesHero from '@/components/sections/features/FeaturesHero'
import FeaturesDetail from '@/components/sections/features/FeaturesDetail'
import AIEngine from '@/components/sections/AIEngine'
import FeatureGrid from '@/components/sections/FeatureGrid'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata: Metadata = {
  title: 'Features — VirtusQ',
  description: 'Frame-by-frame biomechanics analysis, AI performance scoring, position-specific coaching, and progress tracking for volleyball athletes.',
}

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />
      <FeaturesDetail />
      <AIEngine />
      <FeatureGrid />
      <FinalCTA />
    </>
  )
}
