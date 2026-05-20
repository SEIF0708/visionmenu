-- Phase 2.2: Org-scoped storage policies
-- Max sizes enforced in app: images 5MB, GLB models 20MB
-- Path format: {organizationId}/{uuid}.{ext}

-- Replace broad authenticated upload policies with tenant-scoped rules
DROP POLICY IF EXISTS "Authenticated upload models" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload images" ON storage.objects;

-- Members upload only under their organization folder
CREATE POLICY "Org members upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text
      FROM user_roles
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Org members upload models"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'models'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text
      FROM user_roles
      WHERE user_id = auth.uid()
    )
  );

-- Members can update/delete their org files
CREATE POLICY "Org members update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM user_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Org members delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM user_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Org members update models"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'models'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM user_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Org members delete models"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'models'
    AND (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM user_roles WHERE user_id = auth.uid()
    )
  );
