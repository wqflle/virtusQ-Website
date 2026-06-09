'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'

const tiers = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    tagline: 'Start analysing today',
    features: [
      '5 analyses per month',
      'Elite Score (0–100)',
      '1 priority fix per session',
      'Basic session history',
      'iOS app access',
    ],
    cta: 'Download free',
    ctaHref: 'https://apps.apple.com/au/app/virtusq/id6761644948',
    external: true,
    highlight: false,
    accent: 'rgba(255,255,255,0.5)',
    bg: 'rgba(255,255,255,0.025)',
    border: 'var(--border)',
    shadow: 'none',
  },
  {
    name: 'Pro',
    price: '15',
    period: 'per month',
    tagline: 'For serious players',
    features: [
      'Unlimited analyses',
      'Full Elite Score breakdown',
      'All 5 skills tracked',
      'Full session history & trends',
      'Ranked correction list',
    ],
    cta: 'Get started',
    ctaHref: 'https://apps.apple.com/au/app/virtusq/id6761644948',
    external: true,
    highlight: false,
    accent: 'var(--purple-light)',
    bg: 'rgba(255,255,255,0.025)',
    border: 'var(--border)',
    shadow: 'none',
  },
  {
    name: 'Elite',
    price: '25',
    period: 'per month',
    tagline: 'The full AI coaching experience',
    badge: 'Most popular',
    features: [
      'Everything in Pro',
      'Elite coaching insights',
      'Priority AI model updates',
      'Early feature access',
      'Priority processing',
    ],
    cta: 'Get started',
    ctaHref: 'https://apps.apple.com/au/app/virtusq/id6761644948',
    external: true,
    highlight: true,
    accent: 'var(--purple-light)',
    bg: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.06))',
    border: 'rgba(124,58,237,0.4)',
    shadow: '0 0 80px rgba(124,58,237,0.2)',
  },
  {
    name: 'Club',
    price: '200',
    period: 'per month',
    tagline: 'AI coaching for your whole squad',
    badge: 'For teams',
    features: [
      '15 players get free Elite access',
      'Unique access codes per player',
      'Coach squad dashboard',
      'Comparative analytics',
      'Dedicated support',
    ],
    cta: 'Get in touch',
    ctaHref: '/pricing',
    external: false,
    highlight: false,
    accent: '#d97706',
    bg: 'rgba(217,119,6,0.05)',
    border: 'rgba(217,119,6,0.3)',
    shadow: 'none',
    isClub: true,
  },
]

export default function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="section-y relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <div className="badge mb-6 inline-flex">Pricing</div>
          <h2 className="display-xl text-white mb-6">
            Start for free.{' '}
            <span className="gradient-text">Upgrade when ready</span>.
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }}>
            No credit card required. No lock-in. Cancel anytime.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
            Prices in AUD · Automatically adjusted for your region
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-7 relative flex flex-col"
              style={{
                background: tier.bg,
                border: `1px solid ${tier.border}`,
                boxShadow: tier.shadow,
                ...(tier.highlight ? { transform: 'scale(1.02)' } : {}),
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap"
                  style={
                    tier.highlight
                      ? { background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff' }
                      : { background: '#d97706', color: '#000' }
                  }
                >
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: tier.accent }}>
                {tier.name}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-xs font-bold" style={{ color: 'var(--text-subtle)' }}>A$</span>
                <span className="text-5xl font-black text-white leading-none">{tier.price}</span>
                <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>/{tier.period}</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{tier.tagline}</p>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: tier.highlight ? 'var(--purple-light)' : (tier as any).isClub ? '#d97706' : 'var(--cyan-light)' }} />
                    <span className="text-sm" style={{ color: 'rgba(148,163,184,0.9)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {tier.highlight ? (
                <MagneticButton>
                  <a
                    href={tier.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 rounded-xl text-center font-bold text-white text-sm hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, var(--purple), #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
                  >
                    {tier.cta}
                  </a>
                </MagneticButton>
              ) : (tier as any).isClub ? (
                <Link
                  href={tier.ctaHref}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-sm hover:opacity-90 transition-opacity"
                  style={{ background: '#d97706', color: '#000' }}
                >
                  {tier.cta}
                </Link>
              ) : (
                <a
                  href={tier.ctaHref}
                  target={tier.external ? '_blank' : undefined}
                  rel={tier.external ? 'noopener noreferrer' : undefined}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all hover:text-white"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}
                >
                  {tier.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Club callout */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm mt-6"
          style={{ color: 'var(--text-subtle)' }}
        >
          Club plan includes 15 unique access codes — each player redeems a code for full Elite access.{' '}
          <Link href="/pricing" className="underline underline-offset-2 transition-colors hover:text-white" style={{ color: 'var(--purple-light)' }}>
            See full comparison →
          </Link>
        </motion.p>
      </div>
    </section>
  )
}
