'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: 'What counts as a "video analysis"?',
    a: 'Each video you upload and submit for analysis counts as one analysis. A single clip can contain multiple repetitions — we analyze the full clip and identify patterns across all reps. Free accounts get 2 analyses per month.',
  },
  {
    q: 'What video formats and lengths are supported?',
    a: 'We accept MP4, MOV, and AVI files up to 4K resolution. Clips can be up to 3 minutes long. For best results, we recommend 8–30 second clips focusing on a single skill (pass or set).',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'Our pose estimation engine achieves 94.2% joint detection accuracy across controlled testing. Accuracy improves with clear camera angles, good lighting, and stable footage. We display a per-joint confidence score in every analysis.',
  },
  {
    q: 'Can I switch plans or cancel at any time?',
    a: 'Yes, completely. You can upgrade, downgrade, or cancel from your account settings at any time. If you cancel a paid plan, your access continues until the end of the current billing period — no penalty, no friction.',
  },
  {
    q: 'What is the Club plan and how does it work?',
    a: 'The Club plan gives Elite-tier access to up to 15 athletes under one account. Coaches get a team dashboard with side-by-side player comparisons, team-wide weakness reports, and bulk analysis tools. Ideal for high school teams, clubs, and academies.',
  },
  {
    q: 'Is there an app, or is this web-only?',
    a: 'VirtusQ is available on iOS and web. You can film and upload directly from the iOS app, or upload from any device via the web dashboard. Analysis results sync across devices.',
  },
  {
    q: 'Do you store my videos?',
    a: 'Yes, securely. Your video clips are stored encrypted and never shared with third parties. You can delete any video from your account at any time. We use your uploaded data only to generate your analysis.',
  },
]

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section-y" style={{ background: 'var(--surface)' }}>
      <div className="container-narrow">
        <div className="text-center mb-14">
          <motion.h2
            className="display-md text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Frequently asked
          </motion.h2>
          <motion.p
            className="text-base"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            Everything you need to know before you start.
          </motion.p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--void)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-white text-base">{faq.q}</span>
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: '28px',
                    height: '28px',
                    background: open === i ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.05)',
                    border: open === i ? '1px solid rgba(0,212,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
                    color: open === i ? 'var(--cyan)' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-5">
                      <div
                        className="h-px mb-4"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      />
                      <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-sm mt-10"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Still have questions?{' '}
          <a href="mailto:support@virtusq.com" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
            Email our team
          </a>{' '}
          — usually respond within a few hours.
        </motion.p>
      </div>
    </section>
  )
}
