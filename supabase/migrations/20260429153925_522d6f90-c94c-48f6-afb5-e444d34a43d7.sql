-- Remove insecure header-based session access from cart_items
-- The cart is currently client-side only (localStorage); the table is reserved for future authenticated use.

-- 1. Drop insecure anon policy that trusts client-supplied x-session-id header
DROP POLICY IF EXISTS "Users can view their own cart items via session" ON public.cart_items;

-- 2. Drop the legacy session_id column entirely (no longer trusted)
ALTER TABLE public.cart_items DROP COLUMN IF EXISTS session_id;

-- 3. Ensure user_id is enforced (already NOT NULL per schema, but make explicit)
ALTER TABLE public.cart_items ALTER COLUMN user_id SET NOT NULL;

-- 4. Authenticated-only policies already exist (SELECT/INSERT/UPDATE/DELETE on auth.uid() = user_id).
--    Reaffirm by recreating SELECT policy cleanly.
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 5. Drop the insecure get_session_id() function — no longer referenced anywhere
DROP FUNCTION IF EXISTS public.get_session_id() CASCADE;