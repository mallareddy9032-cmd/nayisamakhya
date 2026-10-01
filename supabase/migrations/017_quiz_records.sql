-- Quiz records / Civic & Legal Rights Quiz attempts (Competition 3)
-- Run in Supabase SQL editor after 015_volunteers.sql
-- Powers Admin Portal Legal Advocacy Cell (≥7/10) exports.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS quiz_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  phone VARCHAR(15) NOT NULL,
  district VARCHAR NOT NULL,
  mandal VARCHAR NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 10,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  certificate_id VARCHAR,
  passed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_records_score
  ON quiz_records(score DESC, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_records_phone
  ON quiz_records(phone);

CREATE INDEX IF NOT EXISTS idx_quiz_records_district
  ON quiz_records(district, mandal);

ALTER TABLE quiz_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert quiz_records" ON quiz_records;
DROP POLICY IF EXISTS "Allow public read quiz_records" ON quiz_records;

-- Public insert so quiz submissions can persist when anon key is used.
CREATE POLICY "Allow public insert quiz_records"
  ON quiz_records FOR INSERT
  WITH CHECK (true);

-- Public read for Admin Portal anon client (desk is cookie-gated in Next middleware).
CREATE POLICY "Allow public read quiz_records"
  ON quiz_records FOR SELECT
  USING (true);
