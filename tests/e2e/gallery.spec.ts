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
