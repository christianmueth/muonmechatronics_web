import Image from "next/image";
import SiteNavbar from "./SiteNavbar";
import blogLogo from "../christianmuethblog_logo.png";

export default function Home() {
  return (
    <main className="shell">
      <SiteNavbar />

      <section id="top" className="blog-hero">
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
      </section>

    </main>
  );
}