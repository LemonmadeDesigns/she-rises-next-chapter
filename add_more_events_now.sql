-- Update existing events with real She Rises event images
UPDATE public.events
SET image = '/images/sheRisesEvent/7059925313154428637.jpg'
WHERE id = 'community-launch-2025';

UPDATE public.events
SET image = '/images/sheRisesEvent/4144182975016900898.jpg'
WHERE id = 'wellness-workshop-2025';

UPDATE public.events
SET image = '/images/sheRisesEvent/693318440489445220.jpg'
WHERE id = 'job-fair-2025';

UPDATE public.events
SET image = '/images/sheRisesEvent/5834705427993600355.jpg'
WHERE id = 'support-circle-weekly';

UPDATE public.events
SET image = '/images/sheRisesEvent/2982251138089298540.jpg'
WHERE id = 'financial-literacy-2025';

UPDATE public.events
SET image = '/images/sheRisesEvent/2703810718057889108.jpg'
WHERE id = 'volunteer-orientation-2025';

-- Add more diverse events with real images
INSERT INTO public.events (id, title, category, type, date, time, location, address, description, image, price, capacity, registered, featured, highlights)
VALUES
  (
    'hire-fair-2025',
    'HIRE Reentry Resource Fair',
    'employment',
    'In-Person',
    '2025-11-18',
    '10:00 AM - 4:00 PM',
    'San Bernardino County Library',
    '555 West Fourth Street, San Bernardino, CA',
    'Annual reentry resource fair connecting justice-impacted women with employment, housing, and support services.',
    '/images/sheRisesEvent/2655304675795419291.jpg',
    'Free',
    150,
    38,
    true,
    ARRAY[
      'Employers with immediate openings',
      'Housing assistance resources',
      'Legal aid and expungement info',
      'Skills training programs',
      'Transportation support'
    ]
  ),
  (
    'mental-health-workshop',
    'Mental Health Awareness Workshop',
    'wellness',
    'Hybrid',
    '2025-12-12',
    '5:00 PM - 7:00 PM',
    'She Rises Community Center / Virtual',
    '456 Wellness Ave, San Bernardino, CA',
    'Learn about mental health resources, coping strategies, and self-care practices specifically for women overcoming trauma.',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    'Free',
    60,
    22,
    false,
    ARRAY[
      'Licensed mental health professionals',
      'Stress management techniques',
      'Trauma-informed care practices',
      'Resource directory provided',
      'Q&A session included'
    ]
  ),
  (
    'holiday-giving-gala',
    'Holiday Giving Gala',
    'fundraising',
    'In-Person',
    '2025-12-15',
    '6:00 PM - 10:00 PM',
    'Historic California Theatre',
    '562 West Fourth Street, San Bernardino, CA',
    'Elegant evening gala featuring dinner, entertainment, silent auction, and celebration of our community impact.',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    '$50',
    250,
    142,
    true,
    ARRAY[
      'Silent auction with amazing items',
      'Three-course dinner',
      'Live music and entertainment',
      'Impact awards ceremony',
      'Networking with community leaders'
    ]
  ),
  (
    'parenting-support-group',
    'Parenting Support Circle',
    'support',
    'In-Person',
    '2025-11-25',
    '10:00 AM - 12:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Monthly support group for mothers navigating parenting challenges, co-parenting, and family reunification.',
    'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=800&h=600&fit=crop',
    'Free',
    20,
    14,
    false,
    ARRAY[
      'Licensed family therapist facilitation',
      'Childcare provided',
      'Parenting resources and tools',
      'Community meal included',
      'Connect with other mothers'
    ]
  ),
  (
    'computer-skills-training',
    'Computer Skills & Digital Literacy',
    'education',
    'In-Person',
    '2025-12-03',
    '1:00 PM - 4:00 PM',
    'San Bernardino Public Library - Tech Center',
    '555 West Fourth Street, San Bernardino, CA',
    'Four-week course teaching basic computer skills, internet navigation, email, and online job applications.',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop',
    'Free',
    25,
    19,
    false,
    ARRAY[
      'Beginner-friendly instruction',
      'One-on-one support available',
      'Practice computers provided',
      'Take-home resource guide',
      'Certificate of completion'
    ]
  ),
  (
    'thanksgiving-volunteer-day',
    'Thanksgiving Community Service Day',
    'volunteer',
    'In-Person',
    '2025-11-27',
    '8:00 AM - 2:00 PM',
    'Multiple Locations',
    'San Bernardino County',
    'Join us for a day of service preparing and serving Thanksgiving meals to families in need across our community.',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
    'Free',
    100,
    67,
    true,
    ARRAY[
      'Prepare 500+ meals for families',
      'Team-building and networking',
      'Community meal for volunteers',
      'All ages welcome',
      'Make a direct impact'
    ]
  ),
  (
    'entrepreneurship-workshop',
    'Women in Business: Entrepreneurship Workshop',
    'education',
    'Virtual',
    '2025-12-17',
    '6:00 PM - 8:30 PM',
    'Zoom Meeting',
    'Online',
    'Learn how to start and grow your own business with expert guidance on business planning, financing, and marketing.',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
    'Free',
    75,
    41,
    false,
    ARRAY[
      'Successful women entrepreneurs panel',
      'Business plan template provided',
      'Access to microloans and grants',
      'Marketing and branding basics',
      'Ongoing mentorship opportunities'
    ]
  ),
  (
    'yoga-meditation-series',
    'Healing Through Yoga & Meditation',
    'wellness',
    'In-Person',
    '2025-12-07',
    '9:00 AM - 10:30 AM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Six-week series focused on trauma-informed yoga, meditation, and breathwork for healing and empowerment.',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop',
    '$10',
    30,
    23,
    false,
    ARRAY[
      'Certified trauma-informed yoga instructor',
      'All levels welcome',
      'Yoga mats provided',
      'Meditation guide included',
      'Weekly practice sessions'
    ]
  ),
  (
    'housing-workshop',
    'Path to Housing Stability Workshop',
    'support',
    'In-Person',
    '2025-12-20',
    '3:00 PM - 5:00 PM',
    'Community Resource Center',
    '123 Hope Street, San Bernardino, CA',
    'Connect with housing resources, learn about rental assistance programs, and get support navigating the housing system.',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    'Free',
    40,
    28,
    false,
    ARRAY[
      'Housing authority representatives',
      'Rental assistance applications',
      'Tenant rights education',
      'Credit repair resources',
      'Emergency housing options'
    ]
  ),
  (
    'new-year-celebration',
    'New Year, New Beginnings Celebration',
    'general',
    'In-Person',
    '2025-12-31',
    '7:00 PM - 11:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Ring in the new year with our community! Celebration includes dinner, vision board creation, and goal-setting activities.',
    'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop',
    'Free',
    100,
    56,
    true,
    ARRAY[
      'New Year dinner buffet',
      'Vision board workshop',
      'Goal-setting session',
      'Music and dancing',
      'Midnight celebration and toast'
    ]
  )
ON CONFLICT (id) DO NOTHING;
