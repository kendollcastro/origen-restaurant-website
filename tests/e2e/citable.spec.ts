import { test, expect } from '@playwright/test';
import { faqs } from '../../src/data/faq';
import { site } from '../../src/data/site';

// T-41 · Contenido citable por IA.
// 1) Respuestas de FAQ autoconclusivas de ≤40 palabras (verificado sin navegador).
// 2) Cada página responde «qué es Origen y cuándo abre» en sus primeros párrafos.
// 3) FAQPage JSON-LD 1:1 con las <details> visibles.

const ES_ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
const EN_ROUTES = ['/en/', '/en/menu/', '/en/nosotros/', '/en/eventos/', '/en/contacto/'];

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const WHAT = /(mariscos|parrilla|seafood|\bgrill\b)/i;
const OPENS = /11:00/;
const CLOSES = /(10:00\s*pm|22:00)/i;

test.describe('T-41 · FAQ citable (≤40 palabras, sin placeholders)', () => {
  for (const f of faqs) {
    test(`ES "${f.q}"`, () => {
      expect(words(f.a), f.a).toBeLessThanOrEqual(40);
      expect(f.a).not.toMatch(/\[[^\]]*\]/);
      expect(f.a.trim()).not.toBe('');
    });
    test(`EN "${f.qEn}"`, () => {
      expect(words(f.aEn as string), f.aEn as string).toBeLessThanOrEqual(40);
      expect(f.aEn as string).not.toMatch(/\[[^\]]*\]/);
      expect((f.aEn as string).trim()).not.toBe('');
    });
  }
});

test.describe('T-41 · cada página responde qué es y cuándo abre', () => {
  for (const route of [...ES_ROUTES, ...EN_ROUTES]) {
    test(`${route} · primeros párrafos con tipo de cocina y horario`, async ({ page }) => {
      await page.goto(route);
      const text = (await page.locator('main p').allInnerTexts()).slice(0, 3).join(' ');
      expect(text, 'no menciona qué es Origen').toMatch(WHAT);
      expect(text, 'no menciona la apertura').toMatch(OPENS);
      expect(text, 'no menciona el cierre').toMatch(CLOSES);
    });
  }
});

test.describe('T-41 · FAQPage 1:1 con las preguntas visibles', () => {
  for (const [route, q] of [
    ['/contacto/', (f: (typeof faqs)[number]) => f.q],
    ['/en/contacto/', (f: (typeof faqs)[number]) => f.qEn as string],
  ] as const) {
    test(`${route} · una Question por <details>`, async ({ page }) => {
      await page.goto(route);
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const schema = scripts
        .map((s) => JSON.parse(s))
        .flat()
        .find((node) => node['@type'] === 'FAQPage');
      const shown = await page.locator('.faq details').count();
      expect(shown).toBeGreaterThan(0);
      expect(schema.mainEntity).toHaveLength(shown);
      expect(schema.mainEntity.map((n: { name: string }) => n.name)).toEqual(faqs.map(q));
    });
  }
});
