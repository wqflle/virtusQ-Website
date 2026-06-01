import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download VirtusQ | AI Volleyball Coaching App",
  description:
    "Download VirtusQ free on iOS and Android. AI-powered volleyball form analysis and technique scoring — no equipment needed, just your phone.",
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
