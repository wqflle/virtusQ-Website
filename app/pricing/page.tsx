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
      description: "Core AI analysis to get you started.",
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
      description: "Advanced insights for athletes levelling up.",
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
      description: "Full AI coaching suite for serious competitors.",
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
      description: "Full squad management and analytics for coaches and clubs.",
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

  const featureList: Feature[] = Object.keys(tiers[0].features) as Feature[];

  const featureSections: { label: string; features: Feature[] }[] = [
    {
      label: "Core Analysis",
      features: [
        "AI Skill Detection",
        "Basic Quality Feedback",
        "Elite Score Breakdown",
        "Performance Tier Tracking",
      ],
    },
    {
      label: "Advanced Coaching",
      features: [
        "Advanced Skill Breakdown",
        "Elite Coaching Insights",
        "Priority Model Updates",
        "Early Feature Access",
      ],
    },
    {
      label: "Club & Team Features",
      features: [
        "Multi-Athlete Management",
        "Squad Performance Dashboard",
        "Bulk Rep Analysis",
        "Coach Admin Portal",
        "Dedicated Support",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight">
            Choose Your Plan
          </h1>

          <p className="text-zinc-400 mt-6 text-lg">
            Unlock AI-powered volleyball performance intelligence.
          </p>

          <p className="text-zinc-500 mt-2 text-sm">
            All prices in AUD (Australian Dollars).
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex justify-center">
            <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                  billing === "monthly"
                    ? "bg-white text-black"
                    : "text-zinc-400"
                }`}
              >
                Monthly
              </button>

              <button
                onClick={() => setBilling("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                  billing === "yearly"
                    ? "bg-white text-black"
                    : "text-zinc-400"
                }`}
              >
                Yearly (2 Months Free)
              </button>
            </div>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {tiers.map((tier) => {
            const price =
              billing === "monthly" ? tier.priceMonthly : tier.priceYearly;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 border transition transform hover:scale-[1.02] flex flex-col ${
                  tier.highlight
                    ? "border-purple-500 bg-zinc-900 shadow-2xl shadow-purple-900/30"
                    : tier.name === "Club"
                    ? "border-amber-500/60 bg-zinc-900 shadow-xl shadow-amber-900/20"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                {tier.tag && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${
                      tier.highlight
                        ? "bg-purple-600 text-white"
                        : "bg-amber-500 text-black"
                    }`}
                  >
                    {tier.tag}
                  </span>
                )}

                <h2 className="text-2xl font-bold">{tier.name}</h2>

                <p className="text-zinc-500 text-sm mt-2 mb-6">
                  {tier.description}
                </p>

                <div className="mt-auto">
                  <div>
                    <span className="text-4xl font-black">A${price}</span>
                    <span className="text-zinc-400 ml-2">
                      {billing === "monthly" ? "/month" : "/year"}
                    </span>
                  </div>

                  {billing === "yearly" && tier.name !== "Free" && (
                    <p className="text-green-400 text-sm mt-2 font-semibold">
                      Save 2 months annually
                    </p>
                  )}

                  <Link
                    href="/download"
                    className={`mt-6 block text-center py-3 rounded-xl font-bold transition ${
                      tier.highlight
                        ? "bg-purple-600 hover:bg-purple-500"
                        : tier.name === "Club"
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {tier.name === "Club" ? "Contact Us" : "Get Started"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* FEATURE COMPARISON TABLE */}
        <div className="border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-5 bg-zinc-900 border-b border-zinc-800">
            <div className="p-6 font-bold text-zinc-400">Features</div>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 text-center font-bold ${
                  tier.highlight ? "text-purple-400" : tier.name === "Club" ? "text-amber-400" : ""
                }`}
              >
                {tier.name}
              </div>
            ))}
          </div>

          {featureSections.map((section) => (
            <div key={section.label}>
              {/* Section divider */}
              <div className="grid grid-cols-5 bg-zinc-950 border-b border-zinc-800">
                <div className="p-4 pl-6 text-xs font-extrabold tracking-widest text-zinc-500 uppercase col-span-5">
                  {section.label}
                </div>
              </div>

              {section.features.map((feature, index) => (
                <div
                  key={feature}
                  className={`grid grid-cols-5 border-b border-zinc-800 ${
                    index % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900"
                  }`}
                >
                  <div className="p-6 text-zinc-300">{feature}</div>
                  {tiers.map((tier) => (
                    <div key={tier.name} className="p-6 flex justify-center">
                      {tier.features[feature] ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-zinc-600" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CLUB CALLOUT */}
        <div className="mt-16 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-900/20 to-zinc-900 p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-amber-400">
                FOR CLUBS & COACHES
              </span>
              <h2 className="mt-4 text-3xl font-bold">
                Club Plan — A$200/month
              </h2>
              <p className="text-zinc-400 mt-4 max-w-xl leading-relaxed">
                Manage your entire squad from one coach portal. Analyse multiple athletes, track squad-wide performance trends, run bulk rep analysis, and get dedicated support. Built for clubs and coaching staff who want to bring AI-level analysis to every player on the roster.
              </p>
              <ul className="mt-6 space-y-2 text-zinc-300">
                <li className="flex items-center gap-2"><Check className="text-amber-400 w-4 h-4" /> Multi-athlete management</li>
                <li className="flex items-center gap-2"><Check className="text-amber-400 w-4 h-4" /> Squad performance dashboard</li>
                <li className="flex items-center gap-2"><Check className="text-amber-400 w-4 h-4" /> Bulk rep analysis across the whole team</li>
                <li className="flex items-center gap-2"><Check className="text-amber-400 w-4 h-4" /> Full coach admin portal</li>
                <li className="flex items-center gap-2"><Check className="text-amber-400 w-4 h-4" /> Dedicated support</li>
              </ul>
            </div>
            <div className="shrink-0">
              <Link
                href="/download"
                className="inline-block px-10 py-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-zinc-600 text-sm mt-10">
          All prices listed in AUD (Australian Dollars). Cancel anytime. No lock-in contracts.
        </p>

      </div>
    </main>
  );
}
