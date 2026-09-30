-- Reels / Mana Kala contest (మన కళ - మన ఆత్మగౌరవం) — Competition 2
-- Run in Supabase SQL editor after 015_volunteers.sql
-- Schema v2: `caption` (was `title`); `likes_count` default 0

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  creator_name VARCHAR NOT NULL,
  phone VARCHAR(15) NOT NULL,
  district_slug VARCHAR NOT NULL,
  mandal_slug VARCHAR NOT NULL,
  category VARCHAR NOT NULL
    CHECK (category IN ('salon_craft', 'nadaswaram_music', 'youth_education')),
  video_url TEXT NOT NULL,
  caption VARCHAR NOT NULL,
  shares_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'featured'))
);

-- Idempotent upgrades for environments that already applied the title-based 016
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reels' AND column_name = 'title'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reels' AND column_name = 'caption'
  ) THEN
    ALTER TABLE reels RENAME COLUMN title TO caption;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'reels' AND column_name = 'likes_count'
  ) THEN
    ALTER TABLE reels ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reels_status_category
  ON reels(status, category);

CREATE INDEX IF NOT EXISTS idx_reels_created
  ON reels(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reels_phone
  ON reels(phone);

ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert reels" ON reels;
DROP POLICY IF EXISTS "Allow public read approved reels" ON reels;
DROP POLICY IF EXISTS "Allow public update reel shares" ON reels;

CREATE POLICY "Allow public insert reels"
  ON reels FOR INSERT
  WITH CHECK (true);

-- Public gallery: approved + featured only (pending stays admin/local)
CREATE POLICY "Allow public read approved reels"
  ON reels FOR SELECT
  USING (status IN ('approved', 'featured'));

CREATE POLICY "Allow public update reel shares"
  ON reels FOR UPDATE
  USING (status IN ('approved', 'featured'))
  WITH CHECK (status IN ('approved', 'featured'));
