-- First, update existing events with real She Rises images
UPDATE public.events SET image = '/images/sheRisesEvent/7059925313154428637.jpg' WHERE id = 'community-launch-2025';
UPDATE public.events SET image = '/images/sheRisesEvent/4144182975016900898.jpg' WHERE id = 'wellness-workshop-2025';
UPDATE public.events SET image = '/images/sheRisesEvent/693318440489445220.jpg' WHERE id = 'job-fair-2025';
UPDATE public.events SET image = '/images/sheRisesEvent/5834705427993600355.jpg' WHERE id = 'support-circle-weekly';
UPDATE public.events SET image = '/images/sheRisesEvent/2982251138089298540.jpg' WHERE id = 'financial-literacy-2025';
UPDATE public.events SET image = '/images/sheRisesEvent/2703810718057889108.jpg' WHERE id = 'volunteer-orientation-2025';

-- Add comprehensive list of new events with real and diverse images
INSERT INTO public.events (id, title, category, type, date, time, location, address, description, image, price, capacity, registered, featured, highlights)
VALUES
  -- November 2025 Events
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
      'Transportation support available'
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
    '/images/sheRisesEvent/5834705427993600355.jpg',
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
    'thanksgiving-volunteer-day',
    'Thanksgiving Community Service Day',
    'volunteer',
    'In-Person',
    '2025-11-27',
    '8:00 AM - 2:00 PM',
    'Multiple Locations',
    'San Bernardino County',
    'Join us for a day of service preparing and serving Thanksgiving meals to families in need across our community.',
    '/images/sheRisesEvent/2703810718057889108.jpg',
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

  -- December 2025 Events
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
    '/images/sheRisesEvent/4144182975016900898.jpg',
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
    'yoga-meditation-series',
    'Healing Through Yoga & Meditation',
    'wellness',
    'In-Person',
    '2025-12-07',
    '9:00 AM - 10:30 AM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Six-week series focused on trauma-informed yoga, meditation, and breathwork for healing and empowerment.',
    '/images/sheRisesEvent/4144182975016900898.jpg',
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
    'mental-health-workshop',
    'Mental Health Awareness Workshop',
    'wellness',
    'Hybrid',
    '2025-12-12',
    '5:00 PM - 7:00 PM',
    'She Rises Community Center / Virtual',
    '456 Wellness Ave, San Bernardino, CA',
    'Learn about mental health resources, coping strategies, and self-care practices specifically for women overcoming trauma.',
    '/images/sheRisesEvent/7059925313154428637.jpg',
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
    '/images/sheRisesEvent/7059925313154428637.jpg',
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
    'entrepreneurship-workshop',
    'Women in Business: Entrepreneurship Workshop',
    'education',
    'Virtual',
    '2025-12-17',
    '6:00 PM - 8:30 PM',
    'Zoom Meeting',
    'Online',
    'Learn how to start and grow your own business with expert guidance on business planning, financing, and marketing.',
    '/images/sheRisesEvent/693318440489445220.jpg',
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
    'housing-workshop',
    'Path to Housing Stability Workshop',
    'support',
    'In-Person',
    '2025-12-20',
    '3:00 PM - 5:00 PM',
    'Community Resource Center',
    '123 Hope Street, San Bernardino, CA',
    'Connect with housing resources, learn about rental assistance programs, and get support navigating the housing system.',
    '/images/sheRisesEvent/2982251138089298540.jpg',
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
    '/images/sheRisesEvent/7059925313154428637.jpg',
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
  ),

  -- January 2026 Events
  (
    'fresh-start-orientation',
    'Fresh Start: New Year Orientation',
    'general',
    'In-Person',
    '2026-01-07',
    '6:00 PM - 8:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'New year orientation for women interested in joining She Rises programs. Learn about available services and get connected.',
    '/images/sheRisesEvent/2655304675795419291.jpg',
    'Free',
    50,
    12,
    true,
    ARRAY[
      'Program overview and eligibility',
      'Meet staff and current participants',
      'Tour of facilities',
      'Light refreshments',
      'Resource packets provided'
    ]
  ),
  (
    'resume-building-workshop',
    'Resume Building & Interview Prep',
    'employment',
    'In-Person',
    '2026-01-15',
    '2:00 PM - 5:00 PM',
    'Community College Career Center',
    '789 Education Drive, San Bernardino, CA',
    'Professional workshop on creating compelling resumes and mastering job interviews for women re-entering the workforce.',
    '/images/sheRisesEvent/693318440489445220.jpg',
    'Free',
    30,
    18,
    false,
    ARRAY[
      'Resume templates and examples',
      'Mock interview practice',
      'Professional headshots available',
      'LinkedIn profile building',
      'Job search strategies'
    ]
  ),
  (
    'art-therapy-session',
    'Healing Through Art Therapy',
    'wellness',
    'In-Person',
    '2026-01-22',
    '10:00 AM - 1:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Therapeutic art session using creative expression for healing, stress relief, and self-discovery.',
    '/images/sheRisesEvent/4144182975016900898.jpg',
    '$5',
    15,
    8,
    false,
    ARRAY[
      'Certified art therapist facilitation',
      'All art supplies provided',
      'No experience necessary',
      'Take home your artwork',
      'Light snacks included'
    ]
  ),
  (
    'legal-aid-clinic',
    'Free Legal Aid Clinic',
    'support',
    'In-Person',
    '2026-01-25',
    '9:00 AM - 3:00 PM',
    'Community Law Center',
    '789 Justice Boulevard, San Bernardino, CA',
    'Free legal consultations for family law, expungement, housing issues, and employment matters.',
    '/images/sheRisesEvent/2982251138089298540.jpg',
    'Free',
    40,
    25,
    true,
    ARRAY[
      'Licensed attorneys available',
      'Family law consultations',
      'Expungement information',
      'Housing rights assistance',
      'Document preparation help'
    ]
  ),

  -- February 2026 Events
  (
    'self-care-valentines',
    'Self-Love & Self-Care Valentine''s Workshop',
    'wellness',
    'In-Person',
    '2026-02-14',
    '2:00 PM - 5:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Valentine''s Day focused on self-love, self-care practices, and building healthy relationships with yourself and others.',
    '/images/sheRisesEvent/5834705427993600355.jpg',
    'Free',
    35,
    22,
    true,
    ARRAY[
      'Self-care workshop and activities',
      'Healthy relationship education',
      'Spa treatments and pampering',
      'Vision board creation',
      'Chocolate and refreshments'
    ]
  ),
  (
    'financial-empowerment',
    'Financial Empowerment Series: Credit & Banking',
    'education',
    'Virtual',
    '2026-02-19',
    '7:00 PM - 8:30 PM',
    'Zoom Meeting',
    'Online',
    'Second session in our financial literacy series focusing on building credit, understanding banking, and financial independence.',
    '/images/sheRisesEvent/2982251138089298540.jpg',
    'Free',
    80,
    45,
    false,
    ARRAY[
      'Credit building strategies',
      'Banking basics and options',
      'Understanding credit scores',
      'Avoiding predatory lending',
      'Financial independence planning'
    ]
  ),
  (
    'community-pantry-day',
    'Community Pantry & Resource Day',
    'volunteer',
    'In-Person',
    '2026-02-28',
    '10:00 AM - 2:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Monthly community pantry providing groceries, household items, and connecting families with essential resources.',
    '/images/sheRisesEvent/2703810718057889108.jpg',
    'Free',
    150,
    78,
    false,
    ARRAY[
      'Free groceries for families',
      'Household essentials available',
      'Resource fair with local agencies',
      'Health screenings offered',
      'Children''s activities'
    ]
  ),

  -- March 2026 Events
  (
    'women-history-celebration',
    'Women''s History Month Celebration',
    'general',
    'In-Person',
    '2026-03-08',
    '3:00 PM - 6:00 PM',
    'Historic California Theatre',
    '562 West Fourth Street, San Bernardino, CA',
    'Celebrate Women''s History Month with inspiring speakers, performances, and recognition of local women leaders.',
    '/images/sheRisesEvent/7059925313154428637.jpg',
    'Free',
    200,
    89,
    true,
    ARRAY[
      'Keynote speakers',
      'Cultural performances',
      'Women leaders panel',
      'Resource fair',
      'Light reception'
    ]
  ),
  (
    'spring-job-fair',
    'Spring Career Fair & Hiring Event',
    'employment',
    'In-Person',
    '2026-03-20',
    '9:00 AM - 3:00 PM',
    'Convention Center',
    '100 Convention Way, San Bernardino, CA',
    'Major career fair featuring 50+ employers, on-site interviews, career coaching, and professional development workshops.',
    '/images/sheRisesEvent/693318440489445220.jpg',
    'Free',
    300,
    156,
    true,
    ARRAY[
      '50+ employers hiring',
      'On-site interviews available',
      'Resume review stations',
      'Professional headshots',
      'Career coaching sessions'
    ]
  ),
  (
    'gardening-wellness',
    'Garden Therapy & Urban Farming Workshop',
    'wellness',
    'In-Person',
    '2026-03-28',
    '10:00 AM - 1:00 PM',
    'Community Garden',
    '234 Green Street, San Bernardino, CA',
    'Learn about therapeutic gardening, growing your own food, and connecting with nature for wellness and sustainability.',
    '/images/sheRisesEvent/4144182975016900898.jpg',
    'Free',
    25,
    16,
    false,
    ARRAY[
      'Hands-on gardening instruction',
      'Container gardening for apartments',
      'Seed and plant giveaways',
      'Nutrition and cooking tips',
      'Community garden plot opportunities'
    ]
  ),

  -- April 2026 Events
  (
    'spring-fundraiser',
    'Spring Renewal Fundraising Luncheon',
    'fundraising',
    'In-Person',
    '2026-04-12',
    '11:00 AM - 2:00 PM',
    'The Mission Inn Hotel',
    '3649 Mission Inn Ave, Riverside, CA',
    'Annual spring fundraising luncheon featuring guest speakers, success stories, and recognition of donors and volunteers.',
    '/images/sheRisesEvent/7059925313154428637.jpg',
    '$75',
    180,
    98,
    true,
    ARRAY[
      'Inspiring keynote speaker',
      'Success story testimonials',
      'Gourmet lunch served',
      'Silent auction items',
      'Donor recognition awards'
    ]
  ),
  (
    'tax-prep-assistance',
    'Free Tax Preparation Assistance',
    'education',
    'In-Person',
    '2026-04-10',
    '9:00 AM - 4:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'Free tax preparation help from certified volunteers for individuals and families earning $60,000 or less.',
    '/images/sheRisesEvent/2982251138089298540.jpg',
    'Free',
    50,
    42,
    false,
    ARRAY[
      'Certified tax preparers',
      'E-filing available',
      'Bring all tax documents',
      'EITC and credit assistance',
      'Appointments required'
    ]
  )
ON CONFLICT (id) DO NOTHING;
