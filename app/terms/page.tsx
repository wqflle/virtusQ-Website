// ============================================================
// TERMS OF SERVICE PAGE
// Save as: app/terms/page.tsx
// ============================================================

import Link from "next/link";

export const metadata = {
  title: "Terms of Service | VirtusQ",
};

const TERMS_SECTIONS = [
  {
    num: "01",
    title: "Eligibility",
    body: `You must be at least 13 years old to use the Service. If you are under 18 years of age, you represent and warrant that you have obtained consent from a parent or legal guardian.`,
  },
  {
    num: "02",
    title: "Description of Service",
    body: `VirtusQ provides AI-powered volleyball performance analysis, including biomechanical scoring, pose tracking, performance metrics, and training insights. The Service is provided for educational, informational, and performance-development purposes only.`,
  },
  {
    num: "03",
    title: "No Medical or Professional Advice",
    body: `VirtusQ does not provide medical, physiotherapy, rehabilitation, or certified coaching advice. You acknowledge that physical activity involves inherent risk. You assume full responsibility for any injury, loss, or damage resulting from your training decisions.`,
  },
  {
    num: "04",
    title: "User Content",
    body: `You retain ownership of any videos, images, or content you upload ("User Content"). By uploading User Content, you grant VirtusQ a limited, non-exclusive, worldwide, royalty-free license to process, analyze, and store such content solely for the purpose of operating and improving the Service. You are solely responsible for your User Content and represent that you have all necessary rights to upload it.`,
  },
  {
    num: "05",
    title: "Acceptable Use",
    body: `You agree not to upload unlawful, harmful, abusive, or infringing content; attempt to reverse engineer or extract the underlying AI models; interfere with the security or integrity of the Service; or use the Service for commercial resale without authorization.`,
  },
  {
    num: "06",
    title: "Subscriptions and Payments",
    body: `Certain features require a paid subscription. Pricing, billing cycles, and cancellation policies are disclosed at the time of purchase. Payments may be processed by Apple App Store or Google Play. Subscriptions automatically renew unless cancelled in accordance with the applicable platform's policies.`,
  },
  {
    num: "07",
    title: "Intellectual Property",
    body: `All software, AI models, algorithms, branding, and platform content are the intellectual property of VirtusQ. You may not copy, modify, distribute, or create derivative works without prior written permission.`,
  },
  {
    num: "08",
    title: "Data & Privacy",
    body: `Your use of the Service is also governed by our Privacy Policy. By using VirtusQ, you consent to the collection and processing of data as described therein.`,
  },
  {
    num: "09",
    title: "Disclaimer of Warranties",
    body: `The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be error-free, uninterrupted, or that AI-generated results will be perfectly accurate.`,
  },
  {
    num: "10",
    title: "Limitation of Liability",
    body: `To the maximum extent permitted by law, VirtusQ shall not be liable for any indirect, incidental, consequential, or special damages, including injury, loss of data, or performance outcomes. Our total liability shall not exceed the amount you paid for the Service in the preceding 12 months.`,
  },
  {
    num: "11",
    title: "Indemnification",
    body: `You agree to indemnify and hold harmless VirtusQ from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.`,
  },
  {
    num: "12",
    title: "Termination",
    body: `We may suspend or terminate access to the Service if you violate these Terms or engage in unlawful conduct.`,
  },
  {
    num: "13",
    title: "Service Modifications",
    body: `We reserve the right to modify, suspend, or discontinue the Service at any time without liability.`,
  },
  {
    num: "14",
    title: "Governing Law",
    body: `These Terms are governed by the laws of Australia. Any disputes shall be resolved exclusively in the courts of Australia.`,
  },
  {
    num: "15",
    title: "Changes to Terms",
    body: `We may update these Terms periodically. Continued use of the Service after updates constitutes acceptance of the revised Terms.`,
  },
  {
    num: "16",
    title: "Contact",
    body: `For questions regarding these Terms, contact us at virtusqsup@gmail.com`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ backgroundColor: "#080808", color: "#f0f0f0", minHeight: "100vh" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "clamp(100px, 15vw, 160px) 24px 80px" }}>

        {/* Back */}
        <Link
          href="/"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", color: "#63ffb4", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "3rem" }}
        >
          ← VIRTUSQ
        </Link>

        {/* Header */}
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", color: "#63ffb4", marginBottom: "1rem", textTransform: "uppercase" }}>
          Legal
        </p>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 400, color: "#f0f0f0",
            lineHeight: 1.1, marginBottom: "1rem",
          }}
        >
          Terms of Service
        </h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: "rgba(240,240,240,0.3)", letterSpacing: "0.06em", marginBottom: "3.5rem" }}>
          LAST UPDATED: FEBRUARY 2026
        </p>

        <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(240,240,240,0.55)", marginBottom: "3rem" }}>
          These Terms of Service govern your access to and use of the VirtusQ website, mobile application, and related services. By accessing or using the Service, you agree to be legally bound by these Terms. If you do not agree, you must not use VirtusQ.
        </p>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {TERMS_SECTIONS.map((s) => (
            <div key={s.num} style={{ display: "flex", gap: "1.5rem" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#63ffb4", fontWeight: 700, flexShrink: 0, marginTop: "4px", minWidth: "24px" }}>
                {s.num}
              </span>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", fontWeight: 400, color: "#f0f0f0", marginBottom: "0.6rem" }}>
                  {s.title}
                </h2>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.8, color: "rgba(240,240,240,0.5)" }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
