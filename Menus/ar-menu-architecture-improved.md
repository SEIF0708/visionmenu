# AR Restaurant Menu — Production Architecture

A scalable, maintainable architecture designed for multi-tenant SaaS deployment.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Customer Experience                      │
├─────────────────────────────────────────────────────────────┤
│  QR Scan → Landing Page → AR Viewer → Order Integration     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router │ API Routes │ Edge Functions           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data & Storage                          │
├─────────────────────────────────────────────────────────────┤
│  Supabase (Auth, DB) │ CDN (Models) │ Cache Layer           │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: MVP Foundation (Week 1)

### Core Technical Stack

**Frontend**

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- @google/model-viewer + Three.js fallback

**Backend & Infrastructure**

- Supabase (PostgreSQL + Auth + Storage)
- Vercel (hosting + edge functions)
- Cloudflare CDN (model delivery)
- Redis (caching via Upstash)

**Development Tools**

- pnpm (faster than npm)
- Turborepo (monorepo management)
- Playwright (E2E testing)
- Husky + lint-staged (git hooks)

---

## Improved Folder Structure

```
apps/
├── web/                          # Customer-facing app
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── [restaurantSlug]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── menu/
│   │   │   │       └── [itemSlug]/
│   │   │   │           ├── page.tsx
│   │   │   │           └── loading.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── analytics/route.ts
│   │   │   ├── og/route.tsx      # Dynamic OG images
│   │   │   └── webhooks/route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ar/
│   │   │   ├── ar-viewer.tsx
│   │   │   ├── model-loader.tsx
│   │   │   └── ar-controls.tsx
│   │   ├── menu/
│   │   └── ui/                   # shadcn components
│   ├── lib/
│   │   ├── supabase/
│   │   ├── analytics.ts
│   │   └── utils.ts
│   └── public/
│       └── fallback-models/      # Lightweight fallbacks
│
├── admin/                        # Restaurant dashboard
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── menu/
│   │   │   ├── analytics/
│   │   │   ├── qr-codes/
│   │   │   └── settings/
│   │   └── api/
│   └── components/
│
└── landing/                      # Marketing site
    └── app/

packages/
├── database/                     # Shared Supabase config
│   ├── migrations/
│   ├── schema.sql
│   └── seed.sql
├── shared/                       # Shared types & utils
│   ├── types/
│   └── utils/
└── config/                       # Shared configs
    ├── tailwind/
    └── typescript/
```

---

## Database Schema (Improved)

### Core Tables

```sql
-- Multi-tenancy with row-level security
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  max_menu_items INTEGER DEFAULT 10,
  max_monthly_scans INTEGER DEFAULT 1000,
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address JSONB,
  timezone TEXT DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, slug)
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  calories INTEGER,
  allergens TEXT[],
  dietary_tags TEXT[],
  image_url TEXT,
  model_url TEXT NOT NULL,
  model_format TEXT DEFAULT 'glb',
  model_size_mb DECIMAL(5,2),
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  ar_open_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(location_id, slug),
  CONSTRAINT valid_model CHECK (model_url IS NOT NULL)
);

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  device_type TEXT,
  os TEXT,
  browser TEXT,
  load_time_ms INTEGER,
  model_load_time_ms INTEGER,
  country_code TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  full_url TEXT NOT NULL,
  placement_location TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  last_scanned_at TIMESTAMPTZ,
  scan_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, organization_id)
);

CREATE TABLE model_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  original_filename TEXT NOT NULL,
  file_size_mb DECIMAL(10,2),
  upload_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  optimized_url TEXT,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes for Performance

```sql
CREATE INDEX idx_menu_items_location ON menu_items(location_id) WHERE is_available = true;
CREATE INDEX idx_menu_items_slug ON menu_items(location_id, slug);
CREATE INDEX idx_analytics_events_item ON analytics_events(menu_item_id, created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id, created_at);
CREATE INDEX idx_menu_items_search ON menu_items
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### Row Level Security (RLS)

```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active menu items"
  ON menu_items FOR SELECT
  USING (is_available = true AND published_at IS NOT NULL);

CREATE POLICY "Organization members can manage"
  ON menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN locations l ON l.organization_id = ur.organization_id
      WHERE l.id = menu_items.location_id
        AND ur.user_id = auth.uid()
        AND ur.role IN ('owner', 'admin', 'editor')
    )
  );
```

---

## API Design

### RESTful Routes

```typescript
// Public API (customer-facing)
GET /api/v1/restaurants/[slug]
GET /api/v1/restaurants/[slug]/menu
GET /api/v1/restaurants/[slug]/menu/[itemSlug]
POST /api/v1/analytics/track

// Protected API (dashboard)
GET /api/v1/admin/menu
POST /api/v1/admin/menu
PATCH /api/v1/admin/menu/[id]
DELETE /api/v1/admin/menu/[id]
POST /api/v1/admin/models/upload-url
POST /api/v1/admin/models/optimize
GET /api/v1/admin/analytics/overview
GET /api/v1/admin/analytics/items
GET /api/v1/admin/qr-codes
POST /api/v1/admin/qr-codes/generate
```

### API Response Format

```typescript
// Success
{ success: true, data: {}, meta: { timestamp, version } }

// Error
{ success: false, error: { code, message, details }, meta: { timestamp } }
```

---

## AR Viewer Component Architecture

```typescript
// components/ar/ar-viewer.tsx
interface ARViewerProps {
  modelUrl: string;
  itemName: string;
  fallbackImageUrl?: string;
  onAROpen?: () => void;
  onError?: (error: Error) => void;
}
```

- Uses @google/model-viewer web component
- Supports WebXR (Android) and Quick Look (iOS)
- Progressive loading with poster images
- Error handling with fallback images
- Device capability detection

---

## Performance Optimization Strategy

### Model Optimization Pipeline
1. Upload to temporary storage
2. Trigger optimization (edge function/worker)
3. Generate LOD versions (high: 5MB, medium: 2MB, low: 500KB)
4. Store in CDN with cache headers

### Caching Strategy
- API: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- Models: `Cache-Control: public, max-age=31536000, immutable`

---

## Security Implementation

### Rate Limiting
- 10 requests per 10 seconds per IP (public endpoints)

### Content Security Policy
- Restrict model-src, media-src to CDN domains
- Strict CSP headers

### Input Validation
- Zod schemas for all API inputs
- File validation (GLB/GLTF only, max 50MB)

---

## Deployment Strategy

### Vercel Configuration
- Build: `pnpm turbo build`
- Functions: 1024MB memory, 10s max duration
- CDN: Cloudflare or Vercel edge

### Environment Variables
- Supabase URL/keys
- CDN URL
- Analytics keys (PostHog, Vercel)
- Redis (Upstash)
- Stripe keys

---

## Testing Strategy

### E2E Tests (Playwright)
- Menu item page loads and displays model
- Analytics events tracked
- Error handling works
- Admin CRUD operations

### Performance Tests
- Lighthouse audits (85+ performance)
- Model load time < 3s (P95)

---

## Monitoring & Observability

### Error Tracking (Sentry)
- Filter expected errors (network errors)
- Performance traces (0.1 sample rate)

### Health Checks
- Database connectivity
- Storage accessibility
- Cache (Redis) availability

---

## Pricing & Business Model

### Tiers
- **Free**: 5 items, 500 scans/month, basic analytics
- **Basic** ($29/mo): 25 items, 5000 scans, custom domain
- **Premium** ($99/mo): 100 items, 25000 scans, white-label
- **Enterprise** (custom): Unlimited, dedicated support, SLA

---

## Key Success Metrics

### Technical
- Model load time < 3s (P95)
- Page load time < 2s (P95)
- AR success rate > 90%
- Uptime > 99.9%

### Business
- QR scan to AR view conversion > 30%
- Average time in AR > 15s
- Churn rate < 5%

---

## Next Steps

1. **Day 1-2**: Set up monorepo, database schema, basic Next.js app
2. **Day 3-4**: Build AR viewer component, test on multiple devices
3. **Day 5-6**: Implement admin dashboard (menu CRUD)
4. **Day 7**: Deploy MVP, create demo menu
5. **Week 2**: Add analytics, optimize performance
6. **Week 3**: Build onboarding flow, payment integration
7. **Week 4**: Launch pilot program with 10 restaurants
