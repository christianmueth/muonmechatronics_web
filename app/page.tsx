import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "./SiteNavbar";
import blogLogo from "../christianmuethblog_logo.png";
import writings from "./writing/content.json";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

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
            Muon Mechatronics (Software Business)
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

      <section className="latest-articles" aria-labelledby="latest-science-tech">
        <div className="latest-heading">
          <h2 id="latest-science-tech">Latest from Science and Tech</h2>
          <Link href="/writing" className="latest-link">View all</Link>
        </div>
        <div className="latest-grid">
          {writings.slice(0, 3).map((writing) => (
            <Link key={writing.slug} href={`/writing/${writing.slug}`} className="latest-card">
              {writing.images[0] ? (
                <Image
                  src={writing.images[0]}
                  alt=""
                  width={720}
                  height={420}
                  className="latest-card-image"
                />
              ) : null}
              <div className="latest-card-content">
                <time dateTime={writing.date}>
                  {dateFormatter.format(new Date(`${writing.date}T00:00:00Z`))}
                </time>
                <h3>{writing.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}