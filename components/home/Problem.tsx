'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'

const pains = [
  {
    before: 'Hours of video rewatch with zero insight',
    after: 'AI pinpoints your weakest movement in seconds',
  },
  {
    before: 'Generic drills that don\'t fix YOUR problem',
    after: 'Personalised breakdown matched to your biomechanics',
  },
  {
    before: 'Coaches only see the play, not the mechanics',
    after: 'Frame-by-frame joint tracking even coaches can\'t see',
  },
  {
    before: 'No way to track improvement over time',
    after: 'Score every session. Watch your number climb.',
  },
]

const containerVar = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const itemVar = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
}

export default function Problem() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-y relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute pointer-events-none" style={{ top: '10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)', filter: 'blur(60px)' }} />

      <div className="container-max">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="badge mb-6 inline-flex">The problem</div>
          <h2 className="display-xl text-white mb-6">
            Most volleyball players train{' '}
            <span className="gradient-text-purple">hard</span>.
            <br />
            Very few train{' '}
            <span className="gradient-text">smart</span>.
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Without data, you repeat the same mistakes every session. VirtusQ gives you the feedback loop that top-tier athletes get from professional analysis — for free.
          </p>
        </motion.div>

        {/* Before / After grid */}
        <motion.div
          variants={containerVar}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
        >
          {pains.map((p, i) => (
            <motion.div key={i} variants={itemVar}>
              {/* Before */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl mb-3"
                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                <X size={16} className="mt-0.5 shrink-0" style={{ color: 'rgba(239,68,68,0.7)' }} />
                <p className="text-sm" style={{ color: 'rgba(248,113,113,0.8)' }}>{p.before}</p>
              </div>
              {/* After */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: 'rgba(16,185,129,0.9)' }} />
                <p className="text-sm" style={{ color: 'rgba(110,231,183,0.9)' }}>{p.after}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
