-- Update existing events with diverse, unique images

-- Community Launch (Fundraising) - Elegant gala/community event
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'
WHERE id = 'community-launch-2025';

-- Wellness Workshop - Yoga/meditation/wellness
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop'
WHERE id = 'wellness-workshop-2025';

-- Job Fair (Employment) - Business meeting/office
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop'
WHERE id = 'job-fair-2025';

-- Support Circle - Women supporting each other
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop'
WHERE id = 'support-circle-weekly';

-- Financial Literacy (Education) - Books/learning/study
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop'
WHERE id = 'financial-literacy-2025';

-- Volunteer Orientation - People collaborating/volunteering
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop'
WHERE id = 'volunteer-orientation-2025';

-- HIRE Reentry Resource Fair (if exists)
UPDATE public.events
SET image = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'
WHERE id = 'hire-fair-2025';

-- Update category and type if they're null
UPDATE public.events
SET category = 'general'
WHERE category IS NULL;

UPDATE public.events
SET type = 'In-Person'
WHERE type IS NULL;
