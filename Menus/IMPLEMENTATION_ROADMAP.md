# AR Restaurant SaaS — Implementation Roadmap

**Project:** `ar-menu-platform` (VisionMenu)  
**Status:** MVP UI + partial backend wiring  
**Last reviewed:** May 2026  
**Constraint:** Preserve approved landing page design (hero, 3D pizza, animations, palette, typography).

---

## Executive Summary

The monorepo already delivers the **premium visual direction** and a **credible technical skeleton** for the core QR → food page → AR flow. What remains is turning demo-hardcoded behavior into **real multi-tenant SaaS**: auth that actually protects routes, uploads to Supabase Storage, dynamic URLs per restaurant, reliable AR assets, and analytics that reflect production usage.

**Recommended build order:** Phase 1 → 2 → 3 → 4 → 6 → 5 → 7  
(AR polish and public pages before QR refinements; analytics last once events are trustworthy.)

---

## Current Architecture

```
Menus/
├── apps/
│   ├── landing/     :3002   Marketing (single-page, Framer Motion, model-viewer hero)
│   ├── admin/       :3001   Restaurant dashboard + API routes
│   └── web/         :3000   Customer menu + AR item pages
└── packages/
    ├── database/    Supabase schema + seed SQL
    ├── shared/      Types, zod schemas, utils (underused)
    ├── ui/          shadcn primitives (unused by apps)
    └── config/      Shared tailwind/tsconfig
```

| App | Purpose | Auth |
|-----|---------|------|
| `landing` | Acquisition, pricing, cinematic demo | None |
| `admin` | Menu CRUD, QR management, analytics, settings | Login only (`/login`) |
| `web` | Public menu + AR experience | None (public) |

**Tooling:** npm workspaces, Turborepo, Next.js 15 App Router, Tailwind v4, Supabase, `@google/model-viewer`.

---

## Existing Pages & Components

### Landing (`apps/landing`)

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | ~828 lines, all sections inline; **do not regenerate** |
| Layout | `app/layout.tsx` | model-viewer 4.0.0 CDN script |

**Preserved assets & patterns:**
- Parallax hero with scroll-driven `camera-orbit` on `<model-viewer src="/pizza.glb">`
- Custom SVG ingredients (`BasilLeaf`, `TomatoSlice`, etc.)
- Framer Motion scroll/mouse effects
- Sections: `#how-it-works`, `#demo`, `#features`, `#pricing`
- Dark luxury palette (`neutral-950`, `rose-500`, `amber-500`)

**Gap:** `public/pizza.glb` may be missing from repo; verify before deploy.

### Admin (`apps/admin`)

| Route | File | Status |
|-------|------|--------|
| `/login` | `app/(auth)/login/page.tsx` | UI works; no post-login redirect; no signup |
| `/dashboard` | `app/dashboard/page.tsx` | Overview stats |
| `/dashboard/menu` | `app/dashboard/menu/page.tsx` | List |
| `/dashboard/menu/new` | `app/dashboard/menu/[id]/edit/page.tsx` | Create |
| `/dashboard/menu/[id]/edit` | same | Edit |
| `/dashboard/qr-codes` | `app/dashboard/qr-codes/page.tsx` | QR list |
| `/dashboard/analytics` | `app/dashboard/analytics/page.tsx` | Basic aggregates |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | **Stub** (fake save) |

**API routes:**
- `GET/POST /api/menu` → `app/api/menu/route.ts`
- `GET/PATCH/DELETE /api/menu/[id]` → `app/api/menu/[id]/route.ts`
- `POST /api/qr-codes/generate` → `app/api/qr-codes/generate/route.ts`

**Middleware:** `middleware.ts` checks `sb-access-token` cookie — **likely incompatible** with Supabase Auth v2 cookie naming.

### Web (`apps/web`)

| Route | File | Status |
|-------|------|--------|
| `/` | `app/page.tsx` | Placeholder |
| `/[restaurantSlug]` | `app/[restaurantSlug]/page.tsx` | Menu grid (Supabase) |
| `/[restaurantSlug]/menu/[itemSlug]` | `app/.../menu/[itemSlug]/page.tsx` | Food detail + AR |

**AR components:**
- `components/ar/ar-viewer.tsx` — WebXR check, analytics, fallbacks
- `components/ar/model-viewer-wrapper.tsx` — `model-viewer` element

**API routes:**
- `GET /api/health`
- `POST /api/analytics/track` — **not called** from `ARViewer` (client inserts directly)

### Shared packages (under-leveraged)

| Package | Contents | Adoption |
|---------|----------|----------|
| `@ar-menu/ui` | button, card, dialog, input, label, skeleton | **0 imports in apps** |
| `@ar-menu/shared` | types, zod (`signupSchema`, menu schemas), `cn` | Validation schemas unused |
| `@ar-menu/database` | client factories | Apps use local `lib/supabase/*` instead |

---

## Route Strategy: Spec vs Implementation

Your spec mentions:

- `/view/[foodSlug]`
- `/menu/[restaurant]`

**Current (working) pattern:**

- `/[restaurantSlug]` — restaurant menu
- `/[restaurantSlug]/menu/[itemSlug]` — food + AR

**Recommendation:** Keep the current URL shape for MVP (SEO-friendly, already wired). Optionally add **redirects** later:

```
/view/:foodSlug     → 301 to /:restaurant/menu/:item  (requires lookup table)
/menu/:restaurant   → alias of /:restaurant
```

Document QR codes and marketing links against the **canonical** web URLs, not `/view/`.

---

## Missing SaaS Functionality (Gap Analysis)

### Critical (blocks real restaurants)

| Gap | Impact | Where |
|-----|--------|-------|
| Auth middleware cookie mismatch | Dashboard may be unprotected or always locked | `apps/admin/middleware.ts` |
| No signup / org onboarding | Cannot create tenants | — |
| `user_roles` never populated | RLS may block writes | `schema.sql` |
| Hardcoded `demo-pizzeria` + location UUID | All QR/menu URLs wrong for new tenants | admin QR + menu API |
| No file upload flow | Marketing promises drag-drop GLB; form is URL-only | `menu-item-form.tsx` |
| Missing GLB in `public/` | AR/hero breaks in production | `apps/*/public/` |
| Placeholder `models.example.com` | Relies on client-side fallback | seed + `ar-viewer.tsx` |

### Important (MVP quality)

| Gap | Impact |
|-----|--------|
| Login has no redirect / sign-out | Poor owner UX |
| QR download broken (`#qr-${id}` not on SVG) | `qr-code-list.tsx` |
| `view_count` / `ar_open_count` / `scan_count` never incremented | Stale analytics |
| Settings page is fake | `settings/page.tsx` |
| Web home is placeholder | `web/app/page.tsx` |
| Duplicate analytics paths (client + unused API) | Inconsistent data |
| `@ar-menu/ui` unused | Duplicated `lib/utils.ts`, inconsistent UI |

### Later (post-MVP)

| Gap | Impact |
|-----|--------|
| Billing / plan enforcement | `plan_tier` in schema unused |
| `model_uploads` pipeline | Table exists, no code |
| CDN (`NEXT_PUBLIC_CDN_URL`) | Env unused |
| E2E depends on live Supabase | `tests/e2e/` |

---

## Design System Rules (Non-Negotiable)

When touching UI:

1. **Landing:** No layout redesign; only extract components or fix responsiveness if needed.
2. **Theme:** Luxury dark, cinematic, minimal chrome on customer AR pages.
3. **Motion:** Subtle; preserve existing Framer patterns on landing.
4. **AR pages:** Mobile-first, fullscreen-friendly, fast model load.
5. **Dashboard:** Premium admin — avoid generic food-delivery clutter; reuse dark tokens from `globals.css`.

Centralize tokens in `packages/config` and each app's `@theme` block — do not introduce a second color system.

---

## Phase 1 — Architecture Cleanup

**Goal:** Production-ready folder structure without changing visual output.

### 1.1 Folder organization

```
apps/landing/
  app/                    # routes only
  components/
    marketing/            # extract from page.tsx incrementally
      hero/
      sections/
      ingredients/        # BasilLeaf, etc.
  lib/

apps/admin/
  components/
    dashboard/
    forms/
  lib/
    supabase/             # migrate to @supabase/ssr

apps/web/
  components/
    ar/                   # exists
    menu/
  lib/

packages/
  ui/                     # adopt in admin + web (not landing hero)
  shared/                 # wire zod schemas
  database/
    types/database.ts     # generate from Supabase CLI
```

### 1.2 Shared layout system

| Concern | Action |
|---------|--------|
| Dashboard shell | Extract `apps/admin/app/dashboard/layout.tsx` nav into `components/dashboard/sidebar.tsx` |
| Customer layout | Enhance `apps/web/app/[restaurantSlug]/layout.tsx` with restaurant branding (logo, color from DB) |
| Metadata | Shared `lib/seo.ts` in `packages/shared` |

### 1.3 Design tokens

- Single source: extend `packages/config/tailwind.config.ts` + document CSS variables in `packages/shared/src/tokens.css` (imported by each app's `globals.css`).
- Map landing's `rose-500` / `amber-500` as semantic tokens (`--accent`, `--highlight`) for admin/web consistency.

### 1.4 Route organization

- **Admin:** Keep `(auth)` group; add `(onboarding)` when signup exists.
- **Web:** Keep dynamic segments; add `not-found.tsx` at restaurant level.
- **Landing:** Stay single-page; link Sign In to `NEXT_PUBLIC_ADMIN_URL`.

### 1.5 Mobile optimization

- Audit landing hero `model-viewer` on ≤390px (already has mobile mockup section).
- AR viewer: `touch-action`, safe-area insets, fullscreen AR button sizing.
- Dashboard tables: horizontal scroll or card view on mobile.

### Deliverables

- [ ] Extract landing hero into `components/marketing/hero/` (no visual change)
- [ ] Admin + web import `@ar-menu/ui` for forms and cards
- [ ] Remove duplicate `cn()` — use `@ar-menu/shared`
- [ ] Generate Supabase types → `packages/database/types/database.ts`
- [ ] Document env vars in root `README.md`

**Estimate:** 3–5 days  
**Risk:** Low if landing extraction is copy-only

---

## Phase 2 — Authentication

**Goal:** Restaurant owners can sign up, log in, and only see their organization.

### 2.1 Supabase Auth (proper integration)

| Task | Details |
|------|---------|
| Replace cookie check | Use `@supabase/ssr` in `middleware.ts` + server components |
| Browser client | `createBrowserClient` with cookie storage |
| Server client | `createServerClient` in layouts and API routes |
| Service role | Keep only in admin API routes that need RLS bypass |

**Files:** `apps/admin/lib/supabase/*`, `apps/admin/middleware.ts`, new `app/auth/callback/route.ts`

### 2.2 Signup + onboarding

| Step | UI | Backend |
|------|-----|---------|
| 1 | `/signup` page (match login aesthetic) | `signUp` + email confirm optional |
| 2 | `/onboarding` | Create `organizations` + `locations` + `user_roles` (owner) |
| 3 | Redirect | → `/dashboard` |

Use `signupSchema` from `packages/shared/src/utils/validation.ts`.

### 2.3 Protected routes

- Middleware: session via Supabase SSR, not `sb-access-token`.
- RLS policies in `schema.sql` already assume `user_roles` — **seed role on signup**.
- API routes: derive `organization_id` from session, never from request body alone.

### 2.4 Restaurant accounts

- One org per signup (MVP); multi-location later.
- Store `organization_id` in JWT app metadata or resolve via `user_roles` query.

### Deliverables

- [ ] Working signup → onboarding → dashboard
- [ ] Sign out in dashboard header
- [ ] Middleware blocks unauthenticated `/dashboard/*`
- [ ] All admin API routes scoped to user's org

**Estimate:** 4–6 days  
**Depends on:** Phase 1 Supabase client consolidation

---

## Phase 3 — Dashboard Functionality

**Goal:** Owners manage real menu data with images and GLB models.

### 3.1 Menu CRUD (harden)

| Task | File |
|------|------|
| Remove hardcoded location UUID | `api/menu/route.ts`, `menu-item-form.tsx` |
| Use react-hook-form + zod from shared | `menu-item-form.tsx` |
| Optimistic UI optional | `@tanstack/react-query` (already in deps) |
| Categories, sort order, availability | Already in schema |

### 3.2 Upload food images

| Task | Details |
|------|---------|
| Supabase Storage bucket `images` | Policies exist in `schema.sql` |
| Dropzone UI | Wire `react-dropzone` (already in admin deps) |
| Server upload | API route `POST /api/uploads/image` → return public URL |
| Form | Set `image_url` from upload result |

### 3.3 Upload GLB models

| Task | Details |
|------|---------|
| Bucket `models` | Max size validation (e.g. 15MB MVP) |
| Accept `.glb` only | MIME check |
| Store URL in `menu_items.model_url` | Optional `model_size_mb` |
| `model_uploads` table | Log upload; status `optimized` when done (MVP: immediate) |

### 3.4 Restaurant settings

Replace stub in `apps/admin/app/dashboard/settings/page.tsx`:

- Organization name, slug (immutable after first QR print — warn user)
- Logo upload
- `primary_color` for web menu chrome
- Location name / address

### Deliverables

- [ ] Create/edit/delete menu items with real storage URLs
- [ ] No hardcoded `demo-pizzeria` in writes
- [ ] Settings persist to `organizations` + `locations`

**Estimate:** 5–8 days  
**Depends on:** Phase 2 (org context)

---

## Phase 4 — Public Food Pages

**Goal:** Customer-facing pages feel premium and load fast.

### 4.1 Dynamic routes (enhance existing)

**Canonical URLs:**

```
https://{WEB_APP}/:restaurantSlug
https://{WEB_APP}/:restaurantSlug/menu/:itemSlug
```

| Page | Enhancements |
|------|----------------|
| Restaurant menu | Brand color, logo, category filters |
| Food detail | Hero image, description, allergens, price, prominent **View in AR** |
| Loading/error | Already have `loading.tsx` / `error.tsx` — align with design system |

### 4.2 model-viewer integration

Already in `ARViewer` — tighten:

| Setting | Value |
|---------|-------|
| `ar-modes` | `webxr scene-viewer quick-look` |
| `camera-controls` | true |
| `auto-rotate` | true (pause on AR) |
| `shadow-intensity` | tune for table realism |
| `environment-image` | optional HDR for reflections |
| `ar-scale` | `auto` or fixed for food |

### 4.3 Premium UI (preserve direction)

- Full-bleed dark background on item page
- Minimal nav (back to menu)
- CTA: single primary "View in AR" button
- Skeleton while model loads (`@ar-menu/ui` skeleton)

### 4.4 Web home

Replace `apps/web/app/page.tsx` placeholder with lightweight branded page or redirect to marketing `landing` URL.

### Deliverables

- [ ] All seed items render with real GLB URLs (not example.com)
- [ ] OG metadata correct per item (already started in `page.tsx`)
- [ ] Lighthouse mobile performance acceptable on 4G

**Estimate:** 3–5 days  
**Can parallel:** Phase 3 uploads (need URLs)

---

## Phase 5 — QR System

**Goal:** Print-ready QR codes that always resolve to the correct food page.

### 5.1 URL generation (fix)

**Pattern:**

```
{NEXT_PUBLIC_APP_URL}/{location.slug}/menu/{menu_item.slug}
```

| Fix | Location |
|-----|----------|
| Use `locations.slug` from DB | `qr-code-list.tsx`, `api/qr-codes/generate/route.ts` |
| Remove hardcoded `demo-pizzeria` | both files |

### 5.2 Generate & download

| Task | Details |
|------|---------|
| Unique `code` per QR | Already in schema |
| SVG/PDF download | Fix selector: set `id={`qr-${id}`}` on `QRCodeSVG` |
| PNG export | Optional: `canvas` from SVG or server-side |

### 5.3 QR management page

- List per menu item with scan count
- Toggle `is_active`
- Regenerate URL if slug changes (invalidate old QR)

### 5.4 Link QR → food pages

- `full_url` must match web app canonical route
- Optional short link `/q/:code` → redirect + track scan

### Deliverables

- [ ] QR encodes correct production URL per tenant
- [ ] Download works from dashboard
- [ ] New item auto-suggests QR creation

**Estimate:** 2–4 days  
**Depends on:** Phase 3 (slugs stable), Phase 4 (URLs live)

---

## Phase 6 — AR Experience

**Goal:** Scan → tap → camera → pizza on table feels cinematic and reliable.

### Customer flow

```
Scan QR
  → /:restaurant/menu/:item
  → Tap "View in AR"
  → model-viewer activates AR (Quick Look / Scene Viewer / WebXR)
  → Model anchored on surface
```

### 6.1 Technical requirements

| Requirement | Implementation |
|-------------|----------------|
| iOS Quick Look | `ios-src` USDZ if available; else GLB quick-look |
| Android Scene Viewer | `ar-modes` includes `scene-viewer` |
| WebXR | Feature detect (already in `ar-viewer.tsx`) |
| Realistic shadows | `shadow-intensity`, `shadow-softness` |
| Smooth loading | Progress UI, preload `<link rel="preload">` for GLB |
| Auto-rotate | Preview only; disable in AR |
| Fullscreen | `ar-placement` + UI chrome hide on AR session |

### 6.2 Asset pipeline

| Task | Details |
|------|---------|
| Ship demo `pizza.glb` | `apps/web/public/fallback-models/` + `apps/landing/public/` |
| CDN caching | `next.config.ts` headers (partially done) |
| Compress GLB | Document max poly count for restaurants |
| USDZ generation | Post-MVP (Cloud Function or third-party) |

### 6.3 Cinematic polish

- Subtle vignette overlay on preview
- Haptic-friendly large AR button
- Error state: "AR not supported" + rotate 3D fallback
- Scale guidance copy ("Point at your table")

### Deliverables

- [ ] Test matrix: iPhone Safari, Android Chrome
- [ ] <3s model load on 4G with compressed GLB
- [ ] Analytics `ar_open` fires on AR activation

**Estimate:** 4–6 days  
**Highest product risk** — allocate time for device testing

---

## Phase 7 — Analytics

**Goal:** Owners see real usage from QR scans and AR opens.

### 7.1 Event pipeline

| Event | Trigger | Storage |
|-------|---------|---------|
| `view` | Item page / model load | `analytics_events` |
| `ar_open` | AR button / session start | same |
| `ar_error` | Model or AR failure | same |
| `qr_scan` | Redirect route `/q/:code` | increment `qr_codes.scan_count` |

**Consolidate:** Pick **one** insert path — recommend server API `POST /api/analytics/track` from client (avoids exposing anon insert quirks) or keep direct insert with RLS.

### 7.2 Counter denormalization

On insert, update:

- `menu_items.view_count`, `ar_open_count`
- `qr_codes.scan_count`, `last_scanned_at`

Use Supabase trigger or API route transaction.

### 7.3 Dashboard analytics

`apps/admin/app/dashboard/analytics/page.tsx`:

- QR scans over time (recharts — already in deps)
- Top items by `ar_open_count`
- Device breakdown from `analytics_events`
- Fix stale `view_count` reads

### Deliverables

- [ ] Owner sees last 30 days activity
- [ ] QR scan totals match redirect logs
- [ ] No duplicate event rows from double tracking

**Estimate:** 3–5 days

---

## Cross-Phase: Deployment & Environments

| Env var | Apps | Purpose |
|---------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | admin, web | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | admin, web | Client |
| `SUPABASE_SERVICE_ROLE_KEY` | admin | Server writes |
| `NEXT_PUBLIC_APP_URL` | admin | QR base URL (web app) |
| `NEXT_PUBLIC_ADMIN_URL` | landing | Sign in link |
| `NEXT_PUBLIC_LANDING_URL` | web | Marketing link |

**Vercel layout:**

- Project 1: `apps/web` (customer)
- Project 2: `apps/admin` (dashboard)
- Project 3: `apps/landing` (marketing)

Or single monorepo project with Turborepo filter — document in `README`.

---

## Priority Matrix

| Priority | Item | Phase |
|----------|------|-------|
| P0 | Fix auth middleware (`@supabase/ssr`) | 2 |
| P0 | Add `pizza.glb` + fallback models to `public/` | 6 |
| P0 | Remove hardcoded `demo-pizzeria` / location UUID | 3, 5 |
| P1 | Signup + `user_roles` on create | 2 |
| P1 | Image + GLB upload to Supabase Storage | 3 |
| P1 | QR URL uses real `location.slug` | 5 |
| P2 | Extract landing components (no visual change) | 1 |
| P2 | Adopt `@ar-menu/ui` in admin/web | 1 |
| P2 | AR polish + device testing | 6 |
| P3 | Analytics triggers + dashboard charts | 7 |
| P3 | Billing / plan tiers | Post-MVP |

---

## Suggested Timeline (Solo Senior Dev)

| Week | Phases | Outcome |
|------|--------|---------|
| 1 | 1 + 2 | Clean structure, real auth |
| 2 | 3 | Uploads + settings + tenant-scoped menu |
| 3 | 4 + 5 | Public pages + correct QR |
| 4 | 6 + 7 | AR device hardening + analytics |
| 5 | Buffer | E2E, production deploy, landing link wiring |

---

## Definition of Done (MVP)

A restaurant owner can:

1. Sign up and log in securely  
2. Upload a menu item with image and GLB  
3. Generate a QR code pointing to their live food page  
4. Print the QR  

A customer can:

1. Scan the QR on a phone  
2. Open the food page (premium dark UI)  
3. Tap **View in AR**  
4. See the 3D food on their table via Quick Look / Scene Viewer / WebXR  

Without:

- Hardcoded demo tenant in production paths  
- Broken auth middleware  
- Missing model files  
- Placeholder `models.example.com` URLs in production data  

---

## What Not to Do

- Regenerate or redesign the landing page  
- Merge three apps into one Next.js app (keep separation)  
- Add Redis, Stripe, or heavy infra before MVP flow works  
- Introduce `/view/[foodSlug]` as primary URL without redirects  
- Swap model-viewer for a custom Three.js AR stack (unnecessary for MVP)  

---

## Reference Files

| Area | Path |
|------|------|
| DB schema | `packages/database/schema.sql` |
| Seed data | `packages/database/seed.sql` |
| AR viewer | `apps/web/components/ar/ar-viewer.tsx` |
| Landing hero | `apps/landing/app/page.tsx` |
| Menu form | `apps/admin/app/dashboard/menu/[id]/edit/menu-item-form.tsx` |
| QR list | `apps/admin/app/dashboard/qr-codes/qr-code-list.tsx` |
| Auth middleware | `apps/admin/middleware.ts` |
| Architecture notes | `ar-menu-architecture-improved.md` |

---

## Next Action (Immediate)

Start **Phase 2.1**: replace `sb-access-token` middleware with `@supabase/ssr` and verify dashboard protection against a real Supabase project. In parallel, add `pizza.glb` to `apps/landing/public` and `apps/web/public/fallback-models/` so hero and AR demos work offline.

When ready to implement, proceed phase-by-phase in order above; each phase should ship a deployable increment without touching landing visuals.
