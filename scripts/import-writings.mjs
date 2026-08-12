import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";

const rootDirectory = process.cwd();
const sourceDirectory = path.join(rootDirectory, "ChristianMueth_Science_and_tech");
const publicDirectory = path.join(rootDirectory, "public", "writings");
const outputFile = path.join(rootDirectory, "app", "writing", "content.json");

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function plainText(xml) {
  const text = [...xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
    .map((match) => decodeXml(match[1]))
    .join("");

  return text.replaceAll(/<w:tab\s*\/>/g, " ").trim();
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

async function importDocument(fileName) {
  const filePath = path.join(sourceDirectory, fileName);
  const archive = await JSZip.loadAsync(await readFile(filePath));
  const documentXml = await archive.file("word/document.xml")?.async("string");
  const coreXml = await archive.file("docProps/core.xml")?.async("string");

  if (!documentXml || !coreXml) {
    throw new Error(`Unable to read Word document: ${fileName}`);
  }

  const paragraphs = [...documentXml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)]
    .map((match) => plainText(match[0]))
    .filter(Boolean);
  const fileTitle = fileName.replace(/\.docx$/i, "");
  const title = paragraphs[0] && paragraphs[0].length <= 120 ? paragraphs[0] : fileTitle;
  const created = coreXml.match(/<dcterms:created[^>]*>([^<]+)<\/dcterms:created>/)?.[1];
  const slug = toSlug(fileTitle);
  const imageDirectory = path.join(publicDirectory, slug);
  const images = Object.values(archive.files).filter(
    (file) => !file.dir && file.name.startsWith("word/media/"),
  );

  if (images.length > 0) {
    await mkdir(imageDirectory, { recursive: true });
  }

  const imagePaths = await Promise.all(
    images.map(async (image, index) => {
      const extension = path.extname(image.name).toLowerCase() || ".png";
      const imageName = `${String(index + 1).padStart(2, "0")}${extension}`;
      await writeFile(path.join(imageDirectory, imageName), await image.async("nodebuffer"));
      return `/writings/${slug}/${imageName}`;
    }),
  );

  return {
    slug,
    title,
    date: created ? created.slice(0, 10) : "",
    paragraphs: title === paragraphs[0] ? paragraphs.slice(1) : paragraphs,
    images: imagePaths,
  };
}

const files = (await readdir(sourceDirectory)).filter((file) => file.toLowerCase().endsWith(".docx"));
await rm(publicDirectory, { recursive: true, force: true });
await mkdir(publicDirectory, { recursive: true });
const writings = await Promise.all(files.map(importDocument));
writings.sort((first, second) => second.date.localeCompare(first.date));
await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(writings, null, 2)}\n`);
console.log(`Imported ${writings.length} writings.`);