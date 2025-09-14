-- Add a SELECT policy that only allows authorized administrators to read donation records
CREATE POLICY "Only authorized administrators can view donations" 
ON public.donations 
FOR SELECT 
USING (public.is_admin_user());

-- Add an UPDATE policy for admin management of donation records
CREATE POLICY "Only authorized administrators can update donations" 
ON public.donations 
FOR UPDATE 
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Add a DELETE policy for admin management of donation records
CREATE POLICY "Only authorized administrators can delete donations" 
ON public.donations 
FOR DELETE 
USING (public.is_admin_user());