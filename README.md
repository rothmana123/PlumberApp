# San Francisco Plumber Search Application

A modern web application for finding and connecting with local plumbers in San Francisco. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 **Advanced Search**: Search plumbers by name, business, neighborhood, or specialty
- 🏘️ **Location-based Filtering**: Filter by San Francisco neighborhoods
- 🛠️ **Specialty Filtering**: Find plumbers with specific expertise
- ⚡ **Emergency Service**: Filter for 24/7 emergency plumbers
- 💰 **Price Filtering**: Filter by maximum hourly rate
- ⭐ **Rating System**: Filter by minimum rating and sort by various criteria
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔐 **User Authentication**: Secure login system
- 📝 **Reviews System**: Read and write reviews for plumbers
- 🌐 **Real Data Integration**: Connect to Yelp API for real plumber data

## Data Sources

### Option 1: Sample Data (Default)

- 8 pre-populated San Francisco plumbers
- Realistic ratings, reviews, and pricing
- No external API required

### Option 2: Real Data from Yelp API ⭐

- Fetch real plumber data from Yelp
- Live ratings, reviews, and business information
- Automatic data syncing to your database
- Free tier: 500 requests/day

## Quick Start

### 1. Setup Environment

```bash
# Run the setup script
npm run setup

# Edit .env.local with your credentials
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_YELP_API_KEY=your_yelp_api_key_here  # Optional for real data
```

### 2. Setup Database

```bash
# Install Supabase CLI
npm install -g supabase

# Push database schema
supabase db push
```

### 3. Start Development

```bash
npm run dev
```

## Database Setup

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_YELP_API_KEY=your_yelp_api_key_here  # Optional
```

### 2. Database Migration

Run the database migrations to set up the schema and sample data:

```bash
# If you have Supabase CLI installed
supabase db push

# Or manually run the SQL files in supabase/migrations/
```

The migrations will create:

- `plumbers` table with sample data for 8 San Francisco plumbers
- `reviews` table for user reviews
- Database indexes for optimal search performance
- Full-text search functionality

### 3. Sample Data

The database comes pre-populated with realistic plumber data including:

- 8 plumbers across different San Francisco neighborhoods
- Various specialties (emergency repairs, bathroom remodeling, etc.)
- Realistic ratings, reviews, and pricing
- Emergency service availability

## Real Data Integration (Yelp API)

### Setup Yelp Integration

1. **Get Yelp API Key**:

   - Go to [Yelp Developers](https://www.yelp.com/developers)
   - Sign up for a developer account
   - Create a new app
   - Copy your API key

2. **Add to Environment**:

   ```env
   VITE_YELP_API_KEY=your_yelp_api_key_here
   ```

3. **Use in App**:
   - Click "Show Yelp Integration" in your app
   - Click "Fetch & Sync" to get real plumber data
   - Data automatically syncs to your database

### What You Get from Yelp

- **Real Business Data**: Actual plumber listings from Yelp
- **Live Ratings**: Current star ratings and review counts
- **Business Information**: Phone, address, website, hours
- **Photos**: Business images and logos
- **Categories**: Plumbing specialties and services
- **Pricing**: Price levels ($, $$, $$$, $$$$)

## Search Functionality

### Server-Side Search

The application uses Supabase's built-in search capabilities for optimal performance:

- **Text Search**: Searches across name, business name, neighborhood, and description
- **Array Search**: Searches within specialties arrays
- **Range Queries**: Filters by hourly rate and rating ranges
- **Boolean Filters**: Emergency service availability
- **Sorting**: Multiple sort options with ascending/descending order

### Search Filters

1. **Text Search**: Search by plumber name, business name, neighborhood, or specialty
2. **Neighborhood**: Filter by specific San Francisco neighborhoods
3. **Specialty**: Filter by plumbing specialties (e.g., "Emergency Repairs", "Bathroom Remodeling")
4. **Emergency Service**: Show only 24/7 emergency plumbers
5. **Max Hourly Rate**: Filter by maximum hourly rate
6. **Min Rating**: Filter by minimum rating (1-5 stars)
7. **Sort Options**: Sort by rating, hourly rate, number of reviews, or years of experience

### Performance Optimizations

- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Database Indexes**: Optimized indexes for common search patterns
- **Server-Side Filtering**: All filtering happens in the database
- **Lazy Loading**: Efficient data fetching

## API Functions

### Core Search Functions

```typescript
// Search plumbers with filters
const results = await searchPlumbers({
  searchTerm: "emergency",
  neighborhood: "Mission District",
  specialty: "Emergency Repairs",
  emergencyOnly: true,
  maxRate: 100,
  minRating: 4.5,
  sortBy: "rating",
  sortOrder: "desc",
});

// Get unique neighborhoods
const neighborhoods = await getNeighborhoods();

// Get unique specialties
const specialties = await getSpecialties();

// Get plumber with reviews
const { plumber, reviews } = await getPlumberWithReviews(plumberId);
```

### Yelp Integration Functions

```typescript
// Search real plumbers on Yelp
const yelpPlumbers = await searchSFPlumbers("emergency", {
  neighborhood: "Mission District",
  maxPrice: "$$",
  minRating: 4.5,
});

// Sync Yelp data to database
await syncYelpDataToDatabase(yelpPlumbers);
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Yelp API key (optional)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_YELP_API_KEY=your_yelp_api_key_here  # Optional
```

## Database Schema

### Plumbers Table

```sql
CREATE TABLE plumbers (
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
  updated_at timestamptz DEFAULT now(),
  -- Yelp-specific fields
  yelp_url text,
  image_url text,
  price_level text,
  distance numeric,
  coordinates jsonb
);
```

### Reviews Table

```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plumber_id uuid REFERENCES plumbers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);
```

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access to plumber data
- Authenticated users can create/update/delete their own reviews
- Secure authentication via Supabase Auth

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
