-- Add ordering fields to form_submissions
ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS insertion_order BIGINT,
  ADD COLUMN IF NOT EXISTS original_created_at TIMESTAMPTZ;

-- Sequence for strictly increasing insertion_order
CREATE SEQUENCE IF NOT EXISTS public.form_submissions_insertion_order_seq;

-- Backfill existing rows: order by created_at then id so older imports keep their relative order
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM public.form_submissions
  WHERE insertion_order IS NULL
)
UPDATE public.form_submissions fs
SET insertion_order = o.rn
FROM ordered o
WHERE fs.id = o.id;

-- Advance sequence past current max
SELECT setval(
  'public.form_submissions_insertion_order_seq',
  COALESCE((SELECT MAX(insertion_order) FROM public.form_submissions), 0) + 1,
  false
);

-- Default new rows to next sequence value
ALTER TABLE public.form_submissions
  ALTER COLUMN insertion_order SET DEFAULT nextval('public.form_submissions_insertion_order_seq');

ALTER TABLE public.form_submissions
  ALTER COLUMN insertion_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_form_submissions_insertion_order
  ON public.form_submissions (insertion_order);

-- Trigger: ensure insertion_order is always assigned (in case insert specifies NULL)
CREATE OR REPLACE FUNCTION public.set_form_submission_insertion_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.insertion_order IS NULL THEN
    NEW.insertion_order := nextval('public.form_submissions_insertion_order_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_form_submission_insertion_order ON public.form_submissions;
CREATE TRIGGER trg_set_form_submission_insertion_order
  BEFORE INSERT ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_form_submission_insertion_order();