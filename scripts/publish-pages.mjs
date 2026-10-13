import { copyFile, cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
await mkdir(path.join(root, "assets"), { recursive: true });
await copyFile(path.join(dist, "index.html"), path.join(root, "index.html"));
await cp(path.join(dist, "assets"), path.join(root, "assets"), { recursive: true, force: true });
console.log("GitHub Pages files updated in the repository root.");
