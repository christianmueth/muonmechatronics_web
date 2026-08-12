import Image from "next/image";
import Link from "next/link";
import writings from "./content.json";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default function WritingIndex() {
  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand-mark">Christian Mueth&apos;s Blog</Link>
        <span className="nav-link">Writing</span>
      </header>

      <section className="writing-hero">
        <h1>Writing</h1>
      </section>

      <section className="writing-grid" aria-label="Writing">
        {writings.map((writing) => (
          <Link key={writing.slug} href={`/writing/${writing.slug}`} className="writing-card">
            {writing.images[0] ? (
              <Image
                src={writing.images[0]}
                alt=""
                width={720}
                height={420}
                className="writing-card-image"
              />
            ) : null}
            <div className="writing-card-content">
              <time dateTime={writing.date}>
                {dateFormatter.format(new Date(`${writing.date}T00:00:00Z`))}
              </time>
              <h2>{writing.title}</h2>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}