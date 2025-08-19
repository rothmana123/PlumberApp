import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Plumber = {
  id: string
  name: string
  business_name?: string
  phone: string
  email?: string
  address: string
  neighborhood: string
  specialties: string[]
  description?: string
  rating: number
  total_reviews: number
  years_experience: number
  license_number?: string
  hourly_rate?: number
  emergency_service: boolean
  created_at: string
  updated_at: string
  // Yelp-specific fields
  yelp_url?: string
  image_url?: string
  price_level?: string
  distance?: number
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export type Review = {
  id: string
  plumber_id: string
  user_id: string
  rating: number
  comment?: string
  created_at: string
}

// Enhanced search interface
export interface SearchFilters {
  searchTerm?: string
  neighborhood?: string
  specialty?: string
  emergencyOnly?: boolean
  maxRate?: number
  minRating?: number
  sortBy?: 'rating' | 'hourly_rate' | 'total_reviews' | 'years_experience'
  sortOrder?: 'asc' | 'desc'
}

// Enhanced search function with server-side filtering
export const searchPlumbers = async (filters: SearchFilters = {}) => {
  let query = supabase
    .from('plumbers')
    .select('*')

  // Text search across multiple fields
  if (filters.searchTerm) {
    query = query.or(
      `name.ilike.%${filters.searchTerm}%,business_name.ilike.%${filters.searchTerm}%,neighborhood.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
    )
  }

  // Neighborhood filter
  if (filters.neighborhood) {
    query = query.eq('neighborhood', filters.neighborhood)
  }

  // Specialty filter (using array contains)
  if (filters.specialty) {
    query = query.contains('specialties', [filters.specialty])
  }

  // Emergency service filter
  if (filters.emergencyOnly) {
    query = query.eq('emergency_service', true)
  }

  // Max hourly rate filter
  if (filters.maxRate) {
    query = query.lte('hourly_rate', filters.maxRate)
  }

  // Min rating filter
  if (filters.minRating) {
    query = query.gte('rating', filters.minRating)
  }

  // Sorting
  const sortBy = filters.sortBy || 'rating'
  const sortOrder = filters.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) {
    console.error('Error searching plumbers:', error)
    throw error
  }

  return data || []
}

// Get unique neighborhoods for filter dropdown
export const getNeighborhoods = async () => {
  const { data, error } = await supabase
    .from('plumbers')
    .select('neighborhood')
    .order('neighborhood')

  if (error) {
    console.error('Error fetching neighborhoods:', error)
    return []
  }

  return [...new Set(data?.map(p => p.neighborhood) || [])]
}

// Get unique specialties for filter dropdown
export const getSpecialties = async () => {
  const { data, error } = await supabase
    .from('plumbers')
    .select('specialties')

  if (error) {
    console.error('Error fetching specialties:', error)
    return []
  }

  const allSpecialties = data?.flatMap(p => p.specialties || []) || []
  return [...new Set(allSpecialties)].sort()
}

// Get plumber by ID with reviews
export const getPlumberWithReviews = async (plumberId: string) => {
  const { data: plumber, error: plumberError } = await supabase
    .from('plumbers')
    .select('*')
    .eq('id', plumberId)
    .single()

  if (plumberError) {
    console.error('Error fetching plumber:', plumberError)
    throw plumberError
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      *,
      user:user_id (
        email
      )
    `)
    .eq('plumber_id', plumberId)
    .order('created_at', { ascending: false })

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError)
  }

  return {
    plumber,
    reviews: reviews || []
  }
}

// Sync Yelp data to database
export const syncYelpDataToDatabase = async (yelpPlumbers: any[]) => {
  try {
    // Upsert plumbers (insert or update if exists)
    const { data, error } = await supabase
      .from('plumbers')
      .upsert(yelpPlumbers, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('Error syncing Yelp data:', error)
      throw error
    }

    console.log(`Successfully synced ${yelpPlumbers.length} plumbers from Yelp`)
    return data
  } catch (error) {
    console.error('Error in syncYelpDataToDatabase:', error)
    throw error
  }
}