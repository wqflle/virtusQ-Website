'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: "I\'ve been playing for 6 years and never had feedback this precise. VirtusQ told me my contact point was consistently low — two sessions later, my spike efficiency jumped significantly.",
    name: 'Marcus T.',
    role: 'Club volleyball · Outside hitter',
    score: { before: 61, after: 78 },
    color: 'var(--purple)',
    glow: 'rgba(124,58,237,0.15)',
  },
  {
    quote: "As a coach, I\'m always looking for ways to give data-driven feedback. I started recommending VirtusQ to my players and the conversations we have about technique have completely changed.",
    name: 'Priya S.',
    role: 'U18 head coach · 8 years coaching',
    score: null,
    color: 'var(--cyan)',
    glow: 'rgba(6,182,212,0.1)',
    featured: true,
  },
  {
    quote: "The \'priority fix\' feature is the killer feature. I don\'t get 10 things to fix — I get the ONE thing that will help the most. That\'s exactly how training should work.",
    name: 'Lena K.',
    role: 'Recreational player · Setter',
    score: { before: 55, after: 71 },
    color: '#10b981',
    glow: 'rgba(16,185,129,0.1)',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill="#f59e0b" stroke="none" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="section-y relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{ top: '0', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="badge mb-6 inline-flex">Player results</div>
          <h2 className="display-xl text-white mb-6">
            Real athletes.{' '}
            <span className="gradient-text">Measurable improvement</span>.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            VirtusQ is built for players who are serious about getting better — not just tracking steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl p-7 relative ${t.featured ? 'ring-1' : ''}`}
              style={{
                background: t.featured
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))'
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${t.featured ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
                boxShadow: t.featured ? '0 0 60px rgba(124,58,237,0.1)' : 'none',
              }}
            >
              {t.featured && (
                <div className="absolute -top-3 left-6 badge text-xs">Featured</div>
              )}

              <Stars />

              <blockquote className="text-base leading-relaxed mb-6" style={{ color: 'rgba(248,250,252,0.85)' }}>
                "{t.quote}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{t.role}</div>
                </div>

                {t.score && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span style={{ color: 'var(--text-subtle)' }}>{t.score.before}</span>
                    <span style={{ color: 'var(--text-subtle)' }}>→</span>
                    <span className="font-bold text-sm" style={{ color: '#10b981' }}>{t.score.after}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
          style={{ color: 'var(--text-subtle)' }}
        >
          <p className="text-sm">
            Available on the{' '}
            <a
              href="https://apps.apple.com/au/app/virtusq/id6761644948"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-white"
              style={{ color: 'var(--purple-light)' }}
            >
              App Store
            </a>
            {' '}· Free to download
          </p>
        </motion.div>
      </div>
    </section>
  )
}
