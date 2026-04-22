-- Create comprehensive form_submissions table
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL, -- 'Contact', 'Volunteer', 'Partnership', 'Event Registration', 'Housing Intake', 'Visit Scheduling', etc.
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  category TEXT, -- Category/reason for contact
  form_data JSONB, -- Store additional form-specific data as JSON
  status TEXT DEFAULT 'unread', -- 'unread', 'read', 'responded', 'archived'
  notes TEXT, -- Admin notes
  read_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON public.form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON public.form_submissions(email);

-- Enable Row Level Security
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can submit forms
CREATE POLICY "Anyone can submit forms"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create policy: Only authenticated admins can read submissions
-- Note: This assumes you have an is_admin function or will check admin status in your app
CREATE POLICY "Admins can view all submissions"
  ON public.form_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy: Only authenticated admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON public.form_submissions
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy: Only authenticated admins can delete submissions
CREATE POLICY "Admins can delete submissions"
  ON public.form_submissions
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing contact_submissions data if any
INSERT INTO public.form_submissions (
  form_type,
  name,
  email,
  phone,
  message,
  created_at,
  status
)
SELECT
  'Contact' as form_type,
  name,
  email,
  phone,
  message,
  created_at,
  'unread' as status
FROM public.contact_submissions
WHERE NOT EXISTS (
  SELECT 1 FROM public.form_submissions
);

-- Add comment to table
COMMENT ON TABLE public.form_submissions IS 'Stores all form submissions from website including contact, volunteer, partnership, event registration, and housing intake forms';
