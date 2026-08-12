import Image from "next/image";
import { notFound } from "next/navigation";
import SiteNavbar from "../../SiteNavbar";
import comics from "../content.json";

export function generateStaticParams() {
  return comics.map((comic) => ({ number: String(comic.number) }));
}

export default async function LegoComicPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const comic = comics.find((entry) => entry.number === Number(number));

  if (!comic) {
    notFound();
  }

  return (
    <main className="shell comic-shell">
      <SiteNavbar />

      <article className="comic-viewer">
        <h1>Lego Humor Comic {comic.number}</h1>
        {comic.type === "video" ? (
          <video className="comic-media" controls poster={comic.poster}>
            <source src={comic.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={comic.src}
            alt={`Lego Humor Comic ${comic.number}`}
            width={1600}
            height={1600}
            className="comic-media"
            priority
          />
        )}
      </article>
    </main>
  );
}