'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const SAMPLE_METRICS = [
  { label: 'ARM VELOCITY',   score: 92, status: 'good'    },
  { label: 'JUMP TIMING',    score: 78, status: 'good'    },
  { label: 'CONTACT POINT',  score: 88, status: 'good'    },
  { label: 'BODY ROTATION',  score: 71, status: 'warning' },
  { label: 'BALANCE INDEX',  score: 64, status: 'issue'   },
  { label: 'APPROACH SPEED', score: 86, status: 'good'    },
]

const CORRECTIONS = [
  {
    priority: 'HIGH',
    color: '#ff3d3d',
    label: 'Late arm swing',
    detail: 'Contact point is 18cm below optimal. Your elbow drops 14° before contact — raise your swing path to increase attack angle and power transfer.',
    frame: 'Frame 0847',
  },
  {
    priority: 'MED',
    color: '#ff9d00',
    label: 'Jump timing offset',
    detail: 'You are leaving the ground 120ms early relative to the setter release point. Wait for the ball to peak before initiating jump.',
    frame: 'Frame 0623',
  },
  {
    priority: 'MED',
    color: '#ff9d00',
    label: 'Incomplete hip rotation',
    detail: 'Hip rotation completes 80ms after shoulder contact — you are losing approximately 22% of potential power. Sequence hip before shoulder.',
    frame: 'Frame 0851',
  },
]

export default function DemoAnalysis() {
  return (
    <section className="section-y" style={{ background: 'var(--surface)' }}>
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            className="badge mb-6 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
            Sample Analysis Result
          </motion.div>
          <motion.h2
            className="display-xl text-white mb-4"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            This is what you receive<br />
            <span className="gradient-text">in 47 seconds.</span>
          </motion.h2>
          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            A real analysis — every number, every correction, every flagged frame.
          </motion.p>
        </div>

        {/* Sample result panel */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-12"
          style={{ border: '1px solid rgba(0,212,255,0.14)', background: '#04060d' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Result header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e676]" />
              <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: '#00e676' }}>
                ANALYSIS COMPLETE
              </span>
            </div>
            <div className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
              Processing time: 47 seconds · 1,160 frames analyzed
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Score column */}
            <div className="p-8" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="font-mono text-[10px] tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>
                OVERALL SCORE
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <motion.span
                  className="font-black text-white"
                  style={{ fontSize: '72px', lineHeight: 1 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                >
                  84
                </motion.span>
                <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>/100</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#00d4ff,#1d6aff)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: '84%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.5 }}
                />
              </div>
              <div className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>78th percentile · Outside Hitter</div>

              {/* Sub scores */}
              <div className="space-y-4">
                {SAMPLE_METRICS.map((m, i) => (
                  <div key={m.label}>
                    <div className="flex justify-between font-mono text-[9px] mb-1.5">
                      <span style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                      <span style={{ color: m.status === 'issue' ? '#ff3d3d' : m.status === 'warning' ? '#ff9d00' : '#00d4ff' }}>
                        {m.score}
                      </span>
                    </div>
                    <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: m.status === 'issue' ? '#ff3d3d' : m.status === 'warning' ? '#ff9d00' : '#00d4ff',
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.08 + 0.4 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corrections column */}
            <div className="p-8 lg:col-span-2">
              <div className="font-mono text-[10px] tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>
                TECHNICAL CORRECTIONS · RANKED BY IMPACT
              </div>
              <div className="space-y-5">
                {CORRECTIONS.map((c, i) => (
                  <motion.div
                    key={c.label}
                    className="rounded-xl p-5"
                    style={{ background: `${c.color}08`, border: `1px solid ${c.color}18` }}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.3 }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle size={14} style={{ color: c.color, flexShrink: 0 }} />
                        <span className="font-semibold text-white text-sm">{c.label}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="font-mono text-[8px] px-2 py-0.5 rounded font-bold"
                          style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}25` }}
                        >
                          {c.priority}
                        </span>
                        <span className="font-mono text-[9px]" style={{ color: 'var(--text-subtle)' }}>{c.frame}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{c.detail}</p>
                  </motion.div>
                ))}

                {/* 2 more corrections locked */}
                <div
                  className="rounded-xl p-5 flex items-center justify-between"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <span style={{ color: 'var(--text-subtle)', fontSize: '12px' }}>🔒</span>
                    </div>
                    <div>
                      <div className="text-sm text-white mb-0.5">2 additional corrections</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Unlock with Pro or Elite plan</div>
                    </div>
                  </div>
                  <Link href="/pricing" className="btn-outline-cyan" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                    Upgrade
                  </Link>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <CheckCircle2 size={14} style={{ color: '#00e676' }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Arm velocity, jump timing, and contact point are all within the target range for your level.
                  </span>
                </div>
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
          <p className="text-base mb-6" style={{ color: 'var(--text-muted)' }}>
            Get your own analysis like this — free, in under 60 seconds.
          </p>
          <Link href="#upload" className="btn-primary">
            Analyze My Game — Free
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
