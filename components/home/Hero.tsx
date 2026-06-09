'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

/* ── word-reveal variants ── */
const wordReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
}
const wordVar = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] },
  },
}

const headline1 = ['Know', 'Exactly', "What's"]
const headline2 = ['Holding', 'Your', 'Game', 'Back.']

/* ── Score counter ── */
function ScoreCounter({ to }: { to: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef(false)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const start = Date.now()
    const duration = 2200
    const step = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) requestAnimationFrame(step)
    }
    setTimeout(() => requestAnimationFrame(step), 1800)
  }, [to])
  return <>{val}</>
}

/* ── Skeleton joints data ── */
const joints = [
  { id: 'head',    x: 195, y: 52,  label: 'Head',     delay: 0.2 },
  { id: 'neck',    x: 195, y: 80,  label: null,       delay: 0.3 },
  { id: 'shL',     x: 158, y: 103, label: 'Shoulder', delay: 0.4 },
  { id: 'shR',     x: 232, y: 98,  label: null,       delay: 0.4 },
  { id: 'elL',     x: 128, y: 145, label: 'Elbow',    delay: 0.55 },
  { id: 'elR',     x: 268, y: 130, label: null,       delay: 0.55 },
  { id: 'wrL',     x: 110, y: 182, label: 'Wrist',    delay: 0.7 },
  { id: 'wrR',     x: 290, y: 162, label: null,       delay: 0.7 },
  { id: 'hip',     x: 192, y: 194, label: 'Hip',      delay: 0.5 },
  { id: 'hipL',    x: 170, y: 202, label: null,       delay: 0.5 },
  { id: 'hipR',    x: 214, y: 200, label: null,       delay: 0.5 },
  { id: 'kneeL',   x: 158, y: 272, label: 'Knee',     delay: 0.65 },
  { id: 'kneeR',   x: 218, y: 258, label: null,       delay: 0.65 },
  { id: 'ankleL',  x: 152, y: 342, label: 'Ankle',    delay: 0.8 },
  { id: 'ankleR',  x: 208, y: 328, label: null,       delay: 0.8 },
]

const bones = [
  ['head','neck'], ['neck','shL'], ['neck','shR'],
  ['shL','elL'], ['shR','elR'], ['elL','wrL'], ['elR','wrR'],
  ['neck','hip'], ['hip','hipL'], ['hip','hipR'],
  ['hipL','kneeL'], ['hipR','kneeR'],
  ['kneeL','ankleL'], ['kneeR','ankleR'],
]

const jointMap = Object.fromEntries(joints.map(j => [j.id, j]))

const metrics = [
  { label: 'Arm Swing',      score: 82, color: '#a78bfa', delay: 0 },
  { label: 'Hip Rotation',   score: 74, color: '#06b6d4', delay: 0.1 },
  { label: 'Jump Timing',    score: 91, color: '#10b981', delay: 0.2 },
  { label: 'Contact Point',  score: 67, color: '#f59e0b', delay: 0.3 },
]

function AIAnalysisCard() {
  const [scanned, setScanned] = useState(false)
  useEffect(() => { setTimeout(() => setScanned(true), 2800) }, [])

  return (
    <div
      className="relative w-full max-w-[540px] rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(3,3,10,0.9)', boxShadow: '0 0 80px rgba(124,58,237,0.2), 0 0 40px rgba(6,182,212,0.1)' }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        <span className="ml-2 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>VirtusQ — Analysis Engine v2.4</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <span className="text-xs" style={{ color: 'rgba(74,222,128,0.7)' }}>LIVE</span>
        </div>
      </div>

      <div className="flex">
        {/* Left: Skeleton visual */}
        <div className="relative" style={{ width: '200px', minHeight: '390px', background: 'rgba(0,0,0,0.5)', flexShrink: 0 }}>
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

          {/* Scan line */}
          <div className="scan-line" />

          {/* SVG skeleton */}
          <svg viewBox="0 0 390 395" className="absolute inset-0 w-full h-full" style={{ transform: 'scale(0.95)' }}>
            {/* Bones */}
            {bones.map(([a, b]) => {
              const ja = jointMap[a], jb = jointMap[b]
              if (!ja || !jb) return null
              return (
                <motion.line
                  key={`${a}-${b}`}
                  x1={ja.x} y1={ja.y} x2={jb.x} y2={jb.y}
                  stroke="rgba(167,139,250,0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: Math.max(ja.delay, jb.delay) + 0.8 }}
                />
              )
            })}
            {/* Joints */}
            {joints.map((j) => (
              <motion.g key={j.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: j.delay + 0.8, type: 'spring', stiffness: 300 }}
                style={{ transformOrigin: `${j.x}px ${j.y}px` }}
              >
                {/* Outer ring */}
                <circle cx={j.x} cy={j.y} r="7" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1" />
                {/* Inner dot */}
                <circle cx={j.x} cy={j.y} r="3.5"
                  fill={j.id === 'wrL' ? 'rgba(239,68,68,0.9)' : 'rgba(6,182,212,0.85)'}
                />
              </motion.g>
            ))}
            {/* Fault indicator on wrL (wrist - wrong contact point) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: scanned ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <circle cx={joints.find(j=>j.id==='wrL')!.x} cy={joints.find(j=>j.id==='wrL')!.y} r="14"
                fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" strokeDasharray="4 3" />
            </motion.g>
          </svg>

          {/* Frame counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-3 left-3 font-mono text-xs"
            style={{ color: 'rgba(6,182,212,0.6)' }}
          >
            FRAME 047/120
          </motion.div>

          {/* Labels */}
          {joints.filter(j => j.label).map(j => (
            <motion.div
              key={j.id + '-label'}
              className="absolute font-mono pointer-events-none"
              style={{ left: `${(j.x / 390) * 100}%`, top: `${(j.y / 395) * 100}%`, transform: 'translate(-50%, -180%)', fontSize: '9px', color: 'rgba(6,182,212,0.7)', whiteSpace: 'nowrap' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: j.delay + 1.2 }}
            >
              {j.label}
            </motion.div>
          ))}
        </div>

        {/* Right: Analysis panel */}
        <div className="flex-1 p-4 space-y-4">
          {/* Score */}
          <div className="text-center pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'rgba(167,139,250,0.7)' }}>
              Elite Score
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5, type: 'spring' }}
              className="text-5xl font-black"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              <ScoreCounter to={79} />
            </motion.div>
            <div className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.6)' }}>/ 100 · Silver Tier</div>
          </div>

          {/* Metric bars */}
          <div className="space-y-2.5">
            {metrics.map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'rgba(148,163,184,0.8)' }}>{m.label}</span>
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.score}</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.score}%` }}
                    transition={{ duration: 1, delay: 2 + m.delay, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI correction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: scanned ? 1 : 0, y: scanned ? 0 : 10 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl p-3 text-xs"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="font-semibold text-red-400 uppercase tracking-wider" style={{ fontSize: '10px' }}>Priority Fix</span>
            </div>
            <p style={{ color: 'rgba(252,165,165,0.85)', lineHeight: 1.5 }}>
              Contact point is 8cm too low — extend hitting arm fully at strike.
            </p>
          </motion.div>

          {/* Skill badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="flex items-center gap-2"
          >
            <div className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              SPIKE
            </div>
            <div className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#22d3ee' }}>
              FRONT ROW
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
        <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>17 joints tracked · 120 frames analysed</span>
        <span className="font-mono text-xs" style={{ color: 'rgba(6,182,212,0.6)' }}>2.3s</span>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      style={{ background: 'var(--bg)' }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Ambient glows */}
      <div className="absolute pointer-events-none" style={{ top: '-10%', left: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute pointer-events-none" style={{ top: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-5%', left: '30%', width: '700px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="container-max relative z-10 w-full">
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16">

          {/* ── Left copy ── */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="badge mb-8 inline-flex"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              AI volleyball coaching · Free to download
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-2" style={{ perspective: '1000px' }}>
              <motion.h1
                variants={wordReveal}
                initial="hidden"
                animate="visible"
                className="display-hero text-white"
              >
                {headline1.map((w, i) => (
                  <motion.span key={i} variants={wordVar} style={{ display: 'inline-block', marginRight: '0.22em' }}>
                    {w}
                  </motion.span>
                ))}
                <br />
                {headline2.map((w, i) => (
                  <motion.span
                    key={i}
                    variants={wordVar}
                    style={{ display: 'inline-block', marginRight: '0.22em' }}
                  >
                    {i === 3
                      ? <span className="gradient-text">{w}</span>
                      : w}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl leading-relaxed mb-10 max-w-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              VirtusQ uses AI to analyse your volleyball technique frame-by-frame — giving you a precise biomechanical score and the one fix that will move your performance the most. Right now.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <MagneticButton>
                <a
                  href="https://apps.apple.com/au/app/virtusq/id6761644948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 12px 50px rgba(124,58,237,0.5)' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Analyse My Game Free
                </a>
              </MagneticButton>

              <Link
                href="/how-it-works"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-base transition-all hover:text-white"
                style={{ color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              >
                <Play size={15} />
                See it in action
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className="flex flex-wrap items-center gap-6"
              style={{ color: 'var(--text-subtle)' }}
            >
              {[
                { n: '0–100', label: 'Elite Score' },
                { n: '< 60s', label: 'Analysis time' },
                { n: '5', label: 'Skills tracked' },
                { n: 'Free', label: 'To download' },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-1.5 text-sm">
                  <span className="font-bold" style={{ color: 'var(--purple-light)' }}>{s.n}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="xl:flex-1 w-full flex justify-center xl:justify-end"
          >
            <AIAnalysisCard />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
    </section>
  )
}
