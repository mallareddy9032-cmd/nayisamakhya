-- Volunteers / Mandal Field Champion (సేవా సారథి) — Competition 1
-- Run in Supabase SQL editor after 002_surveys.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  phone VARCHAR(15) NOT NULL,
  district VARCHAR NOT NULL,
  mandal VARCHAR NOT NULL,
  ref_code VARCHAR UNIQUE NOT NULL,
  completed_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'certified')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteers_phone
  ON volunteers(phone);

CREATE INDEX IF NOT EXISTS idx_volunteers_ref
  ON volunteers(ref_code);

CREATE INDEX IF NOT EXISTS idx_volunteers_district
  ON volunteers(district, completed_count DESC);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert volunteers" ON volunteers;
DROP POLICY IF EXISTS "Allow public read volunteers by phone" ON volunteers;
DROP POLICY IF EXISTS "Allow public update volunteers count" ON volunteers;

CREATE POLICY "Allow public insert volunteers"
  ON volunteers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read volunteers by phone"
  ON volunteers FOR SELECT
  USING (true);

CREATE POLICY "Allow public update volunteers count"
  ON volunteers FOR UPDATE
  USING (true)
  WITH CHECK (true);
