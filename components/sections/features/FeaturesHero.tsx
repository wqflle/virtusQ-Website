'use client'
import { motion } from 'framer-motion'

const STATS = [
  { value: '14', label: 'Joint keypoints tracked' },
  { value: '120fps', label: 'Frame analysis rate' },
  { value: '6', label: 'Positions supported' },
  { value: '2', label: 'Skills analyzed' },
]

export default function FeaturesHero() {
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

      <div className="container-max relative">
        <div className="max-w-[720px] mx-auto text-center">
          <motion.div
            className="badge mb-6 mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
            Full Feature Set
          </motion.div>

          <motion.h1
            className="display-xl text-white mb-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Every tool built for<br />
            <span className="gradient-text">measurable improvement.</span>
          </motion.h1>

          <motion.p
            className="text-lg mb-16"
            style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 4rem' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.14 }}
          >
            VirtusQ is not a dashboard with features you ignore. It is a precision system calibrated around one outcome: measurable technical progress, tracked over time.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="rounded-2xl py-5 px-4 text-center"
                style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.07 }}
              >
                <div className="font-black text-white mb-1" style={{ fontSize: '1.75rem' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
