import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map as MapIcon, List, ArrowLeft, ChevronDown } from 'lucide-react';
import { useTheme } from '../theme/useTheme';

interface BackendProvider {
  name: string;
  phone: string;
  details: string;
  address: string;
  location_note?: string;
  confidence?: string;
}

interface LocationState {
  providers?: BackendProvider[];
  searchQuery?: string;
  category?: string;
}

type ViewMode = 'list' | 'map';

// Themed mock map placeholder
const MapPlaceholder: React.FC<{ providers: BackendProvider[]; isDark: boolean }> = ({ providers, isDark }) => (
  <div className={`w-full h-[520px] rounded-3xl relative overflow-hidden backdrop-blur-xl ${
    isDark 
      ? 'bg-gradient-to-br from-[#101826]/80 via-[#0d1320]/70 to-[#161b2b]/80 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
      : 'bg-gradient-to-br from-gray-100/90 via-silver/95 to-gray-200/90 border border-gray-300/50 shadow-xl'
  }`}>
    <div className="absolute inset-0 opacity-[0.35] mix-blend-screen" style={{
      backgroundImage: isDark 
        ? 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35) 0, transparent 55%), radial-gradient(circle at 75% 20%, rgba(168,85,247,0.35) 0, transparent 60%), radial-gradient(circle at 60% 75%, rgba(236,72,153,0.3) 0, transparent 60%)'
        : 'radial-gradient(circle at 20% 30%, rgba(148,163,184,0.25) 0, transparent 55%), radial-gradient(circle at 75% 20%, rgba(156,163,175,0.25) 0, transparent 60%), radial-gradient(circle at 60% 75%, rgba(107,114,128,0.2) 0, transparent 60%)'
    }} />
    <div className={`absolute inset-0 pointer-events-none ${
      isDark 
        ? 'bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_35%,rgba(255,255,255,0)_65%,rgba(255,255,255,0.08)_100%)]'
        : 'bg-[linear-gradient(120deg,rgba(148,163,184,0.12)_0%,rgba(148,163,184,0)_35%,rgba(148,163,184,0)_65%,rgba(148,163,184,0.12)_100%)]'
    }`} />
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
      <div className={`mb-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-lg text-xs font-medium tracking-wider ${
        isDark 
          ? 'bg-white/5 border border-white/10 text-blue-200'
          : 'bg-white/80 border border-gray-300/60 text-gray-700'
      }`}>
        <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${
          isDark 
            ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
            : 'bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600'
        }`} />
        <span>MAP MODE (MOCK)</span>
      </div>
      <p className={`text-lg font-semibold mb-2 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-gray-700 via-slate-700 to-gray-800 bg-clip-text text-transparent'
      }`}>Interactive Map Coming Soon</p>
      <p className={`text-sm ${isDark ? 'text-blue-300/80' : 'text-gray-600'}`}>
        Showing {providers.length} dynamic provider marker placeholders
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-xl">
        {providers.slice(0,8).map((p, index) => (
          <div key={index} className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-[11px] ${
            isDark 
              ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-blue-200/80'
              : 'bg-white/70 border border-gray-300/50 text-gray-700'
          }`}>
            {p.name.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
    {/* Decorative grid for both themes */}
    <div className={`absolute inset-0 opacity-20 ${
      isDark 
        ? 'opacity-20'
        : 'opacity-15'
    }`} style={{
      backgroundImage: isDark 
        ? 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)'
        : 'linear-gradient(rgba(107,114,128,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(107,114,128,0.15) 1px, transparent 1px)',
      backgroundSize:'40px 40px'
    }} />
  </div>
);

const ProviderResultsScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as LocationState;
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAll, setShowAll] = useState(false);
  const providers: BackendProvider[] = state.providers || [];
  const visibleProviders = showAll ? providers : providers.slice(0, 6);

  const category = state.category || 'Service Providers';
  const searchQuery = state.searchQuery || category;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      {isDark ? (
        <>
          {/* Ambient gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e3a8a_0%,transparent_60%),radial-gradient(circle_at_80%_30%,#7e22ce_0%,transparent_55%),radial-gradient(circle_at_50%_80%,#be185d_0%,transparent_55%)] opacity-[0.15] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(140deg,#05070d_0%,#090d17_45%,#0d1220_70%,#101727_100%)]" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cpath fill=%27%23fff%27 fill-opacity=%270.08%27 d=%27M0 0h1v1H0z%27/%3E%3C/svg%3E")'}} />
        </>
      ) : (
        <>
          {/* Metallic silver gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#64748b_0%,transparent_60%),radial-gradient(circle_at_80%_30%,#475569_0%,transparent_55%),radial-gradient(circle_at_50%_80%,#334155_0%,transparent_55%)] opacity-[0.12] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(140deg,#f8fafc_0%,#e2e8f0_25%,#cbd5e1_50%,#94a3b8_75%,#64748b_100%)]" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          {/* Metallic noise overlay */}
          <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cpath fill=%27%23475569%27 fill-opacity=%270.12%27 d=%27M0 0h1v1H0z%27/%3E%3C/svg%3E")'}} />
        </>
      )}

      {/* Fixed Header / Filters */}
      <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        isDark 
          ? 'bg-[linear-gradient(140deg,#05070d_0%,#090d17_45%,#0d1220_70%,#101727_100%)] border-white/10'
          : 'bg-gradient-to-br from-white/80 via-slate-50/90 to-blue-50/80 border-slate-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <button onClick={() => navigate(-1)} className={`group h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border shadow-inner flex items-center justify-center backdrop-blur-md transition-all hover:-translate-y-0.5 ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  : 'bg-white/70 border-slate-200/50 text-slate-600 hover:text-slate-800 hover:bg-white/90 hover:shadow-lg'
              }`}>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <div className="inline-flex items-center gap-2 mb-1 sm:mb-2">
                  <h1 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight ${
                    isDark
                      ? 'bg-gradient-to-r from-white via-blue-50 to-purple-100 bg-clip-text text-transparent'
                      : 'text-slate-800'
                  }`}>{searchQuery}</h1>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/15 text-blue-200/80'
                      : 'bg-blue-100/80 border-blue-200/60 text-blue-700'
                  }`}>Live</span>
                </div>
                <p className={`text-xs sm:text-[13px] font-medium ${
                  isDark ? 'text-blue-100/60' : 'text-slate-600'
                }`}>{providers.length} providers • curated results</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 self-start md:self-auto">
              <button onClick={() => setViewMode('list')} className={`relative h-9 sm:h-11 px-3 sm:px-4 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium transition-all backdrop-blur-md border overflow-hidden ${viewMode==='list' ? 
                isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/40 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400/40 shadow-lg' : 
                isDark ? 'bg-white/5 text-blue-200/70 border-white/10 hover:bg-white/10 hover:text-white' : 'bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white/80 hover:text-slate-800'
              }`}>
                {isDark && <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white/10 to-transparent" />}
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>List</span>
              </button>
              <button onClick={() => setViewMode('map')} className={`relative h-9 sm:h-11 px-3 sm:px-4 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium transition-all backdrop-blur-md border overflow-hidden ${viewMode==='map' ? 
                isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/40 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400/40 shadow-lg' : 
                isDark ? 'bg-white/5 text-blue-200/70 border-white/10 hover:bg-white/10 hover:text-white' : 'bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white/80 hover:text-slate-800'
              }`}>
                {isDark && <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white/10 to-transparent" />}
                <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>Map</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {[
              {label:`Location: 5 km`},
              {label:`Category: ${category}`},
              {label:`Rating 4.0+`},
              {label:`Price: All`}
            ].map(chip => (
              <button key={chip.label} className={`group relative inline-flex items-center space-x-2 h-10 pl-4 pr-3 rounded-xl text-[13px] font-medium tracking-wide border transition-all backdrop-blur-xl overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/10 border-white/10 text-blue-100/80 hover:text-white hover:border-blue-400/40 hover:from-white/20 hover:to-white/10'
                  : 'bg-white/70 border-slate-200/50 text-slate-600 hover:text-slate-800 hover:border-blue-300/60 hover:bg-white/90'
              }`}>
                <span>{chip.label}</span>
                <ChevronDown className={`w-4 h-4 transition-colors ${
                  isDark ? 'text-blue-200/50 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                {isDark && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.25),transparent_60%)] transition-opacity" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="pt-32 sm:pt-36 md:pt-44 lg:pt-48 px-4 sm:px-6 lg:px-10 pb-8">
        <div className="max-w-7xl mx-auto">

          {viewMode === 'map' ? (
            <MapPlaceholder providers={providers} isDark={isDark} />
          ) : (
            <>
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-12">
                {visibleProviders.map((provider, index) => (
                  <div key={index} className={`group relative rounded-xl p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] flex flex-col ${
                    isDark 
                      ? 'bg-gradient-to-br from-[#161B22] to-[#21262D] border border-[#30363D] shadow-xl hover:shadow-2xl'
                      : 'bg-white border border-gray-200 backdrop-blur-sm shadow-lg hover:shadow-xl'
                  }`}>
                    <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-base ${isDark ? 'text-[#E6EDF3]' : 'text-gray-900'}`}>{provider.name}</h3>
                        <div className="flex items-center gap-2">
                            {provider.location_note === 'EXACT' && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                            {provider.confidence === 'HIGH' && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{provider.address}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2">
                            <a href={`tel:${provider.phone}`} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold ${isDark ? 'bg-blue-600/50 text-blue-300 hover:bg-blue-600/80' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} transition-all`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call
                            </a>
                            <button onClick={() => navigator.clipboard.writeText(`${provider.name}\n${provider.phone}\n${provider.address}`)} className={`p-2 rounded-md ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-all`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {provider.details && (
                        <div className="mt-3 pt-3 border-t border-gray-200/20">
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{provider.details}</p>
                        </div>
                    )}
                  </div>
                ))}
              </div>
              {providers.length > 6 && !showAll && (
                <div className="flex justify-center mb-24">
                  <button onClick={() => setShowAll(true)} className={`relative px-10 h-12 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border flex items-center gap-3 overflow-hidden group text-sm tracking-wide ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-white/10'
                      : 'bg-gradient-to-r from-gray-600 to-slate-700 text-white border-gray-500/40 hover:from-gray-500 hover:to-slate-600'
                  }`}>
                    {isDark && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />}
                    <span>Load More Providers</span>
                    <span className={`text-xs px-2 py-1 rounded-md border ${
                      isDark ? 'bg-white/10 border-white/10' : 'bg-white/20 border-white/20'
                    }`}>{providers.length - 6} more</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderResultsScreen;