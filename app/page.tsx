import Image from "next/image";
import logo from "../muon_logo.png";

const solutionAreas = [
  {
    title: "Applied AI Systems",
    text: "We turn AI capability into software that is production-shaped, measurable, and aligned to the actual work your team needs done.",
  },
  {
    title: "Automation Architecture",
    text: "From workflow orchestration to human-in-the-loop control surfaces, we design the stack that lets automation scale without becoming brittle.",
  },
  {
    title: "Deployment Readiness",
    text: "Every engagement is built for shipping: clear operating boundaries, observability, and infrastructure that can move cleanly to Vercel and beyond.",
  },
];

const engagements = [
  "AI copilots for internal operations and knowledge-heavy workflows",
  "Custom retrieval, planning, and decision-support systems",
  "Industrial and technical software interfaces with AI in the loop",
  "Rapid product prototypes that can harden into production deployments",
];

const deliveryPoints = [
  "Strategy grounded in software reality, not slideware",
  "Interfaces designed for operators, clients, and engineering teams",
  "Deployable Next.js experiences with fast iteration on Vercel",
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <nav className="topbar">
          <span className="brand-mark">Muon Mechatronics</span>
          <a href="#contact" className="nav-link">
            Start a conversation
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Muonmechatronics.com</p>
            <h1>AI software solutions built for real operations.</h1>
            <p className="lede">
              Muon Mechatronics helps companies design and ship AI-powered
              software for automation, decision support, and technical
              workflows. We focus on systems that can actually be deployed,
              governed, and used under pressure.
            </p>

            <div className="cta-row">
              <a href="#solutions" className="primary-cta">
                Explore solutions
              </a>
              <a href="#contact" className="secondary-cta">
                Discuss a project
              </a>
            </div>

            <ul className="signal-list" aria-label="Delivery highlights">
              {deliveryPoints.map((point) => (
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
              <span>Core focus</span>
              <strong>Operational AI that ships cleanly</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="section-block">
        <div className="section-heading">
          <p className="eyebrow">What we build</p>
          <h2>Software systems where AI is useful because the delivery is disciplined.</h2>
        </div>

        <div className="card-grid">
          {solutionAreas.map((item) => (
            <article key={item.title} className="info-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading compact">
          <p className="eyebrow">Typical engagements</p>
          <h2>Built for companies that want AI integrated into the product or workflow, not bolted on afterward.</h2>
        </div>

        <div className="bullet-panel">
          {engagements.map((item) => (
            <div key={item} className="bullet-item">
              <span className="bullet-glow" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-panel">
        <div>
          <p className="eyebrow">Next step</p>
          <h2>Need an AI product surface, prototype, or deployable workflow?</h2>
          <p>
            Muon Mechatronics is positioned for focused software engagements
            where clarity, speed, and deployment quality matter.
          </p>
        </div>

        <a className="primary-cta large" href="mailto:hello@muonmechatronics.com">
          hello@muonmechatronics.com
        </a>
      </section>
    </main>
  );
}