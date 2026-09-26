-- Lock survey-photos INSERT to service_role only.
-- Prior policy had no TO clause, so anon/authenticated could upload into the public bucket.

DROP POLICY IF EXISTS "Service upload survey-photos" ON storage.objects;

CREATE POLICY "Service upload survey-photos"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'survey-photos');

COMMENT ON POLICY "Service upload survey-photos" ON storage.objects IS
  'Only service_role may INSERT into survey-photos (Telegram webhook / admin)';
