import Image from "next/image";
import SiteNavbar from "./SiteNavbar";
import blogLogo from "../christianmuethblog_logo.png";

export default function Home() {
  return (
    <main className="shell">
      <SiteNavbar />

      <section id="top" className="hero-layout">
        <div className="blog-hero">
          <Image
            src={blogLogo}
            alt="Christian Mueth's Blog"
            className="hero-logo"
            priority
          />
          <h1>Christian Mueth&apos;s Blog</h1>
          <p className="lede">
            Notes on technology, learning, and making things.
          </p>
        </div>

        <nav className="social-links" aria-label="Christian Mueth links">
          <a href="https://muonmechatronics.com" className="social-link" target="_blank" rel="noreferrer">
            Muon Mechatronics
          </a>
          <a href="https://www.youtube.com/@ChristianMueth" className="social-link" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href="https://github.com/christianmueth" className="social-link" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://x.com/ChristianMueth" className="social-link" target="_blank" rel="noreferrer">
            X / Twitter
          </a>
        </nav>
      </section>

    </main>
  );
}