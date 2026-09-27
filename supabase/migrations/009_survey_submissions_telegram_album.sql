-- Telegram album + reminder columns used by /api/telegram-webhook photo ingest.
-- Safe to re-run. Fixes insert failures that surface as "నమోదు విఫలమైంది".

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS media_group_id TEXT;

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE survey_submissions
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_survey_submissions_media_group
  ON survey_submissions (media_group_id)
  WHERE media_group_id IS NOT NULL;

COMMENT ON COLUMN survey_submissions.media_group_id IS
  'Telegram media_group_id for silent album batching';
COMMENT ON COLUMN survey_submissions.reminder_sent IS
  'True after caption follow-up / reminder handled';
COMMENT ON COLUMN survey_submissions.last_activity_at IS
  'Last photo or caption activity from Telegram ingest';
