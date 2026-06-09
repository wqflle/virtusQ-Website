'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import Aurora from '@/components/ui/Aurora'
import MagneticButton from '@/components/ui/MagneticButton'

type Feature =
  | 'AI Skill Detection'
  | 'Basic Quality Feedback'
  | 'Elite Score Breakdown'
  | 'Performance Tier Tracking'
  | 'Advanced Skill Breakdown'
  | 'Elite Coaching Insights'
  | 'Priority Model Updates'
  | 'Early Feature Access'
  | 'Multi-Athlete Management'
  | 'Squad Performance Dashboard'
  | 'Bulk Rep Analysis'
  | 'Coach Admin Portal'
  | 'Dedicated Support'

type Tier = {
  name: string
  priceMonthly: string
  priceYearly: string
  highlight: boolean
  tag?: string
  tagline: string
  description: string
  features: Record<Feature, boolean>
}

const tiers: Tier[] = [
  {
    name: 'Free', priceMonthly: '0', priceYearly: '0', highlight: false,
    tagline: 'Start analysing your technique today.',
    description: 'Free gives you access to VirtusQ\'s core AI analysis — no credit card, no commitment. Film a rep, get a score, see where you stand.',
    features: {
      'AI Skill Detection': true, 'Basic Quality Feedback': true,
      'Elite Score Breakdown': false, 'Performance Tier Tracking': false,
      'Advanced Skill Breakdown': false, 'Elite Coaching Insights': false,
      'Priority Model Updates': false, 'Early Feature Access': false,
      'Multi-Athlete Management': false, 'Squad Performance Dashboard': false,
      'Bulk Rep Analysis': false, 'Coach Admin Portal': false, 'Dedicated Support': false,
    },
  },
  {
    name: 'Pro', priceMonthly: '15', priceYearly: '150', highlight: false,
    tagline: 'For athletes serious about measurable progress.',
    description: 'Pro unlocks the full performance tracking stack — detailed skill breakdowns, tier progression, and your Elite Score history over time.',
    features: {
      'AI Skill Detection': true, 'Basic Quality Feedback': true,
      'Elite Score Breakdown': true, 'Performance Tier Tracking': true,
      'Advanced Skill Breakdown': true, 'Elite Coaching Insights': false,
      'Priority Model Updates': false, 'Early Feature Access': false,
      'Multi-Athlete Management': false, 'Squad Performance Dashboard': false,
      'Bulk Rep Analysis': false, 'Coach Admin Portal': false, 'Dedicated Support': false,
    },
  },
  {
    name: 'Elite', priceMonthly: '25', priceYearly: '250', highlight: true, tag: 'Most Popular',
    tagline: 'The full AI coaching experience.',
    description: 'Elite is the complete package. Everything in Pro plus our deepest coaching insights, priority access to model updates, and early entry to every new feature.',
    features: {
      'AI Skill Detection': true, 'Basic Quality Feedback': true,
      'Elite Score Breakdown': true, 'Performance Tier Tracking': true,
      'Advanced Skill Breakdown': true, 'Elite Coaching Insights': true,
      'Priority Model Updates': true, 'Early Feature Access': true,
      'Multi-Athlete Management': false, 'Squad Performance Dashboard': false,
      'Bulk Rep Analysis': false, 'Coach Admin Portal': false, 'Dedicated Support': false,
    },
  },
  {
    name: 'Club', priceMonthly: '200', priceYearly: '2000', highlight: false, tag: 'For Teams',
    tagline: 'AI coaching for your entire squad.',
    description: 'One Club subscription gives 15 players full Elite access via unique redemption codes. Manage your whole squad from a single coach portal.',
    features: {
      'AI Skill Detection': true, 'Basic Quality Feedback': true,
      'Elite Score Breakdown': true, 'Performance Tier Tracking': true,
      'Advanced Skill Breakdown': true, 'Elite Coaching Insights': true,
      'Priority Model Updates': true, 'Early Feature Access': true,
      'Multi-Athlete Management': true, 'Squad Performance Dashboard': true,
      'Bulk Rep Analysis': true, 'Coach Admin Portal': true, 'Dedicated Support': true,
    },
  },
]

const featureSections: { label: string; sublabel: string; features: Feature[] }[] = [
  {
    label: 'Core Analysis', sublabel: 'Available on every plan',
    features: ['AI Skill Detection', 'Basic Quality Feedback', 'Elite Score Breakdown', 'Performance Tier Tracking'],
  },
  {
    label: 'Advanced Coaching', sublabel: 'Pro and above',
    features: ['Advanced Skill Breakdown', 'Elite Coaching Insights', 'Priority Model Updates', 'Early Feature Access'],
  },
  {
    label: 'Club & Team Features', sublabel: 'Club plan only',
    features: ['Multi-Athlete Management', 'Squad Performance Dashboard', 'Bulk Rep Analysis', 'Coach Admin Portal', 'Dedicated Support'],
  },
]

const featureDescriptions: Record<Feature, string> = {
  'AI Skill Detection': 'Identifies and analyses your volleyball skill in each video using computer vision pose estimation.',
  'Basic Quality Feedback': 'Clear output on your rep quality including your Elite Score and primary movement observations.',
  'Elite Score Breakdown': 'Full breakdown of how your score was calculated across individual biomechanical dimensions.',
  'Performance Tier Tracking': 'Tracks your average Elite Score over time and places you in Bronze, Silver, Gold, or Champion tier.',
  'Advanced Skill Breakdown': 'Deep per-skill analysis showing strengths and weaknesses across every measured movement dimension.',
  'Elite Coaching Insights': 'The single highest-impact correction for your technique — identified by the AI after each rep.',
  'Priority Model Updates': 'Your app is updated first when we ship improvements to our AI scoring models.',
  'Early Feature Access': 'Be the first to use new skills, features, and tools as we build them.',
  'Multi-Athlete Management': 'Add and manage multiple athletes from a single coach account.',
  'Squad Performance Dashboard': "Birds-eye view of your entire squad's performance tiers and improvement trends.",
  'Bulk Rep Analysis': 'Submit and process reps across your whole team simultaneously.',
  'Coach Admin Portal': 'Dedicated coach interface for reviewing sessions, flagging reps, and managing your program.',
  'Dedicated Support': 'Direct line to our team for onboarding, technical support, and program setup.',
}

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const clubRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const cardsInView = useInView(cardsRef, { once: true })
  const tableInView = useInView(tableRef, { once: true })
  const clubInView = useInView(clubRef, { once: true })
  const faqInView = useInView(faqRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  return (
    <main className="relative min-h-screen text-white overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end pb-20 overflow-hidden pt-32" ref={heroRef}>
        <Aurora intensity="medium" />
        <div className="container-max relative z-10 text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="badge mb-8 inline-flex"
          >
            Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl text-text mb-6"
          >
            Start Free.{' '}
            <span className="gradient-text">Unlock Elite When Ready.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-4"
          >
            VirtusQ is free to download and use. Every plan is built around one goal — giving you the most accurate, actionable volleyball technique feedback available.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-text-subtle"
          >
            Prices shown in AUD · Automatically adjusted for your region · No lock-in · Cancel anytime
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex justify-center"
          >
            <div className="flex rounded-full p-1 glass border border-border">
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200"
                  style={billing === b
                    ? { background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff' }
                    : { color: '#94a3b8' }}
                >
                  {b === 'monthly' ? 'Monthly' : 'Yearly — 2 Months Free'}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-y" ref={cardsRef}>
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {tiers.map((tier, i) => {
              const price = billing === 'monthly' ? tier.priceMonthly : tier.priceYearly
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl p-8 border flex flex-col transition-all duration-300 hover:scale-[1.02]"
                  style={tier.highlight
                    ? { borderColor: 'rgba(124,58,237,0.6)', background: 'rgba(124,58,237,0.08)', boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }
                    : tier.name === 'Club'
                    ? { borderColor: 'rgba(217,119,6,0.4)', background: 'rgba(217,119,6,0.06)' }
                    : { borderColor: 'var(--border)', background: 'rgba(255,255,255,0.03)' }}
                >
                  {tier.tag && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-4 py-1 rounded-full"
                      style={tier.highlight
                        ? { background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff' }
                        : { background: '#d97706', color: '#000' }}
                    >
                      {tier.tag}
                    </span>
                  )}
                  <div>
                    <h2 className="text-2xl font-black text-text">{tier.name}</h2>
                    <p className="text-sm font-semibold mt-1" style={{ color: tier.highlight ? '#a78bfa' : tier.name === 'Club' ? '#d97706' : '#94a3b8' }}>
                      {tier.tagline}
                    </p>
                    <p className="text-text-subtle text-sm mt-4 leading-relaxed">{tier.description}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border">
                    <div>
                      <span className="text-4xl font-black text-text">A${price}</span>
                      <span className="text-text-muted ml-2 text-sm">{billing === 'monthly' ? '/month' : '/year'}</span>
                    </div>
                    {billing === 'yearly' && tier.name !== 'Free' && (
                      <p className="text-green text-xs mt-1 font-semibold">2 months free vs monthly</p>
                    )}
                    <MagneticButton className="mt-5 block">
                      <Link
                        href="/download"
                        className="block text-center py-3 rounded-xl font-bold transition text-sm"
                        style={tier.highlight
                          ? { background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff' }
                          : tier.name === 'Club'
                          ? { background: '#d97706', color: '#000' }
                          : { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        {tier.name === 'Free' ? 'Download Free' : tier.name === 'Club' ? 'Get in Touch' : 'Get Started'}
                      </Link>
                    </MagneticButton>
                  </div>
                </motion.div>
              )
            })}
          </div>
          <p className="text-center text-text-subtle text-sm">All plans can be cancelled at any time. No lock-in. No hidden fees.</p>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section-y" style={{ background: 'var(--bg-2)' }} ref={tableRef}>
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <span className="badge mb-6 inline-flex">Full comparison</span>
            <h2 className="display-md text-text mb-2">Compare Every Feature</h2>
            <p className="text-text-subtle text-sm">Hover over any feature name to see what it includes.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="border rounded-2xl overflow-hidden border-border"
          >
            <div className="grid grid-cols-5 border-b border-border" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="p-6 font-bold text-text-subtle text-sm">Feature</div>
              {tiers.map((tier) => (
                <div key={tier.name} className="p-6 text-center font-black text-sm"
                  style={{ color: tier.highlight ? '#a78bfa' : tier.name === 'Club' ? '#d97706' : '#f1f5f9' }}>
                  {tier.name}
                </div>
              ))}
            </div>
            {featureSections.map((section) => (
              <div key={section.label}>
                <div className="grid grid-cols-5 border-b border-border" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="col-span-5 px-6 py-3 flex items-baseline gap-3">
                    <span className="text-xs font-extrabold tracking-widest text-text-muted uppercase">{section.label}</span>
                    <span className="text-xs text-text-subtle">{section.sublabel}</span>
                  </div>
                </div>
                {section.features.map((feature, index) => (
                  <div
                    key={feature}
                    className="grid grid-cols-5 border-b border-border group"
                    style={{ background: index % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.01)' }}
                  >
                    <div className="p-5 pl-6">
                      <div className="text-text-muted text-sm font-medium">{feature}</div>
                      <div className="text-text-subtle text-xs mt-1 leading-snug max-w-xs">{featureDescriptions[feature]}</div>
                    </div>
                    {tiers.map((tier) => (
                      <div key={tier.name} className="p-5 flex justify-center items-center">
                        {tier.features[feature]
                          ? <Check className="w-5 h-5" style={{ color: tier.highlight ? '#a78bfa' : tier.name === 'Club' ? '#d97706' : '#4ade80' }} />
                          : <X className="w-5 h-5 text-text-subtle" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Club Callout */}
      <section className="section-y" ref={clubRef}>
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={clubInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-12 border"
            style={{
              background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(255,255,255,0.02))',
              borderColor: 'rgba(217,119,6,0.3)',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
              <div className="flex-1">
                <span className="badge mb-6 inline-flex" style={{ background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)', color: '#d97706' }}>
                  For Clubs & Coaches
                </span>
                <h2 className="display-md text-text mb-4">Club Plan — A$200/month</h2>
                <p className="text-text-muted leading-relaxed text-lg max-w-2xl mb-3">
                  Quality coaching analysis has always been available to elite programs with large budgets. The VirtusQ Club plan changes that. For A$200/month, your entire squad gets access to AI-powered biomechanical analysis at club scale.
                </p>
                <p className="text-text-muted leading-relaxed mb-8">
                  Every Club subscription includes <strong className="text-white">15 unique access codes</strong>. Each player redeems their code to unlock full Elite access — unlimited analyses, deep coaching insights, and session history — at no extra cost.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: '15 Player Elite Access Codes', desc: 'Each player redeems a unique code for full Elite plan access — no per-seat charges.' },
                    { title: 'Squad Performance Dashboard', desc: "See your entire team's Elite Scores, tier placements, and improvement trends at a glance." },
                    { title: 'Bulk Rep Analysis', desc: 'Submit reps from your whole squad simultaneously — no queuing during busy sessions.' },
                    { title: 'Coach Admin Portal', desc: 'Dedicated coach interface for reviewing sessions, flagging reps, and annotating feedback.' },
                    { title: 'Dedicated Support', desc: 'Direct access to our team for onboarding and technical help.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3 items-start">
                      <Check className="text-yellow-500 w-4 h-4 mt-1 shrink-0" />
                      <div>
                        <div className="text-text font-semibold text-sm">{item.title}</div>
                        <div className="text-text-subtle text-xs mt-1 leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-center lg:text-right">
                <div className="text-5xl font-black mb-1" style={{ color: '#d97706' }}>A$200</div>
                <div className="text-text-subtle text-sm mb-6">/month · AUD · cancel anytime</div>
                <MagneticButton>
                  <Link href="/download" className="inline-block px-10 py-4 rounded-xl font-bold hover:opacity-90 transition text-base text-black"
                    style={{ background: '#d97706' }}>
                    Get in Touch
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y" style={{ background: 'var(--bg-2)' }} ref={faqRef}>
        <div className="container-max max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <span className="badge mb-6 inline-flex">FAQ</span>
            <h2 className="display-md text-text">Pricing Questions</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { q: 'Can I switch plans at any time?', a: 'Yes. You can upgrade or downgrade at any time through the app. Changes take effect at your next billing cycle.' },
              { q: 'Is there a free trial for paid plans?', a: 'The Free plan lets you experience core AI analysis before committing to a paid tier. Upgrade whenever you\'re ready.' },
              { q: 'What currency are the prices in?', a: 'Prices are shown in AUD but are automatically adjusted for your region at checkout — so you\'ll see the equivalent in your local currency.' },
              { q: 'What happens if I cancel?', a: 'You retain access until the end of your billing period. After that, you drop to the Free tier — you never lose your account or history.' },
              { q: 'How do player codes work on the Club plan?', a: 'Each Club subscription includes 15 unique access codes. You distribute them to your players — when a player redeems their code, they get full Elite access at no extra cost to them.' },
              { q: 'Do you offer discounts for schools?', a: 'We work with schools and academies on a case-by-case basis. Get in touch via the Club plan to discuss your program.' },
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl glass border border-border"
              >
                <h4 className="text-text font-bold mb-3">{faq.q}</h4>
                <p className="text-text-muted text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-y" ref={ctaRef}>
        <div className="container-max max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="p-14 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.05))',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%)'
            }} />
            <div className="relative z-10">
              <h2 className="display-md text-text mb-4">Ready to see your <span className="gradient-text">Elite Score?</span></h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto text-lg leading-relaxed mb-10">
                Download VirtusQ free and get your first AI analysis in under a minute. No credit card required. Upgrade when you are ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton>
                  <a
                    href="https://apps.apple.com/au/app/virtusq/id6761644948"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-white hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
                  >
                    Download Free
                  </a>
                </MagneticButton>
                <Link href="/how-it-works"
                  className="flex items-center justify-center px-10 py-4 rounded-2xl font-semibold text-text-muted border border-border hover:border-white/20 hover:text-text transition-all">
                  See How It Works
                </Link>
              </div>
              <p className="text-text-subtle text-xs mt-6">All prices in AUD · Cancel anytime · No lock-in contracts</p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
