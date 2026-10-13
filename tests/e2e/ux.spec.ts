import { test, expect, type ConsoleMessage, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { site } from '../../src/data/site';

// T-51 · QA UX multi-dispositivo (F7): teclado, contraste, 360/768/1440px, LCP lab 4G
// y entrega real de los formularios a WhatsApp (interceptando window.open).
// Referencia: WCAG 2.1 AA (4.5:1 texto normal, 3:1 texto grande/UI) y foco ≥3:1.

const ES_ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
const EN_ROUTES = ['/en/', '/en/menu/', '/en/nosotros/', '/en/eventos/', '/en/contacto/'];
const ALL_ROUTES = [...ES_ROUTES, '/404.html'];
const WHATSAPP = site.whatsapp;

async function noConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (m: ConsoleMessage) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

// El elemento con foco actual, con su href para las anclas del switcher.
function focusedKey(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return 'BODY';
    const href = el instanceof HTMLAnchorElement ? el.getAttribute('href') ?? '' : '';
    return `${el.tagName.toLowerCase()}#${el.id || ''}${href ? '@' + href : ''}`;
  });
}

// Recorre Tab y detecta trampas de foco: si en N saltos no se llega al final (BODY,
// que significa que el foco "envuelve" fuera del documento) ni aparecen controles
// nuevos, hay un corte. Un input de fecha retiene el foco unos pocos saltos
// (segmentos mm/dd/aaaa), por eso se toleran ≤6 saltos sin elemento nuevo.
async function walkTabs(page: Page, taps = 45) {
  const seen = new Set<string>();
  const order: string[] = [];
  let tapsSinceNew = 0;
  for (let i = 0; i < taps; i++) {
    await page.keyboard.press('Tab');
    const key = await focusedKey(page);
    if (key === 'BODY') return { bodyReached: true, taps: i + 1, seen, order };
    if (!seen.has(key)) {
      seen.add(key);
      tapsSinceNew = 0;
    } else {
      tapsSinceNew += 1;
      if (tapsSinceNew > 6) break;
    }
    order.push(key);
  }
  return { bodyReached: false, taps, seen, order };
}

// --- 1. Teclado -------------------------------------------------------------

test.describe('teclado (T-51)', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const route of ALL_ROUTES) {
    test(`${route} · skip-link primero, sin trampa de foco y switcher EN en el orden de Tab`, async ({
      page,
    }) => {
      await page.goto(route);
      await page.keyboard.press('Tab');
      await expect(page.locator('a.skip-link')).toBeFocused();

      const { bodyReached, seen, order } = await walkTabs(page);

      expect(
        bodyReached || seen.size >= 10,
        `posible trampa de foco en ${route}: ${order.slice(0, 12).join(' -> ')}`,
      ).toBe(true);

      // El switcher EN (href /en/… en las páginas ES) se alcanza con Tab.
      const enInOrder = [...seen].some((key) => key.includes('@/en/'));
      expect(enInOrder, `switcher EN no alcanzado en ${route}`).toBe(true);
    });
  }

  test('/ · menú móvil operable con teclado: abrir, Shift+Tab entra al nav, Escape cierra y vuelve el foco', async ({
    page,
  }) => {
    await page.goto('/');
    const toggle = page.locator('.nav-toggle');
    const nav = page.locator('#main-nav');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();

    // El nav está ANTES del toggler en el DOM: Shift+Tab desde el toggler entra directo
    // a los enlaces desplegados (los enlaces también se alcanzan con Tab tras el wrap).
    await page.keyboard.press('Shift+Tab');
    const activeInNav = await nav.evaluate((n) => n.contains(document.activeElement));
    expect(activeInNav).toBe(true);

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    await expect(nav).toBeHidden();
  });

  test('/ · anillo de foco visible con contraste ≥3:1 (oscuro y claro)', async ({ page }) => {
    await page.goto('/');
    const results = await page.evaluate(async () => {
      const rgb = (c: string) => {
        const m = c.match(/[\d.]+/g) ?? [];
        return { r: Number(m[0]), g: Number(m[1]), b: Number(m[2]) };
      };
      const toLum = ({ r, g, b }: { r: number; g: number; b: number }) =>
        [r, g, b].map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      const contrast = (a: string, b: string) => {
        const l1 = toLum(rgb(a));
        const l2 = toLum(rgb(b));
        const L1 = 0.2126 * l1[0] + 0.7152 * l1[1] + 0.0722 * l1[2];
        const L2 = 0.2126 * l2[0] + 0.7152 * l2[1] + 0.0722 * l2[2];
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      };
      const measure = async (el: HTMLElement) => {
        el.focus();
        const cs = getComputedStyle(el);
        let node: Element | null = el;
        let bgColor = '';
        while (node) {
          const c = getComputedStyle(node).backgroundColor;
          if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
            bgColor = c;
            break;
          }
          node = node.parentElement;
        }
        return { outlineColor: cs.outlineColor, outlineWidth: parseFloat(cs.outlineWidth), bgColor };
      };

      const dark = document.querySelector<HTMLElement>('.main-nav a');
      const light = Array.from(document.querySelectorAll<HTMLElement>('.light a')).find((a) =>
        a.getBoundingClientRect().width > 0,
      );
      const darkInfo = dark ? await measure(dark) : null;
      const lightInfo = light ? await measure(light) : null;
      return {
        dark: darkInfo ? { ...darkInfo, ratio: contrast(darkInfo.outlineColor, darkInfo.bgColor) } : null,
        light: lightInfo ? { ...lightInfo, ratio: contrast(lightInfo.outlineColor, lightInfo.bgColor) } : null,
      };
    });
    expect(results.dark).not.toBeNull();
    expect(results.light).not.toBeNull();
    expect(results.dark!.ratio).toBeGreaterThanOrEqual(3);
    expect(results.light!.ratio).toBeGreaterThanOrEqual(3);
    expect(results.dark!.outlineWidth).toBeGreaterThanOrEqual(2);
    expect(results.light!.outlineWidth).toBeGreaterThanOrEqual(2);
    test.info().annotations.push({
      type: 'foco',
      description: `anillo dark ${results.dark!.ratio.toFixed(2)}:1 · light ${results.light!.ratio.toFixed(2)}:1`,
    });
  });
});

test.describe('teclado desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('/ · sin trampa de foco a 1440px y skip-link primero', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('a.skip-link')).toBeFocused();
    const { bodyReached, seen } = await walkTabs(page);
    expect(bodyReached || seen.size >= 10).toBe(true);
  });
});

// --- 2. Contraste -----------------------------------------------------------

test.describe('contraste (T-51)', () => {
  for (const route of ES_ROUTES) {
    test(`${route} · axe 0 violaciones color-contrast`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const cc = results.violations.filter((v) => v.id === 'color-contrast');
      expect(
        cc.map((v) => v.nodes.map((n) => n.target)),
        `color-contrast en ${route}`,
      ).toEqual([]);
      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(serious).toEqual([]);
    });
  }

  test('· .script/acentos reales sobre fondos oscuros (.ph) y claros (crema) ≥4.5:1', async ({
    page,
  }) => {
    const lum = (c: { r: number; g: number; b: number }) => {
      const [r, g, b] = [c.r, c.g, c.b].map((v) => v / 255).map((v) =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
      );
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
      const L1 = lum(a);
      const L2 = lum(b);
      return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    };
    const parse = (c: string) => {
      const m = c.match(/[\d.]+/g) ?? [];
      return { r: Number(m[0]), g: Number(m[1]), b: Number(m[2]) };
    };

    await page.goto('/');
    const hero = await page.evaluate(() => {
      const script = document.querySelector('.hero .script') as HTMLElement | null;
      if (!script) return null;
      const cs = getComputedStyle(script);
      const ph = script.closest('.ph');
      return { fg: cs.color, bg: ph ? getComputedStyle(ph).backgroundColor : '' };
    });
    await page.goto('/contacto/');
    const light = await page.evaluate(() => {
      const script = Array.from(document.querySelectorAll<HTMLElement>('.light .script')).find((s) =>
        s.getBoundingClientRect().width > 0,
      );
      if (!script) return null;
      const cs = getComputedStyle(script);
      let node: Element | null = script;
      let bg = '';
      while (node) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
          bg = c;
          break;
        }
        node = node.parentElement;
      }
      return { fg: cs.color, bg };
    });

    expect(hero).not.toBeNull();
    expect(light).not.toBeNull();
    const heroRatio = ratio(parse(hero!.fg), parse(hero!.bg));
    const lightRatio = ratio(parse(light!.fg), parse(light!.bg));
    // Texto grande (script) exige ≥3:1; se usa 4.5:1 como criterio estricto de AA.
    expect(heroRatio, `hero .script ${heroRatio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    expect(lightRatio, `light .script ${lightRatio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    test.info().annotations.push({
      type: 'contraste',
      description: `hero .script ${heroRatio.toFixed(2)}:1 (${hero!.fg} sobre ${hero!.bg}) · light .script ${lightRatio.toFixed(2)}:1 (${light!.fg} sobre ${light!.bg})`,
    });
  });
});

// --- 3. Responsive 360/768/1440 ---------------------------------------------

const VIEWPORTS = [
  { name: '360x740', width: 360, height: 740 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1440x900', width: 1440, height: 900 },
];

test.describe('responsive (T-51)', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`${vp.name}px`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const route of [...ALL_ROUTES, ...EN_ROUTES]) {
        test(`${route} · sin desborde horizontal, CTAs y formularios dentro del viewport`, async ({
          page,
        }) => {
          await page.goto(route);
          const report = await page.evaluate(() => {
            const de = document.documentElement;
            const overflowEls = Array.from(document.querySelectorAll('body *'))
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.right > de.clientWidth + 1;
              })
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
            const buttons = Array.from(document.querySelectorAll<HTMLElement>('.btn')).map((el) => ({
              text: el.textContent?.trim().slice(0, 30) ?? '',
              right: el.getBoundingClientRect().right,
              vis: el.getBoundingClientRect().height > 0,
            }));
            const forms = Array.from(document.querySelectorAll('form')).map((f) => ({
              id: f.id,
              right: f.getBoundingClientRect().right,
            }));
            return {
              overflow: de.scrollWidth > de.clientWidth,
              scrollW: de.scrollWidth,
              clientW: de.clientWidth,
              overflowEls,
              ctasOccluded: buttons.filter((b) => !b.vis).map((b) => b.text),
              ctasOverflow: buttons.filter((b) => b.right > de.clientWidth + 1).map((b) => b.text),
              formsOverflow: forms.filter((f) => f.right > de.clientWidth + 1),
            };
          });
          expect(report.overflow, JSON.stringify(report.overflowEls)).toBe(false);
          expect(report.ctasOccluded).toEqual([]);
          expect(report.ctasOverflow).toEqual([]);
          expect(report.formsOverflow).toEqual([]);
        });
      }
    });
  }

  for (const vp of VIEWPORTS) {
    test(`/${vp.name} · tarjetas mar/tierra/fuego y footer sin desborde`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await expect(page.locator('.element')).toHaveCount(3);
      const { bad, right, client } = await page.evaluate(() => {
        const de = document.documentElement;
        const bad = Array.from(document.querySelectorAll('.element, footer')).filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > de.clientWidth + 1;
        });
        return { bad: bad.length, right: de.scrollWidth, client: de.clientWidth };
      });
      expect(bad).toBe(0);
      expect(right).toBeLessThanOrEqual(client);
      await expect(page.locator('.element h3').nth(1)).toHaveText('Tierra');
      await expect(page.locator('footer.site-footer')).toBeVisible();
    });
  }
});

// --- 3b. Paridad ES ↔ EN (T-37) ---------------------------------------------
// La traducción EN crece ~20%: se verifica que el árbol de encabezados, los CTAs por
// sección y las piezas decorativas (.script/.caps) se mantengan equivalentes y legibles.

const ROUTE_PAIRS: [string, string][] = [
  ['/', '/en/'],
  ['/menu/', '/en/menu/'],
  ['/nosotros/', '/en/nosotros/'],
  ['/eventos/', '/en/eventos/'],
  ['/contacto/', '/en/contacto/'],
];

// Enlace EN equivalente: prefija las rutas de página con /en, deja anclas, externos y ficheros igual.
const toEnHref = (href: string) =>
  /^\/(?!\/)/.test(href) && !/\.\w+$/.test(href) ? `/en${href}` : href;
// Normaliza enlaces a WhatsApp (el mensaje se localiza): se compara solo la base.
const stripQuery = (href: string) => href.split('?')[0];

test.describe('T-37 · paridad ES ↔ EN', () => {
  for (const [es, en] of ROUTE_PAIRS) {
    test(`${en} · mismo árbol de encabezados que ${es}`, async ({ page }) => {
      const outline = async (route: string) => {
        await page.goto(route);
        return page.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
          els.map((el) => Number(el.tagName[1])),
        );
      };
      const esOutline = await outline(es);
      const enOutline = await outline(en);
      expect(enOutline).toEqual(esOutline);
      expect(enOutline.filter((n) => n === 1)).toHaveLength(1);
    });

    test(`${en} · CTAs equivalentes a ${es}`, async ({ page }) => {
      const ctaHrefs = async (route: string) => {
        await page.goto(route);
        return page.$$eval('a.btn', (els) =>
          els.map((el) => el.getAttribute('href') ?? ''),
        );
      };
      const esHrefs = (await ctaHrefs(es)).map((h) => toEnHref(stripQuery(h)));
      const enHrefs = (await ctaHrefs(en)).map(stripQuery);
      expect(enHrefs).toEqual(esHrefs);
    });

    test(`${en} · .script y .caps usan la tipografía de marca y no se recortan a 360px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 740 });
      await page.goto(en);
      const report = await page.evaluate(async () => {
        await document.fonts.ready;
        const read = (sel: string) =>
          Array.from(document.querySelectorAll<HTMLElement>(sel)).map((el) => {
            const cs = getComputedStyle(el);
            return {
              text: el.textContent?.trim().slice(0, 40) ?? '',
              font: cs.fontFamily.toLowerCase(),
              loaded: document.fonts.check(`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`),
              clipped: el.scrollWidth > el.clientWidth + 1,
            };
          });
        return { script: read('.script'), caps: read('.caps') };
      });
      for (const item of report.script) {
        expect(item.font, `script: ${item.text}`).toContain('cormorant');
        expect(item.loaded, `script sin cargar: ${item.text}`).toBe(true);
        expect(item.clipped, `script recortado: ${item.text}`).toBe(false);
      }
      for (const item of report.caps) {
        expect(item.font, `caps: ${item.text}`).toContain('jost');
        expect(item.loaded, `caps sin cargar: ${item.text}`).toBe(true);
        expect(item.clipped, `caps recortado: ${item.text}`).toBe(false);
      }
    });
  }
});

// --- 4. LCP lab 4G + errores de consola --------------------------------------

test.describe('rendimiento lab y consola (T-51)', () => {
  test('home · LCP < 2,5 s simulando 4G (referencia lab; fotos reales llegan en T-26)', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    await page.addInitScript(() => {
      (window as unknown as { __lcp: { t: number; e: string }[] }).__lcp = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as unknown as { startTime: number; element?: Element };
          (window as unknown as { __lcp: { t: number; e: string }[] }).__lcp.push({
            t: e.startTime,
            e: e.element ? `${e.element.tagName}.${e.element.className}` : '?',
          });
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto('/', { waitUntil: 'load' });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.waitForTimeout(1500);

    const lcp = await page.evaluate(() => {
      const list = (window as unknown as { __lcp: { t: number; e: string }[] }).__lcp;
      return list.length ? list[list.length - 1] : null;
    });
    expect(lcp).not.toBeNull();
    expect(lcp!.t).toBeLessThan(2500);
    test.info().annotations.push({
      type: 'LCP lab (4G: 150ms · 1.6Mbps · CPU4x)',
      description: `${lcp!.t.toFixed(0)} ms · ${lcp!.e}`,
    });
  });

  for (const route of ALL_ROUTES) {
    test(`${route} · 0 errores de consola ni pageerror`, async ({ page }) => {
      const errors = await noConsoleErrors(page);
      await page.goto(route);
      await page.waitForTimeout(150);
      expect(errors).toEqual([]);
    });
  }
});

// --- 5. Formularios → WhatsApp ----------------------------------------------

test.describe('formularios → WhatsApp (T-51)', () => {
  const interceptOpen = (page: Page) =>
    page.evaluate(() => {
      (window as unknown as { __opened: { url: string; target: string; features: string }[] }).__opened = [];
      window.open = (url?: string | URL, target?: string, features?: string) => {
        (window as unknown as { __opened: { url: string; target: string; features: string }[] }).__opened.push({
          url: String(url ?? ''),
          target: target ?? '',
          features: features ?? '',
        });
        return null;
      };
    });
  const opened = (page: Page) =>
    page.evaluate(
      () => (window as unknown as { __opened: { url: string; target: string; features: string }[] }).__opened,
    );

  test('/ · bar form: window.open con wa.me/<whatsapp> y el mensaje con personas/fecha/hora', async ({
    page,
  }) => {
    await page.goto('/');
    await interceptOpen(page);
    const form = page.locator('.reserve-form').first();
    await form.locator('select[name="personas"]').selectOption('4');
    await form.locator('input[name="fecha"]').fill('2026-12-01');
    await form.locator('input[name="hora"]').fill('19:00');
    await form.locator('input[name="nombre"]').fill('Ana Piera');
    await form.locator('button[type="submit"]').click();

    const calls = await opened(page);
    expect(calls).toHaveLength(1);
    const url = calls[0].url;
    expect(url.startsWith(`https://wa.me/${WHATSAPP}?text=`)).toBe(true);
    expect(calls[0].target).toBe('_blank');
    const text = decodeURIComponent(url.split('?text=')[1] ?? '');
    expect(text).toContain('Ana Piera');
    expect(text).toContain('4 personas');
    expect(text).toContain('2026-12-01');
    expect(text).toContain('19:00');
    test.info().annotations.push({ type: 'wa.me', description: text });
  });

  test('/contacto/ · card form: window.open con los datos de la reserva', async ({ page }) => {
    await page.goto('/contacto/');
    await interceptOpen(page);
    const form = page.locator('form.reserve-form.card-form');
    await form.locator('input[name="nombre"]').fill('Luis Mora');
    await form.locator('select[name="personas"]').selectOption('6');
    await form.locator('input[name="fecha"]').fill('2026-12-02');
    await form.locator('input[name="hora"]').fill('20:00');
    await form.locator('button[type="submit"]').click();

    const calls = await opened(page);
    expect(calls).toHaveLength(1);
    expect(calls[0].url.startsWith(`https://wa.me/${WHATSAPP}?text=`)).toBe(true);
    const text = decodeURIComponent(calls[0].url.split('?text=')[1] ?? '');
    expect(text).toContain('Luis Mora');
    expect(text).toContain('6 personas');
    expect(text).toContain('2026-12-02');
    expect(text).toContain('20:00');
  });

  test('/eventos/ · cotización: sin canal no abre y avisa; con tel sí entrega tipo/invitados/fecha/canal', async ({
    page,
  }) => {
    await page.goto('/eventos/');
    await interceptOpen(page);

    let dialogMsg = '';
    page.on('dialog', async (d) => {
      dialogMsg = d.message();
      await d.accept();
    });

    // Sin WhatsApp ni correo → se bloquea y avisa (T-24).
    await page.fill('#e-n', 'Carlos Vega');
    await page.selectOption('#e-t', 'Empresa');
    await page.fill('#e-p', '20');
    await page.fill('#e-d', '2026-12-04');
    await page.click('#event-form button[type="submit"]');
    await page.waitForTimeout(150);
    expect(dialogMsg).toContain('WhatsApp o correo');
    expect(await opened(page)).toHaveLength(0);

    // Con WhatsApp → se abre wa.me con el mensaje completo.
    await page.fill('#e-w', '+506 8888 7777');
    await page.fill('#e-m', 'Salón completo');
    await page.click('#event-form button[type="submit"]');
    const calls = await opened(page);
    expect(calls).toHaveLength(1);
    const text = decodeURIComponent(calls[0].url.split('?text=')[1] ?? '');
    expect(calls[0].url.startsWith(`https://wa.me/${WHATSAPP}?text=`)).toBe(true);
    expect(text).toContain('Carlos Vega');
    expect(text).toContain('Empresa');
    expect(text).toContain('20');
    expect(text).toContain('2026-12-04');
    expect(text).toContain('8888 7777');
    test.info().annotations.push({ type: 'wa.me eventos', description: text });
  });
});