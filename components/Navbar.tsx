'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl rounded-2xl px-6 py-3.5 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(4,4,10,0.85)' : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: scrolled ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-black tracking-tight gradient-text">
            VirtusQ
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-text transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-sm text-text-muted hover:text-text transition-colors duration-200 px-3 py-2"
            >
              Plans
            </Link>
            <Link
              href="/download"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              Download Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-text-muted hover:text-text transition-colors p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-1 pt-5 mt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="py-2.5 px-2 text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-2 text-sm text-text-muted hover:text-text transition-colors"
                >
                  Plans
                </Link>
                <Link
                  href="/download"
                  onClick={() => setOpen(false)}
                  className="mt-3 text-center py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
                >
                  Download Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
