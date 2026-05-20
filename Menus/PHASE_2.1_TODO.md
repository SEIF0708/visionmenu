# Phase 2.1 — Auth Fixes (Todo List)

**Goal:** Production-quality auth so restaurant owners can sign up, log in, and access a tenant-scoped dashboard.

---

## Checklist

### Dependencies & clients
- [x] Install `@supabase/ssr` in `apps/admin`
- [x] `lib/supabase/client.ts` — browser client (`createBrowserClient`)
- [x] `lib/supabase/server.ts` — server client (cookies)
- [x] `lib/supabase/admin.ts` — service role (signup only)
- [x] `lib/supabase/middleware.ts` — `updateSession()` helper

### Middleware & routes
- [x] Replace `sb-access-token` check with Supabase SSR session
- [x] Protect `/dashboard/*` → redirect to `/login?next=...`
- [x] Redirect logged-in users away from `/login` and `/signup`
- [x] `app/auth/callback/route.ts` — code exchange
- [x] `app/page.tsx` — root redirects to dashboard or login

### Auth UI
- [x] Login page with redirect + `router.refresh()`
- [x] Signup page (`/signup`)
- [x] Sign out button in dashboard header
- [x] Show signed-in user / restaurant name in header

### Signup & tenant bootstrap
- [x] `POST /api/auth/signup` — user + organization + location + `user_roles` (owner)
- [x] Auto sign-in after signup
- [x] Unique org slug generation

### Reusable auth utilities
- [x] `lib/auth.ts` — `getUser`, `requireUser`, `getOrganizationContext`
- [x] `lib/auth-api.ts` — `getAuthenticatedSupabase`, `unauthorizedResponse`

### Session-scoped data access
- [x] Dashboard pages use session client (not service role)
- [x] Menu API routes require auth + RLS
- [x] QR API uses tenant `locationSlug` (no hardcoded demo)
- [x] Menu form uses real `locationId` from session

### Database / RLS
- [x] `migrations/002_auth_rls_policies.sql` — member read policies
- [ ] Run migration in Supabase SQL editor (manual step)

### Verify
- [x] `npm run build` passes in `apps/admin`
- [ ] Manual test: signup → dashboard → refresh → sign out → login (requires Supabase + migration)

---

## After Phase 2.1 → Phase 2.2

- Image upload (Supabase Storage `images` bucket)
- GLB upload (Supabase Storage `models` bucket)
- Replace URL fields in menu form with drag-and-drop
