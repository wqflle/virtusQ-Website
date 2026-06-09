import type { Metadata } from 'next'
import DemoHero from '@/components/sections/demo/DemoHero'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata: Metadata = {
  title: 'Demo Analysis — VirtusQ',
  description: 'Upload your volleyball clip and get objective AI feedback in under 60 seconds. Pose estimation, score, and coaching fixes.',
}

export default function DemoPage() {
  return (
    <>
      <DemoHero />
      <FinalCTA />
    </>
  )
}
