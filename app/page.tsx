import Image from "next/image";
import blogLogo from "../christianmuethblog_logo.png";

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <a href="#top" className="brand-mark">
          <Image
            src={blogLogo}
            alt="Christian Mueth's Blog"
            className="brand-logo"
            priority
          />
          <span>Christian Mueth&apos;s Blog</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="/writing" className="nav-link">Science and Tech Articles</a>
        </nav>
      </header>

      <section id="top" className="blog-hero">
        <h1>Christian Mueth&apos;s Blog</h1>
        <p className="lede">
          Notes on technology, learning, and making things.
        </p>
      </section>

    </main>
  );
}