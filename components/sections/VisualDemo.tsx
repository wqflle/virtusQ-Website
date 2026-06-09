'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (!inView) return
    let n = 0
    const target = score
    const id = setInterval(() => {
      n += 2
      setDisplayed(Math.min(n, target))
      if (n >= target) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [inView, score])

  const r = 44
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference - (circumference * (inView ? score : 0)) / 100

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: '110px', height: '110px' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-white" style={{ fontSize: '28px', lineHeight: 1 }}>{displayed}</span>
          <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>/100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  )
}

const IMPROVEMENTS = [
  { metric: 'Platform Angle',    before: 71, after: 92, unit: '%' },
  { metric: 'Contact Timing',    before: 55, after: 78, unit: '%' },
  { metric: 'Platform Stability', before: 63, after: 88, unit: '%' },
  { metric: 'Weight Transfer',   before: 58, after: 71, unit: '%' },
]

const FIXES = [
  'Bring forearms together — platform must be flat at contact',
  'Form platform 80ms earlier before ball arrival',
  'Bend knees lower to improve contact height consistency',
  'Transfer weight through ball for directional control',
]

export default function VisualDemo() {
  return (
    <section className="section-y relative overflow-hidden" style={{ background: 'var(--void)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)' }}
      />

      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="badge mb-6 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
            See It In Action
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Before. After.<br />
            <span className="gradient-text">The data tells the story.</span>
          </motion.h2>

          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            Real athlete analysis. 8 weeks apart. Same player — completely different mechanics.
          </motion.p>
        </div>

        {/* Before / After comparison */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-12"
          style={{ border: '1px solid rgba(0,212,255,0.12)', background: '#050710' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] pulse-dot" />
              <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: 'var(--cyan)' }}>
                COMPARATIVE ANALYSIS · SESSION DELTA
              </span>
            </div>
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
              ATHLETE: M.CHEN · OH · LINCOLN PREP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Before */}
            <div className="p-8" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
              <div
                className="inline-block font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-full mb-6"
                style={{ background: 'rgba(255,61,61,0.08)', border: '1px solid rgba(255,61,61,0.16)', color: '#ff6060' }}
              >
                BEFORE · SESSION 1
              </div>
              <div className="flex justify-center mb-6">
                <ScoreRing score={58} color="#ff3d3d" label="Performance Score" />
              </div>
              <div className="space-y-3">
                {[
                  'Platform angle too wide at contact',
                  'Platform forming too late before contact',
                  'Knees too high — contact height incorrect',
                  'Weight transfer stalling before contact',
                ].map((flaw) => (
                  <div key={flaw} className="flex items-start gap-2.5">
                    <AlertTriangle size={12} style={{ color: '#ff6060', flexShrink: 0, marginTop: '2px' }} />
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{flaw}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delta center */}
            <div
              className="flex flex-col items-center justify-center p-8"
              style={{ background: 'rgba(0,212,255,0.02)' }}
            >
              <div className="font-mono text-[9px] tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>
                8 WEEK DELTA
              </div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={32} style={{ color: 'var(--cyan)' }} />
                <div className="text-center">
                  <div className="gradient-text font-black" style={{ fontSize: '40px', lineHeight: 1 }}>+26</div>
                  <div className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>POINTS</div>
                </div>
              </div>
              {IMPROVEMENTS.map((imp, i) => (
                <div key={imp.metric} className="w-full mb-3">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>{imp.metric}</span>
                    <span style={{ color: 'var(--cyan)' }}>+{imp.after - imp.before}{imp.unit}</span>
                  </div>
                  <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: 'rgba(255,61,61,0.6)', width: `${imp.before}%` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${imp.before}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg,#00d4ff,#1d6aff)' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${imp.after}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.7, duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* After */}
            <div className="p-8" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
              <div
                className="inline-block font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-full mb-6"
                style={{ background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.16)', color: '#00e676' }}
              >
                AFTER · SESSION 9
              </div>
              <div className="flex justify-center mb-6">
                <ScoreRing score={84} color="#00d4ff" label="Performance Score" />
              </div>
              <div className="space-y-3">
                {FIXES.map((fix) => (
                  <div key={fix} className="flex items-start gap-2.5">
                    <CheckCircle2 size={12} style={{ color: '#00e676', flexShrink: 0, marginTop: '2px' }} />
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{fix}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            This analysis took 47 seconds. The improvement took 8 weeks of targeted practice.
          </p>
          <Link href="/download" className="btn-primary">
            Download the App — Free
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
