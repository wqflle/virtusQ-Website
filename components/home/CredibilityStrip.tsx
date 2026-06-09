'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const signals = [
  { number: '17',    suffix: '+',    label: 'Tracked joints' },
  { number: '120',   suffix: '+',    label: 'Frames analysed' },
  { number: '< 60',  suffix: 's',    label: 'To your score' },
  { number: '5',     suffix: '',     label: 'Key skills assessed' },
  { number: 'Real',  suffix: '',     label: 'Biomechanical AI' },
  { number: 'Free',  suffix: '',     label: 'No subscription' },
]

export default function CredibilityStrip() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative py-10 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(124,58,237,0.03)' }}>
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {signals.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl font-black mb-0.5" style={{ color: i % 2 === 0 ? 'var(--purple-light)' : 'var(--cyan-light)' }}>
                {s.number}<span className="text-lg">{s.suffix}</span>
              </div>
              <div className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--text-subtle)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
