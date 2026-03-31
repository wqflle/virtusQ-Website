"use client";

import { motion } from "framer-motion";

const tiers = [
  { label: "Bronze", emoji: "🥉" },
  { label: "Silver", emoji: "🥈" },
  { label: "Gold", emoji: "🥇" },
  { label: "Platinum", emoji: "💠" },
  { label: "Diamond", emoji: "💎" },
  { label: "Elite", emoji: "👑" },
  { label: "Champion", emoji: "🏆" },
];

export default function Tiers() {
  return (
    <section className="container-max mt-16">
      <div className="card p-7 md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="muted text-sm font-extrabold tracking-widest">PROGRESSION</p>
            <h2 className="mt-3 text-3xl font-black">Performance tiers.</h2>
            <p className="muted mt-3 max-w-2xl leading-relaxed">
              Every rep builds momentum. VirtusQ tracks progression so you can climb from developing consistency
              to elite execution.
            </p>
          </div>

          <div className="rounded-2xl border px-4 py-3 text-sm font-extrabold"
               style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}>
            Based on Elite Score trends
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {tiers.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="rounded-2xl border p-4"
              style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="text-lg font-black">
                {t.emoji} {t.label}
              </div>
              <div className="muted mt-2 text-sm">
                Track, improve, repeat.
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
