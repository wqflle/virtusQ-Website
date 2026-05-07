"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/au/app/virtusq/id6761644948";

type Feature =
  | "AI Skill Detection"
  | "Basic Quality Feedback"
  | "3 Analyses Per Day"
  | "Elite Score Breakdown"
  | "Performance Tier Tracking"
  | "Advanced Skill Breakdown"
  | "Unlimited Analyses"
  | "Elite Coaching Insights"
  | "Priority Model Updates"
  | "Early Feature Access";

type Tier = {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  highlight: boolean;
  tag?: string;
  features: Record<Feature, boolean>;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    priceMonthly: "0",
    priceYearly: "0",
    highlight: false,
    features: {
      "AI Skill Detection": true,
      "Basic Quality Feedback": true,
      "3 Analyses Per Day": true,
      "Elite Score Breakdown": false,
      "Performance Tier Tracking": false,
      "Advanced Skill Breakdown": false,
      "Unlimited Analyses": false,
      "Elite Coaching Insights": false,
      "Priority Model Updates": false,
      "Early Feature Access": false,
    },
  },
  {
    name: "Pro",
    priceMonthly: "15",
    priceYearly: "150",
    highlight: false,
    features: {
      "AI Skill Detection": true,
      "Basic Quality Feedback": true,
      "3 Analyses Per Day": true,
      "Elite Score Breakdown": true,
      "Performance Tier Tracking": true,
      "Advanced Skill Breakdown": true,
      "Unlimited Analyses": true,
      "Elite Coaching Insights": false,
      "Priority Model Updates": false,
      "Early Feature Access": false,
    },
  },
  {
    name: "Elite",
    priceMonthly: "25",
    priceYearly: "250",
    highlight: true,
    tag: "Most Popular",
    features: {
      "AI Skill Detection": true,
      "Basic Quality Feedback": true,
      "3 Analyses Per Day": true,
      "Elite Score Breakdown": true,
      "Performance Tier Tracking": true,
      "Advanced Skill Breakdown": true,
      "Unlimited Analyses": true,
      "Elite Coaching Insights": true,
      "Priority Model Updates": true,
      "Early Feature Access": true,
    },
  },
];

const FEATURE_LIST: Feature[] = Object.keys(TIERS[0].features) as Feature[];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

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

      <section className="pt-44 pb-32 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", color: "#63ffb4", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Pricing
          </p>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400, color: "#f0f0f0",
              lineHeight: 1.05, marginBottom: "1.2rem",
            }}
          >
            Choose your plan.
          </h1>
          <p style={{ fontSize: "1.05rem", color: "rgba(240,240,240,0.5)", maxWidth: "420px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            Unlock AI-powered volleyball performance intelligence.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "999px",
              padding: "4px",
            }}
          >
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: billing === b ? "#63ffb4" : "transparent",
                  color: billing === b ? "#080808" : "rgba(240,240,240,0.5)",
                }}
              >
                {b === "monthly" ? "MONTHLY" : "YEARLY — 2 MONTHS FREE"}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {TIERS.map((tier) => {
            const price = billing === "monthly" ? tier.priceMonthly : tier.priceYearly;
            return (
              <div
                key={tier.name}
                style={{
                  borderRadius: "20px",
                  padding: "28px",
                  backgroundColor: tier.highlight ? "rgba(99,255,180,0.06)" : "rgba(255,255,255,0.03)",
                  border: tier.highlight ? "1px solid rgba(99,255,180,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  position: "relative",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {tier.tag && (
                  <div
                    style={{
                      position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                      backgroundColor: "#63ffb4", color: "#080808",
                      fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                      fontWeight: 700, letterSpacing: "0.08em",
                      padding: "4px 14px", borderRadius: "999px",
                    }}
                  >
                    {tier.tag.toUpperCase()}
                  </div>
                )}

                <h2
                  style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.85rem",
                    letterSpacing: "0.1em", color: tier.highlight ? "#63ffb4" : "rgba(240,240,240,0.6)",
                    fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase",
                  }}
                >
                  {tier.name}
                </h2>

                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "3rem", color: "#f0f0f0" }}>
                    ${price}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(240,240,240,0.4)", marginLeft: "6px" }}>
                    {billing === "monthly" ? "/month" : "/year"}
                  </span>
                  {billing === "yearly" && tier.name !== "Free" && (
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#63ffb4", marginTop: "6px", letterSpacing: "0.06em" }}>
                      SAVE 2 MONTHS
                    </p>
                  )}
                </div>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "12px", borderRadius: "12px",
                    fontWeight: 700, fontSize: "0.9rem",
                    textDecoration: "none", transition: "all 0.2s",
                    backgroundColor: tier.highlight ? "#63ffb4" : "rgba(255,255,255,0.06)",
                    color: tier.highlight ? "#080808" : "#f0f0f0",
                    border: tier.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (tier.highlight) (e.currentTarget as HTMLElement).style.backgroundColor = "#4de8a0";
                    else (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    if (tier.highlight) (e.currentTarget as HTMLElement).style.backgroundColor = "#63ffb4";
                    else (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  Get Started
                </a>
              </div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <div
          style={{
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-4"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px" }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(240,240,240,0.4)", textTransform: "uppercase" }}>
              Features
            </div>
            {TIERS.map((t) => (
              <div key={t.name} style={{ textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.08em", fontWeight: 700, color: t.highlight ? "#63ffb4" : "rgba(240,240,240,0.6)", textTransform: "uppercase" }}>
                {t.name}
              </div>
            ))}
          </div>

          {FEATURE_LIST.map((feature, i) => (
            <div
              key={feature}
              className="grid grid-cols-4"
              style={{
                padding: "14px 20px",
                backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                borderBottom: i < FEATURE_LIST.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "rgba(240,240,240,0.65)" }}>{feature}</div>
              {TIERS.map((t) => (
                <div key={t.name} className="flex justify-center items-center">
                  {t.features[feature]
                    ? <Check size={16} color="#63ffb4" />
                    : <X size={16} color="rgba(255,255,255,0.15)" />
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
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
