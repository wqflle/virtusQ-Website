"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Record Your Rep",
    headline: "Your phone is your coach's eye.",
    body: "Set your phone up so your full body is visible in the frame — ideally side-on or at a slight angle so the AI can read your posture and movement path clearly. You don't need a tripod, a gym, or special equipment. A wall, a chair, or a teammate holding your phone is enough. The better the angle and lighting, the more precise the analysis — but VirtusQ is built to work in real training conditions, not just perfect studios.",
    detail: "Supported skills include passing, setting, serving, spiking, and receiving. Film a single rep or a short sequence. VirtusQ processes each rep individually so you get clean, isolated feedback every time.",
    accent: "from-purple-500 to-blue-500",
  },
  {
    number: "02",
    title: "AI Pose Extraction",
    headline: "Every joint. Every frame. Every millisecond.",
    body: "The moment you submit your video, VirtusQ's computer vision model gets to work. It identifies and tracks the key biomechanical landmarks across your body — shoulders, hips, knees, ankles, elbows, wrists — frame by frame across the entire rep. This isn't a static snapshot. It's a full temporal analysis of how your body moves through space over time.",
    detail: "The system measures joint angles, limb alignment, centre of mass, postural balance, and timing relative to contact point or skill execution. Each of these dimensions is evaluated independently and then combined into a composite picture of your movement quality.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    number: "03",
    title: "Elite Score Generated",
    headline: "One number that tells the truth about your technique.",
    body: "Once pose extraction is complete, VirtusQ's sequence model evaluates the full movement — not just one frame, but the entire rep from start to finish. It scores your technique across multiple biomechanical dimensions and produces a single Elite Score from 0 to 100. This number reflects how close your movement pattern is to an elite execution of that skill.",
    detail: "The Elite Score isn't a guess or a general rating. It's calculated from the same biomechanical principles that sports scientists and elite coaches use to assess athlete technique — now automated, immediate, and available after every single rep you film.",
    accent: "from-purple-500 to-pink-500",
  },
  {
    number: "04",
    title: "Get Your Correction",
    headline: "Not twenty things to fix. The one thing that matters most.",
    body: "This is where VirtusQ is fundamentally different from any other feedback tool. Instead of overwhelming you with a list of issues, the AI identifies the single highest-impact correction available to you right now — the specific biomechanical adjustment that will produce the biggest improvement in your next rep. One clear cue. One targeted fix. One lever.",
    detail: "Over time, as you correct each issue and your Elite Score rises, VirtusQ identifies the next highest-impact correction to focus on. It's a progressive coaching system that meets you exactly where you are and continuously pushes you forward — the same way a world-class coach would, but available every time you train.",
    accent: "from-indigo-500 to-purple-500",
  },
];

const stats = [
  { value: "0–100", label: "Elite Score range, calibrated to real biomechanical standards" },
  { value: "4", label: "Performance tiers — Bronze, Silver, Gold, and Champion" },
  { value: "< 60s", label: "Time from video upload to full AI analysis and correction" },
  { value: "1", label: "High-impact coaching cue delivered per rep — no information overload" },
];

const faqs = [
  {
    q: "What skills can VirtusQ analyse?",
    a: "VirtusQ currently supports passing, setting, serving, spiking, and receiving. We're continuously expanding skill coverage based on athlete and coach feedback.",
  },
  {
    q: "Do I need any special equipment?",
    a: "No. Just your phone and a clear view of your full body in frame. No wearables, no external sensors, no special cameras required.",
  },
  {
    q: "How accurate is the AI scoring?",
    a: "VirtusQ's pose estimation and scoring models are built on biomechanical principles used by sports scientists and elite coaches. The system is continuously updated as we process more rep data and refine our models.",
  },
  {
    q: "Can coaches use VirtusQ with their team?",
    a: "Yes — the Club plan is built specifically for coaches and club programs. It includes multi-athlete management, a squad performance dashboard, bulk rep analysis, and a dedicated coach admin portal.",
  },
  {
    q: "What's the difference between Pro and Elite?",
    a: "Pro unlocks advanced skill breakdowns and performance tier tracking. Elite adds our deepest coaching insights, priority access to model updates, and early access to new features as they launch.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Ambient Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-600/20 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[800px] h-[800px] bg-blue-600/15 blur-[200px] rounded-full" />
      </div>

      <section className="px-6 pt-40 pb-32 max-w-6xl mx-auto">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400">
            HOW VIRTUSQ WORKS
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-tight">
            From video.
            <br />
            To elite correction.
          </h1>

          <p className="text-zinc-400 mt-8 text-lg leading-relaxed max-w-2xl">
            Most athletes never get honest, data-driven feedback on their technique. VirtusQ changes that. Film a rep, and within seconds you have a biomechanical score, a performance tier, and the single most impactful correction available to you right now.
          </p>

          <p className="text-zinc-500 mt-4 text-base leading-relaxed max-w-2xl">
            No coach needs to be in the room. No expensive lab equipment. Just your phone, your rep, and AI that actually understands volleyball movement.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/download"
              className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition shadow-xl text-center"
            >
              Download Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition text-center"
            >
              View Plans
            </Link>
          </div>
        </motion.div>

        {/* ── STATS BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((s) => (
            <div
              key={s.value}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-zinc-500 text-sm mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── STEPS ── */}
        <div className="mt-32 space-y-32">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-start gap-12`}
            >
              {/* Number + accent */}
              <div className="shrink-0 flex flex-col items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.accent} flex items-center justify-center text-2xl font-black shadow-[0_0_40px_rgba(139,92,246,0.5)]`}
                >
                  {step.number}
                </div>
                <div className="hidden md:block w-[2px] flex-1 bg-gradient-to-b from-purple-500/30 to-transparent min-h-[80px]" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
                <p className="text-xs font-extrabold tracking-[0.25em] text-purple-400 mb-3">
                  STEP {step.number}
                </p>
                <h3 className="text-3xl md:text-4xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-300 text-xl font-medium mb-6">
                  {step.headline}
                </p>
                <p className="text-zinc-400 leading-relaxed text-base mb-5">
                  {step.body}
                </p>
                <p className="text-zinc-500 leading-relaxed text-sm border-t border-white/10 pt-5">
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TECHNOLOGY SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-40 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-14 backdrop-blur-xl"
        >
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400">
            THE TECHNOLOGY
          </p>

          <h2 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight">
            Built on Computer Vision.
            <br />
            Designed for Real Athletes.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-3xl leading-relaxed text-lg">
            VirtusQ's analysis pipeline combines real-time pose estimation, temporal sequence modelling, and biomechanical scoring heuristics trained on volleyball-specific movement data. The system doesn't just detect that your arm is in a certain position — it understands how that position interacts with your posture, weight distribution, and timing to produce either a clean, controlled rep or a flawed one.
          </p>

          <p className="text-zinc-500 mt-5 max-w-3xl leading-relaxed text-base">
            This is the same class of technology used in professional sports analytics environments — now built into an app that works on the phone in your pocket. The focus isn't on overwhelming you with data. It's on giving you the right signal at the right moment so that every rep you put in is better than the last.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-2">Pose Estimation</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Identifies and tracks 17+ biomechanical landmarks across your body in every frame of your video — no markers or sensors needed.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-2">Sequence Modelling</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Evaluates movement quality across time, not just in a single frame — so it captures timing, velocity, and the flow of your technique through the skill.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-2">Biomechanical Scoring</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Translates raw movement data into a single 0–100 Elite Score using principles drawn from sports science and elite coaching methodology.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── PERFORMANCE TIERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400">
            PERFORMANCE TIERS
          </p>

          <h2 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight max-w-3xl">
            Know exactly where you stand.
            <br />
            Watch yourself climb.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl leading-relaxed text-lg">
            Your Elite Score doesn't just tell you how you performed on one rep — it feeds into a long-term performance tier that tracks your progression over days, weeks, and months of training. As your technique improves and your average score rises, you move through four tiers that mark real, measurable growth.
          </p>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              { tier: "Bronze", range: "0–49", desc: "Building the foundations of clean technique. Identifying and correcting the biggest movement faults.", color: "from-orange-700 to-orange-500" },
              { tier: "Silver", range: "50–69", desc: "Technique is taking shape. Consistency is improving and the fundamentals are becoming reliable.", color: "from-zinc-400 to-zinc-300" },
              { tier: "Gold", range: "70–84", desc: "High-quality movement. Your form would hold up at a competitive level. Fine-tuning is the focus.", color: "from-yellow-500 to-yellow-300" },
              { tier: "Champion", range: "85–100", desc: "Elite-level biomechanics. Movement quality is consistently close to the ceiling of what the AI can score.", color: "from-purple-500 to-pink-400" },
            ].map((t) => (
              <div
                key={t.tier}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className={`text-2xl font-black bg-gradient-to-r ${t.color} bg-clip-text text-transparent mb-1`}>
                  {t.tier}
                </div>
                <div className="text-zinc-500 text-xs font-bold tracking-widest mb-4">
                  SCORE {t.range}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32"
        >
          <p className="text-xs font-extrabold tracking-[0.3em] text-purple-400">
            COMMON QUESTIONS
          </p>

          <h2 className="mt-6 text-4xl font-semibold mb-12">
            Everything you need to know.
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h4 className="text-white font-semibold text-lg mb-3">{faq.q}</h4>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FINAL CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20 rounded-3xl p-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold">
            Stop guessing about your technique.
          </h2>

          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Every rep you film is data. Every correction moves you forward. Download VirtusQ free today and get your Elite Score after your very first rep — it takes less than a minute.
          </p>

          <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
            <Link
              href="/download"
              className="px-10 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition shadow-xl"
            >
              Download VirtusQ Free
            </Link>

            <Link
              href="/pricing"
              className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 font-semibold hover:bg-white/20 transition"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>

      </section>
    </main>
  );
}
