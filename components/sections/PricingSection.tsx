'use client'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Users } from 'lucide-react'
import Link from 'next/link'

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: null,
    priceNote: 'Always free',
    description: 'Start with your first analysis today. No card required.',
    icon: null,
    cta: 'Get Started',
    ctaStyle: 'secondary',
    features: [
      '2 video analyses per month',
      'Performance score (0–100)',
      'Basic position feedback',
      'Top 2 technical flaws identified',
      'Mobile app access',
    ],
    notIncluded: [
      'Full biomechanical breakdown',
      'Progress tracking',
      'Detailed correction instructions',
      'Benchmark comparison',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15,
    priceNote: 'per month',
    description: 'For serious athletes training consistently and tracking progress.',
    icon: Zap,
    cta: 'Start Pro',
    ctaStyle: 'secondary',
    features: [
      'Unlimited video analyses',
      'Full biomechanical breakdown',
      'All technical flaws ranked by impact',
      'Detailed correction instructions',
      'Progress tracking over time',
      'Position-specific coaching logic',
      '120fps frame-by-frame view',
      'Mobile + web access',
    ],
    notIncluded: [
      'Priority processing',
      'Elite benchmark database',
      'Downloadable PDF reports',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 25,
    priceNote: 'per month',
    description: 'For athletes training at the highest level who need every edge.',
    icon: Star,
    cta: 'Go Elite',
    ctaStyle: 'primary',
    highlighted: true,
    badge: 'MOST POPULAR',
    features: [
      'Everything in Pro',
      'Priority processing (<30s avg.)',
      'Elite benchmark comparison database',
      'Downloadable PDF analysis reports',
      'Historical technique trend graphs',
      'Pre/post comparison side-by-side',
      'Recruiting-grade video annotations',
      'Priority support',
    ],
    notIncluded: [],
  },
  {
    id: 'club',
    name: 'Club',
    price: 200,
    priceNote: 'per month · up to 15 players',
    description: 'Elite access for your entire roster. Built for teams and coaches.',
    icon: Users,
    cta: 'Contact Us',
    ctaStyle: 'outline',
    features: [
      'Elite access for 15 players',
      'Coach dashboard & team view',
      'Side-by-side player comparisons',
      'Team-wide weakness reports',
      'Bulk analysis queue',
      'Roster management tools',
      'Dedicated account manager',
      'Custom onboarding session',
    ],
    notIncluded: [],
  },
]

export default function PricingSection() {
  return (
    <section className="section-y relative overflow-hidden" style={{ background: 'var(--void)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)' }}
      />

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
            Pricing
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Unlock your<br />
            <span className="gradient-text">performance analysis.</span>
          </motion.h2>

          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            Start free. Scale when you're ready. No lock-in, no gimmicks.
          </motion.p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon
            return (
              <motion.div
                key={tier.id}
                className={`relative rounded-2xl overflow-hidden flex flex-col`}
                style={{
                  background: tier.highlighted ? 'rgba(0,212,255,0.05)' : 'var(--surface)',
                  border: tier.highlighted ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: tier.highlighted ? '0 0 60px rgba(0,212,255,0.08)' : 'none',
                }}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Popular badge */}
                {tier.highlighted && (
                  <div
                    className="absolute top-0 left-0 right-0 text-center py-1.5 font-mono text-[9px] tracking-widest font-bold"
                    style={{ background: 'var(--cyan)', color: '#020208' }}
                  >
                    {tier.badge}
                  </div>
                )}

                <div className={`p-6 flex flex-col flex-1 ${tier.highlighted ? 'pt-10' : ''}`}>
                  {/* Tier header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && (
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: '28px',
                            height: '28px',
                            background: tier.highlighted ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.05)',
                          }}
                        >
                          <Icon size={14} style={{ color: tier.highlighted ? 'var(--cyan)' : 'var(--text-muted)' }} />
                        </div>
                      )}
                      <span className="font-black text-lg text-white">{tier.name}</span>
                    </div>

                    {tier.price !== null ? (
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="font-black text-4xl text-white">${tier.price}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/mo</span>
                      </div>
                    ) : (
                      <div className="text-4xl font-black text-white mb-1">$0</div>
                    )}
                    <div className="text-[10px] font-mono" style={{ color: 'var(--text-subtle)' }}>{tier.priceNote}</div>

                    <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {tier.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-2.5 mb-6">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check
                          size={13}
                          style={{
                            color: tier.highlighted ? 'var(--cyan)' : '#00e676',
                            flexShrink: 0,
                            marginTop: '3px',
                          }}
                        />
                        <span className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>{f}</span>
                      </div>
                    ))}
                    {tier.notIncluded.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 opacity-35">
                        <div className="w-3 h-px mt-2 flex-shrink-0" style={{ background: 'var(--text-subtle)' }} />
                        <span className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={tier.id === 'club' ? '/contact' : '/demo'}
                    className={
                      tier.ctaStyle === 'primary'
                        ? 'btn-primary justify-center text-center'
                        : tier.ctaStyle === 'outline'
                        ? 'btn-outline-cyan justify-center text-center'
                        : 'btn-secondary justify-center text-center'
                    }
                    style={{ textDecoration: 'none', display: 'flex' }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-sm mt-10"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          All plans include mobile app access. Cancel anytime. No long-term contracts.
        </motion.p>
      </div>
    </section>
  )
}
