import SiteNavbar from "./SiteNavbar";

export default function Home() {
  return (
    <main className="shell">
      <SiteNavbar />

      <section id="top" className="blog-hero">
        <h1>Christian Mueth&apos;s Blog</h1>
        <p className="lede">
          Notes on technology, learning, and making things.
        </p>
      </section>

    </main>
  );
}