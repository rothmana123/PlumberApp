import React, { useState } from 'react'
import { Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { searchSFPlumbers, convertYelpToPlumber } from '../lib/yelp-api'
import { syncYelpDataToDatabase } from '../lib/supabase'

interface YelpDataSyncProps {
  onDataSynced?: () => void
}

const YelpDataSync: React.FC<YelpDataSyncProps> = ({ onDataSynced }) => {
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchYelpData = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const yelpBusinesses = await searchSFPlumbers()
      setResults(yelpBusinesses)
      setSuccess(`Found ${yelpBusinesses.length} plumbers on Yelp`)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data from Yelp')
      console.error('Error fetching Yelp data:', err)
    } finally {
      setLoading(false)
    }
  }

  const syncToDatabase = async () => {
    if (results.length === 0) {
      setError('No data to sync. Please fetch data from Yelp first.')
      return
    }

    setSyncing(true)
    setError(null)
    setSuccess(null)

    try {
      await syncYelpDataToDatabase(results)
      setSuccess(`Successfully synced ${results.length} plumbers to database`)
      onDataSynced?.()
    } catch (err: any) {
      setError(err.message || 'Failed to sync data to database')
      console.error('Error syncing data:', err)
    } finally {
      setSyncing(false)
    }
  }

  const fetchAndSync = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Fetch from Yelp
      const yelpBusinesses = await searchSFPlumbers()
      setResults(yelpBusinesses)
      
      // Sync to database
      await syncYelpDataToDatabase(yelpBusinesses)
      setSuccess(`Successfully fetched and synced ${yelpBusinesses.length} plumbers`)
      onDataSynced?.()
    } catch (err: any) {
      setError(err.message || 'Failed to fetch and sync data')
      console.error('Error in fetch and sync:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Yelp Data Integration</h2>
          <p className="text-gray-600 mt-1">
            Fetch real plumber data from Yelp and sync to your database
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchYelpData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{loading ? 'Fetching...' : 'Fetch from Yelp'}</span>
          </button>
          
          <button
            onClick={fetchAndSync}
            disabled={loading || syncing}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>{loading || syncing ? 'Processing...' : 'Fetch & Sync'}</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      {/* Results Preview */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Preview ({results.length} plumbers found)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {results.slice(0, 9).map((plumber) => (
              <div key={plumber.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {plumber.image_url && (
                    <img 
                      src={plumber.image_url} 
                      alt={plumber.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {plumber.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {plumber.neighborhood}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">
                        ⭐ {plumber.rating}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({plumber.total_reviews} reviews)
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      ${plumber.hourly_rate}/hr • {plumber.price_level}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {results.length > 9 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing first 9 of {results.length} plumbers
            </p>
          )}
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Setup Instructions</h4>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Get a Yelp API key from <a href="https://www.yelp.com/developers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yelp Developers</a></li>
          <li>2. Add <code className="bg-gray-200 px-1 rounded">VITE_YELP_API_KEY=your_api_key</code> to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file</li>
          <li>3. Click "Fetch & Sync" to get real plumber data</li>
        </ol>
      </div>
    </div>
  )
}

export default YelpDataSync 