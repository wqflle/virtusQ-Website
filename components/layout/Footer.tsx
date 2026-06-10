'use client'
import Link from 'next/link'

const LINKS = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Download', href: '/download' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'How It Works', href: '/#how-it-works' },
  ],
  Athletes: [
    { label: 'Club Players', href: '#' },
    { label: 'High School', href: '#' },
    { label: 'College Level', href: '#' },
    { label: 'Coaches', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Data Processing', href: '#' },
  ],
}

const STATS = [
  { value: '2,400+', label: 'Athletes' },
  { value: '94%', label: 'Accuracy' },
  { value: '120fps', label: 'Analysis' },
  { value: '14', label: 'Joint Points' },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--void)' }}>
      {/* Stats strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,212,255,0.02)' }}>
        <div className="container-max py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-max py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="VirtusQ" width={30} height={30} style={{ borderRadius: '6px' }} />
              <span className="font-black text-[17px] tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>
                VIRTUSQ
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', maxWidth: '180px' }}>
              AI biomechanics analysis for serious volleyball athletes.
            </p>
            <div
              className="inline-flex items-center gap-1.5 mt-5 px-3 py-1.5 rounded-full font-mono text-[9px] tracking-widest"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', color: 'var(--cyan)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] pulse-dot" />
              ENGINE ONLINE
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase mb-5" style={{ color: 'var(--text-subtle)' }}>
                {category}
              </div>
              <ul className="space-y-3.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm"
                      style={{
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                        display: 'inline-block',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            © 2025 VirtusQ Inc. All rights reserved.
          </p>
          <p className="text-[10px] font-mono" style={{ color: 'var(--text-subtle)', letterSpacing: '0.12em' }}>
            AI ANALYSIS ENGINE · V2.1 · BUILT FOR PRECISION
          </p>
        </div>
      </div>
    </footer>
  )
}
