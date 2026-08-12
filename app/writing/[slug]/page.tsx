import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import writings from "../content.json";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function generateStaticParams() {
  return writings.map((writing) => ({ slug: writing.slug }));
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writing = writings.find((entry) => entry.slug === slug);

  if (!writing) {
    notFound();
  }

  return (
    <main className="shell article-shell">
      <header className="topbar">
        <Link href="/" className="brand-mark">Christian Mueth&apos;s Blog</Link>
        <Link href="/writing" className="nav-link">Science and Tech Articles</Link>
      </header>

      <article className="article">
        <time dateTime={writing.date} className="article-date">
          {dateFormatter.format(new Date(`${writing.date}T00:00:00Z`))}
        </time>
        <h1>{writing.title}</h1>
        {writing.paragraphs.map((paragraph, index) => (
          <p key={`${writing.slug}-${index}`}>{paragraph}</p>
        ))}
        {writing.images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`${writing.title} illustration ${index + 1}`}
            width={1280}
            height={960}
            className="article-image"
          />
        ))}
      </article>
    </main>
  );
}