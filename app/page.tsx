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
          <a href="#writing" className="nav-link">Writing</a>
        </nav>
      </header>

      <section id="top" className="blog-hero">
        <h1>Christian Mueth&apos;s Blog</h1>
        <p className="lede">
          Notes on technology, learning, and making things.
        </p>
      </section>

      <section id="writing" className="section-block">
        <div className="post-list">
          <article className="post-card featured-post">
            <h3>Building a practice of thoughtful work</h3>
          </article>
          <article className="post-card">
            <h3>Tools should make room for better questions</h3>
          </article>
        </div>
      </section>
    </main>
  );
}