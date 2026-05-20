-- Seed data for demo restaurant

-- Create demo organization
INSERT INTO organizations (id, name, slug, plan_tier, primary_color, max_menu_items, max_monthly_scans)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Pizzeria',
  'demo-pizzeria',
  'premium',
  '#E31837',
  100,
  25000
);

-- Create location
INSERT INTO locations (id, organization_id, name, slug, address, timezone)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Demo Pizzeria',
  'demo-pizzeria',
  '{"street": "123 Main St", "city": "San Francisco", "country": "US", "coords": {"lat": 37.7749, "lng": -122.4194}}',
  'America/Los_Angeles'
);

-- Menu items
INSERT INTO menu_items (id, location_id, name, slug, description, category, price, calories, allergens, dietary_tags, image_url, model_url, model_format, model_size_mb, is_available, published_at)
VALUES
(
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'Margherita Pizza',
  'margherita-pizza',
  'Classic margherita with fresh mozzarella, basil, and San Marzano tomatoes on a wood-fired crust.',
  'main',
  16.99,
  850,
  ARRAY['dairy', 'gluten'],
  ARRAY['vegetarian'],
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
  'https://models.example.com/margherita-pizza.glb',
  'glb',
  3.2,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000002',
  'Pepperoni Pizza',
  'pepperoni-pizza',
  'Loaded with pepperoni and melted mozzarella on our signature tomato sauce.',
  'main',
  18.99,
  NULL,
  ARRAY['dairy', 'gluten'],
  NULL,
  'https://images.unsplash.com/photo-1628840042765-356cda07504e',
  'https://models.example.com/pepperoni-pizza.glb',
  'glb',
  3.5,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000002',
  'Caesar Salad',
  'caesar-salad',
  'Crisp romaine lettuce with parmesan, croutons, and house-made Caesar dressing.',
  'appetizer',
  11.99,
  350,
  ARRAY['dairy', 'gluten'],
  ARRAY['vegetarian'],
  'https://images.unsplash.com/photo-1546793665-c74683f339c1',
  'https://models.example.com/caesar-salad.glb',
  'glb',
  2.1,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000002',
  'Tiramisu',
  'tiramisu',
  'Classic Italian tiramisu with mascarpone, espresso-soaked ladyfingers, and cocoa.',
  'dessert',
  8.99,
  450,
  ARRAY['dairy', 'gluten', 'eggs'],
  ARRAY['vegetarian'],
  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
  'https://models.example.com/tiramisu.glb',
  'glb',
  2.8,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000002',
  'Spaghetti Carbonara',
  'spaghetti-carbonara',
  'Al dente spaghetti with pancetta, egg yolk, pecorino romano, and black pepper.',
  'main',
  15.99,
  720,
  ARRAY['dairy', 'gluten', 'eggs'],
  NULL,
  'https://images.unsplash.com/photo-1612874742237-6526221588e3',
  'https://models.example.com/carbonara.glb',
  'glb',
  3.0,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000008',
  '00000000-0000-0000-0000-000000000002',
  'Bruschetta',
  'bruschetta',
  'Toasted bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil.',
  'appetizer',
  9.99,
  280,
  ARRAY['gluten'],
  ARRAY['vegan', 'vegetarian'],
  'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f',
  'https://models.example.com/bruschetta.glb',
  'glb',
  1.9,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000009',
  '00000000-0000-0000-0000-000000000002',
  'Limoncello Spritz',
  'limoncello-spritz',
  'Refreshing limoncello with prosecco, soda water, and fresh mint.',
  'drink',
  12.99,
  180,
  NULL,
  ARRAY['vegan', 'vegetarian'],
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
  'https://models.example.com/limoncello-spritz.glb',
  'glb',
  1.5,
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000002',
  'Panna Cotta',
  'panna-cotta',
  'Silky vanilla panna cotta with mixed berry compote.',
  'dessert',
  7.99,
  320,
  ARRAY['dairy'],
  ARRAY['vegetarian', 'gluten-free'],
  'https://images.unsplash.com/photo-1488477181946-6428a0291777',
  'https://models.example.com/panna-cotta.glb',
  'glb',
  2.2,
  true,
  NOW()
);
