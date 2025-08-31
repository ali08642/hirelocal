import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map as MapIcon, List, Star, Heart, MessageCircle, ArrowLeft, X, Check, Loader2 } from 'lucide-react';
import { ServiceProvider } from '../types';
import { useTheme } from '../theme/useTheme';

interface LocationState {
  providers?: ServiceProvider[];
  searchQuery?: string;
  category?: string;
}

type ViewMode = 'list' | 'map';

// Themed mock map placeholder
const MapPlaceholder: React.FC<{ providers: ServiceProvider[]; isDark: boolean }> = ({ providers, isDark }) => (
  <div className={`w-full h-[520px] rounded-3xl relative overflow-hidden backdrop-blur-xl ${
    isDark 
      ? 'glass-surface' 
      : 'bg-white/70 border border-slate-200/40'
  }`}>
    <div className="absolute inset-0 opacity-[0.35] mix-blend-screen" style={{
      backgroundImage: isDark 
        ? 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35) 0, transparent 55%), radial-gradient(circle at 75% 20%, rgba(168,85,247,0.35) 0, transparent 60%), radial-gradient(circle at 60% 75%, rgba(236,72,153,0.3) 0, transparent 60%)'
        : 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.2) 0, transparent 55%), radial-gradient(circle at 75% 20%, rgba(168,85,247,0.2) 0, transparent 60%), radial-gradient(circle at 60% 75%, rgba(236,72,153,0.15) 0, transparent 60%)'
    }} />
    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
      <div className={`mb-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-lg text-xs font-medium tracking-wider ${
        isDark 
          ? 'bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-200'
          : 'bg-white/60 border border-slate-200/50 text-slate-700'
      }`}>
        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse" />
        <span>MAP MODE (MOCK)</span>
      </div>
      <p className={`text-lg font-semibold mb-2 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-200 dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent'
          : 'text-slate-800'
      }`}>Interactive Map Coming Soon</p>
      <p className={`text-sm ${isDark ? 'text-blue-300/80' : 'text-slate-600'}`}>
        Showing {providers.length} dynamic provider marker placeholders
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-xl">
        {providers.slice(0,8).map(p => (
          <div key={p.id} className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-[11px] ${
            isDark 
              ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-blue-200/80'
              : 'bg-white/60 border border-slate-200/40 text-slate-700'
          }`}>
            {p.businessName.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
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
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [prefill, setPrefill] = useState('');
  const providers: ServiceProvider[] = state.providers || [];
  const visibleProviders = showAll ? providers : providers.slice(0, 6);

  const category = state.category || providers[0]?.category || 'Service Providers';
  const searchQuery = state.searchQuery || category;

  // Compose message when provider changes
  useEffect(() => {
    if (selectedProvider) {
      const base = `Hello ${selectedProvider.businessName}! I'm interested in your ${selectedProvider.category.toLowerCase()} services I found via ServiceGPT. Could you assist with my needs?`;
      setPrefill(base + '\n\nBrief: [Add any extra details here]\nPreferred timing: [e.g. This week]\nBudget: [optional]\n\nThanks!');
    }
  }, [selectedProvider]);

  const openWhatsApp = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowWhatsApp(true);
    setSending(false);
    setSent(false);
  };


  const simulateSend = () => {
    setSending(true);
    setSent(false);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1300);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-background-dark' 
        : 'bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50'
    }`}>
      {/* Fixed Header / Filters */}
      <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-500 ${
        isDark 
          ? 'bg-[linear-gradient(140deg,#05070d_0%,#090d17_45%,#0d1220_70%,#101727_100%)] border-b border-white/10' 
          : 'bg-gradient-to-br from-white/80 via-slate-50/90 to-blue-50/80 border-b border-slate-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <button onClick={() => navigate(-1)} className={`group h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border shadow-inner flex items-center justify-center backdrop-blur-md transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                  : 'bg-white/60 border-slate-200/50 text-slate-600 hover:text-slate-800 hover:bg-white/80'
              }`}>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div>
                <div className="inline-flex items-center gap-2 mb-1 sm:mb-2">
                  <h1 className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight ${
                    isDark
                      ? 'text-white'
                      : 'text-slate-800'
                  }`}>{searchQuery}</h1>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${
                    isDark
                      ? 'bg-blue-500/20 border border-white/10 text-blue-200'
                      : 'bg-blue-100 border border-blue-200/50 text-blue-700'
                  }`}>Live</span>
                </div>
                <p className={`text-xs sm:text-[13px] font-medium ${
                  isDark ? 'text-blue-100/60' : 'text-slate-600'
                }`}>{providers.length} providers • curated results</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {['list', 'map'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as ViewMode)}
                  className={`relative h-9 sm:h-11 px-3 sm:px-4 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-medium transition-all backdrop-blur-md border ${
                    viewMode === mode
                      ? isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-400/40 shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400/40 shadow-lg'
                      : isDark
                        ? 'bg-white/5 text-blue-200/70 border-white/10 hover:bg-white/10 hover:text-white'
                        : 'bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white/80 hover:text-slate-800'
                  }`}
                >
                  {mode === 'list' ? (
                    <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <MapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                  <span>{mode === 'list' ? 'List' : 'Map'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-32 sm:pt-36 md:pt-44 lg:pt-48 px-4 sm:px-6 lg:px-10 pb-8">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'map' ? (
            <MapPlaceholder providers={providers} isDark={isDark} />
          ) : (
            <>
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-12">
                {visibleProviders.map(provider => (
                  <div
                    key={provider.id}
                    className={`group relative rounded-3xl p-5 sm:p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                      isDark 
                        ? 'bg-gradient-to-br from-white/[0.07] via-white/[0.05] to-white/[0.04] border border-white/10 shadow-[0_4px_30px_-6px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.55)]'
                        : 'bg-white/60 hover:bg-white/80 border border-slate-200/30 shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {/* Provider Card Content */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl overflow-hidden transition-all duration-500 shadow-lg ${
                          isDark ? 'ring-2 ring-white/20' : 'ring-2 ring-slate-200/50'
                        } group-hover:ring-blue-400/40`}>
                          <img src={provider.profileImage} alt={provider.businessName} className="w-full h-full object-cover" />
                        </div>
                        {provider.verified && (
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white flex items-center justify-center text-[10px] font-bold shadow-md ${
                            isDark ? 'ring-2 ring-[#0d1220]' : 'ring-2 ring-white'
                          }`}>✓</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 pr-2">
                            <h3 className={`text-[15px] font-semibold truncate tracking-wide transition-colors ${
                              isDark ? 'text-white group-hover:text-blue-200' : 'text-slate-800 group-hover:text-blue-600'
                            }`}>{provider.businessName}</h3>
                            <p className={`text-[11px] font-medium uppercase tracking-[0.12em] mt-1 ${
                              isDark ? 'text-blue-300/80' : 'text-slate-600'
                            }`}>{provider.category}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-1.5">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-300 drop-shadow" />
                              <span className={`text-sm font-semibold ${
                                isDark ? 'text-white' : 'text-slate-800'
                              }`}>{provider.rating.toFixed(1)}</span>
                            </div>
                            <span className={`text-[10px] mt-1 ${
                              isDark ? 'text-blue-200/60' : 'text-slate-500'
                            }`}>{provider.distance}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={() => openWhatsApp(provider)}
                            className={`flex-1 h-10 px-4 rounded-xl text-white text-[13px] font-semibold shadow-lg transition-all flex items-center gap-2 ${
                              isDark
                                ? 'bg-green-600 hover:bg-green-500'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </button>
                          <button className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                            isDark
                              ? 'bg-white/5 border border-white/10 text-blue-200/60 hover:text-rose-400 hover:border-rose-400/40 hover:bg-rose-500/10'
                              : 'bg-white/60 border border-slate-200/50 text-slate-500 hover:text-rose-500 hover:border-rose-400/40'
                          }`}>
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {providers.length > 6 && !showAll && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className={`px-10 h-12 rounded-2xl font-semibold text-sm flex items-center gap-3 transition-all ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-white/10 hover:from-blue-500 hover:to-purple-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border border-blue-400/30 hover:from-blue-600 hover:to-purple-600'
                    }`}
                  >
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

      {/* WhatsApp Modal */}
      {showWhatsApp && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowWhatsApp(false)} />
          <div className={`relative w-full max-w-lg rounded-3xl overflow-hidden border shadow-2xl animate-scaleIn ${
            isDark
              ? 'bg-gradient-to-br from-[#101826]/90 via-[#0d1320]/85 to-[#161b2b]/90 border-white/10'
              : 'bg-white/90 backdrop-blur-xl border-slate-200/50'
          }`}>
            <div className="relative p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}>Message {selectedProvider.businessName}</h2>
                  <p className={`text-xs tracking-wide uppercase mt-1 ${
                    isDark ? 'text-blue-200/70' : 'text-slate-500'
                  }`}>WhatsApp Preview</p>
                </div>
                <button
                  onClick={() => setShowWhatsApp(false)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                      : 'bg-white/60 border-slate-200/50 text-slate-500 hover:text-slate-700 hover:bg-white/80'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message content */}
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${
                  isDark ? 'text-blue-200/70' : 'text-slate-500'
                }`}>Your Message</label>
                <textarea
                  value={prefill}
                  onChange={e => setPrefill(e.target.value)}
                  rows={5}
                  className={`w-full rounded-2xl resize-none p-4 text-sm leading-relaxed backdrop-blur-md transition-all ${
                    isDark
                      ? 'bg-white/5 border border-white/10 focus:border-blue-400/50 text-blue-50/90'
                      : 'bg-white/60 border border-slate-200/50 focus:border-blue-400/50 text-slate-700'
                  }`}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={simulateSend}
                  disabled={sending || sent}
                  className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    isDark
                      ? sent
                        ? 'bg-green-600/20 border border-green-400/40 text-green-300'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-white/10'
                      : sent
                        ? 'bg-green-100 border border-green-200 text-green-700'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border border-blue-400/30'
                  }`}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : sent ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  <span>{sent ? 'Ready to send' : sending ? 'Preparing...' : 'Preview & Send'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderResultsScreen;
