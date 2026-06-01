"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";

type Feature =
  | "AI Skill Detection"
  | "Basic Quality Feedback"
  | "Elite Score Breakdown"
  | "Performance Tier Tracking"
  | "Advanced Skill Breakdown"
  | "Elite Coaching Insights"
  | "Priority Model Updates"
  | "Early Feature Access"
  | "Multi-Athlete Management"
  | "Squad Performance Dashboard"
  | "Bulk Rep Analysis"
  | "Coach Admin Portal"
  | "Dedicated Support";

type Tier = {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  highlight: boolean;
  tag?: string;
  tagline: string;
  description: string;
  features: Record<Feature, boolean>;
};

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const tiers: Tier[] = [
    {
      name: "Free",
      priceMonthly: "0",
      priceYearly: "0",
      highlight: false,
      tagline: "Start analysing your technique today.",
      description:
        "Free gives you access to VirtusQ's core AI analysis — no credit card, no commitment. Film a rep, get a score, see where you stand. It's the fastest way to find out exactly how your technique measures up against elite biomechanical standards.",
      features: {
        "AI Skill Detection": true,
        "Basic Quality Feedback": true,
        "Elite Score Breakdown": false,
        "Performance Tier Tracking": false,
        "Advanced Skill Breakdown": false,
        "Elite Coaching Insights": false,
        "Priority Model Updates": false,
        "Early Feature Access": false,
        "Multi-Athlete Management": false,
        "Squad Performance Dashboard": false,
        "Bulk Rep Analysis": false,
        "Coach Admin Portal": false,
        "Dedicated Support": false,
      },
    },
    {
      name: "Pro",
      priceMonthly: "15",
      priceYearly: "150",
      highlight: false,
      tagline: "For athletes serious about measurable progress.",
      description:
        "Pro unlocks the full performance tracking stack — detailed skill breakdowns, tier progression, and your Elite Score history over time. You'll understand not just how you performed, but how you're improving across every session. Built for players who want to see real, data-driven development.",
      features: {
        "AI Skill Detection": true,
        "Basic Quality Feedback": true,
        "Elite Score Breakdown": true,
        "Performance Tier Tracking": true,
        "Advanced Skill Breakdown": true,
        "Elite Coaching Insights": false,
        "Priority Model Updates": false,
        "Early Feature Access": false,
        "Multi-Athlete Management": false,
        "Squad Performance Dashboard": false,
        "Bulk Rep Analysis": false,
        "Coach Admin Portal": false,
        "Dedicated Support": false,
      },
    },
    {
      name: "Elite",
      priceMonthly: "25",
      priceYearly: "250",
      highlight: true,
      tag: "Most Popular",
      tagline: "The full AI coaching experience.",
      description:
        "Elite is the complete package. On top of everything in Pro, you get our deepest coaching insights — the kind of targeted, high-impact feedback that used to require a private coach. Plus priority access to model updates and early entry to every new feature we ship. For athletes who want every possible edge.",
      features: {
        "AI Skill Detection": true,
        "Basic Quality Feedback": true,
        "Elite Score Breakdown": true,
        "Performance Tier Tracking": true,
        "Advanced Skill Breakdown": true,
        "Elite Coaching Insights": true,
        "Priority Model Updates": true,
        "Early Feature Access": true,
        "Multi-Athlete Management": false,
        "Squad Performance Dashboard": false,
        "Bulk Rep Analysis": false,
        "Coach Admin Portal": false,
        "Dedicated Support": false,
      },
    },
    {
      name: "Club",
      priceMonthly: "200",
      priceYearly: "2000",
      highlight: false,
      tag: "For Teams",
      tagline: "AI coaching for your entire squad.",
      description:
        "Club is built for coaches and volleyball programs that want to bring AI-level analysis to every player on the roster. Manage multiple athletes from a single portal, track squad-wide performance trends, run bulk rep analysis across your whole team, and get dedicated support from our team. Everything in Elite — multiplied across your entire program.",
      features: {
        "AI Skill Detection": true,
        "Basic Quality Feedback": true,
        "Elite Score Breakdown": true,
        "Performance Tier Tracking": true,
        "Advanced Skill Breakdown": true,
        "Elite Coaching Insights": true,
        "Priority Model Updates": true,
        "Early Feature Access": true,
        "Multi-Athlete Management": true,
        "Squad Performance Dashboard": true,
        "Bulk Rep Analysis": true,
        "Coach Admin Portal": true,
        "Dedicated Support": true,
      },
    },
  ];

  const featureSections: { label: string; sublabel: string; features: Feature[] }[] = [
    {
      label: "Core Analysis",
      sublabel: "Available on every plan",
      features: [
        "AI Skill Detection",
        "Basic Quality Feedback",
        "Elite Score Breakdown",
        "Performance Tier Tracking",
      ],
    },
    {
      label: "Advanced Coaching",
      sublabel: "Pro and above",
      features: [
        "Advanced Skill Breakdown",
        "Elite Coaching Insights",
        "Priority Model Updates",
        "Early Feature Access",
      ],
    },
    {
      label: "Club & Team Features",
      sublabel: "Club plan only",
      features: [
        "Multi-Athlete Management",
        "Squad Performance Dashboard",
        "Bulk Rep Analysis",
        "Coach Admin Portal",
        "Dedicated Support",
      ],
    },
  ];

  const featureDescriptions: Record<Feature, string> = {
    "AI Skill Detection": "Identifies and analyses your volleyball skill in each video using computer vision pose estimation.",
    "Basic Quality Feedback": "Clear, readable output on your rep quality including your Elite Score and primary movement observations.",
    "Elite Score Breakdown": "Full breakdown of how your score was calculated across individual biomechanical dimensions.",
    "Performance Tier Tracking": "Tracks your average Elite Score over time and places you in Bronze, Silver, Gold, or Champion tier.",
    "Advanced Skill Breakdown": "Deep per-skill analysis showing strengths and weaknesses across every measured movement dimension.",
    "Elite Coaching Insights": "The single highest-impact correction for your technique — identified by the AI and delivered after each rep.",
    "Priority Model Updates": "Your app is updated first when we ship improvements to our AI scoring and analysis models.",
    "Early Feature Access": "Be the first to use new skills, features, and tools as we build them.",
    "Multi-Athlete Management": "Add and manage multiple athletes from a single coach account. Track each player individually.",
    "Squad Performance Dashboard": "Birds-eye view of your entire squad's performance tiers, Elite Scores, and improvement trends.",
    "Bulk Rep Analysis": "Submit and process reps across your whole team simultaneously — no bottleneck during sessions.",
    "Coach Admin Portal": "Dedicated coach interface for reviewing athlete sessions, flagging reps, and managing your program.",
    "Dedicated Support": "Direct line to our team for onboarding, technical support, and program setup assistance.",
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-purple-600/15 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[700px] h-[700px] bg-blue-600/10 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">

        {/* ── HEADER ── */}
        <div className="text-center mb-20">
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400 mb-6">
            PRICING
          </p>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Start Free.
            <br />
            Unlock Elite When You're Ready.
          </h1>

          <p className="text-zinc-400 mt-8 text-lg max-w-2xl mx-auto leading-relaxed">
            VirtusQ is free to download and use. Every plan is built around one goal — giving you access to the most accurate, actionable volleyball technique feedback available. No lock-in contracts. Cancel anytime.
          </p>

          <p className="text-zinc-600 mt-3 text-sm">
            All prices in AUD (Australian Dollars).
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex justify-center">
            <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                  billing === "monthly" ? "bg-white text-black" : "text-zinc-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                  billing === "yearly" ? "bg-white text-black" : "text-zinc-400"
                }`}
              >
                Yearly — 2 Months Free
              </button>
            </div>
          </div>
        </div>

        {/* ── PRICING CARDS ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => {
            const price = billing === "monthly" ? tier.priceMonthly : tier.priceYearly;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 border flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                  tier.highlight
                    ? "border-purple-500 bg-zinc-900 shadow-2xl shadow-purple-900/40"
                    : tier.name === "Club"
                    ? "border-amber-500/50 bg-zinc-900 shadow-xl shadow-amber-900/20"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                {tier.tag && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-4 py-1 rounded-full ${
                      tier.highlight
                        ? "bg-purple-600 text-white"
                        : "bg-amber-500 text-black"
                    }`}
                  >
                    {tier.tag}
                  </span>
                )}

                <div>
                  <h2 className="text-2xl font-black">{tier.name}</h2>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      tier.highlight
                        ? "text-purple-400"
                        : tier.name === "Club"
                        ? "text-amber-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {tier.tagline}
                  </p>
                  <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div>
                    <span className="text-4xl font-black">A${price}</span>
                    <span className="text-zinc-400 ml-2 text-sm">
                      {billing === "monthly" ? "/month" : "/year"}
                    </span>
                  </div>

                  {billing === "yearly" && tier.name !== "Free" && (
                    <p className="text-green-400 text-xs mt-1 font-semibold">
                      2 months free vs monthly
                    </p>
                  )}

                  <Link
                    href="/download"
                    className={`mt-5 block text-center py-3 rounded-xl font-bold transition text-sm ${
                      tier.highlight
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : tier.name === "Club"
                        ? "bg-amber-500 hover:bg-amber-400 text-black"
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {tier.name === "Free"
                      ? "Download Free"
                      : tier.name === "Club"
                      ? "Get in Touch"
                      : "Get Started"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-zinc-600 text-sm mb-24">
          All plans can be cancelled at any time. No lock-in. No hidden fees.
        </p>

        {/* ── FEATURE COMPARISON TABLE ── */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-center mb-2">Compare Every Feature</h2>
          <p className="text-zinc-500 text-center text-sm mb-12">
            Hover over any feature name to see what it includes.
          </p>
        </div>

        <div className="border border-zinc-800 rounded-2xl overflow-hidden mb-20">
          {/* Header */}
          <div className="grid grid-cols-5 bg-zinc-900 border-b border-zinc-800">
            <div className="p-6 font-bold text-zinc-500 text-sm">Feature</div>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 text-center font-black text-sm ${
                  tier.highlight
                    ? "text-purple-400"
                    : tier.name === "Club"
                    ? "text-amber-400"
                    : "text-white"
                }`}
              >
                {tier.name}
              </div>
            ))}
          </div>

          {featureSections.map((section) => (
            <div key={section.label}>
              <div className="col-span-5 grid grid-cols-5 bg-black border-b border-zinc-800">
                <div className="col-span-5 px-6 py-3 flex items-baseline gap-3">
                  <span className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase">
                    {section.label}
                  </span>
                  <span className="text-xs text-zinc-600">{section.sublabel}</span>
                </div>
              </div>

              {section.features.map((feature, index) => (
                <div
                  key={feature}
                  className={`grid grid-cols-5 border-b border-zinc-800 group ${
                    index % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/60"
                  }`}
                >
                  <div className="p-5 pl-6">
                    <div className="text-zinc-300 text-sm font-medium">{feature}</div>
                    <div className="text-zinc-600 text-xs mt-1 leading-snug max-w-xs">
                      {featureDescriptions[feature]}
                    </div>
                  </div>
                  {tiers.map((tier) => (
                    <div key={tier.name} className="p-5 flex justify-center items-center">
                      {tier.features[feature] ? (
                        <Check
                          className={`w-5 h-5 ${
                            tier.highlight
                              ? "text-purple-400"
                              : tier.name === "Club"
                              ? "text-amber-400"
                              : "text-green-500"
                          }`}
                        />
                      ) : (
                        <X className="w-5 h-5 text-zinc-700" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── CLUB CALLOUT ── */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-900/15 via-zinc-900 to-zinc-900 p-12 mb-20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div className="flex-1">
              <p className="text-xs font-extrabold tracking-[0.3em] text-amber-400 mb-4">
                FOR CLUBS & COACHES
              </p>
              <h2 className="text-4xl font-black mb-4">
                Club Plan — A$200/month
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg max-w-2xl mb-6">
                Quality coaching analysis has always been available to elite programs with large budgets and full-time technical staff. The VirtusQ Club plan changes that. For A$200/month, your entire squad gets access to AI-powered biomechanical analysis — the same technology, the same scoring engine, now operating at club scale.
              </p>
              <p className="text-zinc-500 leading-relaxed text-base max-w-2xl mb-8">
                Whether you're running a junior development program, a high school team, or a competitive club, the Club plan gives you and your coaching staff a centralised hub to manage players, monitor technique trends, and make data-driven decisions about where to focus your training.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Multi-Athlete Management", desc: "Add every player to your account and track their individual progress from a single dashboard." },
                  { title: "Squad Performance Dashboard", desc: "See your entire team's Elite Scores, tier placements, and improvement trends at a glance." },
                  { title: "Bulk Rep Analysis", desc: "Submit reps from your whole squad simultaneously — no queuing, no waiting during busy training sessions." },
                  { title: "Coach Admin Portal", desc: "A dedicated coach interface for reviewing athlete sessions, flagging key reps, and annotating feedback." },
                  { title: "Dedicated Support", desc: "Direct access to our team for onboarding, technical help, and making sure your program is set up right." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 items-start">
                    <Check className="text-amber-400 w-4 h-4 mt-1 shrink-0" />
                    <div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-zinc-500 text-xs mt-1 leading-snug">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 text-center lg:text-right">
              <div className="text-5xl font-black text-amber-400 mb-1">A$200</div>
              <div className="text-zinc-500 text-sm mb-6">/month · AUD · cancel anytime</div>
              <Link
                href="/download"
                className="inline-block px-10 py-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition text-base"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-24">
          <h2 className="text-3xl font-black text-center mb-12">Pricing Questions</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I switch plans at any time?",
                a: "Yes. You can upgrade or downgrade your plan at any time through the app. Changes take effect at your next billing cycle.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "The Free plan lets you experience VirtusQ's core AI analysis before committing to a paid tier. You can upgrade whenever you're ready.",
              },
              {
                q: "What currency are the prices in?",
                a: "All prices are listed in AUD (Australian Dollars). We're an Australian product and pricing reflects that.",
              },
              {
                q: "What happens if I cancel?",
                a: "You retain access to your plan until the end of your current billing period. After that, you drop to the Free tier — you never lose your account or your history.",
              },
              {
                q: "Is the Club plan billed per athlete?",
                a: "No. The Club plan is a flat A$200/month fee that covers your entire squad — no per-seat charges, no surprises.",
              },
              {
                q: "Do you offer discounts for schools or academies?",
                a: "We work with schools and academies on a case-by-case basis. Get in touch via the Club plan to discuss your program.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7"
              >
                <h4 className="text-white font-bold mb-3">{faq.q}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div className="text-center bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20 rounded-3xl p-16">
          <h2 className="text-4xl md:text-5xl font-black">
            Ready to see your Elite Score?
          </h2>
          <p className="text-zinc-400 mt-6 max-w-xl mx-auto text-lg leading-relaxed">
            Download VirtusQ free and get your first AI analysis in under a minute. No credit card required. Upgrade when you're ready.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download"
              className="px-10 py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition shadow-xl"
            >
              Download Free
            </Link>
            <Link
              href="/how-it-works"
              className="px-10 py-4 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-zinc-600 text-xs mt-6">
            All prices in AUD. Cancel anytime. No lock-in contracts.
          </p>
        </div>

      </div>
    </main>
  );
}
