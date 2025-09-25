-- Create or replace the update_updated_at_column function
-- This function is needed by triggers in the visit_requests and profiles tables

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the function is owned by the right user
ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO anon;