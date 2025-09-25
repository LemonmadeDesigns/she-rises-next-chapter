-- Update the is_admin_by_email function to be case-insensitive and include both admin emails
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT LOWER(auth.email()) IN ('pransom1319@gmail.com', 'lemonsterrell2021@gmail.com')
$function$;