'use client'
import { motion } from 'framer-motion'
import { BrainCog, Layers, UserCog, TrendingUp, Radar } from 'lucide-react'

const FEATURES = [
  {
    icon: BrainCog,
    label: 'Scoring Engine',
    title: 'AI Technique Scoring',
    body: 'Every movement is evaluated against a dataset of elite volleyball mechanics. A single objective score (0–100) tells you exactly where you stand.',
    metrics: [
      { label: 'Your Score', value: '84', unit: '/100' },
      { label: 'Percentile', value: '78th', unit: '' },
    ],
    tag: 'CORE SYSTEM',
  },
  {
    icon: Layers,
    label: 'Breakdown',
    title: 'Frame-by-Frame Analysis',
    body: 'The AI doesn\'t average your movement — it reads every single frame. Problems visible for only 40ms are captured and flagged.',
    metrics: [
      { label: 'Frame Rate', value: '120', unit: 'fps' },
      { label: 'Resolution', value: '4K', unit: '' },
    ],
    tag: 'ANALYSIS',
  },
  {
    icon: UserCog,
    label: 'Position Logic',
    title: 'Position-Specific Feedback',
    body: 'Outside hitter mechanics differ from setter mechanics. Our coaching logic is calibrated for your specific role — not generic volleyball advice.',
    metrics: [
      { label: 'Positions', value: '6', unit: '' },
      { label: 'Skills', value: '2', unit: '' },
    ],
    tag: 'PERSONALIZED',
  },
  {
    icon: TrendingUp,
    label: 'Progress',
    title: 'Progress Tracking',
    body: 'Upload regularly and watch your scores evolve over time. See which corrections you\'ve integrated and which still need work.',
    metrics: [
      { label: '8-Week Avg.', value: '+18', unit: 'pts' },
      { label: 'Sessions', value: 'Unlimited', unit: '' },
    ],
    tag: 'TRACKING',
  },
  {
    icon: Radar,
    label: 'Detection',
    title: 'Weakness Detection',
    body: 'The system identifies your highest-impact technical flaws and ranks them by effect on performance. Fix what matters most first.',
    metrics: [
      { label: 'Avg. Flaws Found', value: '4.2', unit: '' },
      { label: 'Impact Ranked', value: 'Yes', unit: '' },
    ],
    tag: 'DIAGNOSTICS',
  },
]

export default function FeatureGrid() {
  return (
    <section className="section-y" style={{ background: 'var(--surface)' }}>
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
            Feature System
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Every module built for<br />
            <span className="gradient-text">measurable improvement.</span>
          </motion.h2>

          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            Not a dashboard of features you'll ignore. A precision system built around one outcome: measurable technical progress.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                className="card p-6 flex flex-col gap-5"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                {/* Icon + tag */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: '46px',
                      height: '46px',
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.16)',
                    }}
                  >
                    <Icon size={20} style={{ color: 'var(--cyan)' }} />
                  </div>
                  <span
                    className="font-mono text-[9px] tracking-widest px-2 py-1 rounded"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'var(--text-subtle)',
                    }}
                  >
                    {f.tag}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.body}</p>
                </div>

                {/* Micro metrics */}
                <div
                  className="flex gap-4 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {f.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-subtle)' }}>{m.label}</div>
                      <div className="font-bold text-sm" style={{ color: 'var(--cyan)' }}>
                        {m.value}
                        <span className="font-normal text-xs ml-0.5" style={{ color: 'var(--text-muted)' }}>{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}

          {/* CTA card */}
          <motion.div
            className="card p-6 flex flex-col justify-between"
            style={{
              background: 'rgba(0,212,255,0.04)',
              border: '1px solid rgba(0,212,255,0.18)',
              boxShadow: '0 0 40px rgba(0,212,255,0.05)',
            }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <div>
              <div className="font-mono text-[10px] tracking-widest mb-5" style={{ color: 'var(--cyan)' }}>
                START NOW
              </div>
              <h3 className="display-md text-white mb-3" style={{ fontSize: '1.6rem' }}>
                First analysis free.
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Upload your first video today and see your performance score in under 60 seconds. No commitment required.
              </p>
            </div>
            <a
              href="/download"
              className="btn-primary w-full justify-center"
              style={{ textDecoration: 'none' }}
            >
              Download App — Free
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
