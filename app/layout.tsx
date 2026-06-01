import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "VirtusQ | AI Volleyball Form Analysis & Coaching App",
  description:
    "VirtusQ uses AI to analyse your volleyball technique in real time. Get instant biomechanical scoring, elite-level coaching feedback, and track your improvement — free to download.",
  keywords:
    "volleyball form analysis, AI volleyball coaching, volleyball technique app, volleyball training app, improve volleyball form, volleyball performance tracker",
  openGraph: {
    type: "website",
    url: "https://virtusq.com/",
    title: "VirtusQ | AI Volleyball Form Analysis & Coaching App",
    description:
      "Film your rep. Get instant AI-powered feedback on your volleyball technique. Trusted by serious athletes training to reach the next level.",
    images: [{ url: "https://virtusq.com/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VirtusQ | AI Volleyball Form Analysis App",
    description:
      "AI-powered volleyball coaching in your pocket. Score your technique, fix your form, track your progress.",
    images: ["https://virtusq.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://virtusq.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
