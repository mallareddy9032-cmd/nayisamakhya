-- Phase 2: explicit session step + staged district for multi-step bot intake
-- Extends bot_upload_sessions (canonical bot_sessions store)

ALTER TABLE bot_upload_sessions
  ADD COLUMN IF NOT EXISTS step TEXT NOT NULL DEFAULT 'IDLE'
    CHECK (step IN ('IDLE', 'AWAITING_DETAILS'));

ALTER TABLE bot_upload_sessions
  ADD COLUMN IF NOT EXISTS staged_district TEXT;

COMMENT ON COLUMN bot_upload_sessions.step IS
  'Bot state machine: IDLE | AWAITING_DETAILS (photo staged, awaiting location text)';
COMMENT ON COLUMN bot_upload_sessions.staged_district IS
  'District chosen via inline keyboard before mandal/grievance follow-up';

CREATE INDEX IF NOT EXISTS idx_bot_upload_sessions_step
  ON bot_upload_sessions (chat_id, step)
  WHERE step = 'AWAITING_DETAILS';
