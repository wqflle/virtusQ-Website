'use client'
import { motion } from 'framer-motion'

/* Standing player joints (400 × 420 viewBox) */
const JOINTS: Record<string, [number, number]> = {
  head:      [200, 42],
  neck:      [200, 72],
  lShoulder: [160, 96],
  rShoulder: [240, 96],
  lElbow:    [138, 158],
  rElbow:    [262, 158],
  lWrist:    [122, 218],
  rWrist:    [278, 218],
  lHip:      [172, 218],
  rHip:      [228, 218],
  lKnee:     [165, 308],
  rKnee:     [235, 308],
  lAnkle:    [158, 392],
  rAnkle:    [242, 392],
}

const BONES: [string, string][] = [
  ['head', 'neck'],
  ['neck', 'lShoulder'], ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'], ['lElbow', 'lWrist'],
  ['rShoulder', 'rElbow'], ['rElbow', 'rWrist'],
  ['lShoulder', 'lHip'], ['rShoulder', 'rHip'],
  ['lHip', 'rHip'],
  ['lHip', 'lKnee'], ['lKnee', 'lAnkle'],
  ['rHip', 'rKnee'], ['rKnee', 'rAnkle'],
]

const JOINT_LABELS: { key: string; label: string; value: number; x: number; y: number }[] = [
  { key: 'head',      label: 'Head',     value: 99, x: 230, y: 38 },
  { key: 'lShoulder', label: 'L.Shdr',   value: 87, x: 64,  y: 90 },
  { key: 'rShoulder', label: 'R.Shdr',   value: 82, x: 264, y: 90 },
  { key: 'lElbow',    label: 'L.Elbow',  value: 91, x: 36,  y: 152 },
  { key: 'rElbow',    label: 'R.Elbow',  value: 88, x: 280, y: 152 },
  { key: 'lHip',      label: 'L.Hip',    value: 79, x: 64,  y: 215 },
  { key: 'rHip',      label: 'R.Hip',    value: 81, x: 256, y: 215 },
  { key: 'lKnee',     label: 'L.Knee',   value: 94, x: 60,  y: 305 },
  { key: 'rKnee',     label: 'R.Knee',   value: 96, x: 252, y: 305 },
  { key: 'lAnkle',    label: 'L.Ankle',  value: 98, x: 56,  y: 390 },
  { key: 'rAnkle',    label: 'R.Ankle',  value: 97, x: 250, y: 390 },
]

const SPECS = [
  { label: 'Tracking Rate',      value: '120 fps' },
  { label: 'Joint Keypoints',    value: '14 nodes' },
  { label: 'Detection Accuracy', value: '94.2%' },
  { label: 'Analysis Latency',   value: '< 60 sec' },
  { label: 'Video Formats',      value: 'MP4 / MOV / AVI' },
  { label: 'Resolution Support', value: 'Up to 4K' },
]

const CAPABILITIES = [
  'Pose estimation via deep convolutional network',
  'Frame-differencing for velocity & acceleration vectors',
  'Contact point triangulation and attack angle measurement',
  'Jump timing offset detection (±8ms resolution)',
  'Position-specific benchmark comparison database',
  'Movement efficiency score across full skill repertoire',
]

export default function AIEngine() {
  return (
    <section className="section-y relative overflow-hidden" style={{ background: 'var(--void)' }}>
      {/* Cyan ambiance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(0,212,255,0.035) 0%, transparent 70%)' }}
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
            The AI Engine
          </motion.div>

          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            14 joints. 120 frames/sec.<br />
            <span className="gradient-text">Zero subjectivity.</span>
          </motion.h2>

          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            We quantify human movement into measurable truth. Every joint. Every degree. Every millisecond.
          </motion.p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Body diagram */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative rounded-2xl overflow-hidden mx-auto"
              style={{
                maxWidth: '420px',
                background: '#050710',
                border: '1px solid rgba(0,212,255,0.12)',
              }}
            >
              {/* Scan line */}
              <div className="scan-line" />

              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: 'var(--cyan)' }}>
                  JOINT TRACKING ACTIVE
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] pulse-dot" />
                  <span className="font-mono text-[8px]" style={{ color: '#00e676' }}>14 / 14 LOCKED</span>
                </div>
              </div>

              {/* SVG body */}
              <div className="p-4" style={{ position: 'relative' }}>
                <svg
                  viewBox="0 0 400 440"
                  className="w-full"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.35))' }}
                >
                  {/* Bones */}
                  {BONES.map(([a, b], i) => (
                    <motion.line
                      key={`${a}-${b}`}
                      x1={JOINTS[a][0]} y1={JOINTS[a][1]}
                      x2={JOINTS[b][0]} y2={JOINTS[b][1]}
                      stroke="rgba(0,212,255,0.4)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    />
                  ))}

                  {/* Joints */}
                  {Object.entries(JOINTS).map(([name, [cx, cy]], i) => (
                    <g key={name}>
                      <motion.circle
                        cx={cx} cy={cy} r={6}
                        fill="#00d4ff"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 + 0.1 }}
                      />
                      <motion.circle
                        cx={cx} cy={cy} r={11}
                        fill="none"
                        stroke="rgba(0,212,255,0.2)"
                        strokeWidth="1.5"
                        animate={{ r: [11, 17, 11], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.1 + 0.4 }}
                      />
                    </g>
                  ))}

                  {/* Joint labels */}
                  {JOINT_LABELS.map((jl, i) => (
                    <motion.g
                      key={jl.key}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 + 0.5 }}
                    >
                      <text
                        x={jl.x} y={jl.y}
                        fill="rgba(0,212,255,0.55)"
                        style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 600 }}
                        textAnchor="middle"
                      >
                        {jl.label}
                      </text>
                      <text
                        x={jl.x} y={jl.y + 10}
                        fill="rgba(255,255,255,0.4)"
                        style={{ fontFamily: 'monospace', fontSize: '7px' }}
                        textAnchor="middle"
                      >
                        {jl.value}%
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Specs + capabilities */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Technical specs */}
            <div className="mb-8">
              <div className="font-mono text-[10px] tracking-widest mb-5" style={{ color: 'var(--text-subtle)' }}>
                TECHNICAL SPECIFICATIONS
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SPECS.map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    className="rounded-xl px-4 py-3"
                    style={{ background: 'var(--surface-up)', border: '1px solid var(--border)' }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 + 0.2 }}
                  >
                    <div className="font-mono text-[9px] mb-1" style={{ color: 'var(--text-subtle)' }}>{spec.label}</div>
                    <div className="font-mono font-bold text-sm" style={{ color: 'var(--cyan)' }}>{spec.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <div className="font-mono text-[10px] tracking-widest mb-5" style={{ color: 'var(--text-subtle)' }}>
                ANALYSIS CAPABILITIES
              </div>
              <div className="space-y-3">
                {CAPABILITIES.map((cap, i) => (
                  <motion.div
                    key={cap}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.3 }}
                  >
                    <div
                      className="mt-0.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: 'var(--cyan)', marginTop: '6px' }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{cap}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
