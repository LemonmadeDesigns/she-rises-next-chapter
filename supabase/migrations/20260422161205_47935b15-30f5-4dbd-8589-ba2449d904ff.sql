-- 1. Cart items: switch from session header to auth.uid()

-- Drop existing session-based policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

-- Add user_id column tied to auth.users
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- Clear any legacy rows that have no owner (session-based, untrusted)
DELETE FROM public.cart_items WHERE user_id IS NULL;

ALTER TABLE public.cart_items
  ALTER COLUMN user_id SET NOT NULL;

-- Make session_id optional (kept for backwards compatibility / client grouping)
ALTER TABLE public.cart_items
  ALTER COLUMN session_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- New auth-based RLS policies (authenticated only)
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON public.cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON public.cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON public.cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. user_roles: scope write policies to authenticated role only
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));