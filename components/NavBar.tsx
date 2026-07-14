"use client";

import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-slate-950">
          <Image src="/smartmove-e_logo.png" alt="SmartMove-e logo" width={40} height={40} className="h-10 w-10 rounded-xl object-contain" priority />
          <span>SmartMove Studio</span>
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
