"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container-max pt-16 md:pt-24">
      <div className="relative overflow-hidden rounded-3xl border p-8 md:p-12"
           style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}>
        {/* background glow */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(124,58,237,0.35)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(124,58,237,0.18)" }}
        />

        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="muted text-sm font-extrabold tracking-widest"
            >
              AI PERFORMANCE TRAINING
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-4 text-4xl font-black leading-tight md:text-5xl"
            >
              Train smarter.
              <br />
              <span style={{ color: "var(--primary)" }}>Not harder.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="muted mt-5 text-base leading-relaxed"
            >
              VirtusQ uses AI-powered biomechanical analysis to improve your volleyball technique —
              rep by rep. Track Elite Score, fix weak points, and climb performance tiers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link href="/download" className="btn btn-primary">
                Download VirtusQ
                <span className="text-black/80">→</span>
              </Link>
              <Link href="/how-it-works" className="btn btn-ghost">
                See how it works
                <span className="muted">→</span>
              </Link>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "Pose-based analysis",
                "Elite Score engine",
                "Performance tiers",
                "Coach-style insights",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-full border px-4 py-2 text-xs font-extrabold"
                  style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}
                >
                  <span className="muted">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* “App mockup” placeholder (no images yet) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative"
          >
            <div
              className="mx-auto w-full max-w-md rounded-3xl border p-5"
              style={{
                borderColor: "var(--border)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-black">Analysis Results</div>
                <div className="muted text-xs font-extrabold">VirtusQ</div>
              </div>

              <div className="mt-5 rounded-2xl border p-4"
                   style={{ borderColor: "var(--border)", background: "rgba(20,20,27,0.6)" }}>
                <div className="muted text-xs font-extrabold tracking-widest">ELITE SCORE</div>
                <div className="mt-2 flex items-end gap-2">
                  <div className="text-5xl font-black">84</div>
                  <div className="muted mb-2 text-sm font-extrabold">/100 · PRO</div>
                </div>
                <div className="muted mt-4 text-sm leading-relaxed">
                  Composite score based on posture, timing, stability, and rep cleanliness.
                </div>

                <div className="mt-5 h-2 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full w-[84%] rounded-full" style={{ background: "var(--primary)" }} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border p-4"
                   style={{ borderColor: "var(--border)", background: "rgba(20,20,27,0.6)" }}>
                <div className="muted text-xs font-extrabold tracking-widest">ELITE COACHING INSIGHT</div>
                <div className="mt-2 text-sm font-extrabold leading-relaxed">
                  PASSING: lock your platform through contact — don’t let the angle drift late.
                </div>
              </div>
            </div>

            <div
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] blur-3xl"
              style={{ background: "rgba(124,58,237,0.22)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
