-- Module 2: Civic bulletin ingestion + district-scoped coordinator dispatch targets.
-- Run in Supabase SQL Editor after 007/008.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS civic_bulletins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL
    CHECK (category IN (
      'BC-A Welfare',
      'Collector Circular',
      'Education/Scholarships',
      'Legal Rights'
    )),
  target_districts TEXT[] NOT NULL DEFAULT '{}',
  source_url TEXT,
  pdf_url TEXT,
  summary_te TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  broadcast_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (broadcast_status IN ('pending', 'ready', 'dispatched', 'failed', 'skipped')),
  source_adapter TEXT NOT NULL DEFAULT 'seed',
  source_external_id TEXT,
  approved_for_newsletter BOOLEAN NOT NULL DEFAULT true,
  dispatched_at TIMESTAMPTZ,
  dispatch_meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dedup key for adapter ingestion (empty external id allowed only once per adapter).
CREATE UNIQUE INDEX IF NOT EXISTS idx_civic_bulletins_source_external
  ON civic_bulletins (source_adapter, source_external_id);

CREATE INDEX IF NOT EXISTS idx_civic_bulletins_published
  ON civic_bulletins (published_at DESC);

CREATE INDEX IF NOT EXISTS idx_civic_bulletins_category
  ON civic_bulletins (category);

CREATE INDEX IF NOT EXISTS idx_civic_bulletins_broadcast
  ON civic_bulletins (broadcast_status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_civic_bulletins_target_districts
  ON civic_bulletins USING GIN (target_districts);

CREATE INDEX IF NOT EXISTS idx_civic_bulletins_newsletter
  ON civic_bulletins (approved_for_newsletter, published_at DESC)
  WHERE approved_for_newsletter = true;

-- District-scoped coordinator endpoints for Telegram / WhatsApp dispatch.
CREATE TABLE IF NOT EXISTS bulletin_coordinator_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_slug TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_te TEXT,
  telegram_chat_id TEXT,
  whatsapp_e164 TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bulletin_coord_district_tg
  ON bulletin_coordinator_endpoints (district_slug, telegram_chat_id)
  WHERE telegram_chat_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bulletin_coord_district_wa
  ON bulletin_coordinator_endpoints (district_slug, whatsapp_e164)
  WHERE whatsapp_e164 IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bulletin_coord_district
  ON bulletin_coordinator_endpoints (district_slug)
  WHERE is_active = true;

ALTER TABLE civic_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulletin_coordinator_endpoints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved civic_bulletins" ON civic_bulletins;
CREATE POLICY "Public read approved civic_bulletins"
  ON civic_bulletins
  FOR SELECT
  USING (approved_for_newsletter = true);

DROP POLICY IF EXISTS "Deny public write civic_bulletins" ON civic_bulletins;
CREATE POLICY "Deny public insert civic_bulletins"
  ON civic_bulletins
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Deny public update civic_bulletins"
  ON civic_bulletins
  FOR UPDATE
  USING (false);

CREATE POLICY "Deny public delete civic_bulletins"
  ON civic_bulletins
  FOR DELETE
  USING (false);

DROP POLICY IF EXISTS "Deny public read bulletin_coordinator_endpoints"
  ON bulletin_coordinator_endpoints;
CREATE POLICY "Deny public read bulletin_coordinator_endpoints"
  ON bulletin_coordinator_endpoints
  FOR SELECT
  USING (false);

DROP POLICY IF EXISTS "Deny public write bulletin_coordinator_endpoints"
  ON bulletin_coordinator_endpoints;
CREATE POLICY "Deny public insert bulletin_coordinator_endpoints"
  ON bulletin_coordinator_endpoints
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Deny public update bulletin_coordinator_endpoints"
  ON bulletin_coordinator_endpoints
  FOR UPDATE
  USING (false);

CREATE POLICY "Deny public delete bulletin_coordinator_endpoints"
  ON bulletin_coordinator_endpoints
  FOR DELETE
  USING (false);

COMMENT ON TABLE civic_bulletins IS
  'Ingested GOs / circulars / welfare notices with Telugu auto-summaries for newsletter + district broadcast';
COMMENT ON TABLE bulletin_coordinator_endpoints IS
  'Private coordinator Telegram/WhatsApp endpoints keyed by district_slug for Module 2 dispatch';

-- Seed demo coordinator endpoints (safe placeholders — replace chat IDs in production).
INSERT INTO bulletin_coordinator_endpoints
  (district_slug, name_en, name_te, telegram_chat_id, whatsapp_e164, is_active)
VALUES
  ('suryapet', 'Suryapet Desk Coord', 'సూర్యాపేట సమన్వయకర్త', 'demo-tg-suryapet', '919000000001', true),
  ('nalgonda', 'Nalgonda Desk Coord', 'నల్గొండ సమన్వయకర్త', 'demo-tg-nalgonda', '919000000002', true),
  ('hyderabad', 'Hyderabad Desk Coord', 'హైదరాబాద్ సమన్వయకర్త', 'demo-tg-hyderabad', '919000000003', true),
  ('rangareddy', 'Rangareddy Desk Coord', 'రంగారెడ్డి సమన్వయకర్త', 'demo-tg-rangareddy', '919000000004', true),
  ('adilabad', 'Adilabad Desk Coord', 'ఆదిలాబాద్ సమన్వయకర్త', 'demo-tg-adilabad', '919000000005', true),
  ('nirmal', 'Nirmal Desk Coord', 'నిర్మల్ సమన్వయకర్త', 'demo-tg-nirmal', '919000000006', true)
ON CONFLICT DO NOTHING;
