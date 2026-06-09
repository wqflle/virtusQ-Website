'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Download', href: '/download' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(3,3,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--purple), var(--cyan))' }}
              >
                <span className="text-white font-black text-xs">V</span>
              </div>
              <span className="font-black text-white text-lg tracking-tight">VirtusQ</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://apps.apple.com/au/app/virtusq/id6761644948"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--purple), #a78bfa)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
              >
                Download free
              </a>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
            style={{ background: 'rgba(3,3,10,0.97)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}
          >
            <div className="container-max py-6 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3">
                <a
                  href="https://apps.apple.com/au/app/virtusq/id6761644948"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl text-center font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, var(--purple), #a78bfa)' }}
                >
                  Download free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
