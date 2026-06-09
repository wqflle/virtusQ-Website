'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Zap, Brain, TrendingUp, Smartphone, Trophy, Clock, ArrowUpRight } from 'lucide-react'
import Aurora from '@/components/ui/Aurora'
import MagneticButton from '@/components/ui/MagneticButton'

const reasons = [
  { icon: Zap, title: 'Instant biomechanical scoring', desc: 'Every rep you film is scored from 0 to 100 using real pose data — a precise biomechanical evaluation of your actual movement.', color: '#7c3aed' },
  { icon: Brain, title: 'One high-impact correction per rep', desc: "Instead of a wall of feedback that overwhelms you, VirtusQ identifies the single most important fix available to you right now.", color: '#a78bfa' },
  { icon: TrendingUp, title: 'Performance tier progression', desc: 'Track your growth through Bronze, Silver, Gold, and Champion tiers. Watch your average Elite Score climb over time.', color: '#6366f1' },
  { icon: Smartphone, title: 'No equipment needed', desc: 'All you need is your phone. No wearables, no sensors, no external cameras. Just film your rep and let the AI do the rest.', color: '#c4b5fd' },
  { icon: Clock, title: 'Results in under 60 seconds', desc: 'From the moment you submit your video to receiving your Elite Score and coaching cue — the whole process takes less than a minute.', color: '#7c3aed' },
  { icon: Trophy, title: 'Built specifically for volleyball', desc: "VirtusQ isn't a generic sports app. It's built around volleyball biomechanics — passes, sets, serves, spikes, and receives.", color: '#a78bfa' },
]

const steps = [
  { number: '01', title: 'Download the app', desc: 'VirtusQ is free to download on iOS. Get it from the App Store in seconds — no sign-up required to start.' },
  { number: '02', title: 'Film your first rep', desc: 'Set your phone up with your full body in frame. Side-on or a slight angle works best. Film one clean rep of any skill.' },
  { number: '03', title: 'Get your Elite Score', desc: 'Within seconds, VirtusQ analyses your movement and delivers your biomechanical score, performance tier, and single most important correction.' },
  { number: '04', title: 'Track your improvement', desc: 'Every rep you film is saved to your history. Watch your scores trend upward and your tier climb as you train smarter.' },
]

const AppStoreButton = () => (
  <a
    href="https://apps.apple.com/au/app/virtusq/id6761644948"
    target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-black hover:opacity-90 transition shadow-xl text-base"
    style={{ background: '#fff' }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
    Download on App Store
  </a>
)

export default function DownloadPage() {
  const whyRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const plansRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const whyInView = useInView(whyRef, { once: true })
  const stepsInView = useInView(stepsRef, { once: true })
  const plansInView = useInView(plansRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  return (
    <main className="relative min-h-screen text-white overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <Aurora intensity="strong" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left */}
            <div className="flex-1 max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="badge mb-8 inline-flex"
              >
                Download VirtusQ
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="display-xl text-text mb-6"
              >
                Train Smarter.{' '}
                <span className="gradient-text">Perform Elite.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-xl text-text-muted leading-relaxed mb-4"
              >
                VirtusQ is the AI volleyball coaching app that fits in your pocket. Film a rep from practice, the gym, or your backyard — and get back a biomechanical score, a performance tier, and the single most impactful correction.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="text-text-muted leading-relaxed mb-10"
              >
                Free to download. No credit card. No commitment. Just film your first rep and see exactly where you stand.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <MagneticButton>
                  <a
                    href="https://apps.apple.com/au/app/virtusq/id6761644948"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white hover:opacity-90 transition text-base"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.45)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Download on App Store
                  </a>
                </MagneticButton>
                <a
                  href="#"
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-text-muted border border-border hover:text-text hover:border-white/20 transition-all text-base"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l13.12-7.57-2.83-2.83-11.28 10.2zM.5 1.1C.19 1.42 0 1.9 0 2.53v18.94c0 .63.19 1.11.5 1.43l.07.07 10.61-10.61v-.25L.57 1.03l-.07.07zM20.67 10.03l-2.83-1.63-3.17 3.17 3.17 3.17 2.85-1.64c.81-.47.81-1.23-.02-1.67zM4.17.24L17.29 7.8l-2.83 2.83L3.18.47c.35-.4.7-.43.99-.23z" />
                  </svg>
                  Coming Soon on Google Play
                </a>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-text-subtle text-xs mt-5"
              >
                iOS available now · Android coming soon · Free to download
              </motion.p>
            </div>

            {/* Right: Phone Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 flex justify-center"
            >
              <DeviceCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why VirtusQ */}
      <section className="section-padding" style={{ background: 'var(--bg-2)' }} ref={whyRef}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              className="badge mb-6 inline-flex"
            >
              Why VirtusQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="display-md text-text mb-4"
            >
              Everything you need to <span className="gradient-text">train right.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Most athletes train hard. Very few train with accurate feedback. VirtusQ closes that gap — giving every serious volleyball player access to precise, biomechanical technique analysis.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={whyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 rounded-3xl glass border border-border hover:border-purple-500/30 transition-colors duration-300 relative overflow-hidden group"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 0% 0%, ${r.color}12 0%, transparent 60%)` }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${r.color}18`, border: `1px solid ${r.color}30` }}
                  >
                    <Icon size={20} style={{ color: r.color }} />
                  </div>
                  <h3 className="text-text font-bold text-lg mb-3">{r.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{r.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="section-padding" ref={stepsRef}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              className="badge mb-6 inline-flex"
            >
              Getting started
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="display-md text-text mb-4"
            >
              Your first Elite Score in <span className="gradient-text">four steps.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-xl mx-auto"
            >
              From download to your first AI coaching cue in under five minutes.
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl glass border border-border"
              >
                <div className="text-4xl font-black mb-4 gradient-text opacity-40">{step.number}</div>
                <h3 className="text-text font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Teaser */}
      <section className="section-padding" style={{ background: 'var(--bg-2)' }} ref={plansRef}>
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={plansInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <span className="badge mb-6 inline-flex">Plans & Pricing</span>
              <h2 className="display-md text-text mb-6">
                Free to start.{' '}
                <span className="gradient-text">Elite when ready.</span>
              </h2>
              <p className="text-text-muted text-lg leading-relaxed mb-5">
                The Free plan gives you everything you need to get started — AI skill detection, your Elite Score, and basic quality feedback on every rep. When you are ready to go deeper, Pro and Elite unlock advanced coaching insights and tier tracking.
              </p>
              <p className="text-text-subtle leading-relaxed mb-8">
                Coaching staff and club programs can access the Club plan at A$200/month — built for multi-athlete management, squad dashboards, and bulk rep analysis.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-accent-light hover:text-white transition-colors font-semibold"
              >
                View All Plans <ArrowUpRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={plansInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex-1 grid grid-cols-2 gap-4"
            >
              {[
                { name: 'Free', price: 'A$0', desc: 'Core AI scoring and basic feedback. Free forever.' },
                { name: 'Pro', price: 'A$15/mo', desc: 'Advanced breakdowns, tier tracking, and full score history.' },
                { name: 'Elite', price: 'A$25/mo', desc: 'Full coaching insights, priority updates, and early access.' },
                { name: 'Club', price: 'A$200/mo', desc: 'Squad management, bulk analysis, and coach admin portal.' },
              ].map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={plansInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="p-6 rounded-2xl glass border border-border"
                >
                  <div className="text-text font-black text-lg mb-1">{plan.name}</div>
                  <div className="font-bold text-sm mb-3 gradient-text">{plan.price}</div>
                  <p className="text-text-subtle text-xs leading-snug">{plan.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding" ref={ctaRef}>
        <div className="container-custom max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="p-14 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.05))', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <h2 className="display-md text-text mb-4">Download free. <span className="gradient-text">Score in 60 seconds.</span></h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto text-lg leading-relaxed mb-10">
                No credit card. No commitment. Just download, film one rep, and see exactly where your technique stands against elite biomechanical standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton>
                  <a
                    href="https://apps.apple.com/au/app/virtusq/id6761644948"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-white hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Download on App Store
                  </a>
                </MagneticButton>
                <Link
                  href="/how-it-works"
                  className="flex items-center justify-center px-10 py-4 rounded-2xl font-semibold text-text-muted border border-border hover:text-text hover:border-white/20 transition-all"
                >
                  See How It Works
                </Link>
              </div>
              <p className="text-text-subtle text-xs mt-6">iOS available now · Android coming soon · All prices in AUD</p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}

/* ── Device Carousel ── */
function DeviceCarousel() {
  const screens = [
    { src: '/screens/analysisresults.jpg', title: 'Instant AI Analysis', desc: 'Biomechanical breakdown with Elite Score in seconds.' },
    { src: '/screens/historyScreen.jpg', title: 'Track Every Rep', desc: 'Monitor progress, confidence, and performance trends.' },
    { src: '/screens/profileScreen.jpg', title: 'Performance Identity', desc: 'Your evolving tier. Your average Elite Score. Your growth.' },
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % screens.length), 4000)
    return () => clearInterval(interval)
  }, [screens.length])

  return (
    <div className="relative w-[280px] md:w-[340px]">
      <div className="absolute inset-0 rounded-full -z-10 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div
        className="relative rounded-[48px] p-3.5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 0 80px rgba(124,58,237,0.35)',
        }}
      >
        <div className="relative overflow-hidden rounded-[36px] bg-black aspect-[9/19]">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ width: `${screens.length * 100}%`, transform: `translateX(-${index * (100 / screens.length)}%)` }}
          >
            {screens.map((screen) => (
              <div key={screen.src} className="relative h-full" style={{ width: `${100 / screens.length}%` }}>
                <Image src={screen.src} alt={screen.title} fill sizes="(max-width: 768px) 280px, 340px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold gradient-text">{screens[index].title}</h3>
        <p className="text-text-muted mt-2 text-sm max-w-xs mx-auto">{screens[index].desc}</p>
      </div>
      <div className="flex justify-center gap-2.5 mt-5">
        {screens.map((_, i) => (
          <button
            key={i} onClick={() => setIndex(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{ background: i === index ? '#7c3aed' : 'rgba(255,255,255,0.2)', width: i === index ? '24px' : '8px' }}
          />
        ))}
      </div>
    </div>
  )
}
