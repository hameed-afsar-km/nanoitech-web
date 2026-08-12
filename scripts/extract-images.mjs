import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "..", "index.html"), "utf8");

const re = /data:image\/(png|jpeg);base64,([A-Za-z0-9+/=]+)/g;
const outDir = join(root, "public", "images");
mkdirSync(outDir, { recursive: true });

const names = [
  "bg-logo-story",   // 0  logo-story::before background
  "bg-wisdom",       // 1  amb-wisdom::before background
  "bg-tradition",    // 2  amb-tradition::before background
  "bg-about",        // 3  about-bg::before background
  "bg-pricing",      // 4  pricing-bg::before background
  "bg-tech",         // 5  tech-bg::before background
  "bg-products",     // 6  prod-head-framed::before background
  "brand-logo",      // 7  nav brand logo (png)
  "hero",            // 8  hero image
  "poster",          // 9  logo-story poster
  "story-wisdom",    // 10 story wisdom image
  "story-tradition", // 11 story tradition image
  "product-nanoshield", // 12
  "laurel",          // 13
  "product-rootique",   // 14
  "product-herborelief",// 15
  "product-cocorose",   // 16
  "product-venorestore",// 17
  "footer-logo",     // 18 footer logo (png)
];

let m;
let i = 0;
while ((m = re.exec(html)) !== null) {
  const type = m[1];
  const ext = type === "png" ? "png" : "jpg";
  const name = names[i] ?? `image-${i}`;
  const file = join(outDir, `${name}.${ext}`);
  writeFileSync(file, Buffer.from(m[2], "base64"));
  console.log(`${String(i).padStart(2, "0")} ${name}.${ext}  (${type}, ${Buffer.from(m[2], "base64").length} bytes)`);
  i++;
}
console.log(`Total images extracted: ${i}`);
