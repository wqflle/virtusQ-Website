import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VirtusQ Pricing | Free, Pro, Elite & Club Plans",
  description:
    "VirtusQ offers Free, Pro (A$15/mo), Elite (A$25/mo), and Club (A$200/mo) plans. Start free and upgrade when you're ready to unlock advanced AI coaching insights and performance tracking. All prices in AUD.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
