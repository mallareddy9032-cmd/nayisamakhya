-- G.O. Ms. No. 23 Grievance Docket log
-- Run in Supabase SQL editor after 017_quiz_records.sql
-- Powers /api/notify type=grievance War Room sync + local audit trail.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS grievances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id VARCHAR UNIQUE,
  full_name VARCHAR NOT NULL,
  shop_name VARCHAR NOT NULL,
  mobile VARCHAR(15),
  uscno VARCHAR(20) NOT NULL,
  district_slug VARCHAR NOT NULL,
  district_te VARCHAR,
  mandal_slug VARCHAR NOT NULL,
  mandal_te VARCHAR,
  discom VARCHAR(16) NOT NULL DEFAULT 'TGSPDCL',
  connected_load VARCHAR(40),
  avg_monthly_units VARCHAR(40),
  grievance_type VARCHAR(64) NOT NULL,
  grievance_label_te VARCHAR(240),
  narrative TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grievances_geo
  ON grievances(district_slug, mandal_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_grievances_uscno
  ON grievances(uscno);

CREATE INDEX IF NOT EXISTS idx_grievances_type
  ON grievances(grievance_type, created_at DESC);

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert grievances" ON grievances;
DROP POLICY IF EXISTS "Deny public read grievances" ON grievances;

-- Public insert via anon / service role from /api/notify; no public SELECT.
CREATE POLICY "Allow public insert grievances"
  ON grievances FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Deny public read grievances"
  ON grievances FOR SELECT
  USING (false);
