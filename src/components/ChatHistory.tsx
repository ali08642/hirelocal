import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Filter, Search, Clock, MessageCircle, ChevronRight, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';
import { useTheme } from '../theme/useTheme';

interface SessionCardData {
  id: string;
  category: string;
  startedAt: Date;
  status: 'completed' | 'ongoing';
  providerCount: number;
  preview: string;
  messages: ChatMessage[];
}

const mockSessions: SessionCardData[] = Array.from({ length: 9 }).map((_, i) => {
  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Handyman'];
  const cat = categories[i % categories.length];
  const ongoing = i % 4 === 0;
  return {
    id: `sess-${i+1}`,
    category: cat,
    startedAt: new Date(Date.now() - (i * 3600_000 * 5)),
    status: ongoing ? 'ongoing' : 'completed',
    providerCount: 3 + (i % 4),
    preview: ongoing ? `Continuing discussion about ${cat.toLowerCase()} issue...` : `Matched top providers for ${cat.toLowerCase()} task.` ,
    messages: [
      { id: `m-${i}-1`, type: 'user', content: `Need help with ${cat.toLowerCase()} issue #${i+1}`, timestamp: new Date(), suggestions: [] },
      { id: `m-${i}-2`, type: 'ai', content: `Gathered details for your ${cat.toLowerCase()} request.`, timestamp: new Date(), suggestions: [] }
    ]
  };
});

const ChatHistory: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'ongoing'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [mountAnim, setMountAnim] = useState(false);


  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Handyman'];

  const filtered = useMemo(() => {
    let list = [...mockSessions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.preview.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') list = list.filter(s => s.category === categoryFilter);
    if (statusFilter !== 'all') list = list.filter(s => s.status === statusFilter);
    list.sort((a,b) => sort === 'newest' ? b.startedAt.getTime() - a.startedAt.getTime() : a.startedAt.getTime() - b.startedAt.getTime());
    return list;
  }, [search, categoryFilter, statusFilter, sort]);

  // Inject page-specific luxury animations once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeSlideUp {0%{opacity:0;transform:translateY(18px) scale(.96)}60%{opacity:.85;transform:translateY(-4px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes pulseBorder {0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.0)}50%{box-shadow:0 0 22px 0 rgba(59,130,246,.35)}}
      @keyframes pulseBorderLight {0%,100%{box-shadow:0 0 0 0 rgba(148,163,184,.0)}50%{box-shadow:0 0 18px 0 rgba(148,163,184,.4)}}
      @keyframes shimmer {0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
      .animate-session-enter {animation:fadeSlideUp .65s cubic-bezier(.23,1,.32,1)}
      .live-ring {background:conic-gradient(from 180deg,var(--c1),var(--c2),var(--c3),var(--c1));animation:spin 6s linear infinite}
      @keyframes spin {to{transform:rotate(360deg)}}
      .gradient-border::before {content:'';position:absolute;inset:0;padding:1px;border-radius:inherit;background:linear-gradient(140deg,rgba(59,130,246,.4),rgba(168,85,247,.35),rgba(37,99,235,.35));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .5s}
      .gradient-border:hover::before {opacity:1}
      .gradient-border-light::before {content:'';position:absolute;inset:0;padding:1px;border-radius:inherit;background:linear-gradient(140deg,rgba(148,163,184,.5),rgba(203,213,225,.4),rgba(148,163,184,.5));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .5s}
      .gradient-border-light:hover::before {opacity:1}
      .chip-gradient {background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.15);}
      .chip-gradient:hover {border-color:rgba(255,255,255,.35);}
      .chip-gradient-light {background:linear-gradient(135deg,rgba(148,163,184,.35),rgba(203,213,225,.25));border:1px solid rgba(148,163,184,.5);backdrop-filter:blur(20px);}
      .chip-gradient-light:hover {border-color:rgba(71,85,105,.6);}
      .theme-transition { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      .glass-shimmer {position:relative;overflow:hidden;}
      .glass-shimmer::after {content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:translateX(-100%);animation:shimmer 3s infinite;}
    `;
    document.head.appendChild(style);
    requestAnimationFrame(()=>setMountAnim(true));
    return () => { if(document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  // Category icon mapping
  const catIcon: Record<string,string> = { Plumbing:'🔧', Electrical:'⚡', Cleaning:'🧽', Handyman:'🔨' };

  // Group sessions by date buckets (Today / Yesterday / Earlier)
  const grouped = useMemo(() => {
    const today = new Date();
    const startOfDay = (d:Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const tStart = startOfDay(today);
    const yStart = tStart - 86400000;
    const buckets: Record<string, SessionCardData[]> = { Today:[], Yesterday:[], Earlier:[] };
    filtered.forEach(s => {
      const sDay = startOfDay(s.startedAt);
      if (sDay === tStart) buckets.Today.push(s); else if (sDay === yStart) buckets.Yesterday.push(s); else buckets.Earlier.push(s);
    });
    return buckets;
  }, [filtered]);

  const totalCompleted = filtered.filter(s=>s.status==='completed').length;
  const totalOngoing = filtered.filter(s=>s.status==='ongoing').length;

  // Theme-aware classes
  const themeClasses = {
    // Main backgrounds - Rich silver metallic base
    mainBg: theme === 'dark'
      ? 'bg-gradient-to-b from-[#0b111a] via-[#080e16] to-[#05080d]' 
      : 'bg-gradient-to-br from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]',
    
    // Text colors - Better contrast for readability
    primaryText: theme === 'dark' ? 'text-white' : 'text-slate-900',
    secondaryText: theme === 'dark' ? 'text-blue-200/80' : 'text-slate-700',
    mutedText: theme === 'dark' ? 'text-blue-300/70' : 'text-slate-600',
    accentText: theme === 'dark' ? 'text-blue-200/60' : 'text-slate-500',
    
    // Backgrounds and borders - True glass effect with darker silver
    cardBg: theme === 'dark' ? 'bg-white/5' : 'bg-gradient-to-br from-white/30 via-slate-100/40 to-white/20 backdrop-blur-xl',
    cardBorder: theme === 'dark' ? 'border-white/10' : 'border-slate-300/60',
    headerBg: theme === 'dark'
      ? 'backdrop-blur-2xl bg-black/50/60 border-b border-white/10' 
      : 'bg-gradient-to-r from-gray-700 via-slate-800 to-gray-900 border-b border-gray-600 shadow-xl shadow-gray-900/20',
    
    // Header-specific text colors for light mode
    headerPrimaryText: theme === 'dark' ? 'text-white' : 'text-white',
    headerSecondaryText: theme === 'dark' ? 'text-blue-300/70' : 'text-gray-300',
    
    // Header buttons for light mode
    headerButtonBg: theme === 'dark'
      ? 'bg-white/10 hover:bg-white/20' 
      : 'bg-gray-600/30 hover:bg-gray-500/40 backdrop-blur-sm',
    headerButtonBorder: theme === 'dark' ? 'border-white/15' : 'border-gray-400/30',
    headerButtonText: theme === 'dark' ? 'text-white' : 'text-gray-200',
    headerButtonActiveText: theme === 'dark' ? 'text-blue-200' : 'text-white',
    
    // Regular buttons - Metallic silver appearance
    buttonBg: theme === 'dark'
      ? 'bg-white/10 hover:bg-white/20' 
      : 'bg-gradient-to-br from-slate-200/70 via-slate-100/60 to-slate-200/70 hover:from-slate-300/80 hover:to-slate-300/80 backdrop-blur-lg',
    buttonBorder: theme === 'dark' ? 'border-white/15' : 'border-slate-400/60',
    
    // Input - Silver glass input field
    inputBorder: theme === 'dark'
      ? 'border-white/10 group-focus-within:border-blue-400/40' 
      : 'border-slate-400/50 group-focus-within:border-slate-500/70',
    inputBg: theme === 'dark'
      ? 'bg-gradient-to-r from-white/10 via-white/5 to-white/10 group-focus-within:from-blue-500/20 group-focus-within:to-purple-500/20' 
      : 'bg-gradient-to-r from-slate-200/40 via-slate-100/30 to-slate-200/40 group-focus-within:from-slate-300/50 group-focus-within:to-slate-300/50 backdrop-blur-xl',
    
    // Special elements
    liveRing: theme === 'dark' ? 'animate-pulseBorder' : 'animate-pulseBorderLight',
    gradientBorder: theme === 'dark' ? 'gradient-border' : 'gradient-border-light',
    chipGradient: theme === 'dark' ? 'chip-gradient' : 'chip-gradient-light',
    
    // Footer-specific styling for light mode
    footerBg: theme === 'dark'
      ? 'bg-gradient-to-t from-[#05080d]/90 via-[#05080d]/70 to-transparent backdrop-blur-2xl border-t border-white/10'
      : 'bg-gradient-to-t from-gray-800/95 via-gray-800/90 to-gray-800/80 backdrop-blur-xl border-t border-gray-600/50 shadow-2xl shadow-gray-900/30',
    footerText: theme === 'dark' ? 'text-white' : 'text-gray-200',
    footerSecondaryText: theme === 'dark' ? 'text-blue-200/60' : 'text-gray-400',
    footerButtonBg: theme === 'dark'
      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:from-blue-500 group-hover:to-pink-500'
      : 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 group-hover:from-gray-500 group-hover:to-gray-600',
    
    // Ambient backgrounds - Rich metallic silver atmosphere
    ambientBg1: theme === 'dark'
      ? 'bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-purple-600/10' 
      : 'bg-gradient-to-br from-slate-400/25 via-zinc-400/20 to-gray-400/20',
    ambientBg2: theme === 'dark'
      ? 'bg-gradient-to-tr from-fuchsia-500/10 via-purple-500/10 to-sky-500/10' 
      : 'bg-gradient-to-tr from-slate-300/30 via-zinc-300/25 to-gray-300/25',
    ambientBg3: theme === 'dark'
      ? 'bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-emerald-500/5' 
      : 'bg-gradient-to-br from-slate-500/20 via-zinc-500/15 to-gray-500/15',
    
    // Grid pattern - Metallic grid overlay
    gridPattern: theme === 'dark'
      ? 'bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] opacity-[0.07]' 
      : 'bg-[linear-gradient(rgba(71,85,105,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.12)_1px,transparent_1px)] opacity-[0.4]'
  };

  return (
    <div className={`min-h-screen flex flex-col relative theme-transition ${themeClasses.primaryText}`}>
      {/* Ambient Background Layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute -top-32 -left-32 w-96 h-96 ${themeClasses.ambientBg1} blur-3xl rounded-full theme-transition`} />
        <div className={`absolute top-1/3 -right-40 w-[32rem] h-[32rem] ${themeClasses.ambientBg2} blur-[140px] rounded-full theme-transition`} />
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[46rem] h-[46rem] ${themeClasses.ambientBg3} blur-[160px] theme-transition`} />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.08),transparent_60%)]' : 'bg-[radial-gradient(circle_at_70%_20%,rgba(148,163,184,0.12),transparent_60%)]'} theme-transition`} />
      </div>
      <div className={`absolute inset-0 ${themeClasses.gridPattern} bg-[size:60px_60px] theme-transition`} />
      <div className={`absolute inset-0 ${themeClasses.mainBg} theme-transition`} />
      
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <div className={`sticky top-0 z-30 ${themeClasses.headerBg} px-4 py-4 flex items-center justify-between theme-transition`}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-xl ${themeClasses.headerButtonBg} ${themeClasses.headerButtonBorder} border transition flex items-center justify-center ${themeClasses.headerButtonText} theme-transition`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-lg sm:text-xl font-bold tracking-wide ${theme === 'dark' ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent' : 'text-white font-extrabold'} theme-transition`}>My Conversations</h1>
              <p className={`text-[10px] sm:text-[11px] uppercase tracking-[0.25em] ${themeClasses.headerSecondaryText} font-medium theme-transition`}>History & Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowFilters(f=>!f)} className={`w-10 h-10 rounded-xl border ${themeClasses.headerButtonBorder} flex items-center justify-center transition ${showFilters ? (theme === 'dark' ? 'bg-blue-600/30 text-blue-200 border-blue-400/40' : 'bg-gray-500/40 text-white border-gray-300/50') : `${themeClasses.headerButtonBg} ${themeClasses.headerButtonText}`} theme-transition`}> 
              <Filter className="w-5 h-5"/> 
            </button>
            <button onClick={()=>setSearch('')} className={`w-10 h-10 rounded-xl ${themeClasses.headerButtonBg} ${themeClasses.headerButtonBorder} border flex items-center justify-center ${theme === 'dark' ? themeClasses.mutedText : 'text-gray-300'} hover:${themeClasses.headerButtonActiveText} transition theme-transition`}>
              <RefreshCw className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-4">
          <div className="relative group">
            <div className={`absolute inset-0 rounded-2xl ${themeClasses.inputBg} transition theme-transition`}></div>
            <div className={`absolute inset-0 rounded-2xl border ${themeClasses.inputBorder} theme-transition`}></div>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-blue-300/60' : 'text-slate-500/70'} theme-transition`} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..." className={`w-full bg-transparent rounded-2xl pl-12 pr-4 py-3 outline-none text-sm ${theme === 'dark' ? 'placeholder:text-blue-300/40' : 'placeholder:text-slate-500/60'} theme-transition`} />
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="px-4 mt-5">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {[
              { label:'Total', value: filtered.length, accent:'from-slate-500 to-slate-600' },
              { label:'Completed', value: totalCompleted, accent:'from-emerald-500 to-green-600' },
              { label:'Ongoing', value: totalOngoing, accent:'from-amber-500 to-orange-500' },
              { label:'All Time', value: mockSessions.length, accent:'from-slate-600 to-slate-700' }
            ].map(m => (
              <div key={m.label} className="min-w-[130px] relative group">
                <div className={`absolute -inset-[1px] rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-white/10 to-white/5' : 'bg-gradient-to-r from-white/40 to-white/20'} opacity-30 group-hover:opacity-60 transition-all theme-transition`} />
                <div className={`relative rounded-2xl px-4 py-3 ${themeClasses.cardBg} border ${themeClasses.cardBorder} flex flex-col theme-transition glass-shimmer`}>
                  <span className={`text-[11px] tracking-wide uppercase ${themeClasses.accentText} font-medium theme-transition`}>{m.label}</span>
                  <span className={`mt-1 text-xl font-semibold bg-gradient-to-r ${theme === 'dark' ? m.accent : (m.label === 'Total' || m.label === 'All Time' ? 'from-slate-600 to-slate-700' : m.accent)} bg-clip-text text-transparent`}>{m.value}</span>
                  <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${theme === 'dark' ? m.accent : (m.label === 'Total' || m.label === 'All Time' ? 'from-slate-500 to-slate-600' : m.accent)}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-4 mt-4 animate-fadeIn">
            <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.cardBorder} space-y-4 ${themeClasses.gradientBorder} relative overflow-hidden theme-transition`}>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                <button onClick={()=>setCategoryFilter('all')} className={`px-4 py-2 rounded-xl text-[11px] font-semibold ${themeClasses.chipGradient} whitespace-nowrap ${categoryFilter==='all' ? (theme === 'dark' ? '!bg-blue-600/30 !text-white !border-blue-400/40' : '!bg-slate-400/40 !text-slate-800 !border-slate-500/50') : (theme === 'dark' ? 'text-blue-200/70' : 'text-slate-700/80')} theme-transition`}>All</button>
                {categories.map(cat => (
                  <button key={cat} onClick={()=>setCategoryFilter(cat)} className={`px-4 py-2 rounded-xl text-[11px] font-semibold ${themeClasses.chipGradient} whitespace-nowrap ${categoryFilter===cat ? (theme === 'dark' ? '!bg-blue-600/30 !text-white !border-blue-400/40' : '!bg-slate-400/40 !text-slate-800 !border-slate-500/50') : (theme === 'dark' ? 'text-blue-200/70' : 'text-slate-700/80')} theme-transition`}>{cat}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {(['all','ongoing','completed'] as const).map(st => (
                                    <button key={st} onClick={()=>setStatusFilter(st)} className={`flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold ${themeClasses.chipGradient} ${statusFilter===st ? (theme === 'dark' ? '!bg-emerald-600/30 !text-white !border-emerald-400/40' : '!bg-emerald-500/40 !text-slate-800 !border-emerald-500/60') : (theme === 'dark' ? 'text-blue-200/70' : 'text-slate-700/80')} theme-transition`}>{st.charAt(0).toUpperCase()+st.slice(1)}</button>
                  ))}
                </div>
                <div className="flex-1 flex gap-2">
                  <button onClick={()=>setSort('newest')} className={`flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold ${themeClasses.chipGradient} ${sort==='newest' ? (theme === 'dark' ? '!bg-purple-600/30 !text-white !border-purple-400/40' : '!bg-slate-500/40 !text-slate-800 !border-slate-600/60') : (theme === 'dark' ? 'text-blue-200/70' : 'text-slate-700/80')} theme-transition`}>Newest</button>
                  <button onClick={()=>setSort('oldest')} className={`flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold ${themeClasses.chipGradient} ${sort==='oldest' ? (theme === 'dark' ? '!bg-purple-600/30 !text-white !border-purple-400/40' : '!bg-slate-500/40 !text-slate-800 !border-slate-600/60') : (theme === 'dark' ? 'text-blue-200/70' : 'text-slate-700/80')} theme-transition`}>Oldest</button>
                </div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 px-4 mt-6 pb-32 space-y-8 overflow-y-auto relative">
          {filtered.length === 0 && (
            <div className={`text-center py-16 rounded-3xl border border-dashed ${theme === 'dark' ? 'border-white/15 bg-white/5' : 'border-slate-400/50 bg-slate-200/30'} backdrop-blur-xl theme-transition`}>
              <p className={`text-sm ${themeClasses.mutedText} mb-3 theme-transition`}>No conversations match your filters</p>
              <button onClick={()=>{setSearch(''); setCategoryFilter('all'); setStatusFilter('all');}} className={`px-4 py-2.5 rounded-xl text-white text-xs font-semibold shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>Reset Filters</button>
            </div>
          )}
          {Object.entries(grouped).map(([label, sessions]) => (
            sessions.length > 0 && (
              <div key={label} className="space-y-3 animate-fadeIn">
                <div className="flex items-center gap-3 pl-1">
                  <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-blue-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-500/60 to-transparent'} theme-transition`} />
                  <span className={`text-[11px] tracking-[0.3em] uppercase ${themeClasses.accentText} font-semibold theme-transition`}>{label}</span>
                  <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-blue-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-slate-500/60 to-transparent'} theme-transition`} />
                </div>
                <div className="space-y-4">
                  {sessions.map((session, idx) => {
                    const live = session.status==='ongoing';
                    return (
                      <button key={session.id} onClick={()=> navigate('/chat', { state: { resumeSession: session.id } })} className={`w-full text-left group relative rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 transition-all ${mountAnim ? 'animate-session-enter' : ''} theme-transition`} style={{animationDelay:`${Math.min(idx*60,300)}ms`}}>
                        {/* Glow / gradient backdrop */}
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/8 via-white/5 to-white/10' : 'bg-gradient-to-br from-white/60 via-white/40 to-white/60'} opacity-80 group-hover:opacity-100 transition theme-transition`} />
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 theme-transition`} style={{background: theme === 'dark' ? 'radial-gradient(circle at 85% 20%, rgba(59,130,246,0.25), transparent 60%)' : 'radial-gradient(circle at 85% 20%, rgba(148,163,184,0.3), transparent 60%)'}} />
                        {/* Live animated ring accent */}
                        {live && <div className={`absolute -inset-[1px] rounded-[1.1rem] ${themeClasses.liveRing} pointer-events-none theme-transition`} />}
                        <div className={`relative p-4 sm:p-5 flex items-start gap-4 backdrop-blur-xl border ${themeClasses.cardBorder} rounded-2xl hover:${theme === 'dark' ? 'border-white/20' : 'border-white/60'} transition-colors ${themeClasses.gradientBorder} theme-transition glass-shimmer`}>
                          {/* Category Icon Block */}
                          <div className="relative flex flex-col items-center w-16 sm:w-20">
                            <div className="relative">
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${theme === 'dark' ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700'} flex items-center justify-center shadow-lg text-lg sm:text-xl text-white`}>
                                <span>{catIcon[session.category] || session.category.charAt(0)}</span>
                              </div>
                              {live && (
                                <div
                                  className="absolute -inset-1 rounded-2xl live-ring opacity-40"
                                  style={{
                                    ['--c1' as string]: theme === 'dark' ? '#2563eb55' : '#64748b55',
                                    ['--c2' as string]: theme === 'dark' ? '#9333ea55' : '#94a3b855',
                                    ['--c3' as string]: theme === 'dark' ? '#2563eb55' : '#64748b55'
                                  } as React.CSSProperties}
                                ></div>
                              )}
                            </div>
                            <div className={`mt-2 text-[10px] ${themeClasses.accentText} font-medium text-center leading-tight theme-transition`}>
                              {session.startedAt.toLocaleDateString(undefined,{month:'short', day:'numeric'})}<br/>{session.startedAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className={`font-semibold text-[13px] sm:text-sm tracking-wide ${themeClasses.primaryText} truncate flex items-center gap-2 theme-transition`}>
                                {session.category} Service Inquiry
                                {live && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-500/25 text-amber-700'} text-[10px] font-semibold theme-transition`}><span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-amber-300' : 'bg-amber-600'} animate-pulse theme-transition`} />Live</span>}
                                {session.status==='completed' && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-500/25 text-emerald-700'} text-[10px] font-semibold theme-transition`}><CheckCircle2 className="w-3 h-3" />Done</span>}
                              </h3>
                            </div>
                            <p className={`text-[12px] ${themeClasses.secondaryText} line-clamp-2 mb-3 leading-relaxed tracking-wide theme-transition`}>{session.preview}</p>
                            <div className="flex items-center flex-wrap gap-2">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-200/80 border border-blue-400/20' : 'bg-gradient-to-r from-slate-400/25 to-slate-500/25 text-slate-700 border border-slate-400/40'} flex items-center gap-1 theme-transition backdrop-blur-sm`}><Layers className="w-3 h-3" />{session.providerCount}</span>
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${theme === 'dark' ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-200/80 border border-purple-400/20' : 'bg-gradient-to-r from-slate-500/25 to-slate-600/25 text-slate-700 border border-slate-500/40'} flex items-center gap-1 theme-transition backdrop-blur-sm`}><Clock className="w-3 h-3" />{Math.max(1, Math.round((Date.now()-session.startedAt.getTime())/60000))}m</span>
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-200/80 border border-emerald-400/20' : 'bg-gradient-to-r from-slate-600/25 to-slate-700/25 text-slate-700 border border-slate-600/40'} flex items-center gap-1 theme-transition backdrop-blur-sm`}><MessageCircle className="w-3 h-3" />{session.messages.length}</span>
                            </div>
                          </div>
                          <div className={`self-center ${theme === 'dark' ? 'opacity-30 group-hover:opacity-90' : 'opacity-50 group-hover:opacity-90'} transition-transform group-hover:translate-x-1 theme-transition`}>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Bottom CTA / Summary Bar */}
        <div className={`fixed bottom-0 left-0 right-0 z-20 px-4 pb-5 pt-4 ${themeClasses.footerBg} theme-transition`}>
          <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
            <div className="flex-1">
              <p className={`text-[11px] ${themeClasses.footerSecondaryText} uppercase tracking-wider theme-transition`}>Sessions</p>
              <p className={`text-sm font-semibold flex items-center gap-2 ${themeClasses.footerText} theme-transition`}><span>{filtered.length}</span><span className={`${themeClasses.footerSecondaryText} text-[11px] theme-transition`}>of {mockSessions.length}</span></p>
            </div>
            <button onClick={()=>navigate('/chat')} className="flex-1 h-11 rounded-2xl relative group overflow-hidden font-semibold text-sm text-white">
              <div className={`absolute inset-0 ${themeClasses.footerButtonBg} transition-all`} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.25),transparent_60%)]" />
              <span className="relative">Start New</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;