import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve("dist");
const PLACEHOLDER_RE = /\[[^\]]+\]/g;
const LD_RE = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const SCRIPT_RE = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const STYLE_RE = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
const TAG_RE = /<[^>]+>/g;

function fail(msg) {
  console.error(`✗ gate ERROR — ${msg}`);
  process.exit(1);
}

function listHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtmlFiles(p));
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out.sort();
}

function contextAround(text, index, matchLen, radius = 46) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + matchLen + radius);
  const raw = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${raw}${end < text.length ? "…" : ""}`;
}

function walkStrings(value, visit, trail = "$") {
  if (typeof value === "string") {
    visit(value, trail);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => walkStrings(item, visit, `${trail}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      walkStrings(item, visit, `${trail}.${key}`);
    }
  }
}

if (!fs.existsSync(DIST) || !fs.statSync(DIST).isDirectory()) {
  fail(`no existe dist/ — ejecuta \`npm run build\` antes del gate.`);
}

const files = listHtmlFiles(DIST);
if (files.length === 0) {
  fail("dist/ no contiene ningún archivo .html — ejecuta `npm run build` antes del gate.");
}

let totalVisible = 0;
let totalJsonLd = 0;
let totalWarnings = { TODO: 0, "ph-label": 0, "0000": 0 };
const perFile = [];

for (const file of files) {
  const rel = path.relative(path.resolve("."), file);
  const html = fs.readFileSync(file, "utf8");

  const ldBlocks = [...html.matchAll(LD_RE)];
  let stripped = html.replace(LD_RE, " ");
  stripped = stripped.replace(SCRIPT_RE, " ").replace(STYLE_RE, " ");
  const visibleText = stripped.replace(TAG_RE, " ");

  const visibleMatches = [...visibleText.matchAll(PLACEHOLDER_RE)];
  const visibleByPlaceholder = new Map();
  for (const m of visibleMatches) {
    const key = m[0];
    if (!visibleByPlaceholder.has(key)) visibleByPlaceholder.set(key, []);
    visibleByPlaceholder.get(key).push(contextAround(visibleText, m.index, m[0].length));
  }

  const ldByPlaceholder = new Map();
  const ldErrors = [];
  for (const block of ldBlocks) {
    let parsed;
    try {
      parsed = JSON.parse(block[1]);
    } catch (err) {
      ldErrors.push(`JSON-LD inválido: ${err.message}`);
      continue;
    }
    walkStrings(parsed, (str, trail) => {
      for (const m of str.matchAll(PLACEHOLDER_RE)) {
        const key = m[0];
        if (!ldByPlaceholder.has(key)) ldByPlaceholder.set(key, []);
        const preview = str.replace(/\s+/g, " ").trim();
        const valueCtx = preview.length > 90 ? `${preview.slice(0, 90)}…` : preview;
        ldByPlaceholder.get(key).push(`${trail} = "${valueCtx}"`);
      }
    });
  }

  const warnings = {
    TODO: (stripped.match(/TODO/g) || []).length,
    "ph-label": (stripped.match(/ph-label/g) || []).length,
    "0000": (stripped.match(/0000/g) || []).length,
  };
  for (const k of Object.keys(totalWarnings)) totalWarnings[k] += warnings[k];

  const visibleCount = visibleMatches.length;
  let ldCount = 0;
  for (const contexts of ldByPlaceholder.values()) ldCount += contexts.length;
  for (const err of ldErrors) ldCount += 1;

  totalVisible += visibleCount;
  totalJsonLd += ldCount;
  perFile.push({ rel, visibleCount, ldCount, visibleByPlaceholder, ldByPlaceholder, ldErrors, warnings });

  if (visibleCount > 0 || ldCount > 0) {
    console.log(`\n■ ${rel}`);
    console.log(`  bloqueantes: ${visibleCount} en texto visible · ${ldCount} en JSON-LD`);
    if (ldErrors.length > 0) {
      for (const err of ldErrors) console.log(`  ✗ ${err}`);
    }
    for (const [ph, contexts] of visibleByPlaceholder) {
      console.log(`  [texto visible] ${ph} × ${contexts.length}`);
      contexts.slice(0, 3).forEach((ctx) => console.log(`      · ${ctx}`));
    }
    for (const [ph, contexts] of ldByPlaceholder) {
      console.log(`  [JSON-LD] ${ph} × ${contexts.length}`);
      contexts.slice(0, 3).forEach((ctx) => console.log(`      · ${ctx}`));
    }
  }
}

console.log(`\n${"─".repeat(56)}`);
console.log("Resumen de bloqueantes (\\[[^\\]]+\\]):");
for (const f of perFile) {
  if (f.visibleCount === 0 && f.ldCount === 0) continue;
  console.log(`  ${f.rel}: ${f.visibleCount + f.ldCount} (${f.visibleCount} texto visible + ${f.ldCount} JSON-LD)`);
}
const totalBlocking = totalVisible + totalJsonLd;
console.log(`  TOTAL: ${totalBlocking} (${totalVisible} texto visible + ${totalJsonLd} JSON-LD)`);

console.log(`\nAvisos (no bloquean) — DoD §7.1-2 también los exige a 0 antes de go-live:`);
for (const f of perFile) {
  const { TODO, "ph-label": ph, "0000": z } = f.warnings;
  if (TODO + ph + z === 0) continue;
  console.log(`  ${f.rel}: TODO × ${TODO} · ph-label × ${ph} · 0000 × ${z}`);
}
console.log(
  `  TOTAL: TODO × ${totalWarnings.TODO} · ph-label × ${totalWarnings["ph-label"]} · 0000 × ${totalWarnings["0000"]}`,
);

if (totalBlocking === 0) {
  console.log("\n✓ gate OK — 0 placeholders bloqueantes.");
  process.exit(0);
}

console.log(`\n✗ gate FAILED — ${totalBlocking} placeholders bloqueantes en ${perFile.filter((f) => f.visibleCount + f.ldCount > 0).length} archivo(s).`);
process.exit(1);
