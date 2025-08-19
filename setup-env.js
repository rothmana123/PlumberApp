#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for Plumber Search App\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please check your configuration manually.');
  console.log('Required variables:');
  console.log('  VITE_SUPABASE_URL=your_supabase_project_url');
  console.log('  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('  VITE_YELP_API_KEY=your_yelp_api_key (optional for real data)');
  process.exit(0);
}

// Create template .env.local file
const envTemplate = `# Supabase Configuration
# Get these values from your Supabase project settings
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Yelp API Configuration (Optional - for real plumber data)
# Get this from https://www.yelp.com/developers
VITE_YELP_API_KEY=your-yelp-api-key-here

# Instructions:
# 1. Go to https://supabase.com and create a new project
# 2. Go to Project Settings > API
# 3. Copy the "Project URL" to VITE_SUPABASE_URL
# 4. Copy the "anon public" key to VITE_SUPABASE_ANON_KEY
# 5. (Optional) Go to https://www.yelp.com/developers to get API key for real data
# 6. Run the database migrations in supabase/migrations/
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template file');
  console.log('📝 Please edit .env.local with your credentials');
  console.log('🔗 Get Supabase credentials from: https://supabase.com/dashboard/project/_/settings/api');
  console.log('🔗 Get Yelp API key from: https://www.yelp.com/developers');
  console.log('\nNext steps:');
  console.log('1. Edit .env.local with your Supabase URL and anon key');
  console.log('2. (Optional) Add your Yelp API key for real plumber data');
  console.log('3. Run the database migrations: supabase db push');
  console.log('4. Start the development server: npm run dev');
  console.log('\n💡 With Yelp API key, you can fetch real plumber data from Yelp!');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
} 