# Phase 2 — Authentication & Uploads (Master Todo)

**MVP goal:** Restaurant owners can sign up, log in, and add food items with real images and 3D models.

**Landing page:** Do not modify.

---

## Overview

| Sub-phase | Focus | Status |
|-----------|--------|--------|
| **2.1** | Auth (`@supabase/ssr`, signup, sessions, RLS) | ✅ Complete |
| **2.2** | Storage & uploads (images + GLB) | ✅ Built (run migration + manual test) |

Detail docs:
- [PHASE_2.1_TODO.md](./PHASE_2.1_TODO.md) — auth checklist (done)
- [PHASE_2.2_TODO.md](./PHASE_2.2_TODO.md) — uploads checklist (start here)

---

## Phase 2.1 — Auth ✅

- [x] `@supabase/ssr` clients (browser, server, middleware, admin)
- [x] Protected dashboard routes
- [x] Login + signup + sign out
- [x] Signup creates `organizations`, `locations`, `user_roles`
- [x] Tenant-scoped dashboard (session client + RLS)
- [x] Build passes

**Optional manual:** Run `packages/database/migrations/002_auth_rls_policies.sql` in Supabase if not done yet.

---

## Phase 2.2 — Storage & Uploads 🔲

See **[PHASE_2.2_TODO.md](./PHASE_2.2_TODO.md)** for full task list.

**Summary:**
1. Storage RLS policies (tenant-scoped paths)
2. Upload API routes (`/api/uploads/image`, `/api/uploads/model`)
3. Reusable `FileUpload` component (drag-and-drop, progress)
4. Wire menu form — replace URL text fields with uploads
5. Validate file type/size; store public URLs in `menu_items`

---

## After Phase 2 → Phase 3

- Menu CRUD hardening (react-hook-form + zod)
- Delete item
- Optimistic UI (optional)

---

## Quick test (2.1 — you confirmed working)

```bash
cd Menus/apps/admin && npm run dev
```

- Signup → dashboard ✅
- Next: complete 2.2, then create menu item with uploaded image + GLB
