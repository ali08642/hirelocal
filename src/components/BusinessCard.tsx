import React from 'react';
import { Heart, Phone, Globe, MapPin } from 'lucide-react';
import { Business } from '../types/firebase';
import { BusinessService } from '../services/BusinessService';
import { useAuth } from '../contexts/AuthContextHooks';

interface BusinessCardProps {
  business: Business;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onToggleSave: (businessId: string) => void;
  theme?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  expanded, 
  onToggleExpand, 
  onToggleSave,
  theme = 'light'
}) => {
  const { user } = useAuth();
  const isDark = theme === 'dark';

  // Helper function to format phone number for display (Indian format)
  const formatPhoneForDisplay = (phone?: string): string | null => {
    if (!phone || phone === 'XXXXX-XXXXX' || phone.trim() === '') {
      return null;
    }
    return phone;
  };

  // Helper function to make Indian phone numbers clickable
  const getPhoneLink = (phone: string): string => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Handle Indian numbers
    if (cleanPhone.length === 10 && cleanPhone[0] in ['6', '7', '8', '9']) {
      // Indian mobile: 9876543210 -> +919876543210
      return `tel:+91${cleanPhone}`;
    } else {
      // Fallback - just use the digits
      return `tel:+91${cleanPhone}`;
    }
  };

  const displayPhone = formatPhoneForDisplay(business.phone);

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border`}>
      {/* Business Name and Save Button */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {business.name}
          </h3>
        </div>
        
        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(business.id);
          }}
          className={`p-2 rounded-full ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors duration-200`}
          aria-label={business.saved ? 'Unsave business' : 'Save business'}
        >
          <Heart
            className={`w-6 h-6 transition-colors duration-300 ${
              business.saved
                ? 'fill-red-500 stroke-red-500'
                : `${isDark ? 'stroke-gray-400 hover:stroke-gray-300' : 'stroke-gray-400 hover:stroke-red-500'}`
            }`}
          />
        </button>
      </div>

      {/* Contact Information */}
      <div className="space-y-2">
        {/* Address */}
        {business.location?.address && (
          <div className="flex items-start gap-2">
            <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {business.location.address}
            </p>
          </div>
        )}

        {/* Phone Number - FIXED: Now displays Indian/Pakistani numbers properly */}
        {displayPhone && (
          <div className="flex items-center gap-2">
            <Phone className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <a 
              href={getPhoneLink(displayPhone)}
              className={`text-sm hover:underline transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              onClick={(e) => e.stopPropagation()}
              title="Click to call"
            >
              {displayPhone}
            </a>
          </div>
        )}

        {/* Website */}
        {business.website && business.website !== '' && (
          <div className="flex items-center gap-2">
            <Globe className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <a 
              href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Rating and Reviews */}
        {business.rating && business.rating !== '' && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              ⭐ {business.rating}
              {business.reviews && business.reviews > 0 && (
                <span className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({business.reviews} reviews)
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          {business.description && (
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
              {business.description}
            </p>
          )}
          
          {business.services && business.services.length > 0 && (
            <div>
              <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                Services:
              </h4>
              <div className="flex flex-wrap gap-2">
                {business.services.map((service, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      isDark
                        ? 'bg-gray-600 text-gray-200'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle Expand Button */}
      {onToggleExpand && (
        <button
          onClick={onToggleExpand}
          className={`mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default BusinessCard;