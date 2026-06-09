import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'VirtusQ — AI Volleyball Performance Analysis',
  description: 'Frame-by-frame AI analysis of your volleyball mechanics. Pose estimation, joint tracking, and objective performance scoring — no guessing.',
  keywords: 'volleyball AI analysis, biomechanics scoring, pose estimation, volleyball technique, performance tracking',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    url: 'https://virtusq.com/',
    title: 'VirtusQ — AI Volleyball Performance Analysis',
    description: 'See exactly why your technique breaks down — frame by frame.',
    images: [{ url: '/logo.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VirtusQ — AI Volleyball Performance Analysis',
    description: 'See exactly why your technique breaks down — frame by frame.',
  },
  alternates: { canonical: 'https://virtusq.com/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
