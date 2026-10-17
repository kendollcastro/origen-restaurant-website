import { test, expect, type Page } from '@playwright/test';
import { site, telHref } from '../../src/data/site';
import { formatPrice } from '../../src/data/menu';
import { isReal, isRealPhone } from '../../src/data/placeholders';

// T-34 · Verificación cruzada NAP (site.ts ↔ Footer ↔ /contacto/ ↔ JSON-LD) y smoke
// de wa.me / Maps / Waze. La comparación con la ficha de Google queda PENDIENTE (P-06):
// la ficha aún no existe, por lo que el spec valida coherencia contra `site.ts` (fuente
// única) y nunca contra datos reales que todavía no se han entregado (P-01…P-06).
//
// Los valores de hoy son placeholders (phone `+506 0000 0000`, whatsapp `50600000000`,
// social `[usuario]`, street `[Dirección exacta]`). Por eso las aserciones comprueban
// coherencia literal con `site.ts` y respetan la política «ocultar > inventar» (§ GLOSARIO).

const ROUTES = ['/', '/menu/', '/nosotros/', '/eventos/', '/contacto/'];
// La página 404 (servida como archivo estático /404.html) también monta el mismo Footer.
const NOT_FOUND_PAGE = '/404.html';
const ALL_ROUTES = [...ROUTES, NOT_FOUND_PAGE];

// Enlaces locales conocidos y bloqueados por datos de cliente. `/menu-origen.pdf` (botón
// «Descargar menú PDF» de /menu/) dará 404 hasta que el cliente entregue el PDF (P-18 → T-28).
// NO se corrige aquí: es un insumo externo y `src/**` está fuera del alcance de T-34.
const KNOWN_PENDING_LOCAL_LINKS = new Set<string>(['/menu-origen.pdf']);

const TOLERATED_STATUS = (status: number) => status === 405 || status === 429;

const FOOTER = 'footer.site-footer';

async function footerNap(page: Page) {
  const footer = page.locator(FOOTER);
  await expect(footer).toHaveCount(1);

  const addressText = await footer.locator('address p').innerText();
  expect(addressText).toContain(
    `${site.address.locality}, ${site.address.county}, ${site.address.region}`,
  );
  expect(addressText).toContain(site.address.countryName);
  if (isReal(site.address.street)) expect(addressText).toContain(site.address.street);

  const tel = footer.locator('a[href^="tel:"]');
  await expect(tel).toHaveCount(1);
  await expect(tel).toHaveAttribute('href', telHref(site.phone));
  await expect(tel).toHaveText(site.phone);

  const wa = footer.locator('a[href^="https://wa.me/"]');
  await expect(wa).toHaveCount(1);
  await expect(wa).toHaveAttribute('href', `https://wa.me/${site.whatsapp}`);

  const mail = footer.locator('a[href^="mailto:"]');
  await expect(mail).toHaveCount(1);
  await expect(mail).toHaveAttribute('href', `mailto:${site.email}`);
  await expect(mail).toHaveText(site.email);

  const hours = await footer.innerText();
  expect(hours).toContain(site.hours.days);
  expect(hours).toContain(site.hours.label);
}

async function collectLd(page: Page): Promise<Record<string, unknown>[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes: Record<string, unknown>[] = [];
  for (const text of raw) {
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed)) nodes.push(...parsed);
    else nodes.push(parsed as Record<string, unknown>);
  }
  return nodes;
}

test.describe('NAP · igualdad literal site.ts ↔ Footer (6 rutas)', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} · el footer muestra el mismo NAP que site.ts`, async ({ page }) => {
      await page.goto(route);
      await footerNap(page);
    });
  }
});

test.describe('/contacto/ · bloque de dirección y contacto', () => {
  test('dirección literal coincide con site.ts', async ({ page }) => {
    await page.goto('/contacto/');
    const addr = page.locator('main address');
    await expect(addr).toHaveCount(1);
    const text = await addr.innerText();
    expect(text).toContain(site.fullName);
    expect(text).toContain(
      `${site.address.locality}, ${site.address.county}, ${site.address.region}, ${site.address.countryName}`,
    );
    if (isReal(site.address.street)) expect(text).toContain(site.address.street);
    // Mapa y Waze usan siempre site.* y abren en pestaña nueva.
    const maps = addr.locator(`a[href="${site.mapsUrl}"]`);
    await expect(maps).toHaveCount(1);
    await expect(maps).toHaveAttribute('target', '_blank');
    await expect(maps).toHaveAttribute('rel', 'noopener');
    const waze = addr.locator(`a[href="${site.wazeUrl}"]`);
    await expect(waze).toHaveCount(1);
    await expect(waze).toHaveAttribute('target', '_blank');
    await expect(waze).toHaveAttribute('rel', 'noopener');
  });

  test('contacto literal coincide con site.ts', async ({ page }) => {
    await page.goto('/contacto/');
    const main = page.locator('main');
    const tel = main.locator('a[href^="tel:"]');
    await expect(tel).toHaveCount(1);
    await expect(tel).toHaveAttribute('href', telHref(site.phone));
    await expect(tel).toHaveText(site.phone);

    const wa = main.locator(`a[href="https://wa.me/${site.whatsapp}"]`);
    await expect(wa).toHaveCount(1);

    const mail = main.locator('a[href^="mailto:"]');
    await expect(mail).toHaveCount(1);
    await expect(mail).toHaveAttribute('href', `mailto:${site.email}`);
    await expect(mail).toHaveText(site.email);

    const mainText = await main.innerText();
    expect(mainText).toContain(site.hours.days);
    expect(mainText).toContain(site.hours.label);
  });
});

test.describe('enlaces de contacto', () => {
  test('tel: sin espacios, en formato +506…', async () => {
    const href = telHref(site.phone);
    expect(href).toMatch(/^tel:\+\d+$/);
    expect(href).not.toMatch(/\s/);
    expect(href).toBe(`tel:${site.phone.replace(/[^\d+]/g, '')}`);
  });

  test('whatsapp: solo dígitos con código de país (^506\\d{8}$)', async () => {
    expect(site.whatsapp).toMatch(/^506\d{8}$/);
    expect(site.whatsapp).not.toMatch(/[+\s]/);
  });

  test('mailto: usa site.email', async ({ page }) => {
    await page.goto('/contacto/');
    await expect(page.locator('footer a[href^="mailto:"]')).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    );
    await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    );
  });

  test('formularios wa.me incluyen ?text= y el whatsapp de site.ts', async ({ page }) => {
    await page.goto('/contacto/');
    const reserve = page.locator('form.reserve-form').first();
    const reserveAction = (await reserve.getAttribute('action')) ?? '';
    expect(reserveAction.startsWith(`https://wa.me/${site.whatsapp}?`)).toBe(true);
    expect(reserveAction).toContain('text=');

    await page.goto('/eventos/');
    const event = page.locator('#event-form');
    const eventAction = (await event.getAttribute('action')) ?? '';
    expect(eventAction.startsWith(`https://wa.me/${site.whatsapp}?`)).toBe(true);
    expect(eventAction).toContain('text=');
    await expect(event).toHaveAttribute('data-wa', site.whatsapp);
  });
});

test.describe('JSON-LD Restaurant coherente con site.ts', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} · Restaurant coincide con site.ts`, async ({ page }) => {
      await page.goto(route);
      const nodes = await collectLd(page);
      const restaurant = nodes.find((node) => node['@type'] === 'Restaurant');
      expect(restaurant, `Sin JSON-LD Restaurant en ${route}`).toBeTruthy();
      const r = restaurant as Record<string, unknown>;

      // name / url
      expect(r.name).toBe(site.fullName);
      expect(r.url).toBe(site.url);

      // email siempre presente y literal
      expect(r.email).toBe(site.email);

      // telephone: omitido mientras site.phone sea placeholder (política ocultar > inventar).
      // isRealPhone también descarta el relleno de ceros ('+506 0000 0000') sin corchetes (T-40).
      if ('telephone' in r) expect(r.telephone).toBe(site.phone);
      else expect(isRealPhone(site.phone)).toBe(false);

      // sameAs: solo redes reales; hoy todas son placeholder ([usuario]) → se omite
      const expectedSameAs = Object.values(site.social).filter(isReal);
      if ('sameAs' in r) {
        expect(r.sameAs).toEqual(expect.arrayContaining(expectedSameAs));
        expect(expectedSameAs.length).toBeGreaterThan(0);
      } else {
        expect(expectedSameAs).toEqual([]);
      }

      // address: localidad/región/país literales; streetAddress solo si es real
      const addr = r.address as Record<string, unknown>;
      expect(addr).toBeTruthy();
      expect(addr.addressLocality).toBe(site.address.locality);
      expect(addr.addressRegion).toBe(site.address.region);
      expect(addr.addressCountry).toBe(site.address.country);
      if ('streetAddress' in addr) expect(addr.streetAddress).toBe(site.address.street);
      else expect(isReal(site.address.street)).toBe(false);

      // geo, horario y capacidad derivados de site.ts
      const geo = r.geo as Record<string, unknown>;
      expect(geo.latitude).toBe(site.geo.lat);
      expect(geo.longitude).toBe(site.geo.lng);
      // T-40: maximumAttendeeCapacity se retiró del Restaurant (no es propiedad válida de
      // Google para este rich result; la capacidad 120 queda solo en texto visible).
      expect(r).not.toHaveProperty('maximumAttendeeCapacity');
      // employee (Person chef/manager, site.ts) y ReserveAction anclada al CTA visible.
      const employees = r.employee as Record<string, unknown>[];
      expect(employees).toBeTruthy();
      const names = employees.map((p) => p.name);
      expect(names).toContain(site.chef);
      expect(names).toContain(site.manager);
      expect(r.potentialAction).toBeTruthy();
      expect((r.potentialAction as Record<string, unknown>).name).toBe('Reservar mesa');
      expect(r.priceRange).toBe(site.priceRange);
      const opening = r.openingHoursSpecification as Record<string, unknown>[];
      expect(opening[0].dayOfWeek).toEqual(site.hours.schema);
      expect(opening[0].opens).toBe(site.hours.opens);
      expect(opening[0].closes).toBe(site.hours.closes);

      // Sin corchetes de placeholder dentro de ninguna cadena del JSON-LD (mismo criterio
      // que scripts/check-placeholders.mjs: recorre string a string, no el JSON crudo).
      const PLACEHOLDER_RE = /\[[^\]]+\]/;
      const strings: string[] = [];
      const walk = (value: unknown) => {
        if (typeof value === 'string') strings.push(value);
        else if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === 'object') Object.values(value).forEach(walk);
      };
      nodes.forEach(walk);
      for (const value of strings) expect(value).not.toMatch(PLACEHOLDER_RE);
    });
  }
});

test.describe('smoke wa.me / Maps / Waze', () => {
  test('/contacto/ expone Maps y Waze con target/rel coherentes', async ({ page }) => {
    await page.goto('/contacto/');
    const main = page.locator('main');
    const maps = main.locator(`a[href="${site.mapsUrl}"]`);
    await expect(maps).toHaveCount(1);
    await expect(maps).toHaveAttribute('target', '_blank');
    await expect(maps).toHaveAttribute('rel', 'noopener');

    const waze = main.locator(`a[href="${site.wazeUrl}"]`);
    await expect(waze).toHaveCount(1);
    await expect(waze).toHaveAttribute('target', '_blank');
    await expect(waze).toHaveAttribute('rel', 'noopener');
  });

  test('/ · el CTA de reserva apunta a wa.me/<whatsapp>', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator(`a[href^="https://wa.me/${site.whatsapp}"]`);
    await expect(cta.first()).toBeVisible();
    const href = (await cta.first().getAttribute('href')) ?? '';
    expect(href.startsWith(`https://wa.me/${site.whatsapp}`)).toBe(true);
  });
});

test.describe('404', () => {
  test('/404.html se sirve (200) y una ruta inexistente responde 404', async ({ page }) => {
    const direct = await page.goto(NOT_FOUND_PAGE);
    expect(direct?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Página no encontrada');

    const missing = await page.goto('/ruta-inexistente-t34/');
    expect(missing?.status()).toBe(404);
  });
});

test.describe('integridad de enlaces locales', () => {
  test('ningún href del DOM contiene corchetes de placeholder', async ({ page }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const bracketed = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>('[href]'))
          .map((el) => el.getAttribute('href') ?? '')
          .filter((href) => href.includes('[') || href.includes(']')),
      );
      expect(bracketed, `href con corchetes en ${route}`).toEqual([]);
    }
  });

  test('crawl de las 6 rutas: 0 enlaces locales rotos (salvo pendientes P-18)', async ({
    page,
  }) => {
    const origins = new Map<string, Set<string>>();
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
          .map((a) => a.getAttribute('href') ?? '')
          .filter((href) => href.startsWith('/') && !href.startsWith('//')),
      );
      for (const href of hrefs) {
        const path = href.split('#')[0].split('?')[0];
        if (!path || path === '/') continue;
        if (!origins.has(path)) origins.set(path, new Set());
        origins.get(path)?.add(route);
      }
    }

    const results: { path: string; status: number; origins: string[] }[] = [];
    for (const [path, from] of origins) {
      const response = await page.request.get(path);
      results.push({ path, status: response.status(), origins: [...from] });
    }

    const nonOk = results.filter((r) => r.status !== 200);
    test.info().annotations.push({
      type: 'crawl',
      description: JSON.stringify(
        nonOk.length ? nonOk : results.map((r) => `${r.path} → ${r.status}`),
      ),
    });
    // Se registra el detalle del crawl en la salida para el reporte QA.
    console.log('[crawl T-34] status ≠ 200:', JSON.stringify(nonOk, null, 2));

    const broken = nonOk.filter(
      (r) => !TOLERATED_STATUS(r.status) && !KNOWN_PENDING_LOCAL_LINKS.has(r.path),
    );
    expect(broken, `Enlaces locales rotos: ${JSON.stringify(broken)}`).toEqual([]);

    // Si un pendiente documentado deja de estar roto, la allowlist queda obsoleta.
    for (const pending of KNOWN_PENDING_LOCAL_LINKS) {
      const found = results.find((r) => r.path === pending);
      if (found) {
        expect(
          found.status,
          `${pending} ya no está roto; quitar de KNOWN_PENDING_LOCAL_LINKS`,
        ).toBeGreaterThanOrEqual(400);
      }
    }
  });
});

// T-40 · JSON-LD Menu y FAQPage: estructura válida, offers solo con precio real (número)
// y texto 1:1 con lo visible. Google Rich Results Test se completará en go-live (P-01);
// aquí se valida localmente lo que ese validador comprueba de forma automática.
test.describe('JSON-LD Menu 1:1 con el menú visible', () => {
  test('/menu/ · Menu/MenuSection/MenuItem válidos y solo con platos reales', async ({ page }) => {
    await page.goto('/menu/');
    const nodes = await collectLd(page);
    const menu = nodes.find((node) => node['@type'] === 'Menu') as Record<string, unknown> | undefined;
    expect(menu, 'Sin JSON-LD Menu en /menu/').toBeTruthy();

    const sections = menu!.hasMenuSection as Record<string, unknown>[];
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);

    const visible = await page.locator('main').innerText();
    for (const section of sections) {
      expect(section['@type']).toBe('MenuSection');
      expect(visible, `Sección "${section.name}" no visible`).toContain(section.name as string);
      const items = section.hasMenuItem as Record<string, unknown>[];
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(item['@type']).toBe('MenuItem');
        // Nunca corchetes de placeholder como nombre de plato.
        expect(item.name as string).not.toMatch(/\[[^\]]*\]/);
        expect(visible, `Plato "${item.name}" no visible`).toContain(item.name as string);
        // `offers` solo cuando hay precio real (número en colones, T-40).
        if ('offers' in item) {
          const offer = item.offers as Record<string, unknown>;
          expect(typeof offer.price).toBe('number');
          expect(offer.priceCurrency).toBe('CRC');
          // El precio visible va formateado (₡1.234); comparar contra `formatPrice`.
          expect(visible, `Precio ${String(offer.price)} no visible`).toContain(formatPrice(offer.price as number));
        }
      }
    }
  });
});

test.describe('JSON-LD FAQPage 1:1 con la FAQ visible', () => {
  test('/contacto/ · cada Question/Answer aparece en el texto visible', async ({ page }) => {
    await page.goto('/contacto/');
    const nodes = await collectLd(page);
    const faq = nodes.find((node) => node['@type'] === 'FAQPage') as Record<string, unknown> | undefined;
    if (!faq) {
      // Sin FAQ publicables (todo pendiente) la sección no debe montarse.
      await expect(page.locator('main')).not.toContainText('Preguntas frecuentes');
      test.info().annotations.push({ type: 'faq', description: 'FAQPage omitido (sin FAQs reales)' });
      return;
    }
    const mainEntity = faq.mainEntity as Record<string, unknown>[];
    expect(mainEntity.length).toBeGreaterThan(0);
    // La FAQ vive en <details> (cerrado por defecto): su texto está en el DOM (crawlable y
    // extraíble, T-42) aunque `innerText` lo omita con el panel colapsado → se usa textContent.
    const domText = (await page.locator('main').textContent()) ?? '';
    for (const q of mainEntity) {
      expect(q['@type']).toBe('Question');
      const answer = q.acceptedAnswer as Record<string, unknown>;
      expect(answer['@type']).toBe('Answer');
      expect(domText, `Pregunta no presente en el DOM: ${q.name}`).toContain(q.name as string);
      expect(domText, `Respuesta no presente en el DOM: ${answer.text}`).toContain(answer.text as string);
    }
  });
});

test.describe('T-40 · ningún placeholder en el JSON-LD (incluye teléfono con ceros)', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} · sin corchetes ni relleno de ceros en ninguna cadena`, async ({ page }) => {
      await page.goto(route);
      const nodes = await collectLd(page);
      const strings: string[] = [];
      const walk = (value: unknown) => {
        if (typeof value === 'string') strings.push(value);
        else if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === 'object') Object.values(value).forEach(walk);
      };
      nodes.forEach(walk);
      for (const value of strings) {
        expect(value).not.toMatch(/\[[^\]]*\]/);
        expect(value, `teléfono placeholder filtrado en JSON-LD: ${value}`).not.toMatch(/0{4}\s*0{4}/);
      }
    });
  }
});

// R-05/R-19 · Límites de meta (PLAN §1.1/§1.2): <title> ≤ 60 y description ≤ 155.
// Los valores aprobados viven en `enPages` (EN) y en cada página ES; aquí solo se validan longitudes.
const META_ROUTES = [
  ...ROUTES,
  '/en/',
  '/en/menu/',
  '/en/nosotros/',
  '/en/eventos/',
  '/en/contacto/',
];

test.describe('R-05 · límites de <title> y meta description', () => {
  for (const route of META_ROUTES) {
    test(`${route} · title ≤ 60 y description ≤ 155`, async ({ page }) => {
      await page.goto(route);
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(title.length, `title demasiado largo: ${title}`).toBeLessThanOrEqual(60);
      expect(description.length, `description demasiado larga: ${description}`).toBeGreaterThan(0);
      expect(description.length, `description demasiado larga: ${description}`).toBeLessThanOrEqual(155);
    });
  }
});

// R-19 · no servir literales de plantilla sin resolver (`{...}`) en dist/*.html.
test.describe('R-19 · sin literales de plantilla en el HTML', () => {
  for (const route of META_ROUTES) {
    test(`${route} · sin '{' sin resolver`, async ({ page }) => {
      await page.goto(route);
      const html = await page.content();
      const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
      expect(stripped).not.toMatch(/\{canonical\}|\{[a-zA-Z.]+\}/);
    });
  }
});
