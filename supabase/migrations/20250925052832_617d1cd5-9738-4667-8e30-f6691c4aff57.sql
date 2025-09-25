-- Create user profiles table for storing admin roles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create visit requests table
CREATE TABLE public.visit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for visit requests
CREATE POLICY "Anyone can create visit requests" 
ON public.visit_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all visit requests" 
ON public.visit_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update visit requests" 
ON public.visit_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Function to check if user is admin by email
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.email() IN ('pransom1319@gmail.com', 'LemonsTerrell2021@gmail.com')
$$;

-- Update admin policies to use email check for now
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all visit requests" ON public.visit_requests;
DROP POLICY IF EXISTS "Admins can update visit requests" ON public.visit_requests;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin_by_email());

CREATE POLICY "Admins can view all visit requests" 
ON public.visit_requests 
FOR SELECT 
USING (is_admin_by_email());

CREATE POLICY "Admins can update visit requests" 
ON public.visit_requests 
FOR UPDATE 
USING (is_admin_by_email());

-- Create trigger for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visit_requests_updated_at
  BEFORE UPDATE ON public.visit_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();