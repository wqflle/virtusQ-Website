import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How VirtusQ Works | AI Volleyball Technique Analysis",
  description:
    "See how VirtusQ turns your phone camera into an AI volleyball coach. Film your rep, get pose analysis, and receive one high-impact technique correction instantly.",
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
