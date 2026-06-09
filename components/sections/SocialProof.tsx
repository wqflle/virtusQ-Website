'use client'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
  {
    quote: 'I had been playing for 6 years and nobody had ever told me my platform angle was collapsing before contact. VirtusQ caught it in the first analysis. Fixed it in three weeks.',
    name: 'Marcus T.',
    role: 'Outside Hitter · Club AAU',
    score: { before: 61, after: 83 },
    delta: '+22',
  },
  {
    quote: 'As a coach, I use VirtusQ for every player before we discuss technique. The data ends the argument — it\'s objective, specific, and the athletes actually trust it.',
    name: 'Coach Sara W.',
    role: 'Varsity Coach · Edison High School',
    score: { before: 0, after: 0 },
    delta: '12 players',
    isCoach: true,
  },
  {
    quote: 'I thought my setting was textbook. The AI showed me my wrist snap was initiating 70ms too early — completely killing my directional control. That one fix changed everything.',
    name: 'Devon K.',
    role: 'Setter · Division II Recruit',
    score: { before: 58, after: 79 },
    delta: '+21',
  },
  {
    quote: 'I\'m not technical by nature. But VirtusQ shows me exactly which frame, exactly which joint, exactly what to fix. I finally understand my own mechanics.',
    name: 'Priya M.',
    role: 'Libero · Select 17U',
    score: { before: 64, after: 86 },
    delta: '+22',
  },
]

const CREDIBILITY = [
  { value: '2,400+', label: 'Athletes Analyzed' },
  { value: '78%',    label: 'Show Score Improvement Within 4 Weeks' },
  { value: '4.9',    label: 'Average Rating (App Store)' },
  { value: '+19',    label: 'Average Score Gain Over 8 Weeks' },
]

export default function SocialProof() {
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
            Athlete Results
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Athletes who know<br />
            <span className="gradient-text">what to fix, fix it.</span>
          </motion.h2>
        </div>

        {/* Credibility numbers */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {CREDIBILITY.map((c, i) => (
            <motion.div
              key={c.label}
              className="rounded-2xl p-5 text-center"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.1 }}
            >
              <div className="font-black text-white mb-1" style={{ fontSize: '1.75rem' }}>{c.value}</div>
              <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="card p-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Quote mark */}
              <div
                className="font-serif font-black mb-4"
                style={{ fontSize: '48px', lineHeight: 1, color: 'rgba(0,212,255,0.15)', fontFamily: 'Georgia, serif' }}
              >
                "
              </div>

              <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {t.quote}
              </p>

              {/* Footer */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role}</div>
                </div>

                {!t.isCoach ? (
                  <div className="text-right">
                    <div
                      className="font-black text-xl"
                      style={{ color: 'var(--cyan)' }}
                    >
                      {t.delta}
                    </div>
                    <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      POINTS · 8 WKS
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="font-black text-xl" style={{ color: 'var(--cyan)' }}>{t.delta}</div>
                    <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      ANALYZED
                    </div>
                  </div>
                )}
              </div>

              {/* Score bar (athletes only) */}
              {!t.isCoach && (
                <div
                  className="mt-5 pt-5 grid grid-cols-2 gap-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {[
                    { label: 'Before', value: t.score.before, color: 'rgba(255,61,61,0.7)' },
                    { label: 'After',  value: t.score.after,  color: '#00d4ff' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between font-mono text-[9px] mb-1">
                        <span style={{ color: 'var(--text-subtle)' }}>{s.label}</span>
                        <span style={{ color: s.color }}>{s.value}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.4 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
