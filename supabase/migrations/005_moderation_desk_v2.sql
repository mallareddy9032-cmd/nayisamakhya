-- Moderation desk v2: multi-photo URLs, ULB link, verified establishments publish target

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS ulb_id UUID REFERENCES urban_local_bodies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_survey_submissions_ulb
  ON survey_submissions (ulb_id);

-- Backfill photo_urls from legacy photo_url
UPDATE survey_submissions
SET photo_urls = jsonb_build_array(photo_url)
WHERE photo_url IS NOT NULL
  AND (photo_urls IS NULL OR photo_urls = '[]'::jsonb);

CREATE TABLE IF NOT EXISTS verified_establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
  mandal_id UUID REFERENCES mandals(id) ON DELETE SET NULL,
  ulb_id UUID REFERENCES urban_local_bodies(id) ON DELETE SET NULL,
  name_en VARCHAR NOT NULL,
  name_te VARCHAR NOT NULL,
  owner_en VARCHAR,
  owner_te VARCHAR,
  area_en VARCHAR,
  area_te VARCHAR,
  phone VARCHAR,
  photo_url VARCHAR,
  photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  category_en VARCHAR DEFAULT 'Salon',
  category_te VARCHAR DEFAULT 'సెలూన్',
  source_submission_id UUID REFERENCES survey_submissions(id) ON DELETE SET NULL,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verified_est_district ON verified_establishments(district_id);
CREATE INDEX IF NOT EXISTS idx_verified_est_mandal ON verified_establishments(mandal_id);
CREATE INDEX IF NOT EXISTS idx_verified_est_ulb ON verified_establishments(ulb_id);

ALTER TABLE verified_establishments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read verified_establishments" ON verified_establishments;
CREATE POLICY "Allow public read verified_establishments"
  ON verified_establishments FOR SELECT USING (true);

COMMENT ON TABLE verified_establishments IS
  'Public directory listings published from moderation desk approvals';
