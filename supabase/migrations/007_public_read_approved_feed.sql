-- Allow public (anon) read of approved survey submissions for /api/feed.
-- Permissive policies OR together; the existing deny-all policy never grants,
-- so this policy enables SELECT only when status = 'approved'.

DROP POLICY IF EXISTS "Public read approved survey_submissions" ON survey_submissions;

CREATE POLICY "Public read approved survey_submissions"
  ON survey_submissions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

COMMENT ON POLICY "Public read approved survey_submissions" ON survey_submissions IS
  'Civic field feed — public can read approved intake rows only';
