
-- 1. Prevent role escalation via profiles update
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
);

-- 2. Restrict user_roles SELECT policies to authenticated users only
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Harden cart_items session check (require non-empty session id of reasonable length)
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
USING (
  session_id = get_session_id()
  AND length(get_session_id()) >= 20
);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items
FOR INSERT
WITH CHECK (
  session_id = get_session_id()
  AND length(get_session_id()) >= 20
);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items
FOR UPDATE
USING (
  session_id = get_session_id()
  AND length(get_session_id()) >= 20
);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items
FOR DELETE
USING (
  session_id = get_session_id()
  AND length(get_session_id()) >= 20
);
