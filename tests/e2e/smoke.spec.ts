import { test, expect, type ConsoleMessage, type Page } from '@playwright/test';

const ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
const NOT_FOUND_ROUTE = '/esta-ruta-no-existe/';

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message: ConsoleMessage) => {
    if (message.type() === 'error') {
      errors.push(`${message.text()} @ ${message.location()?.url ?? ''}`);
    }
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

test.describe('smoke', () => {
  for (const route of ROUTES) {
    test(`${route} responde 200, un h1 visible y sin errores de consola`, async ({ page }) => {
      const errors = trackErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test(`ruta inexistente responde 404 con h1 "Página no encontrada"`, async ({ page }) => {
    const errors = trackErrors(page);
    const response = await page.goto(NOT_FOUND_ROUTE);
    expect(response?.status()).toBe(404);
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Página no encontrada');
    const expectedNotFound = errors.filter(
      (error) => error.includes('status of 404') && error.endsWith(NOT_FOUND_ROUTE),
    );
    expect(errors.filter((error) => !expectedNotFound.includes(error))).toEqual([]);
  });
});
