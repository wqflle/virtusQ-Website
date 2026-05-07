"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const APP_STORE_URL = "https://apps.apple.com/au/app/virtusq/id6761644948";

/* =====================================================
   FEATURES DATA
===================================================== */
const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Analysis",
    body: "Upload a 10-second clip. Get a full biomechanical breakdown in under 30 seconds.",
  },
  {
    icon: "🎯",
    title: "Precision Feedback",
    body: "The AI catches what coaches miss — joint angles, platform timing, footwork patterns.",
  },
  {
    icon: "📈",
    title: "Elite Scoring",
    body: "Every rep gets a score out of 100 across Technique, Posture, Stability, and Consistency.",
  },
  {
    icon: "🔁",
    title: "Track Progress",
    body: "See your trend across every session. Watch your score climb as technique improves.",
  },
];

const SCREENS = [
  {
    src: "/screens/analysisresults.jpg",
    label: "Analysis Results",
    caption: "Instant AI feedback on every rep",
  },
  {
    src: "/screens/historyScreen.jpg",
    label: "Session History",
    caption: "Track every analysis over time",
  },
  {
    src: "/screens/profileScreen.jpg",
    label: "Performance Profile",
    caption: "Your elite score and tier progression",
  },
];

const STATS = [
  { value: "30s", label: "Analysis time" },
  { value: "100", label: "Elite score scale" },
  { value: "4", label: "Biomech metrics" },
  { value: "∞", label: "Reps trackable" },
];

/* =====================================================
   MAIN PAGE
===================================================== */
export default function DownloadPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#080808", color: "#f0f0f0" }}
    >
      {/* ── BACKGROUND GRID ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── AMBIENT GLOWS ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute rounded-full"
          style={{
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "900px",
            background: "radial-gradient(circle, rgba(99,255,180,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-10%",
            right: "-15%",
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, rgba(99,160,255,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <Nav />
      <Hero />
      <StatsBar />
      <FeaturesSection />
      <PhoneSection />
      <CTASection />
      <Footer />
    </main>
  );
}

/* =====================================================
   NAV
===================================================== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(8,8,8,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div
        className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between"
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.12em",
            color: "#f0f0f0",
          }}
        >
          VIRTUSQ
        </span>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-200"
          style={{
            backgroundColor: "#63ffb4",
            color: "#080808",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            padding: "8px 18px",
            borderRadius: "8px",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.backgroundColor = "#4de8a0")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.backgroundColor = "#63ffb4")
          }
        >
          DOWNLOAD
        </a>
      </div>
    </nav>
  );
}

/* =====================================================
   HERO
===================================================== */
function Hero() {
  return (
    <section className="relative pt-44 pb-24 px-6 max-w-6xl mx-auto">
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 mb-8"
          style={{
            border: "1px solid rgba(99,255,180,0.3)",
            borderRadius: "999px",
            padding: "6px 14px",
            backgroundColor: "rgba(99,255,180,0.06)",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "999px", backgroundColor: "#63ffb4", display: "inline-block" }} />
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              color: "#63ffb4",
              fontWeight: 600,
            }}
          >
            AI VOLLEYBALL COACHING
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            lineHeight: 1.0,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#f0f0f0",
            marginBottom: "2rem",
          }}
        >
          Know exactly
          <br />
          <span style={{ color: "#63ffb4" }}>what to fix.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.7,
            color: "rgba(240,240,240,0.55)",
            maxWidth: "540px",
            marginBottom: "3rem",
          }}
        >
          VirtusQ analyses your volleyball technique using AI and tells you the
          exact flaw, the exact moment, and the exact correction — in under
          30 seconds.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 transition-all duration-200"
            style={{
              backgroundColor: "#63ffb4",
              color: "#080808",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: "14px 28px",
              borderRadius: "12px",
              letterSpacing: "0.02em",
              boxShadow: "0 0 40px rgba(99,255,180,0.25)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "#4de8a0";
              el.style.boxShadow = "0 0 60px rgba(99,255,180,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "#63ffb4";
              el.style.boxShadow = "0 0 40px rgba(99,255,180,0.25)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on App Store
          </a>

          <span
            style={{
              fontSize: "0.85rem",
              color: "rgba(240,240,240,0.35)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            iOS · Free to start
          </span>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   STATS BAR
===================================================== */
function StatsBar() {
  return (
    <section
      className="px-6 py-10 max-w-6xl mx-auto"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#63ffb4",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                color: "rgba(240,240,240,0.4)",
                marginTop: "8px",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================
   FEATURES
===================================================== */
function FeaturesSection() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div className="mb-16">
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            color: "#63ffb4",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          What it does
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            color: "#f0f0f0",
            lineHeight: 1.1,
            maxWidth: "600px",
          }}
        >
          Coaching feedback that actually tells you something.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} feature={f} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  delay,
}: {
  feature: (typeof FEATURES)[0];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "20px",
        padding: "28px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,255,180,0.2)";
        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(99,255,180,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)";
      }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "14px" }}>{feature.icon}</div>
      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.3rem",
          fontWeight: 400,
          color: "#f0f0f0",
          marginBottom: "10px",
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.7,
          color: "rgba(240,240,240,0.5)",
        }}
      >
        {feature.body}
      </p>
    </div>
  );
}

/* =====================================================
   PHONE CAROUSEL SECTION
===================================================== */
function PhoneSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % SCREENS.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        {/* Left — text */}
        <div className="flex-1">
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              color: "#63ffb4",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            Built for players
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "#f0f0f0",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            Stop guessing.
            <br />
            Start knowing.
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.8,
              color: "rgba(240,240,240,0.5)",
              maxWidth: "420px",
              marginBottom: "2.5rem",
            }}
          >
            Most players finish practice not knowing if they actually got better
            or just got more reps in. VirtusQ changes that. Every clip gives you
            a precise answer.
          </p>

          {/* Screen labels */}
          <div className="flex flex-col gap-3">
            {SCREENS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setIndex(i)}
                className="flex items-center gap-3 text-left transition-all duration-200"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "999px",
                    backgroundColor: i === index ? "#63ffb4" : "rgba(255,255,255,0.2)",
                    flexShrink: 0,
                    transition: "background-color 0.3s",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.8rem",
                    letterSpacing: "0.06em",
                    color: i === index ? "#f0f0f0" : "rgba(240,240,240,0.35)",
                    transition: "color 0.3s",
                  }}
                >
                  {s.label.toUpperCase()}
                </span>
                {i === index && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(240,240,240,0.4)",
                    }}
                  >
                    — {s.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right — phone */}
        <div className="flex-shrink-0">
          <PhoneFrame index={index} />
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ index }: { index: number }) {
  return (
    <div className="relative" style={{ width: 280 }}>
      {/* Glow behind phone */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(99,255,180,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          borderRadius: "999px",
        }}
      />

      {/* Phone shell */}
      <div
        style={{
          borderRadius: "44px",
          padding: "12px",
          background: "linear-gradient(145deg, #1c1c1c, #111)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Notch */}
        <div
          style={{
            width: 90,
            height: 28,
            backgroundColor: "#0a0a0a",
            borderRadius: "0 0 18px 18px",
            margin: "0 auto 8px",
          }}
        />

        {/* Screen */}
        <div
          style={{
            borderRadius: "32px",
            overflow: "hidden",
            aspectRatio: "9/19",
            backgroundColor: "#0a0a0a",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "100%",
              width: `${SCREENS.length * 100}%`,
              transform: `translateX(-${index * (100 / SCREENS.length)}%)`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {SCREENS.map((screen) => (
              <div
                key={screen.src}
                style={{
                  position: "relative",
                  height: "100%",
                  width: `${100 / SCREENS.length}%`,
                  flexShrink: 0,
                }}
              >
                <Image
                  src={screen.src}
                  alt={screen.label}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   CTA SECTION
===================================================== */
function CTASection() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "28px",
          border: "1px solid rgba(99,255,180,0.2)",
          background: "linear-gradient(135deg, rgba(99,255,180,0.06) 0%, rgba(99,160,255,0.04) 100%)",
          padding: "clamp(40px, 8vw, 80px)",
          textAlign: "center",
        }}
      >
        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(99,255,180,0.15), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 100% 100%, rgba(99,160,255,0.12), transparent 70%)",
          }}
        />

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            color: "#63ffb4",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
          }}
        >
          Available now on iOS
        </p>

        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            fontWeight: 400,
            color: "#f0f0f0",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
          }}
        >
          Find out what your
          <br />
          form is actually doing.
        </h2>

        <p
          style={{
            fontSize: "1.05rem",
            color: "rgba(240,240,240,0.5)",
            lineHeight: 1.7,
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          Upload a clip. Get a score. Know what to fix. Free to start — no coach
          required.
        </p>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 transition-all duration-200"
          style={{
            backgroundColor: "#63ffb4",
            color: "#080808",
            fontWeight: 700,
            fontSize: "1rem",
            padding: "16px 36px",
            borderRadius: "14px",
            letterSpacing: "0.02em",
            boxShadow: "0 0 60px rgba(99,255,180,0.3)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "#4de8a0";
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = "0 0 80px rgba(99,255,180,0.45)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "#63ffb4";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 0 60px rgba(99,255,180,0.3)";
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Download on App Store
        </a>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "rgba(240,240,240,0.3)",
            marginTop: "1.2rem",
            letterSpacing: "0.06em",
          }}
        >
          FREE · 3 ANALYSES PER DAY · NO CREDIT CARD
        </p>
      </div>
    </section>
  );
}

/* =====================================================
   FOOTER
===================================================== */
function Footer() {
  return (
    <footer
      className="px-6 py-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 700,
          fontSize: "0.9rem",
          letterSpacing: "0.12em",
          color: "rgba(240,240,240,0.4)",
        }}
      >
        VIRTUSQ
      </span>

      <p
        style={{
          fontSize: "0.85rem",
          color: "rgba(240,240,240,0.25)",
        }}
      >
        © {new Date().getFullYear()} VirtusQ. All rights reserved.
      </p>

      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          color: "#63ffb4",
          textDecoration: "none",
          textTransform: "uppercase",
        }}
      >
        App Store →
      </a>
    </footer>
  );
}
