-- Fix 1: Create proper user roles system
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles table UPDATE policy to prevent role modification
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Fix 2: Remove insecure is_admin_user() function
-- First drop the policies that depend on it
DROP POLICY IF EXISTS "Only authorized administrators can view donations" ON public.donations;
DROP POLICY IF EXISTS "Only authorized administrators can update donations" ON public.donations;
DROP POLICY IF EXISTS "Only authorized administrators can delete donations" ON public.donations;

-- Now drop the insecure function
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Recreate the policies using is_admin_by_email()
CREATE POLICY "Only authorized administrators can view donations"
ON public.donations
FOR SELECT
USING (is_admin_by_email());

CREATE POLICY "Only authorized administrators can update donations"
ON public.donations
FOR UPDATE
USING (is_admin_by_email())
WITH CHECK (is_admin_by_email());

CREATE POLICY "Only authorized administrators can delete donations"
ON public.donations
FOR DELETE
USING (is_admin_by_email());

-- Insert admin roles for the existing admin emails
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE LOWER(email) IN ('pransom1319@gmail.com', 'lemonsterrell2021@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;