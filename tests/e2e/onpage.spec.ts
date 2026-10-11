import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
const NOT_FOUND_ROUTE = '/esta-ruta-no-existe/';
const ALL_ROUTES = [...ROUTES, NOT_FOUND_ROUTE];
const CRUMB_ROUTES = ['/menu/', '/nosotros/', '/eventos/', '/contacto/'];

test.describe('jerarquía de encabezados', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} sin saltos de nivel y un solo h1`, async ({ page }) => {
      await page.goto(route);
      const levels = await page.evaluate(() =>
        Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) =>
          Number(h.tagName.slice(1)),
        ),
      );
      expect(levels.filter((level) => level === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      let max = 1;
      for (const level of levels) {
        expect(level).toBeLessThanOrEqual(max + 1);
        max = Math.max(max, level);
      }
    });
  }
});

test.describe('anchors funcionales', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} sin href="#"`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('a[href="#"]')).toHaveCount(0);
    });

    test(`${route} cada #ancla apunta a un id existente`, async ({ page }) => {
      await page.goto(route);
      const dead = await page.evaluate(() => {
        const anchors = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
        );
        return anchors
          .map((a) => a.getAttribute('href') ?? '')
          .filter((href) => href.length > 1)
          .filter((href) => !document.getElementById(decodeURIComponent(href.slice(1))));
      });
      expect(dead).toEqual([]);
    });
  }

  test('/contacto/#reservar resuelve en /contacto/', async ({ page }) => {
    await page.goto('/contacto/');
    await expect(page.locator('#reservar')).toHaveCount(1);
  });
});

test.describe('enlaces internos (≥3 por página, fuera de header/footer y anclas)', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} tiene al menos 3 enlaces internos útiles`, async ({ page }) => {
      await page.goto(route);
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>('main a[href]'))
          .filter((a) => !a.closest('nav.breadcrumb'))
          .map((a) => a.getAttribute('href') ?? '')
          .filter((href) => href.length > 0 && !href.startsWith('#'))
          .filter((href) => !/^[a-z]+:/i.test(href)),
      );
      const unique = [...new Set(links)];
      expect(unique.length).toBeGreaterThanOrEqual(3);
    });
  }
});

test.describe('breadcrumbs coherentes', () => {
  for (const route of CRUMB_ROUTES) {
    test(`${route} usa el patrón Ruta de navegación con aria-current`, async ({ page }) => {
      await page.goto(route);
      const crumb = page.locator('nav.breadcrumb[aria-label="Ruta de navegación"]');
      await expect(crumb).toHaveCount(1);
      await expect(crumb.locator('a[href="/"]')).toHaveText('Inicio');
      await expect(crumb.locator('[aria-current="page"]')).toHaveCount(1);
      await expect(crumb.locator('> span[aria-hidden="true"]')).toHaveText('/');
    });
  }

  for (const route of ['/', NOT_FOUND_ROUTE]) {
    test(`${route} no incluye breadcrumb`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('nav.breadcrumb')).toHaveCount(0);
    });
  }
});

test.describe('og:type', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} og:type = website`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        'content',
        'website',
      );
    });
  }
});
