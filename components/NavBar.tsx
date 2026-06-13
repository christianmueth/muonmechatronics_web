"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-semibold text-stone-950">
          Alcohol Label Review Prototype
        </Link>

        <div className="flex items-center gap-3 text-sm text-stone-600">
          <Link href="/label-review" className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-900 hover:bg-amber-100">
            Demo route
          </Link>
          <span>Reviewer-focused take-home</span>
        </div>
      </nav>
    </header>
  );
}
