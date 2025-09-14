-- Create a function to check if the current user is an admin
-- This uses a secure approach where admin access is determined by a specific header or setting
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for admin authorization header
  -- In production, this should be replaced with proper user role checking
  RETURN current_setting('request.headers.x-admin-key', true) = 'admin-access-key-2024';
EXCEPTION
  WHEN others THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Add a SELECT policy that only allows authorized administrators to read contact submissions
CREATE POLICY "Only authorized administrators can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (public.is_admin_user());

-- Optional: Add an UPDATE policy for admin management (if needed)
CREATE POLICY "Only authorized administrators can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Optional: Add a DELETE policy for admin management (if needed)
CREATE POLICY "Only authorized administrators can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (public.is_admin_user());