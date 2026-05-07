"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const APP_STORE_URL = "https://apps.apple.com/au/app/virtusq/id6761644948";

const STEPS = [
  {
    step: "01",
    title: "Record Your Rep",
    body: "Set your phone steady with your full body in frame. Side or front view works best. 2–10 seconds is ideal. Lighting and camera angle directly improve AI precision.",
  },
  {
    step: "02",
    title: "AI Pose Extraction",
    body: "VirtusQ tracks biomechanical landmarks across time — measuring posture, alignment, velocity, and timing on every single frame of your clip.",
  },
  {
    step: "03",
    title: "Biomechanical Scoring",
    body: "We evaluate rep cleanliness, stability, control, and timing consistency to generate your Elite Score — a single number from 0 to 100.",
  },
  {
    step: "04",
    title: "Elite Coaching Insight",
    body: "Instead of overwhelming feedback, you get one high-impact correction. The exact flaw, the exact moment, the exact fix. The lever that actually moves performance.",
  },
];

export default function HowItWorksPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#080808", color: "#f0f0f0" }}
    >
      {/* Grid */}
      <div className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute rounded-full" style={{ top: "-20%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "900px", background: "radial-gradient(circle, rgba(99,255,180,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <Nav />

      {/* HERO */}
      <section className="pt-44 pb-20 px-6 max-w-6xl mx-auto">
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", color: "#63ffb4", marginBottom: "1.5rem", textTransform: "uppercase" }}>
          How VirtusQ Works
        </p>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            lineHeight: 1.05, fontWeight: 400,
            color: "#f0f0f0", marginBottom: "1.5rem",
          }}
        >
          From video.
          <br />
          <span style={{ color: "#63ffb4" }}>To elite correction.</span>
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "rgba(240,240,240,0.5)", maxWidth: "540px" }}>
          VirtusQ turns raw reps into actionable insight. Not just a score — a measurable path to performance.
        </p>
      </section>

      {/* STEPS */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, rgba(99,255,180,0.3), transparent)" }}
          />

          <div className="flex flex-col gap-8">
            {STEPS.map((s, i) => (
              <FadeCard key={s.step} delay={i * 100}>
                <div className="flex items-start gap-6">
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#63ffb4", fontWeight: 700, flexShrink: 0, marginTop: "4px", minWidth: "28px" }}>
                    {s.step}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", fontWeight: 400, color: "#f0f0f0", marginBottom: "10px" }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(240,240,240,0.5)" }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              </FadeCard>
            ))}
          </div>
        </div>
      </section>

      {/* TECH SECTION */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <FadeCard>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", color: "#63ffb4", marginBottom: "1.2rem", textTransform: "uppercase" }}>
            Technology
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#f0f0f0", lineHeight: 1.15, marginBottom: "1.2rem" }}>
            Built on Computer Vision.
            <br />
            Designed for Real Athletes.
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(240,240,240,0.5)", maxWidth: "620px", marginBottom: "1rem" }}>
            VirtusQ leverages real-time pose estimation, temporal sequence modeling, and scoring heuristics trained on rep-level data. The focus isn't complexity — it's clarity.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(240,240,240,0.35)", maxWidth: "560px" }}>
            You don't need 50 corrections. You need the right one. Faster iteration. Clear metrics. Real progression.
          </p>
        </FadeCard>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 max-w-6xl mx-auto">
        <div
          style={{
            borderRadius: "28px",
            border: "1px solid rgba(99,255,180,0.2)",
            background: "linear-gradient(135deg, rgba(99,255,180,0.06) 0%, rgba(99,160,255,0.04) 100%)",
            padding: "clamp(40px, 8vw, 72px)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 400, color: "#f0f0f0", lineHeight: 1.1, marginBottom: "1.2rem" }}>
            Ready to experience it?
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(240,240,240,0.5)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 2.5rem" }}>
            Start free. Upgrade when you're ready to push into Elite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#63ffb4", color: "#080808",
                fontWeight: 700, fontSize: "0.95rem",
                padding: "14px 28px", borderRadius: "12px",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: "0 0 40px rgba(99,255,180,0.25)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#4de8a0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#63ffb4"; }}
            >
              <AppleIcon /> Download VirtusQ
            </a>
            <Link
              href="/pricing"
              style={{
                color: "rgba(240,240,240,0.6)", fontWeight: 700,
                fontSize: "0.95rem", padding: "14px 28px",
                borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,255,180,0.3)"; (e.currentTarget as HTMLElement).style.color = "#f0f0f0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(240,240,240,0.6)"; }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px", padding: "28px",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,255,180,0.2)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(99,255,180,0.04)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}
    >
      {children}
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ backgroundColor: scrolled ? "rgba(8,8,8,0.9)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.12em", color: "#f0f0f0", textDecoration: "none" }}>VIRTUSQ</Link>
        <div className="hidden md:flex items-center gap-8">
          {[{ label: "How It Works", href: "/how-it-works" }, { label: "Pricing", href: "/pricing" }, { label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }].map((l) => (
            <Link key={l.label} href={l.href} style={{ fontSize: "0.875rem", color: "rgba(240,240,240,0.5)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f0f0f0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,240,240,0.5)"; }}
            >{l.label}</Link>
          ))}
        </div>
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer"
          style={{ backgroundColor: "#63ffb4", color: "#080808", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.08em", padding: "8px 18px", borderRadius: "8px", textDecoration: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#4de8a0"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#63ffb4"; }}
        >DOWNLOAD</a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.12em", color: "rgba(240,240,240,0.4)" }}>VIRTUSQ</span>
      <div className="flex gap-6">
        {[{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }].map((l) => (
          <Link key={l.label} href={l.href} style={{ fontSize: "0.85rem", color: "rgba(240,240,240,0.3)", textDecoration: "none" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,240,240,0.6)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,240,240,0.3)"; }}
          >{l.label}</Link>
        ))}
      </div>
      <p style={{ fontSize: "0.85rem", color: "rgba(240,240,240,0.25)" }}>© {new Date().getFullYear()} VirtusQ. All rights reserved.</p>
    </footer>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
