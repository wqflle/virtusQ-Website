"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent"
        >
          VirtusQ
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">

          <Link
            href="/how-it-works"
            className="hover:text-purple-400 transition duration-200"
          >
            How It Works
          </Link>

          <Link
            href="/pricing"
            className="hover:text-purple-400 transition duration-200"
          >
            Pricing
          </Link>

          <Link
            href="/terms"
            className="hover:text-purple-400 transition duration-200"
          >
            Terms
          </Link>

          <Link
            href="/privacy"
            className="hover:text-purple-400 transition duration-200"
          >
            Privacy
          </Link>

          <Link
            href="/download"
            className="bg-purple-600 px-5 py-2 rounded-lg text-white hover:bg-purple-500 transition duration-200 shadow-lg"
          >
            Download
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="mt-6 flex flex-col gap-5 md:hidden text-sm text-zinc-300 border-t border-white/10 pt-6">

          <Link
            href="/how-it-works"
            onClick={() => setOpen(false)}
            className="hover:text-purple-400 transition"
          >
            How It Works
          </Link>

          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="hover:text-purple-400 transition"
          >
            Pricing
          </Link>

          <Link
            href="/terms"
            onClick={() => setOpen(false)}
            className="hover:text-purple-400 transition"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            onClick={() => setOpen(false)}
            className="hover:text-purple-400 transition"
          >
            Privacy Policy
          </Link>

          <Link
            href="/download"
            onClick={() => setOpen(false)}
            className="bg-purple-600 px-5 py-3 rounded-lg text-center text-white hover:bg-purple-500 transition shadow-lg"
          >
            Download
          </Link>
        </div>
      )}
    </nav>
  );
}
