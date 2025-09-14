-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can manage cart items" ON public.cart_items;

-- Create secure session-based RLS policies for cart_items
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (session_id = current_setting('request.headers.x-session-id', true));

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (session_id = current_setting('request.headers.x-session-id', true));

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (session_id = current_setting('request.headers.x-session-id', true))
WITH CHECK (session_id = current_setting('request.headers.x-session-id', true));

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (session_id = current_setting('request.headers.x-session-id', true));

-- Alternative: If you prefer to use a more traditional approach with a session ID parameter
-- You can also create a function-based approach:

CREATE OR REPLACE FUNCTION public.get_session_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.headers.x-session-id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update policies to use the function (more readable)
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (session_id = public.get_session_id());

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (session_id = public.get_session_id());

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (session_id = public.get_session_id());

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (session_id = public.get_session_id());