import Image from "next/image";
import { notFound } from "next/navigation";
import SiteNavbar from "../../SiteNavbar";
import writings from "../content.json";

export function generateStaticParams() {
  return writings.map((writing) => ({ slug: writing.slug }));
}

export default async function CreativeWritingPage({
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
      <SiteNavbar />
      <article className="article">
        <p className="article-category">{writing.category === "novels" ? "Novel" : "Short Fiction"}</p>
        <h1>{writing.title}</h1>
        {writing.paragraphs.map((paragraph, index) => <p key={`${writing.slug}-${index}`}>{paragraph}</p>)}
        {writing.images.map((image, index) => <Image key={image} src={image} alt={`${writing.title} illustration ${index + 1}`} width={1280} height={960} className="article-image" />)}
      </article>
    </main>
  );
}
