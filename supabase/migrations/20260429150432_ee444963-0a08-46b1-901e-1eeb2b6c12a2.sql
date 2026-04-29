-- 1. Add missing SELECT policy for cart_items (authenticated users see their own items)
CREATE POLICY "Users can view their own cart items via session"
ON public.cart_items
FOR SELECT
TO anon
USING (session_id IS NOT NULL AND session_id = public.get_session_id() AND length(public.get_session_id()) >= 20);

-- Note: authenticated SELECT policy already exists per RLS list. Skipping if present.

-- 2. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_session_id() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_form_submission_insertion_order() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Ensure required roles can still execute the ones used in RLS
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_session_id() TO anon, authenticated;