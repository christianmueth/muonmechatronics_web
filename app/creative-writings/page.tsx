import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "../SiteNavbar";
import writings from "./content.json";

const categories = ["novels", "short fiction"] as const;
type Category = typeof categories[number];

export default async function CreativeWritingsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory: Category = category === "novels" ? "novels" : "short fiction";
  const categoryWritings = writings.filter((writing) => writing.category === activeCategory);

  return (
    <main className="shell">
      <SiteNavbar />
      <section className="writing-hero">
        <h1>Creative Writings</h1>
      </section>
      <nav className="content-tabs" aria-label="Creative writing categories">
        <Link href="/creative-writings?category=novels" className={activeCategory === "novels" ? "content-tab active" : "content-tab"}>Novels</Link>
        <Link href="/creative-writings?category=short-fiction" className={activeCategory === "short fiction" ? "content-tab active" : "content-tab"}>Short Fiction</Link>
      </nav>
      <section className="writing-grid" aria-label={activeCategory === "novels" ? "Novels" : "Short fiction"}>
        {categoryWritings.map((writing) => (
          <Link key={writing.slug} href={`/creative-writings/${writing.slug}`} className="writing-card">
            {writing.images[0] ? <Image src={writing.images[0]} alt="" width={720} height={420} className="writing-card-image" /> : null}
            <div className="writing-card-content"><h2>{writing.title}</h2></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
