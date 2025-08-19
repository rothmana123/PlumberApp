# Database Setup Guide for Plumber Search

This guide will help you connect your search feature to a real Supabase database with local plumber data.

## Quick Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created (2-3 minutes)

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
3. Copy the **anon public** key (starts with `eyJ...`)

### 3. Configure Environment Variables

Run the setup script:

```bash
npm run setup
```

Then edit the `.env.local` file with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push the database schema
supabase db push
```

**Option B: Manual SQL Execution**

1. Go to your Supabase dashboard → **SQL Editor**
2. Copy and paste the contents of `supabase/migrations/20250819182809_smooth_pond.sql`
3. Click "Run" to create the tables and sample data
4. Copy and paste the contents of `supabase/migrations/20250819182810_add_search_indexes.sql`
5. Click "Run" to add the search indexes

### 5. Test Your Connection

Start the development server:

```bash
npm run dev
```

You should now see:

- ✅ 8 sample plumbers loaded from the database
- ✅ Search functionality working
- ✅ Filters working properly
- ✅ Real-time search results

## What's Included

### Sample Data (8 Plumbers)

- **John Martinez** - Mission District - Emergency Repairs
- **Sarah Chen** - Pacific Heights - Bathroom Remodeling
- **Mike Thompson** - Tenderloin - Emergency Services
- **Lisa Rodriguez** - Sunset District - Eco-Friendly Solutions
- **David Park** - Chinatown - Residential/Commercial
- **Anna Wilson** - Richmond District - Kitchen Remodeling
- **Carlos Mendoza** - Mission Bay - New Construction
- **Rachel Kim** - Castro District - Residential Repairs

### Search Features

- 🔍 **Text Search**: Name, business, neighborhood, description
- 🏘️ **Neighborhood Filter**: All SF neighborhoods
- 🛠️ **Specialty Filter**: 15+ plumbing specialties
- ⚡ **Emergency Filter**: 24/7 service availability
- 💰 **Price Filter**: Hourly rate ranges
- ⭐ **Rating Filter**: 1-5 star ratings
- 📊 **Sorting**: Rating, price, reviews, experience

### Database Optimizations

- **Full-text search** across multiple fields
- **Array search** for specialties
- **Indexed queries** for fast filtering
- **Debounced search** to prevent API spam

## Troubleshooting

### "Cannot connect to database"

- Check your `.env.local` file has correct credentials
- Verify your Supabase project is active
- Check the browser console for error messages

### "No plumbers found"

- Run the database migrations to create sample data
- Check that the `plumbers` table exists in your Supabase dashboard
- Verify Row Level Security policies are set correctly

### "Search not working"

- Check that the search indexes were created
- Verify the `search_plumbers` function exists
- Check browser console for JavaScript errors

## Next Steps

### Add Real Plumber Data

1. Go to Supabase Dashboard → **Table Editor** → **plumbers**
2. Click "Insert" to add new plumbers
3. Fill in the required fields (name, phone, address, neighborhood)
4. Add specialties as an array: `["Emergency Repairs", "Water Heaters"]`

### Customize Search

- Modify `src/lib/supabase.ts` to add new search fields
- Update the database schema in `supabase/migrations/`
- Add new filter options in `src/components/PlumbersList.tsx`

### Deploy to Production

1. Build your app: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting
3. Set environment variables in your hosting platform
4. Your search will work with the same database!

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your Supabase project settings
3. Check the Supabase logs in your dashboard
4. Review the README.md for detailed documentation
