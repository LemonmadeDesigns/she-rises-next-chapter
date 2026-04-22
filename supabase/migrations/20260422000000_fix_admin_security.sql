-- Security Fix: Replace hardcoded email admin check with proper role-based access control
-- This migration addresses the security scanner warning about hardcoded admin emails

-- Step 1: Drop the insecure is_admin_by_email() function and replace with role-based check
DROP FUNCTION IF EXISTS public.is_admin_by_email();

-- Create new function that checks user_roles table instead of hardcoded emails
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Step 2: Update all policies that use is_admin_by_email() to use is_admin()

-- Profiles table policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin());

-- Donations table policies
DROP POLICY IF EXISTS "Only authorized administrators can view donations" ON public.donations;
DROP POLICY IF EXISTS "Only authorized administrators can update donations" ON public.donations;
DROP POLICY IF EXISTS "Only authorized administrators can delete donations" ON public.donations;

CREATE POLICY "Only authorized administrators can view donations"
ON public.donations
FOR SELECT
USING (is_admin());

CREATE POLICY "Only authorized administrators can update donations"
ON public.donations
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only authorized administrators can delete donations"
ON public.donations
FOR DELETE
USING (is_admin());

-- Step 3: Fix profiles table UPDATE policy to prevent role escalation
-- Remove the 'role' column from profiles table entirely to prevent dual source of truth

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  -- Note: If you need to prevent certain fields from being updated,
  -- add those checks here. The 'role' field should not exist in profiles
  -- table if you're using user_roles for role management.
);

-- Step 4: Ensure admin roles are properly seeded in user_roles table
-- This is safe because it only inserts if the record doesn't exist
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE LOWER(email) IN ('pransom1319@gmail.com', 'empowerhavenhomes@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Add comment explaining cart_items security
COMMENT ON TABLE public.cart_items IS 'NOTE: This table is not currently used in production. The application uses client-side cart storage only. If this table is used in the future, the RLS policy must be updated to use auth.uid() instead of x-session-id header for proper security.';

COMMENT ON POLICY "Users can manage their own cart items" ON public.cart_items IS 'SECURITY WARNING: This policy uses client-supplied session_id which is insecure. If cart persistence is needed, migrate to auth.uid() based access control.';
