-- Create programs table
CREATE TABLE public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  address TEXT,
  description TEXT NOT NULL,
  donations_needed TEXT[] DEFAULT '{}',
  donation_deadline TEXT,
  highlights TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table  
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sponsors table
CREATE TABLE public.sponsors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  tier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table for user sessions
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Programs are viewable by everyone" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sponsors are viewable by everyone" ON public.sponsors FOR SELECT USING (true);

-- Create policies for submissions (anyone can insert)
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create donations" ON public.donations FOR INSERT WITH CHECK (true);

-- Create policies for cart items (session-based access)
CREATE POLICY "Users can manage their own cart items" ON public.cart_items 
  FOR ALL USING (session_id = current_setting('request.headers')::json->>'x-session-id');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data from JSON files
-- Programs data
INSERT INTO public.programs (id, title, subtitle, description, features, icon) VALUES
('transitional-housing', 'Transitional Housing', 'Safe, supportive temporary housing', 'Providing safe, supportive temporary housing for women transitioning out of incarceration, homelessness, or unsafe situations.', ARRAY['Safe, secure housing environment', 'Case management services', 'Life skills development', '6-12 month residency program'], 'Home'),
('employment-readiness', 'Employment Readiness', 'Job training and placement assistance', 'Comprehensive employment preparation including job training, resume building, interview skills, and job placement assistance.', ARRAY['Resume writing workshops', 'Interview preparation', 'Job placement assistance', 'Professional clothing closet', 'Skills assessment and training'], 'Briefcase'),
('mentoring', 'Mentoring & Support', 'One-on-one guidance and community', 'Connecting women with experienced mentors who provide guidance, support, and encouragement throughout their journey.', ARRAY['One-on-one mentoring relationships', 'Peer support groups', 'Crisis intervention', 'Goal setting and accountability', 'Community building activities'], 'Users');

-- Events data  
INSERT INTO public.events (id, title, date, time, location, address, description, donations_needed, donation_deadline, featured) VALUES
('hire-fair-2025', 'HIRE Reentry Resource Fair', 'September 17, 2025', '11:00am - 2:00pm', 'Honda Center, Anaheim', '2695 E Katella Ave, Anaheim, CA', '4th Annual Reentry Resource Fair - Calling All Employers & Vendors! We''ll be onsite providing information about our services and connecting with community partners.', ARRAY['Gift cards ($10-$25 gas, groceries, Target, Walmart)', 'Hygiene kits (toothpaste, soap, feminine care, lotion)', 'Snacks & bottled water'], 'September 16, 2025', true),
('community-launch-2025', 'She Rises Community Launch', 'November 2025', 'TBD', 'San Bernardino County', 'Location TBD', 'Join us for an afternoon of empowerment, connection, and community as we officially launch She Rises in San Bernardino County.', ARRAY[], null, true);

-- Products data (sample - you'll need to add all products)
INSERT INTO public.products (id, name, price, description, features, category, images, in_stock, featured) VALUES
('hope-t-shirt', 'Hope T-Shirt', 25.00, 'Comfortable cotton t-shirt with inspiring message', ARRAY['100% cotton', 'Unisex fit', 'Machine washable'], 'Apparel', ARRAY['/assets/hope-tshirt.jpg'], true, true),
('empowerment-mug', 'Empowerment Mug', 15.00, 'Ceramic mug with empowering quote', ARRAY['11oz capacity', 'Dishwasher safe', 'Microwave safe'], 'Accessories', ARRAY['/assets/mug.jpg'], true, false);