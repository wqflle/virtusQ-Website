'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/* ── Joint data for 3 different phases ── */
type Phase = 'approach' | 'jump' | 'contact'
const phases: { key: Phase; label: string; time: string }[] = [
  { key: 'approach', label: 'Approach', time: '00:01.2' },
  { key: 'jump',     label: 'Jump',     time: '00:01.8' },
  { key: 'contact',  label: 'Contact',  time: '00:02.1' },
]

/* Joint positions per phase — each is the jumping/spiking motion at different moments */
const poseData: Record<Phase, { x: number; y: number; id: string }[]> = {
  approach: [
    { id: 'head',   x: 200, y: 70 },
    { id: 'neck',   x: 200, y: 100 },
    { id: 'shL',    x: 165, y: 125 },
    { id: 'shR',    x: 235, y: 120 },
    { id: 'elL',    x: 138, y: 165 },
    { id: 'elR',    x: 265, y: 150 },
    { id: 'wrL',    x: 120, y: 200 },
    { id: 'wrR',    x: 285, y: 180 },
    { id: 'hipL',   x: 178, y: 210 },
    { id: 'hipR',   x: 218, y: 208 },
    { id: 'kneeL',  x: 165, y: 285 },
    { id: 'kneeR',  x: 220, y: 275 },
    { id: 'ankleL', x: 158, y: 355 },
    { id: 'ankleR', x: 215, y: 345 },
  ],
  jump: [
    { id: 'head',   x: 205, y: 45 },
    { id: 'neck',   x: 205, y: 75 },
    { id: 'shL',    x: 162, y: 100 },
    { id: 'shR',    x: 248, y: 92 },
    { id: 'elL',    x: 128, y: 70 },
    { id: 'elR',    x: 292, y: 62 },
    { id: 'wrL',    x: 108, y: 40 },
    { id: 'wrR',    x: 308, y: 38 },
    { id: 'hipL',   x: 180, y: 185 },
    { id: 'hipR',   x: 222, y: 180 },
    { id: 'kneeL',  x: 172, y: 248 },
    { id: 'kneeR',  x: 218, y: 240 },
    { id: 'ankleL', x: 168, y: 310 },
    { id: 'ankleR', x: 210, y: 302 },
  ],
  contact: [
    { id: 'head',   x: 210, y: 40 },
    { id: 'neck',   x: 208, y: 70 },
    { id: 'shL',    x: 168, y: 95 },
    { id: 'shR',    x: 255, y: 85 },
    { id: 'elL',    x: 145, y: 72 },
    { id: 'elR',    x: 305, y: 55 },
    { id: 'wrL',    x: 130, y: 52 },
    { id: 'wrR',    x: 335, y: 38 },
    { id: 'hipL',   x: 182, y: 190 },
    { id: 'hipR',   x: 228, y: 186 },
    { id: 'kneeL',  x: 175, y: 255 },
    { id: 'kneeR',  x: 222, y: 246 },
    { id: 'ankleL', x: 170, y: 318 },
    { id: 'ankleR', x: 214, y: 308 },
  ],
}

const boneConnections = [
  ['head','neck'], ['neck','shL'], ['neck','shR'],
  ['shL','elL'], ['shR','elR'], ['elL','wrL'], ['elR','wrR'],
  ['neck','hipL'], ['neck','hipR'], ['hipL','hipR'],
  ['hipL','kneeL'], ['hipR','kneeR'],
  ['kneeL','ankleL'], ['kneeR','ankleR'],
]

const phaseMetrics: Record<Phase, { label: string; val: number; color: string; flag?: boolean }[]> = {
  approach: [
    { label: 'Arm Position',  val: 72, color: '#a78bfa' },
    { label: 'Hip Drive',     val: 68, color: '#06b6d4' },
    { label: 'Stride Length', val: 85, color: '#10b981' },
    { label: 'Balance',       val: 91, color: '#22d3ee' },
  ],
  jump: [
    { label: 'Jump Height',   val: 78, color: '#a78bfa' },
    { label: 'Arm Swing',     val: 82, color: '#06b6d4' },
    { label: 'Knee Extension',val: 74, color: '#10b981', flag: true },
    { label: 'Core Tension',  val: 88, color: '#22d3ee' },
  ],
  contact: [
    { label: 'Arm Swing',     val: 82, color: '#a78bfa' },
    { label: 'Contact Point', val: 67, color: '#f59e0b', flag: true },
    { label: 'Wrist Snap',    val: 79, color: '#10b981' },
    { label: 'Follow Through',val: 71, color: '#06b6d4' },
  ],
}

function SkeletonViz({ phase }: { phase: Phase }) {
  const joints = poseData[phase]
  const jMap = Object.fromEntries(joints.map(j => [j.id, j]))

  return (
    <svg viewBox="0 0 400 380" className="w-full h-full" style={{ maxHeight: '340px' }}>
      {/* Grid */}
      <defs>
        <pattern id="demoGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(6,182,212,0.12)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="380" fill="url(#demoGrid)" />

      {/* Bones */}
      {boneConnections.map(([a, b]) => {
        const ja = jMap[a], jb = jMap[b]
        if (!ja || !jb) return null
        return (
          <motion.line
            key={`${a}-${b}-${phase}`}
            x1={ja.x} y1={ja.y} x2={jb.x} y2={jb.y}
            stroke="rgba(167,139,250,0.35)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )
      })}

      {/* Joints */}
      {joints.map((j) => {
        const isFlagged = (phase === 'contact' && j.id === 'wrR') || (phase === 'jump' && j.id === 'kneeL')
        return (
          <motion.g key={j.id + phase}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 400 }}
            style={{ transformOrigin: `${j.x}px ${j.y}px` }}
          >
            {isFlagged && (
              <motion.circle
                cx={j.x} cy={j.y} r="14"
                fill="none" stroke="rgba(239,68,68,0.5)"
                strokeWidth="1.5" strokeDasharray="4 2"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${j.x}px ${j.y}px` }}
              />
            )}
            <circle cx={j.x} cy={j.y} r="8" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
            <circle cx={j.x} cy={j.y} r="4"
              fill={isFlagged ? 'rgba(239,68,68,0.9)' : 'rgba(6,182,212,0.85)'}
            />
          </motion.g>
        )
      })}

      {/* Ball at contact phase */}
      {phase === 'contact' && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <circle cx={360} cy={30} r="16" fill="rgba(255,255,255,0.08)" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" />
          <text x="360" y="35" textAnchor="middle" fontSize="14" fill="rgba(245,158,11,0.8)">🏐</text>
        </motion.g>
      )}
    </svg>
  )
}

export default function DemoSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activePhase, setActivePhase] = useState<Phase>('approach')

  // Auto-cycle phases
  useEffect(() => {
    if (!inView) return
    const order: Phase[] = ['approach', 'jump', 'contact']
    let i = 0
    const t = setInterval(() => {
      i = (i + 1) % order.length
      setActivePhase(order[i])
    }, 2800)
    return () => clearInterval(t)
  }, [inView])

  const metrics = phaseMetrics[activePhase]

  return (
    <section ref={ref} className="section-y relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)' }}>
      {/* Ambient */}
      <div className="absolute pointer-events-none inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="badge mb-6 inline-flex">Live analysis demo</div>
          <h2 className="display-xl text-white mb-6">
            Watch the AI break down{' '}
            <span className="gradient-text">every moment</span>.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            The engine tracks each phase of your spike — approach, jump, and contact — giving you precise data on where the movement breaks down.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(3,3,10,0.95)', boxShadow: '0 40px 120px rgba(124,58,237,0.2), 0 0 60px rgba(6,182,212,0.08)' }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>VirtusQ Analysis · Spike Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              <span className="text-xs font-mono" style={{ color: 'rgba(74,222,128,0.7)' }}>PROCESSING</span>
            </div>
          </div>

          {/* Phase tabs */}
          <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {phases.map((p) => (
              <button
                key={p.key}
                onClick={() => setActivePhase(p.key)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all relative"
                style={{
                  color: activePhase === p.key ? 'var(--purple-light)' : 'var(--text-subtle)',
                  background: activePhase === p.key ? 'rgba(124,58,237,0.08)' : 'transparent',
                }}
              >
                {activePhase === p.key && (
                  <motion.div
                    layoutId="phaseIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--purple-light), transparent)' }}
                  />
                )}
                <span>{p.label}</span>
                <span className="text-xs font-mono opacity-50">{p.time}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-2">
            {/* Skeleton panel */}
            <div className="relative p-6 border-r" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', minHeight: '380px' }}>
              <div className="scan-line" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full"
                >
                  <SkeletonViz phase={activePhase} />
                </motion.div>
              </AnimatePresence>

              {/* Frame info */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="font-mono text-xs" style={{ color: 'rgba(6,182,212,0.5)' }}>17 joints tracked</span>
                <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {phases.find(p => p.key === activePhase)?.time}
                </span>
              </div>
            </div>

            {/* Metrics panel */}
            <div className="p-6 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase + '-metrics'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Phase label */}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--text-subtle)' }}>
                      Phase analysis
                    </div>
                    <div className="text-2xl font-bold text-white capitalize">{activePhase}</div>
                  </div>

                  {/* Bars */}
                  <div className="space-y-4">
                    {metrics.map((m, i) => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.9)' }}>{m.label}</span>
                            {m.flag && (
                              <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: 'rgba(248,113,113,0.9)', fontSize: '9px' }}>
                                PRIORITY
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold" style={{ color: m.color }}>{m.val}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: m.color }}
                            key={m.label + activePhase}
                            initial={{ width: 0 }}
                            animate={{ width: `${m.val}%` }}
                            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Phase insight */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--purple-light)' }}>
                      AI Insight
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(196,181,253,0.8)', lineHeight: 1.6 }}>
                      {activePhase === 'approach' && 'Approach angle and arm swing are strong. Focus on increasing hip drive to add more power to the jump.'}
                      {activePhase === 'jump' && 'Good jump height. Knee extension angle at 138° — target 155° for maximum power transfer. Ranked #1 improvement.'}
                      {activePhase === 'contact' && 'Contact point is 8cm below optimal. Fully extending the hitting arm at the moment of contact will increase attack angle by ~12°.'}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              120 frames · 3 phases · 14 joints mapped per frame
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: 'rgba(74,222,128,0.9)', border: '1px solid rgba(16,185,129,0.2)' }}>
              Elite Score: 79
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
