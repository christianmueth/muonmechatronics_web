export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <a href="#top" className="brand-mark">Christian Mueth&apos;s Blog</a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#writing" className="nav-link">Writing</a>
          <a href="#notes" className="nav-link">Notes</a>
        </nav>
      </header>

      <section id="top" className="blog-hero">
        <p className="eyebrow">Personal essays and working notes</p>
        <h1>Christian Mueth&apos;s Blog</h1>
        <p className="lede">
          A place for clear thinking about technology, learning, creativity,
          and the work of making useful things.
        </p>
      </section>

      <section id="writing" className="section-block">
        <div className="section-heading blog-heading">
          <p className="eyebrow">Latest writing</p>
          <h2>Ideas worth returning to.</h2>
        </div>

        <div className="post-list">
          <article className="post-card featured-post">
            <p className="post-meta">Field notes</p>
            <h3>Building a practice of thoughtful work</h3>
            <p>
              The most durable systems begin with attention: a willingness to
              notice what matters, keep the useful parts, and revise the rest.
            </p>
          </article>
          <article className="post-card">
            <p className="post-meta">Technology</p>
            <h3>Tools should make room for better questions</h3>
            <p>
              A useful tool does more than move work along. It helps us see
              the problem with greater precision.
            </p>
          </article>
          <article className="post-card">
            <p className="post-meta">Learning</p>
            <h3>Small, repeated acts of curiosity</h3>
            <p>
              Progress is often less about intensity than a steady habit of
              returning to the things we want to understand.
            </p>
          </article>
        </div>
      </section>

      <section id="notes" className="notes-band">
        <div>
          <p className="eyebrow">From the notebook</p>
          <h2>Observations, experiments, and unfinished thoughts.</h2>
        </div>
        <p>
          This is an evolving collection of writing about the ideas that make
          a life in technology more deliberate, humane, and interesting.
        </p>
      </section>
    </main>
  );
}