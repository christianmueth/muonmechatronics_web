import { execFile } from "node:child_process";
import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const rootDirectory = process.cwd();
const sourceDirectory = path.join(rootDirectory, "lego_humor");
const publicDirectory = path.join(rootDirectory, "public", "lego-comics");
const outputFile = path.join(rootDirectory, "app", "lego-comics", "content.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".mp4"]);

function outputName(index, extension) {
  return `comic-${String(index).padStart(3, "0")}${extension}`;
}

async function createWebVideo(source, destination) {
  await run("ffmpeg", [
    "-y",
    "-i",
    source,
    "-vf",
    "scale=1280:-2",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "31",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    destination,
  ]);

  const { size } = await stat(destination);
  if (size > 95 * 1024 * 1024) {
    throw new Error("The optimized Lego video exceeds GitHub's 100 MB file limit.");
  }
}

async function createPoster(source, destination) {
  await run("ffmpeg", ["-y", "-ss", "00:00:03", "-i", source, "-frames:v", "1", "-q:v", "3", destination]);
}

const files = (await readdir(sourceDirectory))
  .filter((file) => !file.toLowerCase().includes("logo"))
  .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()));
const media = await Promise.all(
  files.map(async (fileName) => ({
    fileName,
    modified: (await stat(path.join(sourceDirectory, fileName))).mtime.toISOString(),
  })),
);

media.sort((first, second) =>
  first.modified.localeCompare(second.modified) || first.fileName.localeCompare(second.fileName, undefined, { numeric: true }),
);

await rm(publicDirectory, { recursive: true, force: true });
await mkdir(publicDirectory, { recursive: true });

const comics = await Promise.all(
  media.map(async (entry, index) => {
    const number = index + 1;
    const extension = path.extname(entry.fileName).toLowerCase();
    const source = path.join(sourceDirectory, entry.fileName);

    if (extension === ".mp4") {
      const videoName = outputName(number, ".mp4");
      const posterName = outputName(number, ".jpg");
      await createWebVideo(source, path.join(publicDirectory, videoName));
      await createPoster(source, path.join(publicDirectory, posterName));
      return {
        number,
        date: entry.modified.slice(0, 10),
        type: "video",
        src: `/lego-comics/${videoName}`,
        poster: `/lego-comics/${posterName}`,
      };
    }

    const imageName = outputName(number, extension);
    await copyFile(source, path.join(publicDirectory, imageName));
    return {
      number,
      date: entry.modified.slice(0, 10),
      type: "image",
      src: `/lego-comics/${imageName}`,
    };
  }),
);

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(comics, null, 2)}\n`);
console.log(`Imported ${comics.length} Lego comics.`);