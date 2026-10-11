import { test, expect } from '@playwright/test';

// T-35 · Arquitectura i18n: rutas /en/, prop lang, noindex y switcher ES↔EN.
// El contenido EN es provisional (TODO P-22); estas aserciones validan estructura y navegación,
// no copy. T-36/T-37 sustituirán el texto; T-38 hará hreflang/indexación final y el sitemap bilingüe.

const ES_ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
const EN_ROUTES = ['/en/', '/en/menu/', '/en/nosotros/', '/en/eventos/', '/en/contacto/'];

const ES_H1: Record<string, string> = {
  '/': 'Restaurante de mariscos y parrilla en Jacó',
  '/menu/': 'Menú',
  '/nosotros/': 'Historia',
  '/eventos/': 'Eventos y grupos',
  '/contacto/': 'Reservas y contacto',
};

test.describe('/en/ · rutas y lang', () => {
  for (const route of EN_ROUTES) {
    test(`${route} responde 200 con <html lang="en">`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });

    test(`${route} emite robots noindex (traducción pendiente P-22)`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  }
});

test.describe('el sitio ES no cambia', () => {
  for (const route of ES_ROUTES) {
    test(`${route} mantiene el h1 y no lleva robots noindex`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveText(ES_H1[route]);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    });
  }
});

test.describe('switcher ES ↔ EN', () => {
  test('ES → EN por ruta equivalente (/menu/ → /en/menu/)', async ({ page }) => {
    await page.goto('/menu/');
    await page.locator('.lang a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/menu\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('EN → ES por ruta equivalente (/en/eventos/ → /eventos/)', async ({ page }) => {
    await page.goto('/en/eventos/');
    await page.locator('.lang a[hreflang="es"]').click();
    await expect(page).toHaveURL(/\/eventos\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('en / el EN es un enlace real, enfocable y con aria-label', async ({ page }) => {
    await page.goto('/');
    const en = page.locator('.lang a[hreflang="en"]');
    await expect(en).toHaveAttribute('href', '/en/');
    await expect(en).toHaveAttribute('hreflang', 'en');
    await expect(en).toHaveAttribute('aria-label', /inglés/i);
    await en.focus();
    await expect(en).toBeFocused();
  });

  test('la ruta activa marca aria-current y el otro idioma navega', async ({ page }) => {
    await page.goto('/en/nosotros/');
    await expect(page.locator('.lang a[aria-current="true"]')).toHaveText('EN');
    await expect(page.locator('.lang a[hreflang="es"]')).toHaveAttribute('href', '/nosotros/');
  });
});