"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


export default function DownloadPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-purple-600/20 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[800px] h-[800px] bg-blue-600/20 blur-[200px] rounded-full animate-pulse" />
      </div>

      <section className="px-6 pt-40 pb-32 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Train Smarter.
            <br />
            Perform Elite.
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto mt-8 text-lg leading-relaxed">
            VirtusQ uses AI-powered biomechanical analysis to break down
            volleyball technique in real time. Instant feedback. Elite scoring.
            Real improvement.
          </p>
        </div>

        <div className="mt-24 flex justify-center">
          <DeviceCarousel />
        </div>

        <div className="mt-24 flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            href="#"
            className="px-10 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-zinc-200 transition shadow-xl"
          >
            Download on App Store
          </a>

          <a
            href="#"
            className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 font-semibold hover:bg-white/20 transition"
          >
            Get it on Google Play
          </a>
        </div>
      </section>
    </main>
  );
}

/* =========================================
   DEVICE CAROUSEL (FIXED + STABLE)
========================================= */

function DeviceCarousel() {
  const screens = [
    {
      src: "/screens/analysisresults.jpg",
      title: "Instant AI Analysis",
      desc: "Biomechanical breakdown with elite scoring in seconds.",
    },
    {
      src: "/screens/historyScreen.jpg",
      title: "Track Every Rep",
      desc: "Monitor progress, confidence, and performance trends.",
    },
    {
      src: "/screens/profileScreen.jpg",
      title: "Performance Identity",
      desc: "Your evolving tier. Your average elite score. Your growth.",
    },
  ];

  const [index, setIndex] = useState(0);

  // Auto scroll
useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % screens.length);
  }, 4000);

  return () => clearInterval(interval);
}, [screens.length]);


  return (
    <div className="relative w-[320px] md:w-[380px]">
      {/* Glow */}
      <div className="absolute inset-0 bg-purple-600/30 blur-[120px] rounded-full -z-10 animate-pulse" />

      {/* Phone Frame */}
      <div className="relative rounded-[50px] p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.35)] backdrop-blur-xl">
        <div className="relative overflow-hidden rounded-[36px] bg-black aspect-[9/19]">
          
          {/* SLIDES CONTAINER */}
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
                  sizes="(max-width: 768px) 320px, 380px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-10 text-center">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          {screens[index].title}
        </h3>
        <p className="text-zinc-400 mt-4 max-w-xs mx-auto">
          {screens[index].desc}
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-6">
        {screens.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-purple-500 w-6"
                : "bg-white/30 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}



  