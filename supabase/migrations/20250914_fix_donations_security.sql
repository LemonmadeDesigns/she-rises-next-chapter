-- CRITICAL SECURITY FIX: Protect sensitive donor information
--
-- ISSUE: The donations table contains donor names and email addresses
-- but has no SELECT policy, making this sensitive donor data publicly readable.
-- This exposes donor information to potential spam, fraud, or harassment.
--
-- SOLUTION: Add strict RLS policies to restrict access to donation records
-- to authorized administrators only.

-- First, create an admin role table to define who can access donations
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own admin status
CREATE POLICY "Users can view their own admin status" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- Only existing admins can create new admin users
CREATE POLICY "Only admins can create admin users" ON public.admin_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CRITICAL FIX: Remove the existing overly permissive donation policies
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;

-- Create secure policies for donations table
-- Policy 1: Only allow anonymous donation creation (without exposing existing data)
CREATE POLICY "Allow anonymous donation creation" ON public.donations
  FOR INSERT WITH CHECK (true);

-- Policy 2: CRITICAL - Only admins can view donation data (protects donor privacy)
CREATE POLICY "Only admins can view donations" ON public.donations
  FOR SELECT USING (public.is_admin());

-- Policy 3: Only admins can update donation status
CREATE POLICY "Only admins can update donations" ON public.donations
  FOR UPDATE USING (public.is_admin());

-- Policy 4: Only admins can delete donations (for GDPR compliance)
CREATE POLICY "Only admins can delete donations" ON public.donations
  FOR DELETE USING (public.is_admin());

-- Similarly, protect contact submissions from unauthorized access
-- Remove existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

-- Create secure contact submission policies
CREATE POLICY "Allow contact form submission" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete contact submissions" ON public.contact_submissions
  FOR DELETE USING (public.is_admin());

-- Create application_submissions table with proper security
CREATE TABLE IF NOT EXISTS public.application_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Emergency Contact
  emergency_name TEXT,
  emergency_relation TEXT,
  emergency_phone TEXT,

  -- Application Details
  application_type TEXT NOT NULL, -- 'program' or 'volunteer'
  program_interest TEXT[], -- for program applications
  volunteer_role TEXT, -- for volunteer applications
  current_situation TEXT,
  housing_situation TEXT,
  employment TEXT,
  education TEXT,
  children TEXT,
  children_ages TEXT,
  goals TEXT,
  challenges TEXT,
  previous_services TEXT,
  medical_needs TEXT,
  transportation TEXT,

  -- Volunteer-specific fields
  availability TEXT,
  start_date DATE,
  experience TEXT,
  skills TEXT,
  motivation TEXT,
  volunteer_history TEXT,
  references TEXT,

  -- Legal agreements
  background_check_consent BOOLEAN DEFAULT false,
  commitment_agreement BOOLEAN DEFAULT false,
  contact_consent BOOLEAN DEFAULT false,

  -- Status tracking
  status TEXT DEFAULT 'submitted',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on application submissions
ALTER TABLE public.application_submissions ENABLE ROW LEVEL SECURITY;

-- Secure policies for application submissions
CREATE POLICY "Allow application submission" ON public.application_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view applications" ON public.application_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admins can update applications" ON public.application_submissions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete applications" ON public.application_submissions
  FOR DELETE USING (public.is_admin());

-- Create newsletter_subscribers table with proper security
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  source TEXT -- where they subscribed from
);

-- Enable RLS on newsletter subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Secure policies for newsletter subscribers
CREATE POLICY "Allow newsletter subscription" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admins can update subscribers" ON public.newsletter_subscribers
  FOR UPDATE USING (public.is_admin());

-- Create triggers for timestamp updates on new tables
CREATE TRIGGER update_application_submissions_updated_at
  BEFORE UPDATE ON public.application_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_application_submissions_created_at ON public.application_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_application_submissions_status ON public.application_submissions(status);
CREATE INDEX IF NOT EXISTS idx_application_submissions_type ON public.application_submissions(application_type);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.programs, public.events, public.products, public.sponsors TO anon, authenticated;
GRANT INSERT ON public.donations, public.contact_submissions, public.application_submissions, public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.cart_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;

-- Security audit log
COMMENT ON TABLE public.donations IS 'SECURITY: Access restricted to admins only. Contains sensitive donor information.';
COMMENT ON TABLE public.contact_submissions IS 'SECURITY: Access restricted to admins only. Contains personal contact information.';
COMMENT ON TABLE public.application_submissions IS 'SECURITY: Access restricted to admins only. Contains sensitive personal and application data.';
COMMENT ON TABLE public.newsletter_subscribers IS 'SECURITY: Access restricted to admins only. Contains email addresses.';

-- Insert first admin user (replace with actual admin user ID)
-- YOU MUST UPDATE THIS WITH YOUR ACTUAL ADMIN USER ID FROM auth.users
-- INSERT INTO public.admin_users (user_id, role, created_by)
-- VALUES ('YOUR_ADMIN_USER_ID_HERE', 'admin', 'YOUR_ADMIN_USER_ID_HERE');