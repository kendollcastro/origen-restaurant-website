import { test, expect } from '@playwright/test';

const hoyEnCR = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Costa_Rica',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/ · todas las categorías del menú son visibles', async ({ page }) => {
    await page.goto('/');
    const panels = page.locator('[role="tabpanel"]');
    await expect(panels).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const panel = panels.nth(i);
      await expect(panel).toBeVisible();
      await expect(panel.locator('.panel-title')).toBeVisible();
      await expect(panel.locator('.dish').first()).toBeVisible();
    }
    await expect(page.locator('.tabs')).toBeHidden();
    await expect(page.locator('#tab-entradas')).toBeHidden();
  });

  test('/ · enlace wa.me visible y form con action a wa.me', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form[action*="wa.me"]');
    await expect(form).toHaveCount(1);
    await expect(form).toHaveAttribute('method', 'get');
    const action = await form.getAttribute('action');
    expect(action?.startsWith('https://wa.me/')).toBe(true);
    await expect(form.locator('a[href*="wa.me"]')).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
  });

  test('/eventos/ · enlace wa.me visible y form con action a wa.me', async ({ page }) => {
    await page.goto('/eventos/');
    const form = page.locator('#event-form');
    const action = await form.getAttribute('action');
    expect(action?.startsWith('https://wa.me/')).toBe(true);
    await expect(form.locator('a[href*="wa.me"]')).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();
  });
});

test.describe('tabs con JavaScript', () => {
  test('/ · un panel visible por defecto y cambio por clic y teclado', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tabs')).toBeVisible();
    await expect(page.locator('.panel-title').first()).toBeHidden();
    await expect(page.locator('[role="tabpanel"][hidden]')).toHaveCount(3);
    await expect(page.locator('#panel-entradas')).toBeVisible();

    await page.locator('#tab-parrilla').click();
    await expect(page.locator('#panel-parrilla')).toBeVisible();
    await expect(page.locator('#panel-entradas')).toBeHidden();
    await expect(page.locator('#tab-parrilla')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tab-entradas')).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('[role="tabpanel"][hidden]')).toHaveCount(3);

    await page.locator('#tab-parrilla').press('ArrowRight');
    await expect(page.locator('#tab-ninos')).toBeFocused();
    await expect(page.locator('#tab-ninos')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-ninos')).toBeVisible();
    await expect(page.locator('#panel-parrilla')).toBeHidden();
    await expect(page.locator('[role="tabpanel"][hidden]')).toHaveCount(3);
  });
});

test.describe('date.min en hora de Costa Rica', () => {
  test('/ y /eventos/ · min es hoy en America/Costa_Rica', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.reserve-form input[type="date"]')).toHaveAttribute('min', hoyEnCR());
    await page.goto('/eventos/');
    await expect(page.locator('#e-d')).toHaveAttribute('min', hoyEnCR());
  });

  test('/ · 18:00 y 23:59 en CR (día siguiente en UTC) siguen ofreciendo hoy', async ({ page }) => {
    const min = page.locator('.reserve-form input[type="date"]');
    await page.clock.install({ time: new Date('2026-01-11T00:00:00.000Z') });
    await page.goto('/');
    await expect(min).toHaveAttribute('min', '2026-01-10');

    await page.clock.setSystemTime(new Date('2026-01-11T05:59:00.000Z'));
    await page.reload();
    await expect(min).toHaveAttribute('min', '2026-01-10');

    await page.clock.setSystemTime(new Date('2026-01-11T06:00:00.000Z'));
    await page.reload();
    await expect(min).toHaveAttribute('min', '2026-01-11');
  });
});
