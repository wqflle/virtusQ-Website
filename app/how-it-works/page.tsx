"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Record Your Rep",
    desc: "Set your phone steady with your full body in frame. Lighting and camera angle directly improve AI precision.",
    accent: "from-purple-500 to-blue-500",
  },
  {
    title: "AI Pose Extraction",
    desc: "VirtusQ tracks biomechanical landmarks across time — measuring posture, alignment, velocity and timing.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    title: "Biomechanical Scoring",
    desc: "We evaluate rep cleanliness, stability, control, and timing consistency to generate your Elite Score.",
    accent: "from-purple-500 to-pink-500",
  },
  {
    title: "Elite Coaching Insight",
    desc: "Instead of overwhelming feedback — you get one high-impact correction. The lever that moves performance.",
    accent: "from-indigo-500 to-purple-500",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-600/20 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-blue-600/20 blur-[200px] rounded-full animate-pulse" />
      </div>

      <section className="px-6 pt-40 pb-32 max-w-6xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400">
            HOW VIRTUSQ WORKS
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            From video.
            <br />
            To elite correction.
          </h1>

          <p className="text-zinc-400 mt-8 text-lg leading-relaxed max-w-2xl">
            VirtusQ turns raw reps into actionable insight.
            Not just a score — a measurable path to performance.
          </p>
        </motion.div>

        {/* STEPS TIMELINE */}
        <div className="mt-24 relative">

          {/* Vertical Glow Line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/30 to-blue-500/30 blur-sm" />

          <div className="space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-12`}
              >
                {/* Step Number Circle */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.accent} flex items-center justify-center text-xl font-bold shadow-[0_0_30px_rgba(139,92,246,0.6)]`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:scale-[1.02] transition-all duration-500">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                    {step.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed text-lg">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TECH SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-40 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-14 backdrop-blur-xl"
        >
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400">
            TECHNOLOGY
          </p>

          <h2 className="mt-6 text-4xl font-semibold">
            Built on Computer Vision.
            <br />
            Designed for Real Athletes.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-3xl leading-relaxed text-lg">
            VirtusQ leverages real-time pose estimation, temporal sequence modeling,
            and scoring heuristics trained on rep-level data.
            The focus isn’t complexity — it’s clarity.
          </p>

          <p className="text-zinc-500 mt-6 max-w-3xl leading-relaxed">
            You don’t need 50 corrections. You need the right one.
            Faster iteration. Clear metrics. Real progression.
          </p>
        </motion.div>

        {/* FINAL CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-semibold">
            Ready to experience it?
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto">
            Start free. Upgrade when you’re ready to push into Elite.
          </p>

          <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
            <a
              href="/download"
              className="px-10 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition shadow-xl"
            >
              Download VirtusQ
            </a>

            <a
              href="/pricing"
              className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 font-semibold hover:bg-white/20 transition"
            >
              View Pricing
            </a>
          </div>
        </motion.div>

      </section>
    </main>
  );
}
