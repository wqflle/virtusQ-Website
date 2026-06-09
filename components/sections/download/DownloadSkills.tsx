'use client'
import { motion } from 'framer-motion'

const SKILLS = [
  {
    key: 'passing',
    label: 'PASSING ANALYSIS',
    title: 'Passing',
    color: '#00d4ff',
    accent: 'rgba(0,212,255,0.05)',
    border: 'rgba(0,212,255,0.14)',
    description: 'Every passing rep is broken down frame by frame. The AI tracks how your platform forms, your contact angle, weight distribution, and whether your mechanics are consistent across reps.',
    metrics: [
      { name: 'Platform Angle', desc: 'Are your forearms flat and square to your target?' },
      { name: 'Contact Height', desc: 'Are you contacting at the optimal position relative to your body?' },
      { name: 'Forearm Alignment', desc: 'Are both arms level and locked before contact?' },
      { name: 'Weight Transfer', desc: 'Is your body weight moving correctly through the ball?' },
      { name: 'Approach Timing', desc: 'Are you set and balanced before the ball arrives?' },
    ],
  },
  {
    key: 'setting',
    label: 'SETTING ANALYSIS',
    title: 'Setting',
    color: '#9333ea',
    accent: 'rgba(147,51,234,0.05)',
    border: 'rgba(147,51,234,0.14)',
    description: 'Setting mechanics are subtle and hard to self-diagnose. VirtusQ reads your hands, wrists, elbows, and hips frame-by-frame to catch breakdowns invisible to the naked eye.',
    metrics: [
      { name: 'Hand Position', desc: 'Are your hands forming correctly above your forehead?' },
      { name: 'Wrist Snap Timing', desc: 'Is your wrist release clean, quick, and consistent?' },
      { name: 'Body Alignment', desc: 'Are feet, hips, and shoulders squared to your target?' },
      { name: 'Elbow Angle', desc: 'Are your elbows at the correct pre-set position?' },
      { name: 'Follow-Through', desc: 'Is your follow-through complete and directed at the target?' },
    ],
  },
]

export default function DownloadSkills() {
  return (
    <section className="section-y" style={{ background: 'var(--surface)' }}>
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
            What VirtusQ Analyzes
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Two skills.<br />
            <span className="gradient-text">Analyzed to the frame.</span>
          </motion.h2>

          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            VirtusQ focuses exclusively on passing and setting — the two most coachable, most measurable skills in volleyball. Deep expertise beats shallow breadth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.key}
              className="card p-8"
              style={{ background: skill.accent, borderColor: skill.border }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-mono text-[10px] tracking-widest mb-3" style={{ color: skill.color }}>
                {skill.label}
              </div>
              <h3 className="text-white mb-4" style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>
                {skill.title}
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                {skill.description}
              </p>

              <div>
                <div className="font-mono text-[9px] tracking-widest mb-4" style={{ color: 'var(--text-subtle)' }}>
                  TRACKED MECHANICS
                </div>
                <div className="space-y-4">
                  {skill.metrics.map((m, mi) => (
                    <motion.div
                      key={m.name}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: mi * 0.07 + 0.25 + i * 0.1 }}
                    >
                      <div
                        className="flex-shrink-0 mt-1.5 rounded-full"
                        style={{ width: '6px', height: '6px', background: skill.color }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-white mb-0.5">{m.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
