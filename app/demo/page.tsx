import type { Metadata } from 'next'
import DemoHero from '@/components/sections/demo/DemoHero'
import DemoAnalysis from '@/components/sections/demo/DemoAnalysis'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata: Metadata = {
  title: 'Demo Analysis — VirtusQ',
  description: 'See exactly what a VirtusQ analysis looks like. Upload your volleyball clip and get objective AI feedback in under 60 seconds.',
}

export default function DemoPage() {
  return (
    <>
      <DemoHero />
      <DemoAnalysis />
      <FinalCTA />
    </>
  )
}
