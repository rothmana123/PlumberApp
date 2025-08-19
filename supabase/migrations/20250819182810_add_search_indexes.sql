-- Add indexes for better search performance
-- This migration adds indexes to improve query performance for the search functionality

-- Index for text search across multiple fields
CREATE INDEX IF NOT EXISTS idx_plumbers_search_text 
ON plumbers USING gin(to_tsvector('english', 
  coalesce(name, '') || ' ' || 
  coalesce(business_name, '') || ' ' || 
  coalesce(neighborhood, '') || ' ' || 
  coalesce(description, '')
));

-- Index for neighborhood filtering
CREATE INDEX IF NOT EXISTS idx_plumbers_neighborhood 
ON plumbers(neighborhood);

-- Index for emergency service filtering
CREATE INDEX IF NOT EXISTS idx_plumbers_emergency_service 
ON plumbers(emergency_service);

-- Index for hourly rate filtering
CREATE INDEX IF NOT EXISTS idx_plumbers_hourly_rate 
ON plumbers(hourly_rate);

-- Index for rating filtering and sorting
CREATE INDEX IF NOT EXISTS idx_plumbers_rating 
ON plumbers(rating DESC);

-- Index for specialties array search
CREATE INDEX IF NOT EXISTS idx_plumbers_specialties 
ON plumbers USING gin(specialties);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_plumbers_neighborhood_emergency 
ON plumbers(neighborhood, emergency_service);

-- Index for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_plumber_id 
ON reviews(plumber_id);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at 
ON reviews(created_at DESC);

-- Add full-text search function for better text matching
CREATE OR REPLACE FUNCTION search_plumbers(search_query text)
RETURNS TABLE(
  id uuid,
  name text,
  business_name text,
  phone text,
  email text,
  address text,
  neighborhood text,
  specialties text[],
  description text,
  rating decimal,
  total_reviews integer,
  years_experience integer,
  license_number text,
  hourly_rate decimal,
  emergency_service boolean,
  created_at timestamptz,
  updated_at timestamptz,
  search_rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.*,
    ts_rank(
      to_tsvector('english', 
        coalesce(p.name, '') || ' ' || 
        coalesce(p.business_name, '') || ' ' || 
        coalesce(p.neighborhood, '') || ' ' || 
        coalesce(p.description, '')
      ),
      plainto_tsquery('english', search_query)
    ) as search_rank
  FROM plumbers p
  WHERE to_tsvector('english', 
    coalesce(p.name, '') || ' ' || 
    coalesce(p.business_name, '') || ' ' || 
    coalesce(p.neighborhood, '') || ' ' || 
    coalesce(p.description, '')
  ) @@ plainto_tsquery('english', search_query)
  ORDER BY search_rank DESC, p.rating DESC;
END;
$$ LANGUAGE plpgsql; 