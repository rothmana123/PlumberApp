/*
  # San Francisco Plumber Recommendation System

  1. New Tables
    - `plumbers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `business_name` (text)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `neighborhood` (text)
      - `specialties` (text array)
      - `description` (text)
      - `rating` (decimal)
      - `total_reviews` (integer)
      - `years_experience` (integer)
      - `license_number` (text)
      - `hourly_rate` (decimal)
      - `emergency_service` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `plumber_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read plumber data
    - Add policies for users to manage their own reviews
*/

-- Create plumbers table
CREATE TABLE IF NOT EXISTS plumbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  neighborhood text NOT NULL,
  specialties text[] DEFAULT '{}',
  description text,
  rating decimal(3,2) DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  years_experience integer DEFAULT 0,
  license_number text,
  hourly_rate decimal(6,2),
  emergency_service boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plumber_id uuid REFERENCES plumbers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE plumbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for plumbers table
CREATE POLICY "Anyone can read plumbers"
  ON plumbers
  FOR SELECT
  TO public
  USING (true);

-- Create policies for reviews table
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample plumbers data
INSERT INTO plumbers (name, business_name, phone, email, address, neighborhood, specialties, description, rating, total_reviews, years_experience, license_number, hourly_rate, emergency_service) VALUES
('John Martinez', 'Martinez Plumbing Solutions', '(415) 555-0123', 'john@martinezplumbing.com', '1234 Mission St, San Francisco, CA 94103', 'Mission District', ARRAY['Emergency Repairs', 'Water Heaters', 'Pipe Installation'], 'Experienced plumber serving San Francisco for over 15 years. Specializing in emergency repairs and water heater installations.', 4.8, 127, 15, 'PL-45678', 85.00, true),

('Sarah Chen', 'Golden Gate Plumbing', '(415) 555-0234', 'sarah@ggplumbing.com', '567 Fillmore St, San Francisco, CA 94117', 'Pacific Heights', ARRAY['Bathroom Remodeling', 'Fixture Installation', 'Leak Detection'], 'Licensed plumber with expertise in bathroom remodeling and high-end fixture installations.', 4.9, 89, 12, 'PL-56789', 95.00, false),

('Mike Thompson', 'Bay Area Emergency Plumbing', '(415) 555-0345', 'mike@bayemergency.com', '890 Geary Blvd, San Francisco, CA 94109', 'Tenderloin', ARRAY['Emergency Repairs', 'Drain Cleaning', 'Pipe Bursts'], '24/7 emergency plumbing services. Quick response times and fair pricing for all your plumbing emergencies.', 4.6, 203, 8, 'PL-67890', 75.00, true),

('Lisa Rodriguez', 'Eco-Friendly Plumbing Co', '(415) 555-0456', 'lisa@ecoplumbing.com', '234 Irving St, San Francisco, CA 94122', 'Sunset District', ARRAY['Green Solutions', 'Water Conservation', 'Solar Water Heaters'], 'Environmentally conscious plumbing services. Specializing in water conservation and eco-friendly solutions.', 4.7, 156, 10, 'PL-78901', 90.00, false),

('David Park', 'Chinatown Plumbing Services', '(415) 555-0567', 'david@chinatownplumbing.com', '678 Grant Ave, San Francisco, CA 94108', 'Chinatown', ARRAY['Residential Repairs', 'Commercial Services', 'Maintenance'], 'Reliable plumbing services for residential and commercial properties in downtown San Francisco.', 4.5, 98, 18, 'PL-89012', 80.00, true),

('Anna Wilson', 'Richmond District Plumbers', '(415) 555-0678', 'anna@richmondplumbers.com', '345 Clement St, San Francisco, CA 94118', 'Richmond District', ARRAY['Kitchen Remodeling', 'Appliance Installation', 'Gas Lines'], 'Kitchen and appliance specialist. Licensed for gas line work and appliance installations.', 4.8, 142, 14, 'PL-90123', 88.00, false),

('Carlos Mendoza', 'Mission Bay Plumbing', '(415) 555-0789', 'carlos@missionbayplumbing.com', '789 Third St, San Francisco, CA 94158', 'Mission Bay', ARRAY['New Construction', 'Commercial', 'Industrial'], 'Commercial and new construction plumbing specialist. Serving the growing Mission Bay area.', 4.4, 76, 9, 'PL-01234', 82.00, false),

('Rachel Kim', 'Castro Valley Plumbing', '(415) 555-0890', 'rachel@castroplumbing.com', '456 Castro St, San Francisco, CA 94114', 'Castro District', ARRAY['Residential Repairs', 'Fixture Upgrades', 'Water Pressure'], 'Friendly neighborhood plumber specializing in residential repairs and fixture upgrades.', 4.9, 134, 11, 'PL-12345', 92.00, true);

-- Insert sample reviews
INSERT INTO reviews (plumber_id, user_id, rating, comment) VALUES
((SELECT id FROM plumbers WHERE name = 'John Martinez' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 5, 'Excellent service! Fixed my emergency leak quickly and professionally.'),
((SELECT id FROM plumbers WHERE name = 'Sarah Chen' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 5, 'Beautiful bathroom remodel. Sarah has great attention to detail.'),
((SELECT id FROM plumbers WHERE name = 'Mike Thompson' LIMIT 1), (SELECT id FROM auth.users LIMIT 1), 4, 'Quick response for emergency call. Fair pricing and good work.');