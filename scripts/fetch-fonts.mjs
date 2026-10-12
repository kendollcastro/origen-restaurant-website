// Descarga Cormorant Garamond + Jost (pesos usados) desde Google Fonts
// (subset latin) y emite src/styles/fonts.css con @font-face auto-hospedados.
// Uso: node scripts/fetch-fonts.mjs
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const run = promisify(execFile);

const FAMILIES = [
  { src: 'Cormorant Garamond', name: 'cormorant', spec: 'ital,wght@0,500;0,600;1,500;1,600' },
  { src: 'Jost', name: 'jost', spec: 'wght@300;400;500;600' },
];
const cssUrl = (f) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.src)}:${f.spec}&display=swap`;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const curl = (url, out) =>
  run('curl', ['-fsSL', '-A', UA, url, ...(out ? ['-o', out] : [])]);

const out = resolve('public/fonts');
await mkdir(out, { recursive: true });

const faces = [];
let order = 1;
for (const fam of FAMILIES) {
  const { stdout: css } = await curl(cssUrl(fam));
  const blocks = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => m[1]);
  const latin = blocks.filter(
    (b) => /unicode-range:\s*U\+0000-00FF/i.test(b) && !/U\+0100-02FF/i.test(b),
  );
  if (latin.length === 0) throw new Error(`no se halló subset latin para ${fam.src}`);
  const seen = new Set();
  for (const b of latin) {
    const style = /font-style:\s*(\w+)/.exec(b)?.[1];
    const wght = /font-weight:\s*(\d{3})/.exec(b)?.[1];
    const url = /url\((https:\/\/[^)]+\.woff2)\)/.exec(b)?.[1];
    const key = `${fam.name}-${style === 'italic' ? 'italic-' : ''}${wght}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const file = resolve(out, `${key}.woff2`);
    await curl(url, file);
    const { stdout: sizeRaw } = await run('stat', ['-f', '%z', file]);
    const size = sizeRaw.trim();
    faces.push({ src: fam.src, key, style, wght });
    console.log(`ok public/fonts/${key}.woff2 (${size} B)`);
    order += 1;
  }
}

const css = faces
  .map(
    (f) =>
      `@font-face {\n  font-family: '${f.src}';\n  font-style: ${f.style};\n  font-weight: ${f.wght};\n  font-display: swap;\n  src: url('/fonts/${f.key}.woff2') format('woff2');\n  unicode-range: U+0000-00FF;\n}`,
  )
  .join('\n\n') + '\n';

await writeFile(resolve('src/styles/fonts.css'), css);
console.log(`ok src/styles/fonts.css (${faces.length} caras latin)`);