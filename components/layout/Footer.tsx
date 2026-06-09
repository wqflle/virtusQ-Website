import Link from 'next/link'

const nav = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Download', href: '/download' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Privacy', href: '/privacy' },
]

export default function Footer() {
  return (
    <footer
      className="py-12 border-t"
      style={{ borderColor: 'var(--border)', background: 'rgba(0,0,0,0.4)' }}
    >
      <div className="container-max">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--purple), var(--cyan))' }}
            >
              <span className="text-white font-black text-xs">V</span>
            </div>
            <span className="font-black text-white text-base tracking-tight">VirtusQ</span>
          </Link>

          {/* Nav */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {nav.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm transition-colors"
                style={{ color: 'var(--text-subtle)' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} VirtusQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
