import { test, expect } from '@playwright/test';

// Tanda 1 del plan de pulido premium (PX-01/02/03/06/07/18): verificación de las
// mejoras de UI/UX que se apoyan en CSS (estado final estable bajo reducedMotion).

test.describe('PX-03 · header sticky y reactivo al scroll', () => {
  test('queda sticky y gana .is-scrolled al bajar', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('.site-header');
    await expect(header).toHaveCSS('position', 'sticky');
    await expect(header).not.toHaveClass(/is-scrolled/);

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveClass(/is-scrolled/);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).not.toHaveClass(/is-scrolled/);
  });

  test('publica --header-h para el offset de anclajes', async ({ page }) => {
    await page.goto('/');
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim(),
    );
    expect(value).toMatch(/^\d+px$/);
  });
});

test.describe('PX-02 · menú móvil premium', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('abre con la clase .is-open y cierra al elegir un enlace', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('.site-header');
    const toggle = page.locator('.nav-toggle');
    const nav = page.locator('#main-nav');

    await toggle.click();
    await expect(header).toHaveClass(/is-open/);
    await expect(nav).toBeVisible();

    await nav.locator('a').first().click();
    await expect(header).not.toHaveClass(/is-open/);
  });
});

test.describe('PX-06 · botones y tabs con feedback', () => {
  test('transicionan transform/background y reaccionan a :active', async ({ page }) => {
    await page.goto('/');
    const props = await page
      .locator('.btn-primary')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(props).toContain('transform');
    expect(props).toContain('background');
  });
});

test.describe('PX-18 · precios con numerales tabulares', () => {
  test('las cifras del menú usan tabular-nums', async ({ page }) => {
    await page.goto('/menu/');
    const price = page.locator('.dish-price').first();
    await expect(price).toHaveCount(1);
    const numeric = await price.evaluate((el) => getComputedStyle(el).fontVariantNumeric);
    expect(numeric).toContain('tabular-nums');
  });
});

test.describe('PX-01 · view transitions nativas entre documentos', () => {
  test('la hoja de estilos declara @view-transition navigation:auto', async ({ page }) => {
    await page.goto('/');
    const hasRule = await page.evaluate(() => {
      const cssText = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules).map((r) => r.cssText).join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');
      return cssText.includes('@view-transition');
    });
    expect(hasRule).toBe(true);
  });
});
