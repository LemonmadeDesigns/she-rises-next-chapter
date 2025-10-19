-- Add sample events if none exist
INSERT INTO public.events (id, title, category, type, date, time, location, address, description, image, price, capacity, registered, featured, highlights)
VALUES
  (
    'community-launch-2025',
    'She Rises Community Launch',
    'fundraising',
    'In-Person',
    '2025-11-15',
    '2:00 PM - 5:00 PM',
    'San Bernardino Community Center',
    '123 Hope Street, San Bernardino, CA',
    'Join us for an afternoon of empowerment, connection, and community as we officially launch She Rises in San Bernardino County.',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    'Free',
    200,
    45,
    true,
    ARRAY[
      'Meet our team and learn about our programs',
      'Network with community leaders and partners',
      'Refreshments and entertainment',
      'Resource fair and giveaways',
      'Inspiring keynote speaker'
    ]
  ),
  (
    'wellness-workshop-2025',
    'Monthly Wellness Workshop: Self-Care Saturday',
    'wellness',
    'In-Person',
    '2025-11-22',
    '10:00 AM - 2:00 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'A monthly wellness workshop focused on self-care practices, mental health awareness, and building supportive community connections.',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
    'Free',
    50,
    28,
    true,
    ARRAY[
      'Guided meditation and mindfulness exercises',
      'Healthy cooking demonstration',
      'Arts and crafts therapy session',
      'Support group discussions',
      'Resource fair with local wellness providers'
    ]
  ),
  (
    'job-fair-2025',
    'Community Job Fair & Career Expo',
    'employment',
    'In-Person',
    '2025-12-05',
    '9:00 AM - 3:00 PM',
    'Community College Convention Center',
    '789 Education Drive, San Bernardino, CA',
    'Connect with local employers actively seeking to hire women from diverse backgrounds. Features on-the-spot interviews and career development resources.',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    'Free',
    200,
    67,
    false,
    ARRAY[
      '30+ local employers participating',
      'Resume review and career coaching',
      'Professional headshot sessions',
      'Skills assessment opportunities',
      'Transportation vouchers provided'
    ]
  ),
  (
    'support-circle-weekly',
    'Weekly Support Circle: Healing Together',
    'support',
    'In-Person',
    '2025-11-20',
    '6:00 PM - 7:30 PM',
    'She Rises Community Center',
    '456 Wellness Ave, San Bernardino, CA',
    'A safe, confidential space for women to share experiences, build connections, and support each other on their healing journey. Held every Thursday.',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    'Free',
    15,
    11,
    false,
    ARRAY[
      'Licensed therapist facilitation',
      'Peer support and connection',
      'Coping strategies and tools',
      'Light refreshments provided',
      'Childcare available with advance notice'
    ]
  ),
  (
    'financial-literacy-2025',
    'Financial Literacy Workshop Series',
    'education',
    'Virtual',
    '2025-12-10',
    '7:00 PM - 8:30 PM',
    'Zoom Meeting',
    'Online',
    'Four-part series covering budgeting, credit repair, savings strategies, and homeownership preparation specifically designed for women rebuilding their financial lives.',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
    'Free',
    100,
    52,
    false,
    ARRAY[
      'Expert financial advisor facilitation',
      'Interactive budgeting tools and templates',
      'One-on-one financial counseling sessions available',
      'Digital workbook and resources',
      'Follow-up support and check-ins'
    ]
  ),
  (
    'volunteer-orientation-2025',
    'Volunteer Orientation & Training',
    'volunteer',
    'Hybrid',
    '2025-11-28',
    '6:00 PM - 8:00 PM',
    'She Rises Community Center / Virtual',
    '456 Wellness Ave, San Bernardino, CA',
    'Learn about volunteer opportunities with She Rises and receive training on our trauma-informed approach to supporting women in transition.',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop',
    'Free',
    40,
    18,
    false,
    ARRAY[
      'Overview of She Rises programs and mission',
      'Trauma-informed care training',
      'Volunteer role descriptions and matching',
      'Background check process explained',
      'Meet current volunteers and staff'
    ]
  )
ON CONFLICT (id) DO NOTHING;
