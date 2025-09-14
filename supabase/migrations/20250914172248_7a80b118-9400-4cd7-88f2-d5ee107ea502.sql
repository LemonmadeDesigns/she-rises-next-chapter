-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.get_session_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.headers.x-session-id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;