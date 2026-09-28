-- Petition dockets for public QR verification (/verify/[id])
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS petition_dockets (
  docket_id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  category_te TEXT NOT NULL,
  district_slug TEXT NOT NULL,
  district_te TEXT NOT NULL,
  mandal_slug TEXT NOT NULL DEFAULT '',
  mandal_te TEXT NOT NULL DEFAULT '',
  statutory_te TEXT NOT NULL,
  subject_te TEXT NOT NULL,
  applicant_name TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_petition_dockets_issued
  ON petition_dockets (issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_petition_dockets_district
  ON petition_dockets (district_slug, issued_at DESC);

ALTER TABLE petition_dockets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read petition_dockets" ON petition_dockets;
DROP POLICY IF EXISTS "Deny public write petition_dockets" ON petition_dockets;

-- Public can verify by docket id (read-only).
CREATE POLICY "Public read petition_dockets"
  ON petition_dockets FOR SELECT
  USING (true);

-- Writes only via service_role (bypasses RLS); block anon/authenticated writes.
CREATE POLICY "Deny public write petition_dockets"
  ON petition_dockets FOR INSERT
  WITH CHECK (false);

COMMENT ON TABLE petition_dockets IS
  'Client-generated representation dockets for QR verification at /verify/[id]';
