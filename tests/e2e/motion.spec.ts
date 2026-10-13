import { test, expect } from '@playwright/test';

// El resto de la suite corre con `reducedMotion: reduce` (estado final). Aquí
// forzamos la preferencia real de movimiento para cubrir la mejora progresiva.
test.use({ reducedMotion: 'no-preference' });

test.describe('motion (mejora progresiva)', () => {
  test('los bloques .reveal aparecen al entrar en el viewport', async ({ page }) => {
    await page.goto('/menu/');
    const blocks = page.locator('.reveal');
    const total = await blocks.count();
    expect(total).toBeGreaterThan(1);

    await expect(blocks.first()).toHaveAttribute('data-visible', '');

    const last = blocks.nth(total - 1);
    await expect(last).not.toHaveAttribute('data-visible', '');
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveAttribute('data-visible', '');

    await expect(last).toHaveCSS('opacity', '1');
  });

  test('el hero anima hasta su estado final', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('.hero-top .inner > *').first();
    await expect(first).toBeVisible();
    await expect(first).toHaveCSS('opacity', '1');
  });

  test('sin JavaScript el contenido es visible (sin recortes ni ocultado)', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/menu/');
    const block = page.locator('.reveal').first();
    await expect(block).toBeVisible();
    await expect(block).toHaveCSS('opacity', '1');
    await context.close();
  });
});
