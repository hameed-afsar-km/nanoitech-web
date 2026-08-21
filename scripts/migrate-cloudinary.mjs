/**
 * One-off migration: upload local product images to Cloudinary and
 * rewrite every reference (src/lib/defaults.ts + Firestore site/content).
 *
 * Usage:  node scripts/migrate-cloudinary.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* ── load .env.local ─────────────────────────────────────────── */
const env = {};
for (const line of readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
  if (m && !line.trim().startsWith("#")) env[m[1]] = m[2];
}

const CLOUD = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
if (!CLOUD || !PRESET) {
  console.error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / UPLOAD_PRESET in .env.local");
  process.exit(1);
}

/* ── product images referenced by defaults.ts ────────────────── */
const IMAGES = [
  "product-nanoshield.jpg",
  "product-rootique.jpg",
  "product-herborelief.jpg",
  "product-cocorose.jpg",
  "product-venorestore.jpg",
];

/* ── 1. upload ──────────────────────────────────────────────── */
const map = {}; // "/images/product-x.jpg" -> cloudinary url
for (const name of IMAGES) {
  const file = path.join(ROOT, "public", "images", name);
  if (!existsSync(file)) {
    console.warn(`skip (missing): ${name}`);
    continue;
  }
  const buf = readFileSync(file);
  const form = new FormData();
  form.append("file", new Blob([buf], { type: "image/jpeg" }), name);
  form.append("upload_preset", PRESET);
  form.append("folder", "products");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    console.error(`upload failed for ${name}: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const data = await res.json();
  map[`/images/${name}`] = data.secure_url;
  console.log(`uploaded ${name} -> ${data.secure_url}`);
}
writeFileSync(path.join(ROOT, "scripts", "cloudinary-map.json"), JSON.stringify(map, null, 2));

/* ── 2. patch src/lib/defaults.ts ───────────────────────────── */
const defPath = path.join(ROOT, "src", "lib", "defaults.ts");
let defSrc = readFileSync(defPath, "utf8");
for (const [local, url] of Object.entries(map)) {
  defSrc = defSrc.split(local).join(url);
}
writeFileSync(defPath, defSrc);
console.log("patched src/lib/defaults.ts");

/* ── 3. patch Firestore site/content ────────────────────────── */
const cfg = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};
async function patchFirestore() {
  const { initializeApp, getApps } = await import("firebase/app");
  const { getFirestore, doc, getDoc, setDoc } = await import("firebase/firestore");
  const app = getApps().length ? getApps()[0] : initializeApp(cfg);
  const db = getFirestore(app);
  const ref = doc(db, "site/content");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    console.log("no remote content doc — nothing to patch in Firestore");
    return true;
  }
  const content = snap.data();
  let changed = 0;
  for (const p of content.products ?? []) {
    if (p.image && map[p.image]) {
      p.image = map[p.image];
      changed++;
    }
  }
  if (!changed) {
    console.log("remote products already use non-local images");
    return true;
  }
  await setDoc(ref, { ...content, products: content.products }, { merge: true });
  console.log(`patched Firestore products (${changed} image links updated)`);
  return true;
}

try {
  await patchFirestore();
} catch (err) {
  console.error("\nFirestore patch failed (likely security rules):", err?.code ?? err?.message ?? err);
  /* Fallback snippet to run in the browser while logged in as admin */
  const snippet = `// Paste this in DevTools console ON THE SITE while logged in as an admin.
{
  const MAP = ${JSON.stringify(map, null, 2)};
  const [{ initializeApp }, FS] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"),
  ]);
  const app = initializeApp(${JSON.stringify(cfg)});
  const db = FS.getFirestore(app);
  const ref = FS.doc(db, "site/content");
  const snap = await FS.getDoc(ref);
  if (!snap.exists()) throw new Error("no site/content doc");
  const content = snap.data();
  let n = 0;
  for (const p of content.products ?? []) {
    if (p.image && MAP[p.image]) { p.image = MAP[p.image]; n++; }
  }
  await FS.setDoc(ref, { ...content, products: content.products }, { merge: true });
  console.log("updated", n, "product image links");
}`;
  writeFileSync(path.join(ROOT, "scripts", "browser-migrate.js"), snippet);
  console.log("wrote scripts/browser-migrate.js — run it in the browser console as a fallback.");
}
process.exit(0);
