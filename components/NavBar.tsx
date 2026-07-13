"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-semibold text-slate-950">
          SmartMove Studio
        </Link>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Link href="/workspace/presentations" className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 font-medium text-cyan-900 hover:bg-cyan-100">
            Presentation workspace
          </Link>
          <Link href="/label-review" className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100">
            Legacy demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
