import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign, Star, SortAsc, SortDesc, Database } from 'lucide-react'
import { Plumber, supabase, searchPlumbers, getNeighborhoods, getSpecialties, SearchFilters } from '../lib/supabase'
import PlumberCard from './PlumberCard'
import PlumberDetails from './PlumberDetails'
import YelpDataSync from './YelpDataSync'

interface PlumbersListProps {
  user: any
}

const PlumbersList: React.FC<PlumbersListProps> = ({ user }) => {
  const [plumbers, setPlumbers] = useState<Plumber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const [maxRate, setMaxRate] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'hourly_rate' | 'total_reviews' | 'years_experience'>('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedPlumber, setSelectedPlumber] = useState<Plumber | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showYelpSync, setShowYelpSync] = useState(false)
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedNeighborhood, selectedSpecialty, emergencyOnly, maxRate, minRating, sortBy, sortOrder])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [neighborhoodsData, specialtiesData] = await Promise.all([
        getNeighborhoods(),
        getSpecialties()
      ])
      setNeighborhoods(neighborhoodsData)
      setSpecialties(specialtiesData)
      await performSearch()
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async () => {
    try {
      const filters: SearchFilters = {
        searchTerm: searchTerm || undefined,
        neighborhood: selectedNeighborhood || undefined,
        specialty: selectedSpecialty || undefined,
        emergencyOnly: emergencyOnly || undefined,
        maxRate: maxRate ? parseFloat(maxRate) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        sortBy,
        sortOrder
      }

      const results = await searchPlumbers(filters)
      setPlumbers(results)
    } catch (error) {
      console.error('Error performing search:', error)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedNeighborhood('')
    setSelectedSpecialty('')
    setEmergencyOnly(false)
    setMaxRate('')
    setMinRating('')
    setSortBy('rating')
    setSortOrder('desc')
  }

  const getSortIcon = () => {
    return sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  const handleDataSynced = () => {
    // Refresh the data after syncing from Yelp
    fetchInitialData()
  }

  if (loading && plumbers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find the Best Plumbers in San Francisco</h1>
        <p className="text-gray-600 text-lg">
          Discover trusted, licensed plumbers in your neighborhood with verified reviews and ratings.
        </p>
      </div>

      {/* Yelp Data Sync Section */}
      {showYelpSync && (
        <YelpDataSync onDataSynced={handleDataSynced} />
      )}

      {/* Data Source Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowYelpSync(!showYelpSync)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Database className="h-4 w-4" />
            <span>{showYelpSync ? 'Hide' : 'Show'} Yelp Integration</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {plumbers.length} plumbers in database
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, business, neighborhood, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:w-auto bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Neighborhood</label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Neighborhoods</option>
                  {neighborhoods.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Hourly Rate</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="100"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="4.0"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emergency" className="ml-2 text-sm text-gray-700">
                  24/7 Emergency Service Only
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Rating</option>
                  <option value="hourly_rate">Hourly Rate</option>
                  <option value="total_reviews">Number of Reviews</option>
                  <option value="years_experience">Years Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{sortOrder === 'asc' ? 'Lowest First' : 'Highest First'}</span>
                  {getSortIcon()}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          {plumbers.length} plumber{plumbers.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
          {selectedNeighborhood && ` in ${selectedNeighborhood}`}
        </p>
        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Searching...</span>
          </div>
        )}
      </div>

      {/* Plumbers Grid */}
      {plumbers.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plumbers found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters to find more results.
          </p>
          {!showYelpSync && (
            <button
              onClick={() => setShowYelpSync(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Real Plumber Data from Yelp
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plumbers.map(plumber => (
            <PlumberCard
              key={plumber.id}
              plumber={plumber}
              onViewDetails={setSelectedPlumber}
            />
          ))}
        </div>
      )}

      {/* Plumber Details Modal */}
      {selectedPlumber && (
        <PlumberDetails
          plumber={selectedPlumber}
          user={user}
          onClose={() => setSelectedPlumber(null)}
        />
      )}
    </div>
  )
}

export default PlumbersList