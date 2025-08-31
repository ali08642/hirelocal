import React from 'react';
import { X, Star, Check, Clock, Phone, MessageCircle } from 'lucide-react';
import GlassCard from './shared/GlassCard';
import { Provider } from '../types';
import { useTheme } from '../theme/useTheme';

interface ProviderDetailProps {
  provider: Provider;
  onBack: () => void;
}

const ProviderDetail: React.FC<ProviderDetailProps> = ({ provider, onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className={`h-48 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-600 to-cyan-500' 
            : 'bg-gradient-to-r from-slate-400/70 via-blue-300/60 to-cyan-300/70'
        } transition-all duration-500`}></div>
        <button
          onClick={onBack}
          className={`absolute top-6 left-6 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-500 ${
            isDark 
              ? 'bg-black/20 text-white hover:bg-black/30' 
              : 'bg-white/30 text-slate-700 hover:bg-white/40 hover:text-slate-800'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Provider Info Overlay */}
        <GlassCard className={`absolute -bottom-16 left-6 right-6 p-6 backdrop-blur-xl border transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] border-white/10' 
            : 'bg-white/80 border-slate-200/50'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              {provider.verified && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className={`text-xl font-bold transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>{provider.name}</h1>
              <p className={`transition-colors duration-500 ${
                isDark ? 'text-blue-200' : 'text-slate-600'
              }`}>{provider.category}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className={`font-medium transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}>{provider.rating}</span>
                </div>
                <span className={`transition-colors duration-500 ${
                  isDark ? 'text-blue-200' : 'text-slate-500'
                }`}>•</span>
                <span className={`transition-colors duration-500 ${
                  isDark ? 'text-blue-200' : 'text-slate-600'
                }`}>{provider.distance}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Content */}
      <div className="pt-24 p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Response Time', value: provider.responseTime, icon: Clock },
            { label: 'Completed', value: `${provider.completedJobs} jobs`, icon: Check },
            { label: 'Rating', value: provider.rating.toString(), icon: Star }
          ].map((stat, index) => (
            <GlassCard key={index} className={`p-4 text-center backdrop-blur-xl border transition-all duration-500 ${
              isDark 
                ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] border-white/10' 
                : 'bg-gradient-to-br from-white/95 via-gray-100/90 to-slate-200/85 border-gray-300/60 shadow-md'
            }`}>
              <stat.icon className={`w-6 h-6 mx-auto mb-2 transition-colors duration-500 ${
                isDark ? 'text-blue-400' : 'text-gray-600'
              }`} />
              <p className={`font-semibold transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>{stat.value}</p>
              <p className={`text-xs transition-colors duration-500 ${
                isDark ? 'text-blue-200' : 'text-gray-600'
              }`}>{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* About */}
        <GlassCard className={`p-6 backdrop-blur-xl border transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] border-white/10' 
            : 'bg-gradient-to-br from-white/95 via-gray-100/90 to-slate-200/85 border-gray-300/60 shadow-md'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>About</h2>
          <p className={`leading-relaxed transition-colors duration-500 ${
            isDark ? 'text-blue-200' : 'text-gray-600'
          }`}>{provider.bio}</p>
        </GlassCard>

        {/* Services */}
        <GlassCard className={`p-6 backdrop-blur-xl border transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] border-white/10' 
            : 'bg-gradient-to-br from-white/95 via-gray-100/90 to-slate-200/85 border-gray-300/60 shadow-md'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Services</h2>
          <div className="flex flex-wrap gap-2">
            {provider.tags.map((tag) => (
              <span
                key={tag}
                className={`px-4 py-2 rounded-full border transition-all duration-500 ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-blue-300' 
                    : 'bg-gradient-to-r from-gray-200/90 to-slate-300/80 border-gray-400/50 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Gallery */}
        <GlassCard className={`p-6 backdrop-blur-xl border transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] border-white/10' 
            : 'bg-gradient-to-br from-white/95 via-gray-100/90 to-slate-200/85 border-gray-300/60 shadow-md'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Work Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {provider.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Work sample ${index + 1}`}
                className="w-full h-32 object-cover rounded-xl"
              />
            ))}
          </div>
        </GlassCard>

        {/* Contact Actions */}
        <div className="fixed bottom-6 left-6 right-6">
          <div className="flex space-x-4">
            <button className={`flex-1 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg hover:shadow-xl ${
              isDark 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500' 
                : 'bg-gradient-to-r from-slate-500 to-blue-500 hover:from-slate-600 hover:to-blue-600'
            }`}>
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg hover:shadow-xl">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;