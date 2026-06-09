'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/* ── Pass pose skeleton (300 × 320 viewBox) ── */
const JOINTS: Record<string, [number, number]> = {
  head:      [150, 30],
  neck:      [150, 52],
  lShoulder: [122, 70],
  rShoulder: [184, 54],
  lElbow:    [102, 108],
  rElbow:    [212, 26],
  lWrist:    [86,  145],
  rWrist:    [238, 4],
  lHip:      [128, 155],
  rHip:      [168, 148],
  lKnee:     [115, 215],
  rKnee:     [175, 205],
  lAnkle:    [104, 275],
  rAnkle:    [188, 262],
}

const BONES: [string, string][] = [
  ['head', 'neck'],
  ['neck', 'lShoulder'], ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'], ['lElbow', 'lWrist'],
  ['rShoulder', 'rElbow'], ['rElbow', 'rWrist'],
  ['lShoulder', 'lHip'],  ['rShoulder', 'rHip'],
  ['lHip', 'rHip'],
  ['lHip', 'lKnee'],  ['lKnee', 'lAnkle'],
  ['rHip', 'rKnee'],  ['rKnee', 'rAnkle'],
]

const METRICS = [
  { label: 'PLATFORM ANGLE',   value: 92, color: '#00d4ff' },
  { label: 'CONTACT TIMING',   value: 78, color: '#00d4ff' },
  { label: 'FOREARM ALIGN',    value: 88, color: '#00d4ff' },
  { label: 'WEIGHT TRANSFER',  value: 71, color: '#ff9d00' },
  { label: 'APPROACH TIMING',  value: 64, color: '#ff3d3d' },
]

/* ── AI Analysis mockup panel ── */
function AnalysisPanel() {
  const [booted, setBooted]         = useState(false)
  const [score, setScore]           = useState(0)
  const [metricPct, setMetricPct]   = useState(0)
  const [frame, setFrame]           = useState(847)

  useEffect(() => {
    const t1 = setTimeout(() => setBooted(true), 600)

    const t2 = setTimeout(() => {
      let s = 0
      const id = setInterval(() => {
        s += 2
        setScore(Math.min(s, 84))
        if (s >= 84) clearInterval(id)
      }, 18)
      return () => clearInterval(id)
    }, 1300)

    const t3 = setTimeout(() => {
      let m = 0
      const id = setInterval(() => {
        m += 0.04
        setMetricPct(Math.min(m, 1))
        if (m >= 1) clearInterval(id)
      }, 25)
      return () => clearInterval(id)
    }, 1600)

    const frameId = setInterval(() => setFrame((f) => (f + 4) % 2340), 60)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearInterval(frameId)
    }
  }, [])

  return (
    <div className="relative w-full" style={{ maxWidth: '520px', marginLeft: 'auto' }}>
      {/* Outer gradient border glow */}
      <div
        className="absolute rounded-2xl pointer-events-none"
        style={{
          inset: '-1px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.35) 0%, rgba(29,106,255,0.18) 55%, rgba(0,212,255,0.04) 100%)',
          borderRadius: '18px',
        }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: '16px',
          background: '#04060d',
          border: '1px solid rgba(0,212,255,0.14)',
        }}
      >
        {/* ── Header bar ── */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] pulse-dot" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--cyan)' }}>
              VirtusQ Analysis Engine
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
              FR {String(frame).padStart(4, '0')} / 2340
            </span>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.18)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] pulse-dot" />
              <span className="font-mono text-[8px]" style={{ color: '#00e676' }}>PROCESSING</span>
            </div>
          </div>
        </div>

        {/* ── Main body ── */}
        <div className="flex">
          {/* Video frame area */}
          <div
            className="relative overflow-hidden"
            style={{ width: '100%', maxWidth: '310px', height: '320px', background: '#02040a', flexShrink: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(0,212,255,0.05) 0%, transparent 65%)' }}
            />

            {/* Skeleton SVG */}
            {booted && (
              <svg
                viewBox="0 0 300 320"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.45))' }}
              >
                {/* Bones */}
                {BONES.map(([a, b], i) => (
                  <motion.line
                    key={`${a}-${b}`}
                    x1={JOINTS[a][0]} y1={JOINTS[a][1]}
                    x2={JOINTS[b][0]} y2={JOINTS[b][1]}
                    stroke="rgba(0,212,255,0.55)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  />
                ))}

                {/* Joint dots */}
                {Object.entries(JOINTS).map(([name, [cx, cy]], i) => (
                  <g key={name}>
                    <motion.circle
                      cx={cx} cy={cy} r={4}
                      fill="#00d4ff"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.055 + 0.12 }}
                    />
                    <motion.circle
                      cx={cx} cy={cy} r={8}
                      fill="none"
                      stroke="rgba(0,212,255,0.28)"
                      strokeWidth="1"
                      animate={{ r: [8, 13, 8], opacity: [0.28, 0, 0.28] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.08 + 0.5, ease: 'easeInOut' }}
                    />
                  </g>
                ))}

                {/* Contact point ring (right wrist) */}
                <motion.circle
                  cx={JOINTS.rWrist[0]} cy={JOINTS.rWrist[1]}
                  r={12}
                  fill="none"
                  stroke="rgba(255,157,0,0.65)"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  style={{ transformOrigin: `${JOINTS.rWrist[0]}px ${JOINTS.rWrist[1]}px`, animation: 'var(--no-anim)' }}
                />
              </svg>
            )}

            {/* Scan line */}
            <div className="scan-line" />

            {/* HUD corners */}
            <div className="absolute top-2.5 left-3 font-mono leading-relaxed" style={{ fontSize: '8px', color: 'rgba(0,212,255,0.45)' }}>
              <div>JOINTS 14/14</div>
              <div>CONF 97.3%</div>
            </div>
            <div className="absolute top-2.5 right-3 font-mono text-right leading-relaxed" style={{ fontSize: '8px', color: 'rgba(0,212,255,0.45)' }}>
              <div>120 FPS</div>
              <div>8ms LAT</div>
            </div>
            <div className="absolute bottom-2.5 left-3 font-mono" style={{ fontSize: '8px', color: 'var(--text-subtle)' }}>
              PASS ANALYSIS · SET 2
            </div>

            {booted && (
              <motion.div
                className="absolute font-mono px-1.5 py-0.5 rounded"
                style={{
                  top: '16px', right: '12px',
                  fontSize: '7px',
                  color: '#ff9d00',
                  background: 'rgba(255,157,0,0.08)',
                  border: '1px solid rgba(255,157,0,0.22)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                CONTACT PT
              </motion.div>
            )}
          </div>

          {/* Metrics sidebar */}
          <div
            className="flex flex-col p-3.5 gap-3"
            style={{
              flexShrink: 0,
              width: '148px',
              background: '#060810',
              borderLeft: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {/* Score readout */}
            <div className="text-center pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="font-mono tracking-widest mb-1.5" style={{ fontSize: '8px', color: 'var(--text-muted)' }}>PERFORMANCE</div>
              <div className="font-black text-white leading-none" style={{ fontSize: '42px' }}>{score}</div>
              <div className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/ 100</div>
              <div className="mt-2.5 rounded-full overflow-hidden" style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#00d4ff,#1d6aff)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.5, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Metric bars */}
            {METRICS.map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono" style={{ fontSize: '7px', color: 'var(--text-muted)' }}>{m.label}</span>
                  <span className="font-mono font-bold text-white" style={{ fontSize: '9px' }}>
                    {Math.round(m.value * metricPct)}
                  </span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value * metricPct}%` }}
                    transition={{ duration: 0.9, delay: 1.7 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}

            {/* Weakness flag */}
            <motion.div
              className="mt-1 p-2 rounded-lg"
              style={{ background: 'rgba(255,61,61,0.06)', border: '1px solid rgba(255,61,61,0.16)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              <div className="font-mono tracking-widest mb-1" style={{ fontSize: '7px', color: '#ff3d3d' }}>WEAK POINT</div>
              <div className="leading-tight" style={{ fontSize: '8px', color: '#ff8080' }}>
                Platform angle 14° wide. Contact height 8cm low.
              </div>
            </motion.div>
          </div>
        </div>

        {/* Progress footer */}
        <div
          className="flex items-center gap-3 px-4 py-2"
          style={{ background: '#060810', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#00d4ff,#1d6aff)' }}
              initial={{ width: 0 }}
              animate={{ width: '73%' }}
              transition={{ duration: 2.4, delay: 0.7, ease: 'easeInOut' }}
            />
          </div>
          <span className="font-mono whitespace-nowrap" style={{ fontSize: '8px', color: 'var(--text-muted)' }}>
            847 / 1160 FRAMES
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Hero section ── */
export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: '80px', background: 'var(--void)' }}
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 grid-bg" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 65% at 72% 44%, rgba(0,212,255,0.06) 0%, transparent 65%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 50% 55% at 22% 50%, rgba(29,106,255,0.04) 0%, transparent 70%)' }}
      />

      <div className="container-max w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-20 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="badge mb-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
              AI Biomechanics Engine · V2.1
            </motion.div>

            <h1 className="display-hero text-white mb-6">
              See exactly<br />
              <span className="gradient-text">why your<br />technique<br />breaks down.</span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: 'var(--text-muted)', maxWidth: '420px' }}
            >
              Frame-by-frame AI analysis of your volleyball mechanics. Pose estimation, joint tracking, and objective performance scoring — no guessing, no bias.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link href="/download" className="btn-primary">
                Download the App
                <ArrowRight size={15} />
              </Link>
              <Link href="/pricing" className="btn-secondary" style={{ textDecoration: 'none' }}>
                View Pricing
              </Link>
            </div>

            <div className="flex flex-wrap gap-10">
              {[
                { value: '2,400+', label: 'Athletes Analyzed' },
                { value: '94%',    label: 'Tracking Accuracy' },
                { value: '<60s',   label: 'Analysis Time' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 52 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnalysisPanel />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '120px', background: 'linear-gradient(to bottom, transparent, var(--void))' }}
      />
    </section>
  )
}
