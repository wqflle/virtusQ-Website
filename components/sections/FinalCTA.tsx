'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: '9rem 0', background: '#020208' }}
    >
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(0,212,255,0.07) 0%, rgba(29,106,255,0.04) 50%, transparent 80%)' }}
      />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Corner HUD marks */}
      {[
        { top: '24px', left: '24px' },
        { top: '24px', right: '24px' },
        { bottom: '24px', left: '24px' },
        { bottom: '24px', right: '24px' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...pos,
            width: '20px',
            height: '20px',
            borderTop: i < 2 ? '1px solid rgba(0,212,255,0.2)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(0,212,255,0.2)' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid rgba(0,212,255,0.2)' : 'none',
            borderRight: i % 2 !== 0 ? '1px solid rgba(0,212,255,0.2)' : 'none',
          }}
        />
      ))}

      <div className="container-narrow relative text-center">
        {/* System tag */}
        <motion.div
          className="badge mb-8 mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
          Analysis Ready
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="display-xl text-white mb-6"
          style={{ maxWidth: '720px', margin: '0 auto 1.5rem' }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Your technique already has answers.{' '}
          <span className="gradient-text">You just haven't seen them yet.</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="text-lg mb-12"
          style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 3rem' }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Upload your first video free. No credit card. No commitment. Just objective data about your game — in under 60 seconds.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.22 }}
        >
          <Link
            href="/download"
            className="btn-primary"
            style={{
              fontSize: '1rem',
              padding: '1rem 2rem',
              boxShadow: '0 0 40px rgba(0,212,255,0.25)',
            }}
          >
            Download the App — Free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/pricing"
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '1rem 2rem' }}
          >
            View Pricing
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-10 font-mono text-[10px] tracking-widest"
          style={{ color: 'var(--text-subtle)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          2,400+ ATHLETES · 94% ACCURACY · NO CREDIT CARD REQUIRED
        </motion.p>
      </div>
    </section>
  )
}
