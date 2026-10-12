// Genera public/og-image.jpg (1200x630) con una foto real de Origen y el wordmark de marca.
// Render en Chromium (Playwright) para tipografía exacta; sin dependencias nuevas.
// Uso: node scripts/generate-og-image.mjs
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const SRC = resolve('src/assets/images/ambiente/ambiente-1.jpeg');
const OUT = resolve('public/og-image.jpg');

const photo = await readFile(SRC).then((b) => b.toString('base64'));

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<style>
  :root {
    --ink: #0F0E0C;
    --cream: #F3EAD7;
    --accent: #B4572E;
    --gold: #C9A227;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  .a {
    position: relative;
    width: 1200px; height: 630px;
    background: var(--ink);
    font-family: Georgia, 'Times New Roman', serif;
  }
  img.bg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: 50% 38%;
    filter: saturate(1.08) brightness(0.86) contrast(1.04);
  }
  .scrim {
    position: absolute; inset: 0;
    background:
      linear-gradient(90deg, rgba(15,14,12,.82) 0%, rgba(15,14,12,.55) 34%, rgba(15,14,12,.18) 62%, rgba(15,14,12,.38) 100%),
      linear-gradient(0deg, rgba(15,14,12,.55) 0%, rgba(15,14,12,0) 26%);
  }
  .frame {
    position: absolute; inset: 0;
    padding: 54px 64px;
    display: flex; flex-direction: column; justify-content: center;
    color: var(--cream);
  }
  .eyebrow {
    font: 600 15px/1 'Jost', 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 500;
    font-size: 132px; line-height: .98;
    letter-spacing: .02em;
    text-shadow: 0 2px 28px rgba(0,0,0,.38);
  }
  .rule {
    width: 74px; height: 3px;
    background: var(--accent);
    margin: 26px 0 22px;
  }
  .tag {
    font: 300 27px/1.25 'Jost', 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--cream);
    opacity: .96;
  }
  .foot {
    margin-top: auto;
    display: flex; gap: 26px;
    font: 500 18px/1 'Jost', 'Helvetica Neue', Arial, sans-serif;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(243, 234, 215, .78);
  }
  .foot b { color: var(--gold); font-weight: 600; }
</style>
</head>
<body>
  <div class="a">
    <img class="bg" alt="" src="data:image/jpeg;base64,${photo}" />
    <div class="scrim"></div>
    <div class="frame">
      <div class="eyebrow">Restaurante · Jacó</div>
      <h1>Origen</h1>
      <div class="rule"></div>
      <div class="tag">Mar · Tierra · Fuego</div>
      <div class="foot">
        <span>Costa Rica</span>
        <span><b>origenjaco</b>.com</span>
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.locator('img.bg').evaluate((el) => el.decode ? el.decode() : true);
await page.screenshot({ path: OUT, type: 'jpeg', quality: 86 });
await browser.close();

const buf = await readFile(OUT);
console.log(`ok public/og-image.jpg: ${buf.length} bytes`);