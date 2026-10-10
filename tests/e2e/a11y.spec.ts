import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/', '/esta-ruta-no-existe/'];

test.describe('a11y (axe)', () => {
  for (const route of ROUTES) {
    test(`${route} sin violaciones serious/critical`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );
      const nonBlocking = results.violations.filter(
        (violation) => violation.impact !== 'serious' && violation.impact !== 'critical',
      );
      if (nonBlocking.length > 0) {
        console.log(
          `[a11y] ${route} violaciones no bloqueantes: ${nonBlocking
            .map((violation) => `${violation.id}(${violation.impact ?? 'unknown'})`)
            .join(', ')}`,
        );
      }
      expect(
        blocking.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
    });
  }
});

test.describe('skip link', () => {
  for (const route of ROUTES) {
    test(`${route} visible con Tab, dentro del viewport y con foco en #contenido`, async ({ page }) => {
      await page.goto(route);
      await page.keyboard.press('Tab');

      const skip = page.locator('a.skip-link');
      await expect(skip).toBeFocused();
      await expect(skip).toContainText('Saltar al contenido');

      const box = await skip.boundingBox();
      const viewport = page.viewportSize();
      expect(box).not.toBeNull();
      expect(viewport).not.toBeNull();
      expect(box!.width).toBeGreaterThan(50);
      expect(box!.height).toBeGreaterThan(20);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);

      const outline = await skip.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor };
      });
      expect(outline.style).toBe('solid');
      expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
      expect(outline.color).not.toBe('rgba(0, 0, 0, 0)');

      await page.keyboard.press('Enter');
      await expect(page.locator('#contenido')).toBeFocused();
    });
  }
});
