# Runbook de Go-live — Origen (T-53)

> Documento de operación para publicar `https://www.origenjaco.com` en producción.
> Se ejecuta SOLO cuando haya: **P-01** (dominio + acceso), **P-19** (aprobador único de producción) y
> la **aprobación explícita del go-live**. El resto de insumos (NAP P-02…P-06, P-11, PDF P-18, forma de
> pago P-10…) son **recomendables antes de publicar** pero no bloquean el DNS.

## Estado actual de referencia (2026-10-12)

| Ítem | Valor |
|---|---|
| Cuenta / team Vercel | `kendollcastro` / `kendollcastros-projects` |
| Proyecto | `origen-web` · framework `astro` · `trailingSlash: true` |
| Producción | **vacía** (el deploy accidental se eliminó; alias `origen-web-alpha.vercel.app` sin despliegue) |
| Preview | SSO-protegido (`Deployment Protection`), p. ej. `https://origen-…-kendollcastros-projects.vercel.app` |
| Git ↔ Vercel | **desconectado** (para que los pushes a `main` no auto-desplieguen) |
| `site.url` / canónicas / sitemap / robots | `https://www.origenjaco.com` (ya apuntado; P-01 pendiente) |
| Fuentes / og-image / fotos | auto-hospedadas (`/fonts/*.woff2`), `og-image.jpg`, `src/assets/images` (T-26/T-27/T-28·parte) |

## Pre-requisitos

1. **P-01**: dominio comprado y con acceso al panel del registrador (o transferencia a Vercel).
2. **P-19**: nombre del **aprobador único de producción**; su "sí" queda registrado en este doc antes de ejecutar.
3. (Recomendado) Cerrar NAP real en `src/data/site.ts` (P-02…P-06, P-11) y el PDF `menu-origen.pdf` (P-18).
4. `npm run check` + `npm run build` + `npm run gate` + `npx playwright test` en verde (T-46/T-51 re-run).

## Ejecución

### 1. Registrar el visto bueno

```text
Aprobador: [nombre]
Fecha: [fecha]
Firma del go-live (acuerdo de alcance, dominio y aprobador): ______________
```

### 2. Dominio en Vercel

Con `vercel` CLI desde la raíz del repo (o dashboard → Settings → Domains):

```bash
vercel domains add www.origenjaco.com --scope kendollcastros-projects
vercel domains add origenjaco.com --scope kendollcastros-projects   # apex → 301 a www
```

Sigue las instrucciones que da Vercel según el registrador:

- **Opción A (recomendada, sin transferir):** apuntar a los servidores de Vercel:
  - Apex `@` → `76.76.21.21` y `76.76.21.98`
  - AAAA `@` → `2606:50c0::` y `2606:50c0::1000`
  - `www` → CNAME `cname.vercel-dns.com`
- **Opción B:** cambiar las **nameservers** del dominio a las que indique Vercel (gestión DNS completa en Vercel).

Verificar con: `vercel domains inspect www.origenjaco.com --scope kendollcastros-projects`.

> HTTPS lo gestiona Vercel (certificado auto). No configurar SSL en el registrador.

### 3. Redirección apex → www (301)

Vercel ya crea la redirección de dominio que no es la canónica al publicar. Para forzarla explícitamente,
añadir a `vercel.json`:

```jsonc
"redirects": [
  { "source": "/(.*)", "destination": "https://www.origenjaco.com/$1", "statusCode": 301 }
]
```

Nótese que esto aplica a todo el contenido servido bajo el host apex. El host canónico (`www`) no se toca.

### 4. Reconexión git (deploy automático controlado)

```bash
vercel git connect https://github.com/kendollcastro/origen-restaurant-website
vercel project settings ... # Production Branch = main; PRs → preview
```

Con esto: **push a `main` → producción**; **pull request → preview (SSO)**. Si se prefiere despliegue manual,
mantener desconectado y usar `vercel --prod` con aprobación explícita. Decidir en T-53 y registrar aquí.

### 5. Tras publicar (deploy de producción)

En `vercel`, el primer deploy marcado `--prod` (o el de git al conectar) genera el alias producído. Verificar:

```bash
curl -sI https://www.origenjaco.com/ | grep -iE 'HTTP/|strict-transport|x-content|content-security|cache-control'
curl -sI http://origenjaco.com/ | grep -i '^location'   # → 301 a https://www.
```

### 6. Protección de producción

- La **Deployment Protection (SSO)** por defecto protegería también producción. Para go-live hay que
  **desactivarla para el dominio de producción** (Settings → Deployment Protection → exigir sólo en preview)
  o pasar a **Password Protection** durante una ventana de revisión. Nunca publicar el sitio titular a ciegas.

### 7. Post-live (T-54 + operación)

- Smoke de producción (T-54): 5 rutas `200`, canonical, `og-image.jpg`, `menu-origen.pdf`, sitemap y
  `robots.txt` accesibles, gate de placeholders en vivo, alta en **Search Console** + **Rich Results Test**.
- Registrar la evidencia en `docs/QA-REPORT.md`.
- **Rollback:** `vercel rollback <id>` (CLI) o, si viene de git, `git revert` + push → re-deploy.
- **Futuros cambios:** seguir el flujo del PLAN (rama `main` + CI verde + T-46 gate) y, para contenido del
  cliente, revisar con el aprobador antes de tocar producción.

## Notas

- Mantener `/.vercel/` y `.env.local` fuera de git (ya en `.gitignore`).
- La CSP de `vercel.json` ya no depende de Google Fonts (T-28·parte); no re-añadir `fonts.googleapis.com`.
- La og-image provisional y los `alt` por categoría están pendientes de **P-17/P-16**; publicar solo si el
  cliente los aprueba (o reemplazar antes del lanzamiento).
- Recordar quitar el SSO del preview al abrir al público (o regenerar el preview con protección de contraseña).