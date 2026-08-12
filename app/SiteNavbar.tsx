import Image from "next/image";
import Link from "next/link";
import blogLogo from "../christianmuethblog_logo.png";

export default function SiteNavbar() {
  return (
    <header className="topbar">
      <Link href="/" className="brand-mark">
        <Image
          src={blogLogo}
          alt="Christian Mueth's Blog"
          className="brand-logo"
          priority
        />
        <span>Christian Mueth&apos;s Blog</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/writing" className="nav-link">Science and Tech Articles</Link>
        <Link href="/lego-comics" className="nav-link">Old Lego Comics</Link>
      </nav>
    </header>
  );
}