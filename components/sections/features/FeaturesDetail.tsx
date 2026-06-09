'use client'
import { motion } from 'framer-motion'
import { Shield, Crosshair, Activity, FileText } from 'lucide-react'

const DETAILS = [
  {
    icon: Crosshair,
    tag: 'CORE SYSTEM',
    title: 'AI Technique Scoring Engine',
    subtitle: 'Objective measurement. No interpretation required.',
    body: [
      'Every analysis produces a single, objective performance score from 0 to 100. This score is calculated by our biomechanics model — trained on thousands of hours of competitive volleyball footage at every level.',
      'The score is broken into sub-categories specific to passing and setting: platform angle, contact height, forearm alignment, weight transfer, and approach timing for passing; hand position, wrist snap timing, body alignment, and elbow angle for setting. Each sub-score contributes to the overall, giving you a precise map of where to focus.',
    ],
    specs: [
      { label: 'Score Range', value: '0–100' },
      { label: 'Sub-categories', value: '6 dimensions' },
      { label: 'Benchmark dataset', value: 'Elite / Club / HS' },
      { label: 'Bias', value: 'Zero — fully algorithmic' },
    ],
    gradient: 'from-[rgba(0,212,255,0.08)] to-transparent',
  },
  {
    icon: Activity,
    tag: 'ANALYSIS DEPTH',
    title: 'Frame-by-Frame Biomechanical Breakdown',
    subtitle: 'We find what the human eye cannot.',
    body: [
      '120 frames per second. Every frame analyzed. The AI is detecting movement events that last as little as 30–40ms — shorter than the blink of an eye. These are the micro-timing errors that separate good technique from elite technique.',
      'Each finding is linked to a specific timestamp in your video, so you see exactly where the breakdown occurs. Not a general observation — a specific frame, a specific joint, a specific measurement.',
    ],
    specs: [
      { label: 'Frame rate', value: '120 fps' },
      { label: 'Min. detectable event', value: '8ms' },
      { label: 'Joints tracked', value: '14 keypoints' },
      { label: 'Confidence score', value: 'Per joint' },
    ],
    gradient: 'from-[rgba(29,106,255,0.06)] to-transparent',
  },
  {
    icon: Shield,
    tag: 'PERSONALIZATION',
    title: 'Position-Specific Coaching Logic',
    subtitle: 'Outside hitters aren\'t liberos. Your feedback shouldn\'t be either.',
    body: [
      'We\'ve built separate coaching models for each volleyball position: outside hitter, middle blocker, opposite, setter, libero, and defensive specialist. The biomechanical ideal for a setter\'s hand position differs from an OH\'s arm swing.',
      'When you specify your position, every analysis is calibrated to position-appropriate mechanics — not generic volleyball advice. A libero\'s passing form is evaluated differently than a middle blocker\'s approach.',
    ],
    specs: [
      { label: 'Positions', value: '6 distinct models' },
      { label: 'Skills per position', value: '2–4 primary' },
      { label: 'Calibration', value: 'Position-specific' },
      { label: 'Multi-position', value: 'Supported' },
    ],
    gradient: 'from-[rgba(0,212,255,0.06)] to-transparent',
  },
  {
    icon: FileText,
    tag: 'TRACKING',
    title: 'Progress Tracking & Reports',
    subtitle: 'Know exactly what changed, and why.',
    body: [
      'Upload regularly and track your performance score over time. Your dashboard shows your historical trajectory — which sessions improved your mechanics, and which corrections have stuck.',
      'Elite-tier users get downloadable PDF reports with annotated frames, score history, and correction summaries. Useful for coaches, recruiting profiles, and self-directed training programs.',
    ],
    specs: [
      { label: 'History retention', value: 'Full (unlimited)' },
      { label: 'PDF reports', value: 'Elite & Club plans' },
      { label: 'Trend analytics', value: 'Included' },
      { label: 'Session delta', value: 'Before vs. after' },
    ],
    gradient: 'from-[rgba(0,230,118,0.04)] to-transparent',
  },
]

export default function FeaturesDetail() {
  return (
    <section className="section-y" style={{ background: 'var(--surface)' }}>
      <div className="container-max">
        <div className="space-y-24">
          {DETAILS.map((item, i) => {
            const Icon = item.icon
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={item.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isEven ? '' : ''}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Text column */}
                <div className={isEven ? 'order-1' : 'order-1 lg:order-2'}>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{
                        width: '44px',
                        height: '44px',
                        background: 'rgba(0,212,255,0.08)',
                        border: '1px solid rgba(0,212,255,0.16)',
                      }}
                    >
                      <Icon size={20} style={{ color: 'var(--cyan)' }} />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                      {item.tag}
                    </span>
                  </div>

                  <h2 className="display-md text-white mb-3">{item.title}</h2>
                  <p className="text-base font-medium mb-6" style={{ color: 'var(--cyan)', opacity: 0.8 }}>{item.subtitle}</p>

                  {item.body.map((para, pi) => (
                    <p key={pi} className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Spec panel */}
                <div className={isEven ? 'order-2' : 'order-2 lg:order-1'}>
                  <div
                    className="rounded-2xl p-8"
                    style={{
                      background: `linear-gradient(135deg, rgba(5,7,16,1) 0%, rgba(8,10,18,1) 100%)`,
                      border: '1px solid rgba(0,212,255,0.1)',
                    }}
                  >
                    <div className="font-mono text-[10px] tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>
                      TECHNICAL SPECS
                    </div>
                    <div className="space-y-4">
                      {item.specs.map((spec, si) => (
                        <motion.div
                          key={spec.label}
                          className="flex items-center justify-between py-3"
                          style={{ borderBottom: si < item.specs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: si * 0.08 + 0.2 }}
                        >
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
                          <span className="font-mono font-bold text-sm" style={{ color: 'var(--cyan)' }}>{spec.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
