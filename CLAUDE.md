# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Progress tracker:** `../PROGRESS.md` lists what is built and what is left, per phase — tick items there as work lands.

Angular 22 (standalone components, no NgModules) frontend for **ZexServer**, a hosting provider platform. Covers the public marketing site, the admin dashboard, and the customer panel. Tailwind v4 for styling, `@ngrx/signals` SignalStore for client state. Talks to the sibling `ZexServer-nest-js` backend over REST — see [../ZexServer-nest-js/CLAUDE.md](../ZexServer-nest-js/CLAUDE.md).

The design reference is `../ZexServerAdditionalPages/` — a Claude Design export of the whole product (17 `.dc.html` pages plus `site-data.js` / `support.js`). Pages are ported **near-verbatim**: match the reference's layout, spacing and colour choices rather than reinterpreting them.

The layering here mirrors the `Miveh` project's Next.js frontend (`~/Develop/Miveh/Miveh-next-js`) — same `common/apiRoutes.ts` + `common/appRoutes.ts` maps, same hard split between the public site and the admin dashboard.

## Commands

Bun is the package manager. **Unlike Miveh, the Angular CLI itself does not run under `bun --bun`** — Bun reports itself as Node v24.3.0 and the CLI hard-rejects that against its v24.15.0 minimum, so `ng` runs on the host's Node. Do not add `--bun` back to these scripts.

```bash
bun install
bun run dev        # ng serve --port 4200
bun run build      # ng build (production configuration by default)
bun run watch      # ng build --watch --configuration development
bun test           # ng test (vitest)
bun run format     # prettier over src
```

There is deliberately **no `ng` script** in `package.json`: a script by that name shadows the `ng` binary and makes `bun run ng` recurse into itself forever. Invoke the CLI directly (`./node_modules/.bin/ng generate ...`).

### Local environment

`src/environments/environment.ts` holds `baseUrl` (the backend API root, **including** its `api/v1` prefix) and `resourceUrl`. `environment.production.ts` is the production counterpart.

Docker serves only a built production bundle behind nginx — there is no hot reload in the container, so develop with `bun run dev` on the host:

```bash
docker compose up --build -d
```

## Architecture

### Path aliases

`@src/*` → `src/*`, `@libs/*` → `libs/*` (in `tsconfig.json`). Note there is no `baseUrl` — TypeScript 6 deprecates it and `paths` resolve relative to the tsconfig without it.

### Route groups (`src/features`)

`app.routes.ts` splits the app in two, each half lazily loaded with its own layout — the equivalent of Miveh's `(website)` / `admin` route groups:

- `features/website/` — public storefront. `website.routes.ts` + `_component/website-layout.ts` (navbar/footer land here in phase 4) + one folder per page.
- `features/admin/` — admin dashboard, structurally separate. `admin.routes.ts` + `_component/admin-layout.ts` (the 17-item sidebar from `Admin Dashboard.dc.html` lands here in phase 5).
- `shared/components/` — cross-cutting UI used by both halves.

### Data layer

- `src/common/apiRoutes.ts` — single source of truth for every backend endpoint path; mirrors the backend's controllers 1:1. Add new endpoints here rather than inlining path strings.
- `src/common/appRoutes.ts` — equivalent map for the frontend's own page paths. Use these instead of hardcoded `routerLink` / `navigateByUrl` strings.
- `src/lib/auth.interceptor.ts` — the Angular counterpart of Miveh's `FetchClient`. Prefixes relative URLs with `environment.baseUrl`, attaches `Authorization: Bearer` from the `zexUserToken` cookie, and on a `401` clears the cookie and redirects to `appRoutes.AdminLogin` or `appRoutes.Login` depending on whether the current route starts with `/admin`. Absolute `http(s)://` URLs pass through unprefixed.
- `src/lib/api.service.ts` — thin `HttpClient` wrapper that unwraps the backend's `{ result, message, httpCode, statusCode }` envelope so callers receive `result` directly.
- `src/lib/cookie.ts` — `document.cookie` helpers and the `TOKEN_COOKIE` name.

### State (`src/store`)

One SignalStore per domain slice, split the same way Miveh splits its Redux slices:
- `store/website/*` — public site and customer panel state.
- `store/admin/*` — admin dashboard state.

Keep new stores in the matching folder — don't mix the two domains in one store. `store/website/health.store.ts` is the reference implementation of the pattern (`signalStore` + `withState` / `withComputed` / `withMethods`).

### Styling

`src/styles/tokens.css` holds design tokens **extracted verbatim from the reference pages** — every `--zx-*` colour is a hex that literally appears in `../ZexServerAdditionalPages`. Do not invent new brand colours; add one only once it appears in a reference page. `src/styles.css` imports Tailwind and the tokens, then restates the reference pages' own `<style>` baseline (Inter, `#1A1A2E` body ink, `#1269E8` links) so ported markup lands unchanged.
