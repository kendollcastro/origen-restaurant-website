import { test, expect, type ConsoleMessage, type Page } from '@playwright/test';

const ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/', '/404.html'];

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message: ConsoleMessage) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

test.describe('sin scroll horizontal a 360px', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const route of ROUTES) {
    test(`${route} scrollWidth ≤ viewport`, async ({ page }) => {
      await page.goto(route);
      const sizes = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
    });
  }
});

test.describe('menú colapsado a ≤760px', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const route of ROUTES) {
    test(`${route} botón con aria-expanded, teclado abre y Escape cierra`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(route);

      const toggle = page.locator('.nav-toggle');
      const nav = page.locator('#main-nav');
      await expect(toggle).toBeVisible();
      await expect(toggle).toHaveAttribute('type', 'button');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');

      const controls = await toggle.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      await expect(page.locator(`#${controls}`)).toHaveCount(1);
      await expect(nav).toBeHidden();

      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(nav).toBeVisible();

      const heights = await nav.locator('a').evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().height),
      );
      expect(heights.length).toBeGreaterThan(0);
      for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);

      const sizes = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);

      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
      await expect(nav).toBeHidden();

      expect(errors).toEqual([]);
    });

    test(`${route} clic fuera del panel lo cierra`, async ({ page }) => {
      await page.goto(route);
      const toggle = page.locator('.nav-toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.locator('main h1').click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });
  }
});

test.describe('fallback sin JavaScript', () => {
  test('el nav sigue visible y el botón no aparece', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 360, height: 740 },
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('#main-nav')).toBeVisible();
    const links = page.locator('#main-nav a');
    await expect(links.first()).toBeVisible();
    expect(await links.count()).toBeGreaterThan(1);
    await expect(page.locator('.nav-toggle')).toBeHidden();
    await context.close();
  });
});
