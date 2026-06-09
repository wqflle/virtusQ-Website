'use client'
import { motion } from 'framer-motion'

const APP_STORE_URL = 'https://apps.apple.com/au/app/virtusq/id6761644948'
const APPLE_LOGO = 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.029 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z'

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '215px',
        height: '450px',
        borderRadius: '38px',
        background: '#0a0a10',
        border: '1.5px solid rgba(255,255,255,0.09)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
          width: '90px', height: '26px', borderRadius: '14px', background: '#000', zIndex: 10,
        }}
      />
      <div style={{ paddingTop: '46px', height: '100%', background: '#020208' }}>
        {children}
      </div>
    </div>
  )
}

function UploadPhone() {
  return (
    <PhoneShell>
      <div style={{ padding: '12px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(0,212,255,0.7)', letterSpacing: '0.15em' }}>
          ANALYSIS ENGINE
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['PASSING', 'SETTING'].map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1, padding: '7px 0', borderRadius: '8px', textAlign: 'center',
                fontFamily: 'monospace', fontSize: '8px', fontWeight: 700,
                background: i === 0 ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 0 ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                color: i === 0 ? '#00d4ff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {s}
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1, borderRadius: '12px', border: '1.5px dashed rgba(0,212,255,0.2)',
            background: 'rgba(0,212,255,0.02)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round">
              <polyline points="16 16 12 12 8 16"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>Select Clip</span>
          <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.2)' }}>MP4 · MOV · AVI</span>
        </div>
        <div style={{
          padding: '9px', borderRadius: '10px', background: '#00d4ff',
          textAlign: 'center', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#020208',
        }}>
          CHOOSE FILE
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '7px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
          2 free analyses / month
        </div>
      </div>
    </PhoneShell>
  )
}

function ProcessingPhone() {
  const bones: Array<[number, number, number, number]> = [
    [50,14,50,30],[50,30,34,52],[50,30,66,52],
    [34,52,28,82],[66,52,72,82],[28,82,22,108],[72,82,78,108],
    [50,30,44,88],[50,30,56,88],[44,88,40,128],[56,88,60,128],
    [40,128,38,155],[60,128,62,155],
  ]
  const joints: Array<[number, number]> = [
    [50,14],[50,30],[34,52],[66,52],[28,82],[72,82],[22,108],[78,108],
    [44,88],[56,88],[40,128],[60,128],[38,155],[62,155],
  ]
  return (
    <PhoneShell>
      <div style={{ padding: '12px', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00d4ff' }} className="pulse-dot" />
          <span style={{ fontFamily: 'monospace', fontSize: '8px', color: '#00d4ff', letterSpacing: '0.12em' }}>ANALYZING</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 100 175" width="85" height="148" style={{ filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.4))' }}>
            {bones.map(([x1, y1, x2, y2], i) => (
              <motion.line
                key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, delay: i * 0.07, repeat: Infinity }}
              />
            ))}
            {joints.map(([cx, cy], i) => (
              <motion.circle
                key={i} cx={cx} cy={cy} r={2.5} fill="#00d4ff"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, delay: i * 0.06, repeat: Infinity }}
              />
            ))}
          </svg>
        </div>
        {[
          { label: 'Pose extraction', done: true },
          { label: 'Rep detection', done: true },
          { label: 'Score computation', done: false },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
              background: s.done ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${s.done ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {s.done && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00e676' }} />}
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '8px', color: s.done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)' }}>
              {s.label}
            </span>
          </div>
        ))}
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg,#00d4ff,#1d6aff)', borderRadius: '1px' }}
            initial={{ width: '20%' }}
            animate={{ width: '72%' }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        </div>
      </div>
    </PhoneShell>
  )
}

function ResultsPhone() {
  const metrics = [
    { l: 'PLATFORM ANGLE', v: 88, c: '#00d4ff' },
    { l: 'CONTACT TIMING', v: 76, c: '#00d4ff' },
    { l: 'WEIGHT TRANSFER', v: 71, c: '#ff9d00' },
    { l: 'FOREARM STABILITY', v: 64, c: '#ff3d3d' },
  ]
  return (
    <PhoneShell>
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00e676' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '7px', color: '#00e676', letterSpacing: '0.12em' }}>COMPLETE</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '7px', color: 'rgba(255,255,255,0.2)' }}>47s</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span style={{ fontSize: '44px', fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}>84</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>/100</span>
        </div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg,#00d4ff,#1d6aff)', borderRadius: '1px' }}
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {metrics.map(m => (
            <div key={m.l}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '7px', marginBottom: '2px', color: 'rgba(255,255,255,0.3)' }}>
                <span>{m.l}</span><span style={{ color: m.c }}>{m.v}</span>
              </div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: m.c, borderRadius: '1px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.v}%` }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,61,61,0.06)', border: '1px solid rgba(255,61,61,0.16)',
          borderRadius: '10px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: '7px', color: '#ff6060', letterSpacing: '0.1em' }}>
            PRIMARY FIX
          </div>
          <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
            Platform angle too wide. Bring forearms together and lock wrists before contact.
          </div>
        </div>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', padding: '8px', borderRadius: '9px', background: '#00d4ff',
            textAlign: 'center', fontFamily: 'monospace', fontSize: '8px', fontWeight: 700,
            color: '#020208', letterSpacing: '0.08em', textDecoration: 'none',
          }}
        >
          DOWNLOAD FREE
        </a>
      </div>
    </PhoneShell>
  )
}

export default function DownloadScreenshots() {
  const steps = [
    { phone: <UploadPhone />, num: '01', label: 'Upload your clip' },
    { phone: <ProcessingPhone />, num: '02', label: 'AI analyzes every frame' },
    { phone: <ResultsPhone />, num: '03', label: 'Score + coaching fix' },
  ]

  return (
    <section className="section-y relative overflow-hidden" style={{ background: 'var(--void)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
      />

      <div className="container-max">
        <div className="text-center mb-16">
          <motion.div
            className="badge mb-6 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
            Three Steps
          </motion.div>
          <motion.h2
            className="display-xl text-white mb-5"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            Film. Analyze.<br />
            <span className="gradient-text">Improve.</span>
          </motion.h2>
          <motion.p
            className="text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
          >
            From upload to coaching fix in under 60 seconds. No equipment. No subscription required to start.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-10">
          {steps.map(({ phone, num, label }, i) => (
            <motion.div
              key={num}
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: i === 1 ? -20 : 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: i === 1 ? 'translateY(-20px)' : undefined }}
            >
              <div style={{ boxShadow: i === 1 ? '0 20px 80px rgba(0,212,255,0.18)' : '0 20px 60px rgba(0,0,0,0.5)' }}>
                {phone}
              </div>
              <div className="text-center">
                <div className="font-mono text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--cyan)' }}>
                  {num}
                </div>
                <div className="text-sm font-medium text-white">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
            style={{ fontSize: '1rem', padding: '1rem 2rem', textDecoration: 'none', boxShadow: '0 0 40px rgba(0,212,255,0.2)' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d={APPLE_LOGO} />
            </svg>
            Download Free on the App Store
          </a>
          <p className="mt-4 text-sm" style={{ color: 'var(--text-subtle)' }}>
            iOS only · Free to start · No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  )
}
