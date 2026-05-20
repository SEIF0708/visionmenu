-- Auth & tenant RLS policies (run after schema.sql)

-- Users can read their own role assignments
CREATE POLICY "Users read own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Organization members can read their organization
CREATE POLICY "Members read own organization"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE organization_id = organizations.id
        AND user_id = auth.uid()
    )
  );

-- Owners can update their organization
CREATE POLICY "Owners update organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE organization_id = organizations.id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Members can read locations in their organization
CREATE POLICY "Members read own locations"
  ON locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE organization_id = locations.organization_id
        AND user_id = auth.uid()
    )
  );

-- Editors can read analytics for their organization's items
-- (existing policy may cover; ensure members can read qr_codes via menu_items join)
