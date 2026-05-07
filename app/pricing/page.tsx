"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";

/* ================================
   Strong Feature Typing
================================ */

type Feature =
  | "AI Skill Detection"
  | "Basic Quality Feedback"
  | "Elite Score Breakdown"
  | "Performance Tier Tracking"
  | "Advanced Skill Breakdown"
  | "Elite Coaching Insights"
  | "Priority Model Updates"
  | "Early Feature Access";

type Tier = {
  name: string;
  priceMonthly: string;
  priceYearly: string;
  highlight: boolean;
  features: Record<Feature, boolean>;
};

export default function PricingPage() {
  const [billing, setBilling] =
    useState<"monthly" | "yearly">("monthly");

  const tiers: Tier[] = [
    {
      name: "Free",
      priceMonthly: "0",
      priceYearly: "0",
      highlight: false,
      features: {
        "AI Skill Detection": true,
        "Basic Quality Feedback": true,
        "Elite Score Breakdown": false,
        "Performance Tier Tracking": false,
        "Advanced Skill Breakdown": false,
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
        "Elite Score Breakdown": true,
        "Performance Tier Tracking": true,
        "Advanced Skill Breakdown": true,
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
      features: {
        "AI Skill Detection": true,
        "Basic Quality Feedback": true,
        "Elite Score Breakdown": true,
        "Performance Tier Tracking": true,
        "Advanced Skill Breakdown": true,
        "Elite Coaching Insights": true,
        "Priority Model Updates": true,
        "Early Feature Access": true,
      },
    },
  ];

  const featureList: Feature[] = Object.keys(
    tiers[0].features
  ) as Feature[];

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black tracking-tight">
            Choose Your Plan
          </h1>

          <p className="text-zinc-400 mt-6 text-lg">
            Unlock AI-powered volleyball performance intelligence.
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

        {/* ================= PRICING CARDS ================= */}

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {tiers.map((tier) => {
            const price =
              billing === "monthly"
                ? tier.priceMonthly
                : tier.priceYearly;

            return (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 border transition transform hover:scale-[1.02] ${
                  tier.highlight
                    ? "border-purple-500 bg-zinc-900 shadow-2xl shadow-purple-900/30"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <h2 className="text-2xl font-bold">
                  {tier.name}
                </h2>

                <div className="mt-6">
                  <span className="text-4xl font-black">
                    ${price}
                  </span>
                  <span className="text-zinc-400 ml-2">
                    {billing === "monthly"
                      ? "/month"
                      : "/year"}
                  </span>
                </div>

                {billing === "yearly" &&
                  tier.name !== "Free" && (
                    <p className="text-green-400 text-sm mt-2 font-semibold">
                      Save 2 months annually
                    </p>
                  )}

                <Link
                  href="/download"
                  className={`mt-8 block text-center py-3 rounded-xl font-bold transition ${
                    tier.highlight
                      ? "bg-purple-600 hover:bg-purple-500"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            );
          })}
        </div>

        {/* ================= FEATURE COMPARISON ================= */}

        <div className="border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 bg-zinc-900 border-b border-zinc-800">
            <div className="p-6 font-bold text-zinc-400">
              Features
            </div>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="p-6 text-center font-bold"
              >
                {tier.name}
              </div>
            ))}
          </div>

          {featureList.map((feature, index) => (
            <div
              key={feature}
              className={`grid grid-cols-4 border-b border-zinc-800 ${
                index % 2 === 0
                  ? "bg-zinc-950"
                  : "bg-zinc-900"
              }`}
            >
              <div className="p-6 text-zinc-300">
                {feature}
              </div>

              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="p-6 flex justify-center"
                >
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

      </div>
    </main>
  );
}
