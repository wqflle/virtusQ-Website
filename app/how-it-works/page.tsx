'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Aurora from '@/components/ui/Aurora'
import MagneticButton from '@/components/ui/MagneticButton'

const steps = [
  {
    number: '01',
    title: 'Record Your Rep',
    headline: 'Your phone is your coach\'s eye.',
    body: 'Set your phone up so your full body is visible in the frame — ideally side-on or at a slight angle so the AI can read your posture and movement path clearly. You don\'t need a tripod, a gym, or special equipment. The better the angle and lighting, the more precise the analysis — but VirtusQ is built to work in real training conditions, not just perfect studios.',
    detail: 'Supported skills include passing, setting, serving, spiking, and receiving. Film a single rep or a short sequence. VirtusQ processes each rep individually so you get clean, isolated feedback every time.',
    color: '#7c3aed',
  },
  {
    number: '02',
    title: 'AI Pose Extraction',
    headline: 'Every joint. Every frame. Every millisecond.',
    body: 'The moment you submit your video, VirtusQ\'s computer vision model gets to work. It identifies and tracks the key biomechanical landmarks across your body — shoulders, hips, knees, ankles, elbows, wrists — frame by frame across the entire rep.',
    detail: 'The system measures joint angles, limb alignment, centre of mass, postural balance, and timing relative to contact point or skill execution. Each of these dimensions is evaluated independently and combined into a composite picture of your movement quality.',
    color: '#6366f1',
  },
  {
    number: '03',
    title: 'Elite Score Generated',
    headline: 'One number that tells the truth about your technique.',
    body: "Once pose extraction is complete, VirtusQ's sequence model evaluates the full movement — not just one frame, but the entire rep. It scores your technique across multiple biomechanical dimensions and produces a single Elite Score from 0 to 100.",
    detail: "The Elite Score isn't a guess or a general rating. It's calculated from the same biomechanical principles that sports scientists and elite coaches use to assess athlete technique — now automated, immediate, and available after every single rep you film.",
    color: '#a78bfa',
  },
  {
    number: '04',
    title: 'Get Your Correction',
    headline: 'Not twenty things to fix. The one thing that matters most.',
    body: "This is where VirtusQ is fundamentally different from any other feedback tool. Instead of overwhelming you with a list of issues, the AI identifies the single highest-impact correction available to you right now — the specific biomechanical adjustment that will produce the biggest improvement in your next rep.",
    detail: 'Over time, as you correct each issue and your Elite Score rises, VirtusQ identifies the next highest-impact correction. It is a progressive coaching system that meets you exactly where you are — the same way a world-class coach would.',
    color: '#c4b5fd',
  },
]

const stats = [
  { value: '0–100', label: 'Elite Score range, calibrated to real biomechanical standards' },
  { value: '4', label: 'Performance tiers — Bronze, Silver, Gold, and Champion' },
  { value: '< 60s', label: 'Time from video upload to full AI analysis and correction' },
  { value: '1', label: 'High-impact coaching cue delivered per rep — no information overload' },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8`}
    >
      {/* Timeline node */}
      <div className="flex flex-col items-center gap-4 pt-2 flex-shrink-0 hidden md:flex">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-lg z-10 text-white"
          style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}99)`, boxShadow: `0 0 40px ${step.color}40` }}
        >
          {step.number}
        </div>
        {index < steps.length - 1 && (
          <div className="w-0.5 flex-1" style={{ minHeight: '80px', background: `linear-gradient(to bottom, ${step.color}60, ${steps[index + 1].color}60)` }} />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-3xl p-8 md:p-10 glass border border-border overflow-hidden relative group mb-8"
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at ${isEven ? '0% 0%' : '100% 0%'}, ${step.color}10 0%, transparent 60%)` }}
        />

        {/* Mobile number */}
        <div className="flex items-center gap-4 mb-6 md:mb-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black md:hidden"
            style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}99)` }}>
            {step.number}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="hidden md:flex items-center gap-3 mb-5">
              <span className="text-xs text-text-subtle font-medium uppercase tracking-widest" style={{ color: step.color }}>
                Step {step.number}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text mb-2">{step.title}</h3>
            <p className="text-sm font-medium mb-4" style={{ color: step.color }}>{step.headline}</p>
            <p className="text-text-muted text-sm leading-relaxed">{step.body}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-subtle mb-4">Technical detail</p>
            <div
              className="p-5 rounded-2xl text-sm leading-relaxed text-text-muted"
              style={{ background: `${step.color}08`, border: `1px solid ${step.color}20` }}
            >
              {step.detail}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function HowItWorksPage() {
  const statsRef = useRef<HTMLDivElement>(null)
  const techRef = useRef<HTMLDivElement>(null)
  const tiersRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const statsInView = useInView(statsRef, { once: true })
  const techInView = useInView(techRef, { once: true })
  const tiersInView = useInView(tiersRef, { once: true })
  const faqInView = useInView(faqRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  return (
    <main className="relative min-h-screen text-white overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end pb-20 overflow-hidden pt-32">
        <Aurora intensity="medium" />
        <div className="container-custom relative z-10 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="badge mb-8 inline-flex"
          >
            How VirtusQ works
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl text-text mb-6"
          >
            From video.{' '}
            <span className="gradient-text">To elite correction.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-xl text-text-muted max-w-xl leading-relaxed mb-8"
          >
            Most athletes never get honest, data-driven feedback on their technique. Film a rep and within seconds you have a biomechanical score, a performance tier, and the single most impactful correction available to you.
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
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white hover:opacity-90 transition"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
              >
                Download Free
              </a>
            </MagneticButton>
            <Link href="/pricing"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-text-muted border border-border hover:text-text hover:border-white/20 transition-all">
              View Plans <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12" style={{ background: 'var(--bg-2)' }} ref={statsRef}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl glass border border-border"
              >
                <div className="text-3xl font-black gradient-text mb-2">{s.value}</div>
                <div className="text-text-subtle text-xs leading-snug">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* Technology */}
      <section className="section-padding" style={{ background: 'var(--bg-2)' }} ref={techRef}>
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="p-12 rounded-3xl glass border border-border relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 100% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)'
            }} />
            <div className="relative z-10">
              <span className="badge mb-6 inline-flex">The technology</span>
              <h2 className="display-md text-text mb-6">
                Built on Computer Vision.{' '}
                <span className="gradient-text">Designed for Real Athletes.</span>
              </h2>
              <p className="text-text-muted leading-relaxed text-lg max-w-3xl mb-5">
                VirtusQ's analysis pipeline combines real-time pose estimation, temporal sequence modelling, and biomechanical scoring trained on volleyball-specific movement data. The system understands how a body position interacts with your posture, weight distribution, and timing to produce either a clean, controlled rep or a flawed one.
              </p>
              <p className="text-text-subtle leading-relaxed max-w-3xl mb-10">
                This is the same class of technology used in professional sports analytics — now built into an app in your pocket. The focus isn't on overwhelming you with data. It's on giving you the right signal at the right moment so every rep is better than the last.
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  { title: 'Pose Estimation', desc: 'Identifies and tracks 17+ biomechanical landmarks across your body in every frame — no markers or sensors needed.' },
                  { title: 'Sequence Modelling', desc: 'Evaluates movement quality across time, not just a single frame — capturing timing, velocity, and the flow of your technique.' },
                  { title: 'Biomechanical Scoring', desc: 'Translates raw movement data into a single 0–100 Elite Score using principles from sports science and elite coaching methodology.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={techInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
                  >
                    <h4 className="font-bold text-text mb-2">{item.title}</h4>
                    <p className="text-text-subtle text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Performance Tiers */}
      <section className="section-padding" ref={tiersRef}>
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tiersInView ? { opacity: 1, y: 0 } : {}}
            className="mb-12"
          >
            <span className="badge mb-6 inline-flex">Performance tiers</span>
            <h2 className="display-md text-text mb-4">
              Know exactly where you stand.{' '}
              <span className="gradient-text">Watch yourself climb.</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
              Your Elite Score feeds into a long-term performance tier that tracks your progression over days, weeks, and months.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { tier: 'Bronze', range: '0–49', desc: 'Building the foundations. Identifying and correcting the biggest movement faults.', color: '#b45309', bg: 'rgba(180,83,9,0.1)', border: 'rgba(180,83,9,0.25)' },
              { tier: 'Silver', range: '50–69', desc: "Technique is taking shape. Consistency is improving and the fundamentals are becoming reliable.", color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
              { tier: 'Gold', range: '70–84', desc: 'High-quality movement. Your form would hold up at a competitive level. Fine-tuning is the focus.', color: '#d97706', bg: 'rgba(217,119,6,0.1)', border: 'rgba(217,119,6,0.25)' },
              { tier: 'Champion', range: '85–100', desc: 'Elite-level biomechanics. Movement quality is consistently close to the ceiling of what the AI can score.', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
            ].map((t, i) => (
              <motion.div
                key={t.tier}
                initial={{ opacity: 0, y: 30 }}
                animate={tiersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl"
                style={{ background: t.bg, border: `1px solid ${t.border}` }}
              >
                <div className="text-2xl font-black mb-1" style={{ color: t.color }}>{t.tier}</div>
                <div className="text-xs font-bold tracking-widest text-text-subtle uppercase mb-4">Score {t.range}</div>
                <p className="text-text-muted text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: 'var(--bg-2)' }} ref={faqRef}>
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-14"
          >
            <span className="badge mb-6 inline-flex">FAQ</span>
            <h2 className="display-md text-text">Common questions.</h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: 'What skills can VirtusQ analyse?', a: 'VirtusQ currently supports passing, setting, serving, spiking, and receiving. We are continuously expanding skill coverage based on athlete and coach feedback.' },
              { q: 'Do I need any special equipment?', a: 'No. Just your phone and a clear view of your full body in frame. No wearables, no external sensors, no special cameras required.' },
              { q: 'How accurate is the AI scoring?', a: "VirtusQ's pose estimation and scoring models are built on biomechanical principles used by sports scientists and elite coaches. The system is continuously updated as we process more rep data." },
              { q: 'Can coaches use VirtusQ with their team?', a: 'Yes — the Club plan is built specifically for coaches and club programs. It includes multi-athlete management, squad performance dashboard, bulk rep analysis, and a dedicated coach admin portal.' },
              { q: "What's the difference between Pro and Elite?", a: 'Pro unlocks advanced skill breakdowns and performance tier tracking. Elite adds our deepest coaching insights, priority access to model updates, and early access to new features.' },
            ].map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="p-7 rounded-2xl glass border border-border"
              >
                <h4 className="text-text font-semibold text-lg mb-3">{faq.q}</h4>
                <p className="text-text-muted leading-relaxed text-sm">{faq.a}</p>
              </motion.div>
            ))}
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
              <h2 className="display-md text-text mb-4">Stop guessing about <span className="gradient-text">your technique.</span></h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto text-lg leading-relaxed mb-10">
                Every rep you film is data. Every correction moves you forward. Download VirtusQ free today and get your Elite Score after your very first rep.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <MagneticButton>
                  <a
                    href="https://apps.apple.com/au/app/virtusq/id6761644948"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-white hover:opacity-90 transition"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 10px 40px rgba(124,58,237,0.4)' }}
                  >
                    Download VirtusQ Free
                  </a>
                </MagneticButton>
                <Link href="/pricing"
                  className="flex items-center justify-center px-10 py-4 rounded-2xl font-semibold text-text-muted border border-border hover:text-text hover:border-white/20 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
