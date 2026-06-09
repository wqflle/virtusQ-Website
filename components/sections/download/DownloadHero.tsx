'use client'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const APP_STORE_URL = 'https://apps.apple.com/au/app/virtusq/id6761644948'
const APPLE_LOGO = 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.029 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z'

function AppStoreBadge() {
  return (
    <motion.a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3"
      style={{
        background: '#000',
        border: '1.5px solid rgba(255,255,255,0.18)',
        borderRadius: '14px',
        padding: '12px 22px',
        textDecoration: 'none',
        boxShadow: '0 0 30px rgba(0,212,255,0.12)',
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.15 }}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d={APPLE_LOGO} />
      </svg>
      <div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '3px' }}>
          Download on the
        </div>
        <div style={{ fontSize: '17px', color: '#fff', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.01em' }}>
          App Store
        </div>
      </div>
    </motion.a>
  )
}

function PhoneMockup() {
  const metrics = [
    { label: 'PLATFORM ANGLE', val: 88, color: '#00d4ff' },
    { label: 'CONTACT TIMING', val: 76, color: '#00d4ff' },
    { label: 'WEIGHT TRANSFER', val: 71, color: '#ff9d00' },
    { label: 'FOREARM STABILITY', val: 64, color: '#ff3d3d' },
  ]

  return (
    <div className="relative flex justify-center">
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-60px',
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,212,255,0.12) 0%, transparent 65%)',
        }}
      />
      <div
        style={{
          width: '270px',
          height: '560px',
          borderRadius: '44px',
          background: 'linear-gradient(180deg, #0e0e14 0%, #07070c 100%)',
          border: '2px solid rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        <div
          style={{
            position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
            width: '115px', height: '32px', borderRadius: '20px', background: '#000', zIndex: 10,
          }}
        />
        <div style={{ paddingTop: '56px', height: '100%', display: 'flex', flexDirection: 'column', background: '#020208' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e676' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#00e676', letterSpacing: '0.12em' }}>
                ANALYSIS COMPLETE
              </span>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.25)' }}>47s</span>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflow: 'hidden' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', marginBottom: '6px' }}>
                ELITE SCORE · PASSING
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <motion.span
                  style={{ fontSize: '58px', fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  84
                </motion.span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>/100</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: 'linear-gradient(90deg, #00d4ff 0%, #1d6aff 100%)', borderRadius: '2px' }}
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1.2, delay: 1 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics.map((m, i) => (
                <div key={m.label}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: 'monospace', fontSize: '8px',
                    color: 'rgba(255,255,255,0.35)', marginBottom: '4px',
                  }}>
                    <span>{m.label}</span>
                    <span style={{ color: m.color }}>{m.val}</span>
                  </div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: m.color, borderRadius: '1px' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      transition={{ duration: 0.8, delay: 1.1 + i * 0.08 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(255,61,61,0.07)',
                border: '1px solid rgba(255,61,61,0.2)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#ff6060', letterSpacing: '0.12em', marginBottom: '6px' }}>
                PRIMARY FIX · HIGH PRIORITY
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55 }}>
                Platform angle too wide at contact. Bring forearms closer together and lock wrists before the ball arrives.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DownloadHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: '120px', paddingBottom: '7rem', background: 'var(--void)' }}
    >
      <div className="absolute inset-0 grid-bg" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 62% 48%, rgba(0,212,255,0.06) 0%, transparent 65%)' }}
      />

      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="badge mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
              Now available on iOS
            </motion.div>

            <h1 className="display-hero text-white mb-6" style={{ lineHeight: 1.05 }}>
              Your AI volleyball<br />
              <span className="gradient-text">coach. In your<br />pocket.</span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: 'var(--text-muted)', maxWidth: '420px' }}
            >
              Film your pass or set from any angle. Get an objective 0–100 score and exact coaching fixes — on your phone, in under 60 seconds. No coach. No guessing.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {[
                'Frame-by-frame YOLOv8 pose detection',
                'Passing and setting technique analysis',
                'Objective 0–100 score + ranked coaching fixes',
                'Track your progress over every session',
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} style={{ color: '#00e676', flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>

            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AppStoreBadge />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[0,1,2,3,4].map(i => (
                    <svg key={i} viewBox="0 0 16 16" width="13" height="13" fill="#ff9d00">
                      <path d="M8 1l2.16 4.37L15 6.27l-3.5 3.41.83 4.82L8 12.12l-4.33 2.38.83-4.82L1 6.27l4.84-.9z"/>
                    </svg>
                  ))}
                  <span className="ml-1 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>4.9</span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                  Rated on the App Store · Free to start
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
