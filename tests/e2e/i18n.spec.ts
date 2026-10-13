import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { enPages } from '../../src/data/i18n/pages';
import { site } from '../../src/data/site';
import { faqs } from '../../src/data/faq';
import { isReal, isRealPhone } from '../../src/data/placeholders';

// T-35 · Arquitectura i18n: rutas /en/, prop lang, noindex y switcher ES↔EN.
// El contenido EN es provisional (TODO P-22); estas aserciones validan estructura y navegación,
// no copy. T-36/T-37 sustituirán el texto; T-38 hará hreflang/indexación final y el sitemap bilingüe.
// T-39 · QA i18n: 1 h1, títulos/descripciones del mapa §1.2 (enPages), axe en /en/,
// switcher bidireccional en los 5 pares y sitemap sin /en/ hasta go-live.

const ES_ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
const EN_ROUTES = ['/en/', '/en/menu/', '/en/nosotros/', '/en/eventos/', '/en/contacto/'];
const EN_KEY: Record<string, keyof typeof enPages> = {
  '/en/': 'index',
  '/en/menu/': 'menu',
  '/en/nosotros/': 'nosotros',
  '/en/eventos/': 'eventos',
  '/en/contacto/': 'contacto',
};

const ES_H1: Record<string, string> = {
  '/': 'Restaurante de mariscos y parrilla en Jacó',
  '/menu/': 'Menú',
  '/nosotros/': 'Historia',
  '/eventos/': 'Eventos y grupos',
  '/contacto/': 'Reservas y contacto',
};

test.describe('/en/ · rutas y lang', () => {
  for (const route of EN_ROUTES) {
    test(`${route} responde 200 con <html lang="en">`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });

    test(`${route} emite robots noindex (traducción pendiente P-22)`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });
  }
});

test.describe('el sitio ES no cambia', () => {
  for (const route of ES_ROUTES) {
    test(`${route} mantiene el h1 y no lleva robots noindex`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveText(ES_H1[route]);
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    });
  }
});

test.describe('switcher ES ↔ EN', () => {
  test('ES → EN por ruta equivalente (/menu/ → /en/menu/)', async ({ page }) => {
    await page.goto('/menu/');
    await page.locator('.lang a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/menu\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('EN → ES por ruta equivalente (/en/eventos/ → /eventos/)', async ({ page }) => {
    await page.goto('/en/eventos/');
    await page.locator('.lang a[hreflang="es"]').click();
    await expect(page).toHaveURL(/\/eventos\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('en / el EN es un enlace real, enfocable y con aria-label', async ({ page }) => {
    await page.goto('/');
    const en = page.locator('.lang a[hreflang="en"]');
    await expect(en).toHaveAttribute('href', '/en/');
    await expect(en).toHaveAttribute('hreflang', 'en');
    await expect(en).toHaveAttribute('aria-label', /inglés/i);
    await en.focus();
    await expect(en).toBeFocused();
  });

  test('la ruta activa marca aria-current y el otro idioma navega', async ({ page }) => {
    await page.goto('/en/nosotros/');
    await expect(page.locator('.lang a[aria-current="true"]')).toHaveText('EN');
    await expect(page.locator('.lang a[hreflang="es"]')).toHaveAttribute('href', '/nosotros/');
  });

  test.describe('switcher recorre los 5 pares en ambas direcciones (T-39)', () => {
    for (const [es, en] of [
      ['/', '/en/'],
      ['/menu/', '/en/menu/'],
      ['/nosotros/', '/en/nosotros/'],
      ['/eventos/', '/en/eventos/'],
      ['/contacto/', '/en/contacto/'],
    ]) {
      test(`${es} → ${en}`, async ({ page }) => {
        await page.goto(es);
        await page.locator('.lang a[hreflang="en"]').click();
        await expect(page).toHaveURL(new RegExp(`${en.replace(/\//g, '\\/')}$`));
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      });

      test(`${en} → ${es}`, async ({ page }) => {
        await page.goto(en);
        await page.locator('.lang a[hreflang="es"]').click();
        await expect(page).toHaveURL(new RegExp(`${es.replace(/\//g, '\\/')}$`));
        await expect(page.locator('html')).toHaveAttribute('lang', 'es');
      });
    }
  });
});

test.describe('T-39 · title, description y un solo h1 en /en/', () => {
  for (const route of EN_ROUTES) {
    test(`${route} · title y description coinciden con enPages`, async ({ page }) => {
      const p = enPages[EN_KEY[route]];
      await page.goto(route);
      await expect(page).toHaveTitle(p.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', p.description);
    });

    test(`${route} · exactamente un h1`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});

test.describe('T-39 · axe en /en/ (sin serious/critical)', () => {
  for (const route of EN_ROUTES) {
    test(`${route} sin violaciones serious/critical`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );
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

test.describe('T-39 · sitemap (estado provisional)', () => {
  test('excluye /en/ hasta go-live; solo las 5 URLs ES del dominio', async ({ request }) => {
    const index = await request.get('/sitemap-index.xml');
    expect(index.status()).toBe(200);
    expect(await index.text()).toContain('sitemap-0.xml');

    const map = await request.get('/sitemap-0.xml');
    expect(map.status()).toBe(200);
    const body = await map.text();
    for (const es of ES_ROUTES) {
      expect(body).toContain(`https://www.origenjaco.com${es === '/' ? '' : es}`);
    }
    expect(body).not.toContain('/en/');
  });
});

// T-36 · Traducción EN completa (P-22 aprobado). Verifica que /en/ no mezcle texto ES
// y que los datos bilingües (menú, FAQ, NAP) y el JSON-LD se emitan en inglés.
const ES_MARKERS =
  /\b(Todos|días|Menú|Nosotros|Eventos|Contacto|Reservar|Reserva|Horario|Ubicación|Galería|Precios|Personas|Nombre|Fecha|Invitados|Cotiza|Cumpleaños|Mariscos|Parrilla|Postres|Entradas|Coctelería|Bebidas|Síguenos|Descubre|Bienvenidos|esperamos|Dirección|Cerrar|Anterior|Siguiente|Ampliar|Momentos|Celebra|Nuestro|Nuestra|Invita|Almuerzo|Cena|Cócteles|llega|servimos|incluyen|Costarricense)\b/;

test.describe('T-36 · /en/ sin texto ES mezclado', () => {
  for (const route of EN_ROUTES) {
    test(`${route} solo muestra copy en inglés`, async ({ page }) => {
      await page.goto(route);
      const text = await page.locator('body').innerText();
      const hits = [...new Set(text.match(ES_MARKERS) ?? [])];
      expect(hits).toEqual([]);
    });
  }
});

test.describe('T-36 · datos bilingües se emiten en inglés', () => {
  test('menú: nombres y descripciones EN (no la fuente ES)', async ({ page }) => {
    await page.goto('/en/menu/');
    const text = await page.locator('.menu-cats').innerText();
    expect(text).toContain('Pacific Pearls');
    expect(text).toContain('Fish Fingers');
    expect(text).toContain('Each cut comes with a side of your choice.');
    expect(text).not.toContain('Perlas del Pacífico');
    expect(text).not.toContain('Menú de niños');
  });

  test('FAQ de contacto en EN y FAQPage JSON-LD 1:1', async ({ page }) => {
    await page.goto('/en/contacto/');
    const phonePending = !isRealPhone(site.phone);
    const expected = faqs.filter(
      (f) => isReal(f.qEn) && isReal(f.aEn) && !(phonePending && (f.aEn as string).includes(site.phone)),
    );
    expect(expected.length).toBeGreaterThan(0);

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faqSchema = scripts
      .map((s) => JSON.parse(s))
      .flat()
      .find((node) => node['@type'] === 'FAQPage');
    expect(faqSchema).toBeTruthy();
    expect(faqSchema.mainEntity).toHaveLength(expected.length);
    expect(faqSchema.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      expected.map((f) => f.qEn),
    );

    const visible = await page.locator('.faq').innerText();
    expect(visible).toContain(expected[0].qEn as string);
  });

  test('JSON-LD Restaurant en inglés (descripción, cocina y ReserveAction /en/)', async ({ page }) => {
    await page.goto('/en/contacto/');
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const restaurant = scripts
      .map((s) => JSON.parse(s))
      .flat()
      .find((node) => node['@type'] === 'Restaurant');
    expect(restaurant.description).toBe(site.descriptionEn);
    expect(restaurant.servesCuisine).toEqual(['Seafood', 'Grill', 'Costa Rican']);
    expect(restaurant.hasMenu).toBe(`${site.url}/en/menu/`);
    expect(restaurant.potentialAction.name).toBe('Book a table');
    expect(restaurant.potentialAction.target.urlTemplate).toBe(`${site.url}/en/contacto/#reservar`);
    expect(restaurant.potentialAction.target.inLanguage).toBe('en');
  });

  test('JSON-LD Restaurant en ES conserva el copy español', async ({ page }) => {
    await page.goto('/contacto/');
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const restaurant = scripts
      .map((s) => JSON.parse(s))
      .flat()
      .find((node) => node['@type'] === 'Restaurant');
    expect(restaurant.description).toBe(site.description);
    expect(restaurant.servesCuisine).toEqual(['Mariscos', 'Parrilla', 'Costarricense']);
    expect(restaurant.hasMenu).toBe(`${site.url}/menu/`);
    expect(restaurant.potentialAction.name).toBe('Reservar mesa');
    expect(restaurant.potentialAction.target.urlTemplate).toBe(`${site.url}/contacto/#reservar`);
  });
});