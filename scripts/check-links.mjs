import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const siteRoot = path.resolve("_site");
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

function checkReference(reference, sourceFile) {
  if (
    !reference ||
    /^(?:#|data:|https?:|mailto:|tel:|javascript:)/i.test(reference)
  )
    return;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!clean) return;
  let target = clean.startsWith("/")
    ? path.join(siteRoot, clean)
    : path.resolve(path.dirname(sourceFile), clean);
  if (target.endsWith(path.sep)) target = path.join(target, "index.html");
  if (!existsSync(target))
    failures.push(`${path.relative(siteRoot, sourceFile)} -> ${reference}`);
}

const files = await walk(siteRoot);
for (const file of files) {
  const extension = path.extname(file).toLowerCase();
  if (extension !== ".html" && extension !== ".css") continue;
  const source = await readFile(file, "utf8");
  const references = [];
  if (extension === ".html") {
    for (const match of source.matchAll(/\b(?:href|src)="([^"]+)"/g))
      references.push(match[1]);
    for (const match of source.matchAll(/\bsrcset="([^"]+)"/g)) {
      references.push(
        ...match[1]
          .split(",")
          .map((candidate) => candidate.trim().split(/\s+/)[0]),
      );
    }
  } else {
    for (const match of source.matchAll(/url\(["']?([^"')]+)["']?\)/g))
      references.push(match[1]);
  }
  references.forEach((reference) => checkReference(reference, file));
}

if (failures.length) {
  console.error(`Broken local references:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Local link check passed across ${files.filter((file) => file.endsWith(".html")).length} HTML pages.`,
  );
}
