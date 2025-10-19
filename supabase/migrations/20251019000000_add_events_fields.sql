-- Add additional fields to events table for better event management
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'In-Person';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price TEXT DEFAULT 'Free';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 50;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registered INTEGER DEFAULT 0;

-- Create index on date for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(featured);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);

-- Create a policy to allow admins to insert, update, and delete events
-- First, we need to create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN ('pransom1319@gmail.com', 'lemonsterrell2021@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policies for admin write access
CREATE POLICY "Admins can insert events" ON public.events
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE
  USING (is_admin());

-- Update existing events with default values if they don't have them
UPDATE public.events
SET
  category = COALESCE(category, 'general'),
  type = COALESCE(type, 'In-Person'),
  price = COALESCE(price, 'Free'),
  capacity = COALESCE(capacity, 50),
  registered = COALESCE(registered, 0)
WHERE category IS NULL OR type IS NULL OR price IS NULL OR capacity IS NULL OR registered IS NULL;
