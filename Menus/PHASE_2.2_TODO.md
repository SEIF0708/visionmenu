# Phase 2.2 — Storage & Uploads (Todo List)

**Goal:** Restaurant owners upload food images and GLB 3D models from the dashboard — no more manual URL pasting.

**Depends on:** Phase 2.1 auth (complete).

---

## Checklist

### 1. Database & storage policies
- [x] Add migration `003_storage_rls_policies.sql`
- [ ] **Run migration in Supabase SQL editor** (manual)

### 2. Upload API routes
- [x] `POST /api/uploads/image`
- [x] `POST /api/uploads/model`
- [x] `lib/uploads.ts` + `lib/upload-handler.ts`

### 3. Reusable upload components
- [x] `components/uploads/file-upload.tsx`
- [x] `components/uploads/image-upload.tsx`
- [x] `components/uploads/model-upload.tsx`

### 4. Menu form integration
- [x] Drag-and-drop image + GLB on menu form
- [x] `model_size_mb` from upload
- [x] Validation: GLB required before save
- [x] Advanced URL fallback (collapsed)

### 5. Auth context in uploads
- [x] Paths scoped to `organizationId` server-side

### 6. Customer web app
- [x] Supabase storage host in `apps/web/next.config.ts`

### 7. Error handling & UX
- [x] File type/size errors
- [x] Disable submit while uploading

### 8. Verify
- [x] `npm run build` passes
- [ ] Manual: upload image + GLB → save → view on web app

---

## Manual step: run migration

In Supabase SQL editor, run:

`packages/database/migrations/003_storage_rls_policies.sql`

---

## Test flow

1. `cd Menus/apps/admin && npm run dev`
2. Dashboard → Menu → Add Item
3. Upload photo + GLB
4. Save
5. Generate QR → open on `localhost:3000`
