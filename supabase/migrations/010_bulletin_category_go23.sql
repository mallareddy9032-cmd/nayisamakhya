-- Expand civic_bulletins.category to include G.O. 23 Power + Education & Scholarships alias.
-- Safe to re-run: drops and recreates the check constraint.

ALTER TABLE civic_bulletins DROP CONSTRAINT IF EXISTS civic_bulletins_category_check;

ALTER TABLE civic_bulletins
  ADD CONSTRAINT civic_bulletins_category_check
  CHECK (category IN (
    'BC-A Welfare',
    'G.O. 23 Power',
    'Collector Circular',
    'Education/Scholarships',
    'Education & Scholarships',
    'Legal Rights'
  ));
