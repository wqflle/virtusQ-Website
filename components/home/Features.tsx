'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Scan, BarChart3, Target, Zap, Brain, Award } from 'lucide-react'

const features = [
  {
    icon: Scan,
    title: 'Pose estimation engine',
    body: 'Maps 17 keypoints across every frame using a custom model trained on volleyball motion — not generic human poses.',
    color: 'var(--purple)',
    glow: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.25)',
    size: 'large',
  },
  {
    icon: BarChart3,
    title: 'Elite Score (0–100)',
    body: 'A single standardised metric so you always know where you stand — and how far you\'ve come.',
    color: 'var(--cyan)',
    glow: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.2)',
    size: 'small',
  },
  {
    icon: Target,
    title: 'Priority fix ranking',
    body: 'AI ranks every flaw by impact. You get the one fix that will move your score the most — not a list of everything wrong.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    size: 'small',
  },
  {
    icon: Zap,
    title: 'Sub-60-second results',
    body: 'On-device inference means no cloud upload, no wait. Your score is ready before you\'ve caught your breath.',
    color: 'var(--green)',
    glow: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
    size: 'small',
  },
  {
    icon: Brain,
    title: '5 core skills tracked',
    body: 'Spike, serve, block, dig, and set — each with a dedicated model trained on that specific movement pattern.',
    color: 'var(--purple-light)',
    glow: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.2)',
    size: 'small',
  },
  {
    icon: Award,
    title: 'Session history',
    body: 'Every analysis is saved. Watch your technique evolve session by session with clear score progression.',
    color: 'var(--cyan-light)',
    glow: 'rgba(34,211,238,0.1)',
    border: 'rgba(34,211,238,0.15)',
    size: 'large',
  },
]

function FeatureCard({ f, i }: { f: typeof features[number]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = f.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${f.size === 'large' ? 'lg:col-span-2' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${f.border}`,
        boxShadow: `0 0 0 0 ${f.glow}`,
      }}
      whileHover={{ boxShadow: `0 20px 60px ${f.glow}` }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{ background: f.glow, border: `1px solid ${f.border}` }}
      >
        <Icon size={22} style={{ color: f.color }} />
      </div>

      <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
      <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.body}</p>

      {/* Hover line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`, opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="section-y relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{ bottom: '5%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      <div className="container-max relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="badge mb-6 inline-flex">Features</div>
          <h2 className="display-xl text-white mb-6">
            Built for athletes who{' '}
            <span className="gradient-text">demand precision</span>.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Not a fitness tracker. Not a generic coach app. VirtusQ is purpose-built volleyball biomechanics analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
