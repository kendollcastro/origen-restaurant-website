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
