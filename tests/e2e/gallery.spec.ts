import { test, expect } from '@playwright/test';

test.describe('galería (scroll-snap + lightbox)', () => {
  test('muestra 8 fotos y las flechas desplazan el carrusel', async ({ page }) => {
    await page.goto('/');
    const track = page.locator('[data-gallery]');
    await expect(track).toBeVisible();
    await expect(page.locator('.gallery-open')).toHaveCount(8);

    const snap = await track.evaluate((el) => getComputedStyle(el).scrollSnapType);
    expect(snap).toContain('x');

    const before = await track.evaluate((el) => el.scrollLeft);
    await page.locator('.gallery-arrow[data-dir="1"]').click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });

  test('el lightbox abre con la foto elegida, navega con wrap y cierra', async ({ page }) => {
    await page.goto('/');
    const dialog = page.locator('#lightbox');
    const img = page.locator('#lb-img');
    await expect(dialog).not.toHaveAttribute('open', '');

    await page.locator('.gallery-open').first().click();
    await expect(dialog).toHaveAttribute('open', '');
    const firstSrc = await img.getAttribute('src');
    expect(firstSrc).toBeTruthy();
    await expect(page.locator('#lb-cap')).not.toBeEmpty();

    await page.locator('[data-prev]').click();
    await expect.poll(() => img.getAttribute('src')).not.toBe(firstSrc);

    await page.locator('[data-close]').click();
    await expect(dialog).not.toHaveAttribute('open', '');
  });
});

test.describe('autoplay de la galería', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('avanza sola cuando es visible y el botón pausa/reanuda (WCAG 2.2.2)', async ({ page }) => {
    // Acelera el ciclo para un test determinista (el markup usa 4500 ms).
    await page.route(
      (url) => url.pathname === '/',
      async (route) => {
        const res = await route.fetch();
        const body = (await res.text()).replace('data-delay="4500"', 'data-delay="1000"');
        await route.fulfill({ response: res, body });
      },
    );
    await page.goto('/');
    const track = page.locator('[data-gallery]');
    const toggle = page.locator('[data-gallery-toggle]');
    await expect(page.locator('html')).toHaveClass(/js/);
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('data-state', 'playing');

    await page.locator('#galeria').scrollIntoViewIfNeeded();
    const before = await track.evaluate((el) => el.scrollLeft);
    await expect
      .poll(() => track.evaluate((el) => el.scrollLeft), { timeout: 8000 })
      .toBeGreaterThan(before);

    await toggle.click();
    await expect(toggle).toHaveAttribute('data-state', 'paused');
    await expect(toggle).toHaveAttribute('aria-label', /reanudar/i);
    // Deja asentar el smooth-scroll en curso antes de congelar la posición.
    await page.waitForTimeout(1000);
    const frozen = await track.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(2200);
    expect(await track.evaluate((el) => el.scrollLeft)).toBe(frozen);
  });

  test('sin preferencia de movimiento arranca pausada y el toggle la reanuda', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const toggle = page.locator('[data-gallery-toggle]');
    await expect(toggle).toHaveAttribute('data-state', 'paused');
    await toggle.click();
    await expect(toggle).toHaveAttribute('data-state', 'playing');
  });

  test('sin JS el control de pausa no se muestra (no hay botón muerto)', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('[data-gallery-toggle]')).toBeHidden();
    await context.close();
  });

  test('/en/ tiene la misma galería con el control en inglés', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('.gallery-open')).toHaveCount(8);
    const toggle = page.locator('[data-gallery-toggle]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-label', /pause|resume/i);
  });
});
