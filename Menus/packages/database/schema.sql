-- AR Menu Platform - Database Schema
-- Multi-tenancy with row-level security

-- Core organization table
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
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$'),
  CONSTRAINT valid_plan CHECK (plan_tier IN ('free', 'basic', 'premium', 'enterprise'))
);

-- Restaurant locations (support multiple locations per org)
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

-- Menu items with versioning
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

-- Analytics events for aggregation
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

-- QR codes for tracking
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

-- User roles and permissions
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, organization_id),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'editor', 'viewer'))
);

-- Model upload queue for processing
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'optimized', 'failed'))
);

-- Indexes for performance
CREATE INDEX idx_menu_items_location ON menu_items(location_id) WHERE is_available = true;
CREATE INDEX idx_menu_items_slug ON menu_items(location_id, slug);
CREATE INDEX idx_analytics_events_item ON analytics_events(menu_item_id, created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id, created_at);
CREATE INDEX idx_menu_items_search ON menu_items
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public users can read active menu items
CREATE POLICY "Public read active menu items"
  ON menu_items FOR SELECT
  USING (is_available = true AND published_at IS NOT NULL);

-- Public can read locations with active menus
CREATE POLICY "Public read active locations"
  ON locations FOR SELECT
  USING (is_active = true);

-- Public can read organizations (basic info)
CREATE POLICY "Public read organizations"
  ON organizations FOR SELECT
  USING (true);

-- Anyone can insert analytics events
CREATE POLICY "Public insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Organization members can manage their data
CREATE POLICY "Organization members manage menu items"
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

CREATE POLICY "Organization members manage locations"
  ON locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE organization_id = locations.organization_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Organization members view analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN locations l ON l.organization_id = ur.organization_id
      WHERE l.id = (
        SELECT location_id FROM menu_items WHERE id = analytics_events.menu_item_id
      )
      AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members manage QR codes"
  ON qr_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN locations l ON l.organization_id = ur.organization_id
      WHERE l.id = (
        SELECT location_id FROM menu_items WHERE id = qr_codes.menu_item_id
      )
      AND ur.user_id = auth.uid()
      AND ur.role IN ('owner', 'admin', 'editor')
    )
  );

-- Auth: members read own role, org, and locations (required for dashboard)
CREATE POLICY "Users read own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Members read own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE organization_id = organizations.id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members read own locations"
  ON locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE organization_id = locations.organization_id
        AND user_id = auth.uid()
    )
  );

-- Storage bucket for 3D models
INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policies
CREATE POLICY "Public read models"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'models');

CREATE POLICY "Authenticated upload models"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'models'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );
