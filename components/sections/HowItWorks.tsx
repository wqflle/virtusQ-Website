'use client'
import { motion } from 'framer-motion'
import { Upload, Cpu, BarChart3, Target } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: Upload,
    title: 'Upload your clip',
    body: 'Record any volleyball skill — spike, serve, pass, set, or receive — and upload directly from your phone or camera. Any angle, any court.',
    detail: 'MP4 · MOV · AVI · 4K supported',
    mockup: (
      <div
        className="rounded-xl p-4 font-mono text-xs"
        style={{ background: '#02040a', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div style={{ color: 'var(--text-subtle)' }} className="mb-3">UPLOADING</div>
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.1)' }}>
            <Upload size={14} style={{ color: 'var(--cyan)' }} />
          </div>
          <div className="flex-1">
            <div className="text-white text-xs mb-1">spike_practice_tue.mp4</div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--cyan)' }}
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>
          </div>
        </div>
        <div style={{ color: 'var(--text-subtle)' }}>34.2 MB · 1080p · 00:08</div>
      </div>
    ),
  },
  {
    n: '02',
    icon: Cpu,
    title: 'AI extracts biomechanics frame-by-frame',
    body: 'Our pose estimation engine processes every frame at 120fps, detecting 14 key joint positions and computing movement vectors, velocity curves, and timing data.',
    detail: '14 joints · 120fps · <60s processing',
    mockup: (
      <div
        className="rounded-xl p-4 font-mono text-xs"
        style={{ background: '#02040a', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: 'var(--text-subtle)' }}>ANALYZING</span>
          <span style={{ color: 'var(--cyan)' }} className="pulse-dot">●</span>
        </div>
        {['Joint detection', 'Velocity mapping', 'Timing analysis', 'Contact point'].map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-2 mb-1.5"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 + 0.2 }}
          >
            <motion.span
              style={{ color: '#00e676', fontSize: '10px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.5 }}
            >
              ✓
            </motion.span>
            <span style={{ color: 'var(--text-muted)' }}>{item}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    n: '03',
    icon: BarChart3,
    title: 'Performance score generated (0–100)',
    body: 'Every mechanical element is quantified and weighted against position-specific elite benchmarks. You receive a single, objective number — and a full breakdown behind it.',
    detail: 'Compared against elite athlete benchmarks',
    mockup: (
      <div
        className="rounded-xl p-4 font-mono text-xs"
        style={{ background: '#02040a', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div style={{ color: 'var(--text-subtle)' }} className="mb-3">SCORE</div>
        <div className="flex items-baseline gap-1 mb-3">
          <motion.span
            className="font-black text-white"
            style={{ fontSize: '36px', lineHeight: 1 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            84
          </motion.span>
          <span style={{ color: 'var(--text-muted)' }}>/100</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#00d4ff,#1d6aff)' }}
            initial={{ width: 0 }}
            whileInView={{ width: '84%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.5 }}
          />
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Above 78th percentile</div>
      </div>
    ),
  },
  {
    n: '04',
    icon: Target,
    title: 'Receive your exact technical fixes',
    body: 'Not generic tips. Specific corrections tied to your exact video frame. "Your elbow drops 14° before contact — raise your swing path to increase attack angle."',
    detail: 'Prioritized by performance impact',
    mockup: (
      <div
        className="rounded-xl p-4 font-mono text-xs"
        style={{ background: '#02040a', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <div style={{ color: 'var(--text-subtle)' }} className="mb-3">CORRECTIONS</div>
        {[
          { issue: 'Elbow drop at contact', impact: 'HIGH', color: '#ff3d3d' },
          { issue: 'Jump timing −120ms early', impact: 'MED', color: '#ff9d00' },
          { issue: 'Hip rotation incomplete', impact: 'MED', color: '#ff9d00' },
        ].map((item, i) => (
          <motion.div
            key={item.issue}
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 + 0.2 }}
          >
            <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}>
              {item.impact}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{item.issue}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="section-y" id="how-it-works" style={{ background: 'var(--surface)' }}>
      <div className="container-max">
        <div className="text-center mb-16">
          <motion.div
            className="badge mb-6 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
            How It Works
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            From raw footage<br />to <span className="gradient-text">precise answers</span>.
          </motion.h2>

          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            Four steps. Under 60 seconds. Objective data you can act on immediately.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.n}
                className="card p-7"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: 'var(--cyan-dim)',
                      border: '1px solid rgba(0,212,255,0.18)',
                    }}
                  >
                    <Icon size={18} style={{ color: 'var(--cyan)' }} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--text-subtle)' }}>
                      STEP {step.n}
                    </div>
                    <h3 className="display-sm text-white" style={{ fontSize: '1.05rem' }}>{step.title}</h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  {step.body}
                </p>

                {step.mockup}

                <div className="mt-4 font-mono text-[10px] tracking-wider" style={{ color: 'var(--text-subtle)' }}>
                  {step.detail}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
