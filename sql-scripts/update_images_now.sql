-- Update HIRE fair
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop' WHERE title LIKE '%HIRE%';

-- Update Community Launch
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop' WHERE title LIKE '%Community Launch%';

-- Update Wellness
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop' WHERE category = 'wellness';

-- Update Employment
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop' WHERE category = 'employment';

-- Update Support
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop' WHERE category = 'support';

-- Update Education
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop' WHERE category = 'education';

-- Update Volunteer
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop' WHERE category = 'volunteer';

-- Update Fundraising
UPDATE public.events SET image = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop' WHERE category = 'fundraising';
