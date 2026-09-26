-- Phase 1: Urban Local Bodies directory (municipalities / corporations / nagar panchayats)

CREATE TABLE IF NOT EXISTS urban_local_bodies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  slug VARCHAR NOT NULL,
  name_en VARCHAR NOT NULL,
  name_te VARCHAR NOT NULL,
  ulb_type VARCHAR NOT NULL DEFAULT 'municipality',
  town_coordinators_count INTEGER DEFAULT 0,
  registered_establishments_count INTEGER DEFAULT 0,
  welfare_support_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(district_id, slug)
);

CREATE TABLE IF NOT EXISTS urban_representatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ulb_id UUID REFERENCES urban_local_bodies(id) ON DELETE CASCADE,
  name_en VARCHAR NOT NULL,
  name_te VARCHAR NOT NULL,
  designation_en VARCHAR NOT NULL DEFAULT 'Coordinator',
  designation_te VARCHAR NOT NULL DEFAULT 'సమన్వయకర్త',
  phone VARCHAR NOT NULL,
  photo_url VARCHAR,
  is_verified BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS urban_establishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ulb_id UUID REFERENCES urban_local_bodies(id) ON DELETE CASCADE,
  name_en VARCHAR NOT NULL,
  name_te VARCHAR NOT NULL,
  category_en VARCHAR DEFAULT 'Salon',
  category_te VARCHAR DEFAULT 'సెలూన్',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE urban_local_bodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE urban_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE urban_establishments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read urban_local_bodies" ON urban_local_bodies;
DROP POLICY IF EXISTS "Allow public read urban_representatives" ON urban_representatives;
DROP POLICY IF EXISTS "Allow public read urban_establishments" ON urban_establishments;

CREATE POLICY "Allow public read urban_local_bodies"
  ON urban_local_bodies FOR SELECT USING (true);
CREATE POLICY "Allow public read urban_representatives"
  ON urban_representatives FOR SELECT USING (true);
CREATE POLICY "Allow public read urban_establishments"
  ON urban_establishments FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_ulb_district ON urban_local_bodies(district_id);
CREATE INDEX IF NOT EXISTS idx_ulb_slug ON urban_local_bodies(slug);
CREATE INDEX IF NOT EXISTS idx_urban_reps_ulb ON urban_representatives(ulb_id);
CREATE INDEX IF NOT EXISTS idx_urban_est_ulb ON urban_establishments(ulb_id);
