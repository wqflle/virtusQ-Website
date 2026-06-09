'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

export default function FinalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="section-y relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="container-narrow relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="badge mb-8 inline-flex">Ready to level up?</div>

          <h2 className="display-xl text-white mb-6">
            Your next session starts with{' '}
            <span className="gradient-text">knowing what to fix</span>.
          </h2>

          <p className="text-xl leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Download VirtusQ free and get your first Elite Score in under 60 seconds. No equipment. No subscription. Just better volleyball.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton>
              <a
                href="https://apps.apple.com/au/app/virtusq/id6761644948"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 16px 60px rgba(124,58,237,0.5)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on the App Store
                <ArrowRight size={16} />
              </a>
            </MagneticButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-6 text-sm"
            style={{ color: 'var(--text-subtle)' }}
          >
            Free forever plan available · No credit card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
