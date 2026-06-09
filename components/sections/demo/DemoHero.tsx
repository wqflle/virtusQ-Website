'use client'
import { motion } from 'framer-motion'
import { Upload, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEPS_PREVIEW = [
  { n: '01', label: 'Upload your clip' },
  { n: '02', label: 'AI analyzes' },
  { n: '03', label: 'Get your score' },
  { n: '04', label: 'See exact fixes' },
]

export default function DemoHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: '140px', paddingBottom: '6rem', background: 'var(--void)' }}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,212,255,0.055) 0%, transparent 65%)' }}
      />

      <div className="container-max relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="badge mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
              Live Analysis
            </motion.div>

            <h1 className="display-xl text-white mb-5">
              Upload.<br />
              <span className="gradient-text">Analyze.<br />Improve.</span>
            </h1>

            <p className="text-lg mb-8" style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.7 }}>
              Film any volleyball skill. Upload the clip. Get your objective AI performance score in under 60 seconds.
            </p>

            {/* Step preview */}
            <div className="flex items-center gap-3 mb-10 flex-wrap">
              {STEPS_PREVIEW.map((step, i) => (
                <div key={step.n} className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs"
                    style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', color: 'var(--text-muted)' }}
                  >
                    <span style={{ color: 'var(--cyan)' }}>{step.n}</span>
                    {step.label}
                  </div>
                  {i < STEPS_PREVIEW.length - 1 && (
                    <ArrowRight size={12} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="#upload" className="btn-primary">
                <Upload size={15} />
                Analyze My Game — Free
              </Link>
              <Link href="/pricing" className="btn-secondary">
                View All Plans
              </Link>
            </div>
          </motion.div>

          {/* Upload card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              id="upload"
              className="rounded-2xl overflow-hidden"
              style={{ background: '#050710', border: '1px solid rgba(0,212,255,0.14)' }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-2 px-5 py-3.5"
                style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
                <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--cyan)' }}>
                  ANALYSIS UPLOAD
                </span>
              </div>

              {/* Drop zone */}
              <div className="p-6">
                <div
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-14 px-6 text-center cursor-pointer transition-all"
                  style={{
                    borderColor: 'rgba(0,212,255,0.2)',
                    background: 'rgba(0,212,255,0.02)',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl mb-5"
                    style={{ width: '64px', height: '64px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.16)' }}
                  >
                    <Upload size={28} style={{ color: 'var(--cyan)' }} />
                  </div>
                  <div className="font-semibold text-white mb-2">Drop your clip here</div>
                  <div className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                    MP4, MOV, AVI · Up to 4K · Up to 3 minutes
                  </div>
                  <button className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}>
                    Choose File
                  </button>
                </div>

                {/* Options */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Position', value: 'Outside Hitter' },
                    { label: 'Skill',    value: 'Spike Approach' },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className="rounded-xl px-4 py-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="font-mono text-[9px] tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                        {opt.label}
                      </div>
                      <div className="text-sm font-medium text-white">{opt.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                    Free account includes 2 analyses/month. No card required.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
