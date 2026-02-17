"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="container-max mt-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border p-10"
        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.02)" }}
      >
        <div
          className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(124,58,237,0.25)" }}
        />
        <div className="relative">
          <p className="muted text-sm font-extrabold tracking-widest">READY?</p>
          <h3 className="mt-3 text-3xl font-black">Start training with VirtusQ.</h3>
          <p className="muted mt-3 max-w-2xl leading-relaxed">
            Record a rep, get your Elite Score, fix one key lever, and stack progress fast.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/download" className="btn btn-primary">
              Download VirtusQ →
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              See pricing →
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
