'use client'
import { motion } from 'framer-motion'

export default function PricingHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: '140px', paddingBottom: '6rem', background: 'var(--void)' }}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,212,255,0.055) 0%, transparent 65%)' }}
      />

      <div className="container-narrow text-center relative">
        <motion.div
          className="badge mb-6 mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
          Transparent Pricing
        </motion.div>

        <motion.h1
          className="display-xl text-white mb-6"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Start free.<br />
          <span className="gradient-text">Scale when ready.</span>
        </motion.h1>

        <motion.p
          className="text-lg mb-12"
          style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 3rem' }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14 }}
        >
          No lock-in. No annual commitments. Cancel any plan at any time. Your first two analyses are always free.
        </motion.p>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
        >
          {[
            'No credit card for Free',
            'Cancel anytime',
            'Instant access',
            '2,400+ athletes',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--cyan)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
