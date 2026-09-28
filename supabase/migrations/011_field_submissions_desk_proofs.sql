-- Field proof intake (Telegram bot) + desk_proofs storage bucket
-- Safe to re-run: IF NOT EXISTS / DROP POLICY IF EXISTS

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- field_submissions — lightweight proof rows for bot intake
-- image_url is NULLABLE so we never fail NOT NULL when storage is delayed
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS field_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  chat_id TEXT NOT NULL,
  image_url TEXT,
  district TEXT,
  mandal TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'flagged', 'staged')),
  photo_file_unique_id TEXT,
  telegram_message_id TEXT,
  sender_name TEXT,
  survey_submission_id UUID REFERENCES survey_submissions(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_field_submissions_photo_unique
  ON field_submissions (photo_file_unique_id)
  WHERE photo_file_unique_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_field_submissions_chat_created
  ON field_submissions (chat_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_field_submissions_status
  ON field_submissions (status, created_at DESC);

ALTER TABLE field_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public read field_submissions" ON field_submissions;
DROP POLICY IF EXISTS "Deny public write field_submissions" ON field_submissions;

CREATE POLICY "Deny public read field_submissions"
  ON field_submissions FOR SELECT
  USING (false);

CREATE POLICY "Deny public write field_submissions"
  ON field_submissions FOR ALL
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE field_submissions IS
  'Telegram bot field proof intake — image_url nullable; desk reviews via status=pending';
COMMENT ON COLUMN field_submissions.image_url IS
  'Supabase Storage public URL; nullable when upload deferred or staged';

-- ---------------------------------------------------------------------------
-- bot_upload_sessions — stage photo URL until user sends district/mandal text
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bot_upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id TEXT NOT NULL,
  user_id TEXT,
  image_url TEXT,
  object_path TEXT,
  storage_bucket TEXT,
  photo_file_unique_id TEXT,
  sender_name TEXT,
  intent TEXT DEFAULT 'submit_proof',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bot_upload_sessions_chat
  ON bot_upload_sessions (chat_id, updated_at DESC);

ALTER TABLE bot_upload_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny public bot_upload_sessions" ON bot_upload_sessions;
CREATE POLICY "Deny public bot_upload_sessions"
  ON bot_upload_sessions FOR ALL
  USING (false)
  WITH CHECK (false);

-- ---------------------------------------------------------------------------
-- desk_proofs storage bucket — service_role full access
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'desk_proofs',
  'desk_proofs',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read desk_proofs" ON storage.objects;
DROP POLICY IF EXISTS "Service upload desk_proofs" ON storage.objects;
DROP POLICY IF EXISTS "Service update desk_proofs" ON storage.objects;
DROP POLICY IF EXISTS "Service delete desk_proofs" ON storage.objects;

CREATE POLICY "Public read desk_proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'desk_proofs');

-- service_role bypasses RLS; these policies also allow authenticated service paths
CREATE POLICY "Service upload desk_proofs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'desk_proofs');

CREATE POLICY "Service update desk_proofs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'desk_proofs')
  WITH CHECK (bucket_id = 'desk_proofs');

CREATE POLICY "Service delete desk_proofs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'desk_proofs');
