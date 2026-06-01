"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const reasons = [
  {
    icon: "🎯",
    title: "Instant biomechanical scoring",
    desc: "Every rep you film is scored from 0 to 100 using real pose data — not a rough estimate, a precise biomechanical evaluation of your actual movement.",
  },
  {
    icon: "🧠",
    title: "One high-impact correction per rep",
    desc: "Instead of a wall of feedback that overwhelms you, VirtusQ identifies the single most important fix available to you right now and delivers it clearly.",
  },
  {
    icon: "📈",
    title: "Performance tier progression",
    desc: "Track your growth through Bronze, Silver, Gold, and Champion tiers. Watch your average Elite Score climb as your technique improves over time.",
  },
  {
    icon: "🎥",
    title: "No equipment needed",
    desc: "All you need is your phone. No wearables, no sensors, no external cameras. Just film your rep and let the AI do the rest.",
  },
  {
    icon: "⚡",
    title: "Results in under 60 seconds",
    desc: "From the moment you submit your video to receiving your Elite Score and coaching cue — the whole process takes less than a minute.",
  },
  {
    icon: "🏐",
    title: "Built specifically for volleyball",
    desc: "VirtusQ isn't a generic sports app. It's built around volleyball biomechanics — passes, sets, serves, spikes, and receives — with sport-specific scoring models.",
  },
];

const steps = [
  {
    number: "01",
    title: "Download the app",
    desc: "VirtusQ is free to download on iOS. Get it from the App Store in seconds — no sign-up required to start.",
  },
  {
    number: "02",
    title: "Film your first rep",
    desc: "Set your phone up with your full body in frame. Side-on or a slight angle works best. Film one clean rep of any skill.",
  },
  {
    number: "03",
    title: "Get your Elite Score",
    desc: "Within seconds, VirtusQ analyses your movement and delivers your biomechanical score, your performance tier, and your single most important correction.",
  },
  {
    number: "04",
    title: "Track your improvement",
    desc: "Every rep you film is saved to your history. Watch your scores trend upward and your tier climb as you apply the corrections and train smarter.",
  },
];

export default function DownloadPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-600/20 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-blue-600/15 blur-[200px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="px-6 pt-40 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* Left: Copy */}
          <div className="flex-1 max-w-2xl">
            <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400 mb-6">
              DOWNLOAD VIRTUSQ
            </p>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-tight">
              Train Smarter.
              <br />
              Perform Elite.
            </h1>

            <p className="text-zinc-400 mt-8 text-lg leading-relaxed">
              VirtusQ is the AI volleyball coaching app that fits in your pocket. Film a rep from practice, the gym, or your backyard — and get back a biomechanical score, a performance tier placement, and the single most impactful correction to your technique. All in under a minute.
            </p>

            <p className="text-zinc-500 mt-4 text-base leading-relaxed">
              It's free to download. No credit card. No commitment. Just film your first rep and see exactly where you stand.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="https://apps.apple.com/au/app/virtusq/id6761644948"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition shadow-xl text-base"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on App Store
              </a>

              <a
                href="#"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition text-base"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l13.12-7.57-2.83-2.83-11.28 10.2zM.5 1.1C.19 1.42 0 1.9 0 2.53v18.94c0 .63.19 1.11.5 1.43l.07.07 10.61-10.61v-.25L.57 1.03l-.07.07zM20.67 10.03l-2.83-1.63-3.17 3.17 3.17 3.17 2.85-1.64c.81-.47.81-1.23-.02-1.67zM4.17.24L17.29 7.8l-2.83 2.83L3.18.47c.35-.4.7-.43.99-.23z" />
                </svg>
                Coming Soon on Google Play
              </a>
            </div>

            <p className="text-zinc-600 text-xs mt-5">
              iOS available now · Android coming soon · Free to download
            </p>
          </div>

          {/* Right: Phone Carousel */}
          <div className="shrink-0 flex justify-center">
            <DeviceCarousel />
          </div>
        </div>
      </section>

      {/* ── WHY VIRTUSQ ── */}
      <section className="px-6 py-24 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="text-center mb-16">
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400 mb-4">
            WHY VIRTUSQ
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Everything you need to train right.
          </h2>
          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Most athletes train hard. Very few train with accurate feedback. VirtusQ closes that gap — giving every serious volleyball player access to the kind of precise, biomechanical technique analysis that used to be reserved for elite programs with full-time coaching staff.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{r.icon}</div>
              <h3 className="text-white font-bold text-lg mb-3">{r.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW TO GET STARTED ── */}
      <section className="px-6 py-24 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="text-center mb-16">
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400 mb-4">
            GETTING STARTED
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold">
            Your first Elite Score in four steps.
          </h2>
          <p className="text-zinc-400 mt-6 max-w-xl mx-auto text-lg">
            From download to your first AI coaching cue in under five minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="text-4xl font-black text-purple-500/40 mb-4">
                {step.number}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLANS TEASER ── */}
      <section className="px-6 py-24 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400 mb-4">
              PLANS & PRICING
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Free to start.
              <br />
              Elite when you're ready.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-5">
              The Free plan gives you everything you need to get started — AI skill detection, your Elite Score, and basic quality feedback on every rep. When you're ready to go deeper, Pro and Elite unlock advanced coaching insights, detailed skill breakdowns, tier tracking, and more.
            </p>
            <p className="text-zinc-500 text-base leading-relaxed mb-8">
              Coaching staff and club programs can access the Club plan at A$200/month — built for multi-athlete management, squad dashboards, and bulk rep analysis across your entire team.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition"
            >
              View All Plans →
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { name: "Free", price: "A$0", desc: "Core AI scoring and basic feedback. Free forever." },
              { name: "Pro", price: "A$15/mo", desc: "Advanced breakdowns, tier tracking, and full score history." },
              { name: "Elite", price: "A$25/mo", desc: "Full coaching insights, priority updates, and early access." },
              { name: "Club", price: "A$200/mo", desc: "Squad management, bulk analysis, and coach admin portal." },
            ].map((plan) => (
              <div
                key={plan.name}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >
                <div className="text-white font-black text-lg mb-1">{plan.name}</div>
                <div className="text-purple-400 font-bold text-sm mb-3">{plan.price}</div>
                <p className="text-zinc-500 text-xs leading-snug">{plan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20 rounded-3xl p-16">
          <h2 className="text-4xl md:text-5xl font-semibold">
            Download free.
            <br />
            See your score in 60 seconds.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-xl mx-auto text-lg leading-relaxed">
            No credit card. No commitment. Just download, film one rep, and see exactly where your technique stands against elite biomechanical standards.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://apps.apple.com/au/app/virtusq/id6761644948"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition shadow-xl"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </a>

            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition"
            >
              See How It Works
            </Link>
          </div>

          <p className="text-zinc-600 text-xs mt-6">
            iOS available now · Android coming soon · All prices in AUD
          </p>
        </div>
      </section>

    </main>
  );
}

/* ── DEVICE CAROUSEL ── */

function DeviceCarousel() {
  const screens = [
    {
      src: "/screens/analysisresults.jpg",
      title: "Instant AI Analysis",
      desc: "Biomechanical breakdown with Elite Score in seconds.",
    },
    {
      src: "/screens/historyScreen.jpg",
      title: "Track Every Rep",
      desc: "Monitor progress, confidence, and performance trends.",
    },
    {
      src: "/screens/profileScreen.jpg",
      title: "Performance Identity",
      desc: "Your evolving tier. Your average Elite Score. Your growth.",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % screens.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [screens.length]);

  return (
    <div className="relative w-[300px] md:w-[360px]">
      {/* Glow */}
      <div className="absolute inset-0 bg-purple-600/30 blur-[120px] rounded-full -z-10 animate-pulse" />

      {/* Phone Frame */}
      <div className="relative rounded-[50px] p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.35)]">
        <div className="relative overflow-hidden rounded-[36px] bg-black aspect-[9/19]">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              width: `${screens.length * 100}%`,
              transform: `translateX(-${index * (100 / screens.length)}%)`,
            }}
          >
            {screens.map((screen) => (
              <div
                key={screen.src}
                className="relative h-full"
                style={{ width: `${100 / screens.length}%` }}
              >
                <Image
                  src={screen.src}
                  alt={screen.title}
                  fill
                  sizes="(max-width: 768px) 300px, 360px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          {screens[index].title}
        </h3>
        <p className="text-zinc-400 mt-3 text-sm max-w-xs mx-auto">
          {screens[index].desc}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-5">
        {screens.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "bg-purple-500 w-6" : "bg-white/30 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
