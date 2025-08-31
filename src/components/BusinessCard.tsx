import React from 'react';
import { Heart } from 'lucide-react';
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

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border`}>
      {/* Business Name and Info */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {business.name}
          </h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {business.location.address}
          </p>
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

      {/* Expanded Details */}
      {expanded && (
        <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {business.description}
          </p>
          {business.services && business.services.length > 0 && (
            <div className="mt-3">
              <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Services:
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
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
          className={`mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium ${
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
