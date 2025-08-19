import React, { useState } from 'react'
import { Star, Phone, Mail, MapPin, Clock, DollarSign, Shield, Calendar } from 'lucide-react'
import { Plumber } from '../lib/supabase'

interface PlumberCardProps {
  plumber: Plumber
  onViewDetails: (plumber: Plumber) => void
}

const PlumberCard: React.FC<PlumberCardProps> = ({ plumber, onViewDetails }) => {
  const [imageError, setImageError] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : index < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{plumber.name}</h3>
            {plumber.business_name && (
              <p className="text-sm text-gray-600 mb-2">{plumber.business_name}</p>
            )}
            
            <div className="flex items-center space-x-1 mb-2">
              {renderStars(plumber.rating)}
              <span className="text-sm text-gray-600 ml-2">
                {plumber.rating.toFixed(1)} ({plumber.total_reviews} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4" />
              <span>{plumber.neighborhood}</span>
            </div>
          </div>

          {plumber.emergency_service && (
            <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
              24/7 Emergency
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{plumber.years_experience} years experience</span>
          </div>
          
          {plumber.hourly_rate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>${plumber.hourly_rate}/hour</span>
            </div>
          )}

          {plumber.license_number && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>License #{plumber.license_number}</span>
            </div>
          )}
        </div>

        {plumber.specialties && plumber.specialties.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {plumber.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
              {plumber.specialties.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{plumber.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {plumber.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {plumber.description}
          </p>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(plumber)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            View Details
          </button>
          <a
            href={`tel:${plumber.phone}`}
            className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>
          {plumber.email && (
            <a
              href={`mailto:${plumber.email}`}
              className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlumberCard