'use client'
import { motion } from 'framer-motion'

const PAINS = [
  {
    number: '01',
    headline: 'You repeat the same mistakes for months.',
    body: 'Without objective data, the same technical errors compound every session. Nobody can see a 12-millisecond timing gap with the naked eye.',
    accent: 'rgba(255,61,61,0.08)',
    border: 'rgba(255,61,61,0.14)',
  },
  {
    number: '02',
    headline: 'Your coach cannot watch every repetition.',
    body: 'Even the best coach has 12 other players. The critical moment — the exact breakdown — happens when no one is looking closely enough.',
    accent: 'rgba(255,157,0,0.06)',
    border: 'rgba(255,157,0,0.12)',
  },
  {
    number: '03',
    headline: 'Progress feels random because it is.',
    body: 'Training without measurement is hope. Without knowing what changed, you cannot know why you improved — or why you stopped improving.',
    accent: 'rgba(255,61,61,0.06)',
    border: 'rgba(255,61,61,0.1)',
  },
  {
    number: '04',
    headline: 'You plateau because you can\'t see what you can\'t see.',
    body: 'Biomechanical flaws are invisible to the untrained eye. Contact point angle. Hip rotation timing. Arm deceleration. You feel the problem but cannot locate it.',
    accent: 'rgba(255,157,0,0.08)',
    border: 'rgba(255,157,0,0.14)',
  },
]

// No module-level variants needed; each card uses inline whileInView props

export default function ProblemSection() {
  return (
    <section className="section-y relative overflow-hidden" style={{ background: 'var(--void)' }}>
      {/* Subtle red ambiance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255,61,61,0.025) 0%, transparent 70%)' }}
      />

      <div className="container-max">
        {/* Section label */}
        <motion.div
          className="badge mb-6"
          style={{ background: 'rgba(255,61,61,0.07)', border: '1px solid rgba(255,61,61,0.16)', color: '#ff8080' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff3d3d' }} />
          The Problem
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="display-xl text-white mb-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Most athletes train<br />
          <span style={{ color: 'rgba(255,80,80,0.9)' }}>completely blind.</span>
        </motion.h2>

        <motion.p
          className="text-lg mb-16"
          style={{ color: 'var(--text-muted)', maxWidth: '540px', lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          73% of competitive volleyball players have never received objective, data-backed technique feedback. They train by feel, guess by intuition, and plateau by default.
        </motion.p>

        {/* Pain cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAINS.map((pain, i) => (
            <motion.div
              key={pain.number}
              className="card p-7"
              style={{ background: pain.accent, borderColor: pain.border }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            >
              <div className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>
                {pain.number}
              </div>
              <h3 className="display-sm text-white mb-3" style={{ fontSize: '1.15rem' }}>
                {pain.headline}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {pain.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            className="inline-block px-10 py-8 rounded-2xl"
            style={{ background: 'rgba(255,61,61,0.05)', border: '1px solid rgba(255,61,61,0.1)' }}
          >
            <div className="display-xl mb-2" style={{ color: '#ff6060' }}>68%</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)', maxWidth: '360px' }}>
              of club volleyball players report their biggest training obstacle is not knowing{' '}
              <em>what specifically</em> to fix.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
