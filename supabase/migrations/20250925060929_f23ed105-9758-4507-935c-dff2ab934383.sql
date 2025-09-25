-- Fix security vulnerability in contact_submissions table
-- Replace insecure header-based admin check with proper email-based authentication

-- Drop existing policies that use the insecure is_admin_user() function
DROP POLICY IF EXISTS "Only authorized administrators can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only authorized administrators can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only authorized administrators can delete contact submissions" ON public.contact_submissions;

-- Create secure policies using email-based admin verification
CREATE POLICY "Only admin users can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (is_admin_by_email());

CREATE POLICY "Only admin users can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (is_admin_by_email())
WITH CHECK (is_admin_by_email());

CREATE POLICY "Only admin users can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (is_admin_by_email());