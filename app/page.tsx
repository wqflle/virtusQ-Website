import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VirtusQ | AI Volleyball Form Analysis & Coaching App",
  description:
    "VirtusQ uses AI to analyse your volleyball technique in real time. Get instant biomechanical scoring, elite-level feedback, and track your improvement. Free to download.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black opacity-80" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700 opacity-30 blur-[150px]" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fadeUp">

        {/* HERO */}
        <section className="max-w-4xl py-32">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Your Volleyball Coach Is Now Powered by AI.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Film your rep. Get instant biomechanical scoring and elite-level technique corrections — in seconds. VirtusQ is the AI volleyball performance app built for athletes who are serious about getting better.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download"
              className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold hover:bg-purple-500 transition"
            >
              Download Free
            </Link>

            <Link
              href="/how-it-works"
              className="rounded-xl border border-gray-600 px-8 py-4 text-lg font-semibold hover:border-white transition"
            >
              See How It Works
            </Link>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="max-w-4xl w-full py-24 border-t border-gray-800 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Most Athletes Train Hard. Few Train Right.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            You can put in the hours, but if your technique is off, you're reinforcing the wrong movement patterns every single rep. Bad form doesn't just limit your performance — it puts you at risk of injury.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            The problem is that quality coaching is expensive, hard to access, and only available when your coach is in the room. VirtusQ changes that. Now you get elite-level technique analysis every time you train — whether you're at practice, in the gym, or training solo at 10pm.
          </p>
        </section>

        {/* WHAT IT DOES */}
        <section className="max-w-6xl w-full py-24 border-t border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            AI That Actually Understands Volleyball
          </h2>
          <p className="text-gray-400 text-lg text-center max-w-3xl mx-auto mb-16">
            VirtusQ uses computer vision and biomechanical pose estimation to analyse your movement frame by frame. It tracks joint positioning, alignment, timing, and movement quality — then generates an Elite Score from 0 to 100 so you always know exactly where you stand.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <div className="text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">AI Technique Scoring</h3>
              <p className="text-gray-400">
                Every rep scored from 0–100 using real biomechanical pose data. Know exactly how good your form is — not just whether it "looked okay."
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <div className="text-2xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Progress Tier Tracking</h3>
              <p className="text-gray-400">
                Move through Bronze, Silver, Gold, and Champion tiers as your technique improves. Visualise your development over days, weeks, and months.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <div className="text-2xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3">Personalised Coaching Feedback</h3>
              <p className="text-gray-400">
                Instead of 20 corrections that overwhelm you, VirtusQ gives you the one high-impact fix that will move your performance the most.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <div className="text-2xl mb-4">🎥</div>
              <h3 className="text-xl font-semibold mb-3">Works With Your Phone</h3>
              <p className="text-gray-400">
                No expensive equipment. No wearables. Just your phone camera and your game. Film your pass, set, spike, or serve and let the AI do the rest.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-5xl w-full py-24 border-t border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            From Video to Elite Feedback in Seconds
          </h2>

          <div className="space-y-10 text-left">
            <div>
              <h3 className="text-xl font-semibold">1. Record Your Rep</h3>
              <p className="text-gray-400 mt-2">
                Set your phone up so your full body is in frame. The better the angle, the more precise the AI analysis.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">2. AI Pose Extraction</h3>
              <p className="text-gray-400 mt-2">
                VirtusQ maps your body's biomechanical landmarks across every frame — tracking posture, alignment, velocity, and timing simultaneously.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">3. Elite Score Generated</h3>
              <p className="text-gray-400 mt-2">
                Our sequence model evaluates your rep across multiple dimensions and generates a single Elite Score reflecting your true movement quality.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">4. Get Your Correction</h3>
              <p className="text-gray-400 mt-2">
                You receive one targeted, high-impact coaching cue — the specific fix that will improve your technique the most right now.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/how-it-works"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Learn More →
            </Link>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="max-w-4xl w-full py-24 border-t border-gray-800 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Built for Serious Volleyball Athletes
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Whether you're a club player pushing for the next level, a high school athlete building toward college recruitment, or a college player refining your technique between sessions — VirtusQ gives you the coaching access that used to be reserved for elite programs.
          </p>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li>✅ Club volleyball players</li>
            <li>✅ High school athletes</li>
            <li>✅ College players</li>
            <li>✅ Coaches looking for a player analysis tool</li>
            <li>✅ Anyone serious about improving their volleyball game</li>
          </ul>
        </section>

        {/* PRICING TEASER */}
        <section className="max-w-4xl w-full py-24 border-t border-gray-800 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Free. Unlock Elite When You're Ready.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            VirtusQ is free to download with access to core AI analysis features. Upgrade to Pro or Elite to unlock advanced coaching insights, detailed skill breakdowns, priority model updates, and early access to new features. For teams and clubs, our Club plan delivers powerful squad-wide analytics.
          </p>
          <p className="text-gray-300 font-semibold mb-8">
            Individual plans from A$15/month. Club plan available at A$200/month. Cancel anytime.
          </p>
          <Link
            href="/pricing"
            className="text-purple-400 hover:text-purple-300 transition text-lg font-semibold"
          >
            View Pricing →
          </Link>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl py-24 border-t border-gray-800 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop Guessing. Start Improving.
          </h2>

          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
            Every rep you film is a data point. Every correction moves you forward. VirtusQ turns your phone into the most accessible volleyball coaching tool on the market — and it takes less than a minute to get your first analysis.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download"
              className="rounded-xl bg-purple-600 px-10 py-5 text-lg font-semibold hover:bg-purple-500 transition"
            >
              Download VirtusQ Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-gray-600 px-10 py-5 text-lg font-semibold hover:border-white transition"
            >
              View Pricing
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
