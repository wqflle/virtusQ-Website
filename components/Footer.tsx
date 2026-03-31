import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container-max py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="text-sm font-black tracking-wide">VirtusQ</div>
            <div className="muted mt-2 text-sm max-w-md">
              Train smarter with AI-powered biomechanics. Rep-by-rep analysis, elite scoring, and performance progression.
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-extrabold">
            <Link className="muted hover:text-white" href="/how-it-works">
              How it works
            </Link>
            <Link className="muted hover:text-white" href="/pricing">
              Pricing
            </Link>
            <Link className="muted hover:text-white" href="/download">
              Download
            </Link>
          </div>
        </div>

        <div className="muted mt-10 text-xs">
          © {new Date().getFullYear()} VirtusQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
