-- Fix: dashboard/menu broken when members cannot read user_roles or locations
-- Run this in Supabase SQL Editor if menu/dashboard shows errors or missing_org loops

-- Allow users to read their own role row (required for tenant context)
DROP POLICY IF EXISTS "Users read own roles" ON user_roles;
CREATE POLICY "Users read own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow all org members (including editors) to read their locations
DROP POLICY IF EXISTS "Members read own locations" ON locations;
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

-- Allow members to read their organization
DROP POLICY IF EXISTS "Members read own organization" ON organizations;
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
