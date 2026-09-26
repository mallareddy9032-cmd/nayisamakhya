-- Admin desk submissions API columns (GET/PATCH /api/admin/submissions)
-- Safe to re-run.

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS panchayat_name TEXT;

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Keep photo_urls available for the desk grid (idempotent with 005).
ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN survey_submissions.panchayat_name IS
  'Free-text gram panchayat / village tag from admin desk';
COMMENT ON COLUMN survey_submissions.admin_notes IS
  'Moderator notes from /admin/desk (Bearer MODERATION_DESK_SECRET API)';
COMMENT ON COLUMN survey_submissions.reviewed_at IS
  'Timestamp set by PATCH /api/admin/submissions';
