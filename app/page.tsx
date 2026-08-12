import Image from "next/image";
import logo from "../muon_logo.png";
import { navigationLinks, platformProof, products } from "./siteContent";

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <nav className="topbar">
          <span className="brand-mark">Muon Mechatronics</span>
          <div className="nav-links" aria-label="Primary navigation">
            {navigationLinks.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI product company</p>
            <h1>AI products for the robotics era.</h1>
            <p className="lede">
              Muon Mechatronics builds AI software that helps people learn,
              organize, create, and make better decisions. We design practical
              digital companions with a robotics-era sensibility: clear,
              capable, and built to do useful work.
            </p>

            <div className="cta-row">
              <a href="#products" className="primary-cta">
                View products
              </a>
              <a href="mailto:christianmueth@muonmechatronics.com" className="secondary-cta">
                Contact Muon
              </a>
            </div>

            <ul className="signal-list" aria-label="Platform highlights">
              {platformProof.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="hero-card">
            <div className="logo-wrap">
              <Image
                src={logo}
                alt="Muon Mechatronics logo"
                priority
                className="hero-logo"
              />
            </div>
            <div className="status-panel">
              <span>Focus</span>
              <strong>AI companions for learning, work, creativity, and life</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Products</p>
          <h2>Six products. One focus: useful AI software.</h2>
        </div>

        <div className="product-grid">
          {products.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`info-card product-card accent-${item.accent}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="product-topline">
                <span className="product-badge">{item.tagline}</span>
                <span className="product-open">Open</span>
              </div>
              <div className="product-image-wrap">
                <Image
                  src={item.image}
                  alt={`${item.title} brand artwork`}
                  width={320}
                  height={320}
                  className="product-art"
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading compact">
          <p className="eyebrow">What we do</p>
          <h2>We ship AI products with real software underneath them.</h2>
        </div>

        <div className="stack-grid">
          {platformProof.map((item) => (
            <div key={item} className="bullet-item stack-item">
              <span className="bullet-glow" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-panel">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Build with an AI product company shaped by software and robotics.</h2>
          <p>
            Reach out for product partnerships, applied AI collaboration, or
            serious conversations about software that helps people do more.
          </p>
        </div>

        <a className="primary-cta large" href="mailto:christianmueth@muonmechatronics.com">
          christianmueth@muonmechatronics.com
        </a>
      </section>
    </main>
  );
}