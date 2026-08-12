import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";

const rootDirectory = process.cwd();
const sourceDirectory = path.join(rootDirectory, "ChristianMueth_creative_writings");
const publicDirectory = path.join(rootDirectory, "public", "creative-writings");
const outputFile = path.join(rootDirectory, "app", "creative-writings", "content.json");

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function toSlug(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");
}

function docxParagraphs(xml) {
  return [...xml.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)]
    .map((match) => [...match[0].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
      .map((text) => decodeXml(text[1]))
      .join("")
      .trim())
    .filter(Boolean);
}

function odtParagraphs(xml) {
  return [...xml.matchAll(/<text:p(?:\s[^>]*)?>([\s\S]*?)<\/text:p>/g)]
    .map((match) => decodeXml(match[1].replaceAll(/<[^>]+>/g, "")).trim())
    .filter(Boolean);
}

async function importDocument(category, fileName) {
  const filePath = path.join(sourceDirectory, category, fileName);
  const archive = await JSZip.loadAsync(await readFile(filePath));
  const isDocx = fileName.toLowerCase().endsWith(".docx");
  const documentPath = isDocx
    ? Object.keys(archive.files).find((entry) => /^word\/document[^/]*\.xml$/i.test(entry))
    : "content.xml";
  const documentXml = documentPath ? await archive.file(documentPath)?.async("string") : undefined;
  const fileTitle = fileName.replace(/\.(docx|odt)$/i, "");

  if (!documentXml) {
    throw new Error(`Unable to read creative writing: ${fileName}`);
  }

  const paragraphs = isDocx ? docxParagraphs(documentXml) : odtParagraphs(documentXml);
  const title = paragraphs[0] && paragraphs[0].length <= 120 ? paragraphs[0] : fileTitle;
  const slug = `${toSlug(category)}-${toSlug(fileTitle)}`;
  const imageDirectory = path.join(publicDirectory, slug);
  const images = Object.values(archive.files).filter((file) =>
    !file.dir && (isDocx ? /(?:^word\/media\/|^media\/)/i.test(file.name) : file.name.startsWith("Pictures/")),
  );

  if (images.length) {
    await mkdir(imageDirectory, { recursive: true });
  }

  const imagePaths = await Promise.all(images.map(async (image, index) => {
    const extension = path.extname(image.name).toLowerCase() || ".png";
    const imageName = `${String(index + 1).padStart(2, "0")}${extension}`;
    await writeFile(path.join(imageDirectory, imageName), await image.async("nodebuffer"));
    return `/creative-writings/${slug}/${imageName}`;
  }));

  return {
    slug,
    category,
    title,
    paragraphs: title === paragraphs[0] ? paragraphs.slice(1) : paragraphs,
    images: imagePaths,
  };
}

const categories = ["novels", "short fiction"];
await rm(publicDirectory, { recursive: true, force: true });
await mkdir(publicDirectory, { recursive: true });
const writings = [];

for (const category of categories) {
  const files = (await readdir(path.join(sourceDirectory, category)))
    .filter((file) => /\.(docx|odt)$/i.test(file))
    .sort((first, second) => first.localeCompare(second));
  writings.push(...await Promise.all(files.map((fileName) => importDocument(category, fileName))));
}

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(writings, null, 2)}\n`);
console.log(`Imported ${writings.length} creative writings.`);
