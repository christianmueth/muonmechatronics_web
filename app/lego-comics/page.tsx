import Image from "next/image";
import Link from "next/link";
import comics from "./content.json";

const comicsNewestFirst = [...comics].reverse();

export default function LegoComicIndex() {
  return (
    <main className="shell">
      <header className="topbar">
        <Link href="/" className="brand-mark">Christian Mueth&apos;s Blog</Link>
        <span className="nav-link">Old Lego Comics</span>
      </header>

      <section className="writing-hero">
        <h1>Old Lego Comics</h1>
      </section>

      <section className="comic-grid" aria-label="Old Lego Comics">
        {comicsNewestFirst.map((comic) => (
          <Link key={comic.number} href={`/lego-comics/${comic.number}`} className="comic-card">
            <Image
              src={comic.type === "video" ? comic.poster ?? comic.src : comic.src}
              alt=""
              width={720}
              height={720}
              className="comic-card-image"
            />
            <h2>Lego Humor Comic {comic.number}</h2>
          </Link>
        ))}
      </section>
    </main>
  );
}