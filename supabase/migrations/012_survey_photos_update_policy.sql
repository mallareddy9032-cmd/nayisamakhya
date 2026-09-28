-- Allow service_role upserts into survey-photos (x-upsert / Storage UPDATE).
-- Migration 008 only granted INSERT; REST fallback with x-upsert:true needs UPDATE.

DROP POLICY IF EXISTS "Service update survey-photos" ON storage.objects;

CREATE POLICY "Service update survey-photos"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'survey-photos')
  WITH CHECK (bucket_id = 'survey-photos');

COMMENT ON POLICY "Service update survey-photos" ON storage.objects IS
  'Only service_role may UPDATE objects in survey-photos (Telegram webhook upserts)';
