import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { site } from '../../src/data/site';
import { isReal } from '../../src/data/placeholders';

// Interfaz interna de QR (/qr/): no enlazada desde el sitio, noindex y fuera del sitemap.
// Es data-driven: al confirmar el cliente nuevos enlaces en `site.ts`, sus tarjetas
// aparecen y este test lo valida sin cambios.

const QR_ROUTE = '/qr/';
const ES_ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];

const realTargets = [site.mapsUrl, site.social.tripadvisor].filter(isReal);
const pendingTargets = [site.mapsUrl, site.social.tripadvisor].filter((u) => !isReal(u));

test.describe('Interfaz de QR (/qr/)', () => {
  test('responde 200 con noindex', async ({ page }) => {
    const response = await page.goto(QR_ROUTE);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('un QR por enlace real, con su URL visible', async ({ page }) => {
    await page.goto(QR_ROUTE);
    const cards = page.locator('.qr-card');
    await expect(cards).toHaveCount(realTargets.length);
    expect(realTargets.length).toBeGreaterThan(0);
    for (const url of realTargets) {
      await expect(page.locator(`.qr-card a[href="${url}"]`)).toBeVisible();
    }
    await expect(page.locator('.qr-card svg')).toHaveCount(realTargets.length);
    if (pendingTargets.length > 0) {
      await expect(page.locator('.qr-pending')).toBeVisible();
    } else {
      await expect(page.locator('.qr-pending')).toHaveCount(0);
    }
  });

  test('no está enlazada desde ninguna página del sitio', async ({ request }) => {
    for (const route of ES_ROUTES) {
      const html = await (await request.get(route)).text();
      expect(html, `${route} enlaza a /qr/`).not.toContain('/qr');
    }
  });

  test('queda fuera del sitemap', async ({ request }) => {
    const map = await (await request.get('/sitemap-0.xml')).text();
    expect(map).not.toContain('/qr');
  });

  test('sin violaciones de accesibilidad serious/critical', async ({ page }) => {
    await page.goto(QR_ROUTE);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(
      blocking.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
});
