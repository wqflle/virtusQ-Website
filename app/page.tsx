"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-black opacity-80" />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700 opacity-30 blur-[150px]" />

      {/* Animated wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fadeUp">

        {/* HERO */}
        <section className="max-w-4xl py-32">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            VirtusQ
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300">
            AI powered volleyball performance analysis built for serious athletes.
            Upload your rep. Get instant elite level feedback.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download"
              className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold hover:bg-purple-500 transition"
            >
              Download App
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border border-gray-600 px-8 py-4 text-lg font-semibold hover:border-white transition"
            >
              View Pricing
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-6xl w-full py-24 border-t border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Built for Modern Athletes
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <h3 className="text-xl font-semibold mb-4">AI Technique Scoring</h3>
              <p className="text-gray-400">
                Every rep is scored from 0 to 100 using real biomechanical pose data.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <h3 className="text-xl font-semibold mb-4">Elite Performance Levels</h3>
              <p className="text-gray-400">
                Track your progression from Bronze to Champion with live analytics.
              </p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 hover:border-purple-600 transition">
              <h3 className="text-xl font-semibold mb-4">Personalized Fixes</h3>
              <p className="text-gray-400">
                Get specific technique corrections powered by AI pattern recognition.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-5xl w-full py-24 border-t border-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            How It Works
          </h2>

          <div className="space-y-10 text-left">
            <div>
              <h3 className="text-xl font-semibold">1. Record Your Rep</h3>
              <p className="text-gray-400 mt-2">
                Film your pass, set, or receive using your phone.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">2. AI Pose Extraction</h3>
              <p className="text-gray-400 mt-2">
                VirtusQ extracts body joint data frame by frame.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">3. Elite Score Generated</h3>
              <p className="text-gray-400 mt-2">
                Our sequence model evaluates movement quality and generates an elite score.
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

        {/* FINAL CTA */}
        <section className="max-w-4xl py-24 border-t border-gray-800 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Level Up?
          </h2>

          <p className="mt-6 text-gray-400">
            Join the next generation of AI driven volleyball training.
          </p>

          <div className="mt-10">
            <Link
              href="/download"
              className="rounded-xl bg-purple-600 px-10 py-5 text-lg font-semibold hover:bg-purple-500 transition"
            >
              Get VirtusQ
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
