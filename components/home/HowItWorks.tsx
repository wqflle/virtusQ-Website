'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Smartphone, Video, Brain, TrendingUp } from 'lucide-react'

const steps = [
  {
    n: '01',
    icon: Smartphone,
    title: 'Download the app',
    body: 'Free on the App Store. Takes 30 seconds to set up. No subscription, no gym required.',
    detail: 'Available on iOS — works on any iPhone 12 or newer.',
    color: 'var(--purple)',
    glow: 'rgba(124,58,237,0.25)',
    mockup: {
      lines: [
        { w: '70%', color: 'rgba(167,139,250,0.4)' },
        { w: '45%', color: 'rgba(167,139,250,0.2)' },
      ],
      pill: 'App Store',
      pillColor: 'rgba(124,58,237,0.8)',
    },
  },
  {
    n: '02',
    icon: Video,
    title: 'Record your technique',
    body: 'Film yourself hitting, serving, or blocking. The app analyses any angle — even sloppy gym footage.',
    detail: '5–15 seconds of footage is all the AI needs.',
    color: 'var(--cyan)',
    glow: 'rgba(6,182,212,0.2)',
    mockup: {
      lines: [
        { w: '80%', color: 'rgba(34,211,238,0.4)' },
        { w: '55%', color: 'rgba(34,211,238,0.2)' },
      ],
      pill: 'Recording…',
      pillColor: 'rgba(6,182,212,0.7)',
    },
  },
  {
    n: '03',
    icon: Brain,
    title: 'AI scans every frame',
    body: 'The engine maps 17 joints across 120+ frames, computing angles, timing, and force vectors in real time.',
    detail: 'Results in under 60 seconds — no cloud upload needed.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.2)',
    mockup: {
      lines: [
        { w: '60%', color: 'rgba(167,139,250,0.5)' },
        { w: '90%', color: 'rgba(6,182,212,0.3)' },
      ],
      pill: 'Analysing…',
      pillColor: 'rgba(167,139,250,0.8)',
    },
  },
  {
    n: '04',
    icon: TrendingUp,
    title: 'Get your score + fix',
    body: 'You receive an Elite Score from 0–100 and a single ranked correction — the change that will move your number most.',
    detail: 'Track sessions over time. Watch your score climb.',
    color: 'var(--green)',
    glow: 'rgba(16,185,129,0.2)',
    mockup: {
      lines: [
        { w: '55%', color: 'rgba(16,185,129,0.4)' },
        { w: '75%', color: 'rgba(16,185,129,0.2)' },
      ],
      pill: 'Score: 79',
      pillColor: 'rgba(16,185,129,0.8)',
    },
  },
]

function StepCard({ step, i }: { step: typeof steps[number]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = step.icon
  const isEven = i % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16 py-14 border-b`}
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Copy */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl font-black leading-none" style={{ color: 'rgba(255,255,255,0.05)', fontVariantNumeric: 'tabular-nums' }}>
            {step.n}
          </span>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${step.glow}`, border: `1px solid ${step.glow}` }}
          >
            <Icon size={18} style={{ color: step.color }} />
          </div>
        </div>
        <h3 className="display-md text-white mb-4">{step.title}</h3>
        <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{step.body}</p>
        <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>{step.detail}</p>
      </div>

      {/* Mock UI */}
      <div className="flex-1 w-full max-w-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: isEven ? -2 : 2 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid var(--border)',
            boxShadow: `0 20px 60px ${step.glow}`,
          }}
        >
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ background: `${step.glow}`, border: `1px solid ${step.glow}`, color: step.color }}
          >
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: step.color }} />
            {step.mockup.pill}
          </div>

          {/* Icon large */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: step.glow, border: `1px solid ${step.glow}` }}
          >
            <Icon size={28} style={{ color: step.color }} />
          </div>

          {/* Skeleton lines */}
          <div className="space-y-2.5">
            {step.mockup.lines.map((l, j) => (
              <motion.div
                key={j}
                initial={{ width: 0 }}
                animate={inView ? { width: l.w } : {}}
                transition={{ duration: 0.9, delay: 0.6 + j * 0.15 }}
                className="h-1.5 rounded-full"
                style={{ background: l.color }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="section-y relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <div className="badge mb-6 inline-flex">How it works</div>
          <h2 className="display-xl text-white mb-6">
            From shaky footage to{' '}
            <span className="gradient-text">pro-level insight</span>
            <br />in four steps.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            No equipment. No expensive coach. No setup. Just your phone and the will to get better.
          </p>
        </motion.div>

        {/* Steps */}
        <div>
          {steps.map((s, i) => (
            <StepCard key={i} step={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
