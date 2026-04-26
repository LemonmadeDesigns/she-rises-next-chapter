-- Restrict sensitive form submissions to administrators only
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.form_submissions;

CREATE POLICY "Admins can view all submissions"
ON public.form_submissions
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update submissions"
ON public.form_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete submissions"
ON public.form_submissions
FOR DELETE
TO authenticated
USING (public.is_admin());