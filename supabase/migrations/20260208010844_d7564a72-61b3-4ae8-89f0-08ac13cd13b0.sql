-- Harden profiles SELECT policies: add explicit TO authenticated role restriction
-- This prevents any possibility of anon access even if auth functions behave unexpectedly

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with explicit TO authenticated restriction
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin_by_email());

-- Also harden the UPDATE policy with TO authenticated
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  (auth.uid() = id) 
  AND (role = (SELECT profiles_1.role FROM profiles profiles_1 WHERE profiles_1.id = auth.uid()))
);