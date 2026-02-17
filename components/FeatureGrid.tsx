"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "AI Skill Detection",
    desc: "Pose-based motion analysis detects skills and evaluates execution quality across the rep.",
  },
  {
    title: "Elite Score Engine",
    desc: "A composite score built from posture, timing, stability, and rep cleanliness.",
  },
  {
    title: "Performance Progression",
    desc: "Track growth over time, see trends by skill, and push toward elite consistency.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="container-max mt-16">
      <div className="flex items-end justify-between gap-8">
        <div>
          <p className="muted text-sm font-extrabold tracking-widest">WHAT YOU GET</p>
          <h2 className="mt-3 text-3xl font-black">Built for serious improvement.</h2>
          <p className="muted mt-3 max-w-2xl leading-relaxed">
            VirtusQ focuses on the things that actually move performance: clean biomechanics, repeatable reps,
            and targeted corrections.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="card p-6"
          >
            <div className="mb-3 text-lg font-black">{f.title}</div>
            <div className="muted leading-relaxed">{f.desc}</div>

            <div className="mt-5 h-1 w-16 rounded-full" style={{ background: "var(--primary)" }} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
