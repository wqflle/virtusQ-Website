'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

const tiers = [
  {
    name: 'Free',
    price: '$0',
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
    ctaLink: 'https://apps.apple.com/au/app/virtusq/id6761644948',
    featured: false,
    color: 'rgba(255,255,255,0.06)',
    border: 'var(--border)',
    glow: 'none',
  },
  {
    name: 'Athlete',
    price: '$9',
    period: 'per month',
    tagline: 'For serious players',
    features: [
      'Unlimited analyses',
      'Elite Score + full breakdown',
      'All 5 skills tracked',
      'Full session history & trends',
      'Ranked correction list',
      'Priority AI processing',
    ],
    cta: 'Start free trial',
    ctaLink: 'https://apps.apple.com/au/app/virtusq/id6761644948',
    featured: true,
    color: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.06))',
    border: 'rgba(124,58,237,0.35)',
    glow: '0 0 80px rgba(124,58,237,0.2)',
    badge: 'Most popular',
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per month',
    tagline: 'For coaches + squads',
    features: [
      'Everything in Athlete',
      'Up to 10 player profiles',
      'Coach dashboard',
      'Comparative analytics',
      'Export reports (PDF)',
      'Priority support',
    ],
    cta: 'Contact us',
    ctaLink: 'mailto:hello@virtusq.com',
    featured: false,
    color: 'rgba(255,255,255,0.03)',
    border: 'var(--border)',
    glow: 'none',
    comingSoon: true,
  },
]

export default function PricingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="section-y relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="badge mb-6 inline-flex">Pricing</div>
          <h2 className="display-xl text-white mb-6">
            Start for free.{' '}
            <span className="gradient-text">Upgrade when ready</span>.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            No credit card required. No lock-in. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40, scale: tier.featured ? 0.97 : 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: tier.featured ? 1.02 : 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-7 relative"
              style={{
                background: tier.color,
                border: `1px solid ${tier.border}`,
                boxShadow: tier.glow,
              }}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge text-xs whitespace-nowrap">
                  {tier.badge}
                </div>
              )}
              {tier.comingSoon && (
                <div className="absolute -top-3 right-5 badge badge-cyan text-xs whitespace-nowrap">
                  Coming soon
                </div>
              )}

              <div className="mb-7">
                <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: tier.featured ? 'var(--purple-light)' : 'var(--text-subtle)' }}>
                  {tier.name}
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-white">{tier.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>/{tier.period}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tier.tagline}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: tier.featured ? 'var(--purple-light)' : 'var(--cyan-light)' }} />
                    <span className="text-sm" style={{ color: 'rgba(148,163,184,0.9)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              {tier.featured ? (
                <MagneticButton>
                  <a
                    href={tier.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 rounded-xl text-center font-bold text-white text-sm transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, var(--purple), #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
                  >
                    {tier.cta}
                  </a>
                </MagneticButton>
              ) : (
                <a
                  href={tier.ctaLink}
                  target={tier.ctaLink.startsWith('http') ? '_blank' : undefined}
                  rel={tier.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all"
                  style={{
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  {tier.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
