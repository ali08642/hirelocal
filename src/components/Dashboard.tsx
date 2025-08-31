import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  History, 
  User, 
  Bell,
  MapPin,
  Clock,
  Heart,
  Home,
  ChevronRight,
  Calendar,
  Award,
  DollarSign,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import PageTransition from './shared/PageTransition';
import { useTheme } from '../theme/useTheme';
import { useAuth } from '../contexts/AuthContextHooks';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const timerRef = React.useRef<NodeJS.Timeout>();
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setUserMenuOpen(!userMenuOpen);
  };

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 2000);
  };

  // Handle click outside to close menu
  React.useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const menu = menuRef.current.querySelector('[role="menu"]');
        if (menu) {
          menu.classList.add('menu-fade-out');
          timerRef.current = setTimeout(() => {
            setUserMenuOpen(false);
          }, 200);
        } else {
          setUserMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const greeting = React.useMemo(()=>{
    const h = now.getHours();
    if (h < 5) return 'Late night';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  },[now]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleStartChat = () => {
    const button = document.querySelector('.start-ai-search-button');
    if (button) {
      button.classList.add('animate-pulse');
    }
    setTimeout(() => {
      setIsTransitioning(true);
    }, 150);
  };

  const onTransitionComplete = () => {
    navigate('/chat');
  };


  // Add custom animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes menuFadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.95); }
      }

      .menu-fade-out {
        animation: menuFadeOut 0.2s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Mobile input handling
  React.useEffect(() => {
    const handleInputFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        target.style.fontSize = '16px';
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            target.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }, 300);
        }
      }
    };

    const handleInputBlur = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }
      }
    };

    document.addEventListener('focusin', handleInputFocus);
    document.addEventListener('focusout', handleInputBlur);

    return () => {
      document.removeEventListener('focusin', handleInputFocus);
      document.removeEventListener('focusout', handleInputBlur);
    };
  }, []);

  // Add custom CSS for spark animations and mobile input handling
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes menuFadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.95); }
      }

      .menu-fade-out {
        animation: menuFadeOut 0.2s ease-out forwards;
      }

      @keyframes spark-1 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        30% { opacity: 1; transform: translate(15px, -8px) scale(1.2); }
        60% { opacity: 0.8; transform: translate(25px, -15px) scale(1); }
        100% { opacity: 0; transform: translate(35px, -20px) scale(0.3); }
      }
      
      @keyframes spark-2 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        25% { opacity: 1; transform: translate(-10px, 15px) scale(1.1); }
        50% { opacity: 0.9; transform: translate(-18px, 25px) scale(1.3); }
        75% { opacity: 0.5; transform: translate(-25px, 35px) scale(0.8); }
        100% { opacity: 0; transform: translate(-30px, 40px) scale(0.3); }
      }
      
      @keyframes spark-3 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        40% { opacity: 1; transform: translate(20px, -12px) scale(1.4); }
        70% { opacity: 0.7; transform: translate(30px, -20px) scale(1); }
        100% { opacity: 0; transform: translate(40px, -25px) scale(0.3); }
      }
      
      @keyframes spark-4 {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        35% { opacity: 1; transform: translate(-15px, -10px) scale(1.2); }
        65% { opacity: 0.8; transform: translate(-25px, -18px) scale(1.1); }
        100% { opacity: 0; transform: translate(-35px, -25px) scale(0.3); }
      }
      
      .animate-spark-1 { animation: spark-1 2s ease-out; }
      .animate-spark-2 { animation: spark-2 2.2s ease-out 0.2s; }
      .animate-spark-3 { animation: spark-3 1.8s ease-out 0.4s; }
      .animate-spark-4 { animation: spark-4 2.1s ease-out 0.6s; }
      
      @media (max-width: 768px) {
        input, textarea {
          font-size: 16px !important;
          zoom: 1 !important;
          -webkit-appearance: none !important;
          -webkit-text-size-adjust: 100% !important;
        }
        body {
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        .keyboard-adjust {
          height: 100vh;
          height: 100dvh;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const recentActivity = [
    { 
      id: 1, 
      type: 'search', 
      title: 'Found 3 plumbers near you', 
      subtitle: 'Leaky kitchen faucet repair',
      time: '2 hours ago', 
      status: 'completed',
      icon: '🔧',
      color: 'text-blue-500'
    },
    { 
      id: 2, 
      type: 'contact', 
      title: 'Contacted Mike\'s Cleaning Service', 
      subtitle: 'Deep house cleaning',
      time: '1 day ago', 
      status: 'replied',
      icon: '🧽',
      color: 'text-green-500'
    },
    { 
      id: 3, 
      type: 'save', 
      title: 'Saved ElectroFix Solutions', 
      subtitle: 'Light fixture installation',
      time: '3 days ago', 
      status: 'saved',
      icon: '⚡',
      color: 'text-yellow-500'
    }
  ];

  const stats = [
    { label: 'Total Searches', value: '24', icon: Search, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Providers Found', value: '142', icon: Award, color: 'from-purple-500 to-pink-500', change: '+8%' },
    { label: 'Money Saved', value: '$340', icon: DollarSign, color: 'from-green-500 to-emerald-500', change: '+15%' },
    { label: 'This Month', value: '8', icon: Calendar, color: 'from-orange-500 to-red-500', change: '+25%' }
  ];

  // ===== THEME-SPECIFIC STYLES =====
  // Dark Theme Styles
  const darkThemeStyles = {
    // Background and base
    background: "min-h-screen bg-black relative overflow-hidden",
    backgroundEffects: {
      grid: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]",
      gradient: "absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50",
      glow1: "absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl",
      glow2: "absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-600/10 rounded-full blur-3xl"
    },
    
    // Header
    header: {
      container: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]",
      background: "absolute inset-0 bg-gradient-to-br from-[#0d141f]/90 via-[#0a111b]/80 to-[#090f18]/90 backdrop-blur-2xl",
      border: "absolute inset-0 rounded-none border-b border-white/10 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_120%,rgba(59,130,246,0.25),transparent_70%)] before:opacity-40",
      greeting: "text-base font-semibold tracking-wide bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent",
      metadata: "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-blue-200/60 font-medium",
      button: "relative h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-medium text-blue-100 transition",
      userButton: "w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-white/15 hover:border-white/30 flex items-center justify-center transition shadow-lg",
      menu: "absolute right-0 mt-2 w-52 rounded-2xl bg-[#0d1522]/95 border border-white/10 backdrop-blur-xl p-2 shadow-2xl animate-fadeSlide z-50"
    },
    
    // Cards and content
    welcomeCard: "bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-6",
    aiCard: {
      background: "relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl",
      heading: "text-2xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent",
      subtitle: "text-gray-300 text-base leading-relaxed max-w-sm mx-auto",
      input: "w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-6 pr-16 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-base",
      button: "relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-0.5 shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden group-active:scale-95"
    },
    
    // Stats and activity
    statsCard: "bg-white/5 border-white/10 backdrop-blur-sm border rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group",
    statsCardHighlighted: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm border rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group",
    activityCard: "bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden",
    
    // Navigation
    bottomNav: "fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 px-6 py-3 shadow-2xl",
    navActiveButton: "flex flex-col items-center space-y-2 py-2 px-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 shadow-lg",
    navButton: "flex flex-col items-center space-y-2 py-2 px-4 hover:bg-white/5 rounded-2xl transition-all duration-300 group"
  };

  // Light Theme Styles (Beautiful Silver Metallic)
// Light Theme Styles (Clean Modern with Strong Contrast)
const lightThemeStyles = {
    // Background and base - Clean white with subtle blue accents
    background: "min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 relative overflow-hidden",
    backgroundEffects: {
      grid: "absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:60px_60px]",
      gradient: "absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white/80 to-indigo-100/30",
      glow1: "absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl",
      glow2: "absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl"
    },
    
    // Header - Grayish background with white fonts
    header: {
      container: "absolute inset-0 bg-[linear-gradient(rgba(107,114,128,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(107,114,128,0.15)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.4]",
      background: "absolute inset-0 bg-gradient-to-br from-gray-700/95 via-gray-800/95 to-slate-700/95 backdrop-blur-xl shadow-lg border-b-2 border-gray-600/80",
      border: "absolute inset-0 rounded-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_120%,rgba(107,114,128,0.2),transparent_70%)] before:opacity-60",
      greeting: "text-base font-bold tracking-wide text-white",
      metadata: "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-200 font-semibold",
      button: "relative h-11 px-4 rounded-xl bg-gray-600/60 hover:bg-gray-500/60 border-2 border-gray-500/60 hover:border-gray-400/60 flex items-center gap-2 text-xs font-semibold text-white transition shadow-sm",
      userButton: "w-11 h-11 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-gray-500 hover:border-gray-400 flex items-center justify-center transition shadow-lg hover:shadow-xl text-white [&>*]:text-white [&>svg]:text-white [&>svg]:fill-white",
      userIcon: "text-white fill-white stroke-white",
      menu: "absolute right-0 mt-2 w-52 rounded-2xl bg-gray-800/98 border-2 border-gray-600/80 backdrop-blur-xl p-2 shadow-2xl animate-fadeSlide z-50"
    },
    
    // Cards and content - Clean white cards with strong shadows
    welcomeCard: "bg-white/90 backdrop-blur-sm border-2 border-blue-100/80 rounded-3xl p-6 mb-6 shadow-xl shadow-blue-100/50",
    aiCard: {
      background: "relative bg-white/95 backdrop-blur-xl border-2 border-gray-200/80 rounded-3xl p-8 shadow-2xl shadow-blue-100/30",
      heading: "text-2xl font-bold mb-3 text-gray-900",
      subtitle: "text-gray-700 text-base leading-relaxed max-w-sm mx-auto",
      input: "w-full bg-blue-50/60 backdrop-blur-sm border-2 border-blue-200/80 rounded-2xl pl-6 pr-16 py-4 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base shadow-inner font-medium",
      button: "relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-0.5 shadow-2xl group-hover:shadow-blue-400/40 transition-all duration-300 overflow-hidden group-active:scale-95",
      // Animated search icon with vibrant colors
      searchIcon: "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-xl text-white shadow-lg animate-pulse"
    },
    
    // Stats and activity - High contrast white cards with colored borders
    statsCard: "bg-white/95 border-2 border-gray-200/80 backdrop-blur-sm rounded-3xl p-5 hover:bg-white/98 hover:shadow-lg transition-all duration-300 relative overflow-hidden group shadow-md",
    statsCardHighlighted: "bg-gradient-to-br from-amber-50/80 to-yellow-50/80 border-2 border-amber-300/80 backdrop-blur-sm rounded-3xl p-5 hover:bg-white/98 hover:shadow-lg transition-all duration-300 relative overflow-hidden group shadow-lg shadow-amber-200/50",
    activityCard: "bg-white/95 backdrop-blur-sm border-2 border-gray-200/80 rounded-3xl p-5 hover:bg-white/98 hover:shadow-lg transition-all duration-300 group relative overflow-hidden shadow-md",
    
    // Navigation - Grayish navigation to match header
    bottomNav: "fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-700/95 via-gray-800/95 to-slate-700/95 backdrop-blur-xl border-t-2 border-gray-600/80 px-6 py-3 shadow-2xl shadow-gray-500/30",
    navActiveButton: "flex flex-col items-center space-y-2 py-2 px-4 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 shadow-lg shadow-white/20 text-white [&>svg]:text-white [&>svg]:fill-none [&>svg]:stroke-white [&>svg]:stroke-2 [&>span]:text-white [&>div]:text-white [&>*]:text-white",
    navButton: "flex flex-col items-center space-y-2 py-2 px-4 hover:bg-white/10 rounded-2xl transition-all duration-300 group border-2 border-transparent hover:border-white/30 text-white hover:text-white [&>svg]:text-white [&>svg]:fill-none [&>svg]:stroke-white [&>svg]:stroke-2 [&>span]:text-white [&>div]:text-white [&>*]:text-white",
    
    // Additional animated search icon styles
    animatedSearchIcon: {
      container: "relative w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 p-1 shadow-lg animate-spin-slow",
      inner: "w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-inner",
      icon: "w-8 h-8 text-white animate-pulse"
    }
  };
  // Select theme styles
  const themeStyles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
  const isDark = theme === 'dark';

  return (
    <PageTransition
      isTransitioning={isTransitioning}
      onTransitionComplete={onTransitionComplete}
    >
      <div className={themeStyles.background}>
        {/* Background Effects */}
        <div className={themeStyles.backgroundEffects.grid}></div>
        <div className={themeStyles.backgroundEffects.gradient}></div>
        <div className={themeStyles.backgroundEffects.glow1}></div>
        <div className={themeStyles.backgroundEffects.glow2}></div>

        <div className="relative z-10">
          {/* Header */}
          <header className="relative w-full">
            <div className="relative">
              <div className={themeStyles.header.container} />
              <div className={themeStyles.header.background} />
              <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,black,transparent)]" />
              <div className={themeStyles.header.border} />
              
              <div className="relative px-4 pt-3 pb-3">
                <div className="flex items-center justify-between">
                  {/* Left cluster */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600'} flex items-center justify-center shadow-lg ring-1 ${isDark ? 'ring-white/20' : 'ring-slate-400/30'}`}>
                        <Search className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h1 className={themeStyles.header.greeting}>{greeting}, John</h1>
                      <div className={themeStyles.header.metadata}>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> New York, NY</span>
                        <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-blue-300/50' : 'bg-slate-400/60'}`} />
                        <span>{now.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</span>
                        <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-blue-300/50' : 'bg-slate-400/60'}`} />
                        <span>{now.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right cluster */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={toggleTheme}
                      className={themeStyles.header.button}
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </button>
                    <button className={themeStyles.header.button}>
                      <Bell className="w-4 h-4" />
                      <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${isDark ? 'bg-gradient-to-br from-rose-500 to-pink-500' : 'bg-gradient-to-br from-red-500 to-rose-500'} text-[10px] font-bold flex items-center justify-center shadow text-white`}>3</span>
                    </button>
                    <div 
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      ref={menuRef}
                    >
                      <button 
                        className={themeStyles.header.userButton}
                        onClick={handleMenuToggle}
                      >
                        <User className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                      </button>
                      {userMenuOpen && (
                        <div 
                          role="menu"
                          className={themeStyles.header.menu + " transition-all duration-200"}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onClick={(e) => e.stopPropagation()}>
                          {[
                            {label:'Profile', action:()=>navigate('/profile')},
                            {label:'History', action:()=>navigate('/history')},
                            {label:'Saved Providers', action:()=>{}},
                            {label:'Logout', action: handleLogout}
                          ].map(item => (
                            <button key={item.label} onClick={()=>{item.action(); setUserMenuOpen(false);}} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${isDark ? 'text-blue-100 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'} transition flex items-center justify-between group`}>
                              <span>{item.label}</span>
                              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white/30 group-hover:text-white/60' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="pb-20">
            {/* Welcome Card */}
            <div id="ai-search-card" className="px-4 py-6">
              <div className={themeStyles.welcomeCard}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`${isDark ? 'text-white' : 'text-gray-800'} font-bold text-lg mb-1`}>Welcome back, John! 👋</h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-slate-600'} text-sm`}>Ready to find your next service provider?</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>24</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>searches</div>
                  </div>
                </div>
              </div>

              {/* Main AI Search Card */}
              <div className="relative">
                <div className={`absolute -inset-4 ${isDark ? 'bg-gradient-to-r from-blue-500/5 to-purple-600/5' : 'bg-gradient-to-r from-slate-300/20 to-gray-300/20'} rounded-[2rem] blur-xl`}></div>
                
                <div className={themeStyles.aiCard.background}>
                  {/* Floating elements */}
                  <div className={`absolute top-4 right-4 w-3 h-3 ${isDark ? 'bg-blue-500' : 'bg-slate-500'} rounded-full animate-pulse`}></div>
                  <div className={`absolute top-8 right-8 w-2 h-2 ${isDark ? 'bg-purple-500' : 'bg-gray-500'} rounded-full animate-pulse`} style={{animationDelay: '1s'}}></div>
                  <div className={`absolute bottom-8 left-6 w-2 h-2 ${isDark ? 'bg-cyan-500' : 'bg-blue-500'} rounded-full animate-pulse`} style={{animationDelay: '2s'}}></div>
                  
                  {/* AI Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className={`w-20 h-20 ${isDark ? 'bg-gradient-to-br from-blue-500/30 to-purple-600/30 border-white/30' : 'bg-gradient-to-br from-slate-300/80 to-gray-300/80 border-slate-400/60'} backdrop-blur-sm border rounded-3xl flex items-center justify-center shadow-2xl`}>
                        <Search className={`w-10 h-10 ${isDark ? 'text-blue-300' : 'text-slate-700'}`} />
                      </div>
                      <div className={`absolute inset-0 w-20 h-20 border-2 ${isDark ? 'border-blue-500/30' : 'border-slate-400/40'} rounded-3xl animate-ping`}></div>
                      <div className={`absolute inset-2 w-16 h-16 border-2 ${isDark ? 'border-purple-500/20' : 'border-gray-400/30'} rounded-2xl animate-ping`} style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>

                  {/* Main heading */}
                  <div className="text-center mb-6">
                    <h2 className={themeStyles.aiCard.heading}>
                      What service do you need?
                    </h2>
                    <p className={themeStyles.aiCard.subtitle}>
                      Tell me what you're looking for and I'll find the 
                      <span className={`${isDark ? 'text-blue-300' : 'text-blue-600'} font-medium`}> best providers</span> in your area
                    </p>
                  </div>


                  {/* Main CTA Button */}
                  <div className="flex justify-center">
                    <button 
                      onClick={handleStartChat}
                      className="relative group start-ai-search-button"
                    >
                      {/* Spark animation container */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none">
                        <div className="absolute w-2 h-2 bg-white rounded-full shadow-lg top-2 left-3 opacity-0 group-hover:opacity-100 group-hover:animate-spark-1 z-20"></div>
                        <div className={`absolute w-1.5 h-1.5 ${isDark ? 'bg-blue-300' : 'bg-slate-300'} rounded-full shadow-lg top-5 right-4 opacity-0 group-hover:opacity-100 group-hover:animate-spark-2 z-20`}></div>
                        <div className="absolute w-2 h-2 bg-white rounded-full shadow-lg bottom-4 left-5 opacity-0 group-hover:opacity-100 group-hover:animate-spark-3 z-20"></div>
                        <div className={`absolute w-1.5 h-1.5 ${isDark ? 'bg-purple-300' : 'bg-gray-300'} rounded-full shadow-lg bottom-2 right-3 opacity-0 group-hover:opacity-100 group-hover:animate-spark-4 z-20`}></div>
                      </div>
                      
                      {/* Main button */}
                      <div className={themeStyles.aiCard.button}>
                        <div className={`relative ${isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500' : 'bg-gradient-to-r from-slate-600 to-gray-700 group-hover:from-slate-500 group-hover:to-gray-600'} rounded-2xl py-4 px-8 text-white font-bold transition-all duration-200`}>
                          <div className="relative flex items-center justify-center space-x-3 z-10">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <MessageCircle className="w-5 h-5 group-hover:scale-110 group-active:scale-95 transition-all duration-200" />
                              </div>
                              <span className="text-base font-bold tracking-wide group-hover:tracking-wider transition-all duration-200">Start AI Search</span>
                              <div className="relative">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-20"></div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </div>
                      </div>
                      
                      {/* Outer glow */}
                      <div className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-r from-slate-400/20 to-gray-400/20'} blur-xl opacity-0 group-hover:opacity-100 group-active:opacity-50 transition-all duration-300 -z-10`}></div>
                      <div className={`absolute inset-0 rounded-2xl border-2 ${isDark ? 'border-blue-400' : 'border-slate-400'} opacity-0 group-active:opacity-50 transition-opacity duration-150`}></div>
                    </button>
                  </div>

                  {/* Quick suggestions */}
                  <div className="mt-6 text-center">
                    <p className={`${isDark ? 'text-gray-400' : 'text-slate-500'} text-xs mb-3`}>Popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Plumber', 'Electrician', 'Cleaner', 'Handyman'].map((service) => (
                        <button
                          key={service}
                          onClick={handleStartChat}
                          className={`px-3 py-1.5 ${isDark ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white' : 'bg-slate-100/60 border-slate-300/60 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'} border rounded-full text-xs transition-all duration-300`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trust indicators */}
                  <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-300/50'}`}>
                    <div className="flex items-center justify-center space-x-6 text-center">
                      <div>
                        <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>1000+</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Providers</div>
                      </div>
                      <div className={`w-px h-8 ${isDark ? 'bg-white/20' : 'bg-slate-300/60'}`}></div>
                      <div>
                        <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>4.9⭐</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Rating</div>
                      </div>
                      <div className={`w-px h-8 ${isDark ? 'bg-white/20' : 'bg-slate-300/60'}`}></div>
                      <div>
                        <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>24/7</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="px-4 py-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Your Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 4).map((stat, index) => {
                  const IconComponent = stat.icon;
                  const isHighlighted = index === 1;
                  return (
                    <div 
                      key={index} 
                      className={isHighlighted ? themeStyles.statsCardHighlighted : themeStyles.statsCard}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className={`w-full h-full ${isDark ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)]'} bg-[length:20px_20px]`}></div>
                      </div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isHighlighted 
                              ? (isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-amber-200/60 text-amber-700') 
                              : (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-200/60 text-green-700')
                          }`}>
                            {stat.change}
                          </div>
                        </div>
                        <h4 className={`text-3xl font-bold mb-1 ${
                          isHighlighted 
                            ? (isDark ? 'text-yellow-300' : 'text-amber-700') 
                            : (isDark ? 'text-white' : 'text-gray-800')
                        }`}>{stat.value}</h4>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'} font-medium`}>{stat.label}</p>
                        
                        {/* Progress bar */}
                        <div className={`mt-3 w-full h-1.5 ${isDark ? 'bg-white/10' : 'bg-slate-300/50'} rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                            style={{width: `${60 + index * 10}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h3>
                <button onClick={() => navigate('/history')} className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} text-sm font-medium transition-colors flex items-center space-x-1`}>
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={themeStyles.activityCard}>
                    {/* Activity type gradient overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl ${
                      activity.type === 'search' 
                        ? (isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400')
                        : activity.type === 'contact' 
                        ? (isDark ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-green-400 to-emerald-400')
                        : (isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-purple-400 to-pink-400')
                    }`}></div>
                    
                    <div className="relative flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg backdrop-blur-sm ${
                        activity.type === 'search' 
                          ? (isDark ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-300/40 to-cyan-300/40 border-blue-400/50')
                          : activity.type === 'contact' 
                          ? (isDark ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-br from-green-300/40 to-emerald-300/40 border-green-400/50')
                          : (isDark ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-300/40 to-pink-300/40 border-purple-400/50')
                      } border`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm transition-colors ${isDark ? 'text-white group-hover:text-blue-300' : 'text-gray-800 group-hover:text-blue-600'}`}>{activity.title}</h4>
                        <p className={`text-xs mt-1 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{activity.subtitle}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            <Clock className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-slate-500'}`} />
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>{activity.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              activity.status === 'completed' ? 'bg-green-500' : 
                              activity.status === 'replied' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}></span>
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-500'} capitalize`}>{activity.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronRight className={`w-5 h-5 transition-colors group-hover:translate-x-1 duration-300 ${isDark ? 'text-gray-400 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-6`}>Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/history')} className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-slate-300/50 hover:bg-white/80'} backdrop-blur-sm border rounded-3xl p-6 transition-all duration-300 active:scale-95 group relative overflow-hidden shadow-lg`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl ${isDark ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-br from-purple-300/20 to-pink-300/20'}`}></div>
                  <div className="relative">
                    <div className={`w-14 h-14 ${isDark ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-purple-600 to-pink-600'} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <History className="w-7 h-7 text-white" />
                    </div>
                    <h4 className={`font-semibold text-sm mb-1 transition-colors ${isDark ? 'text-white group-hover:text-purple-300' : 'text-gray-800 group-hover:text-purple-600'}`}>Chat History</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>View conversations</p>
                    <div className="mt-3 flex justify-center">
                      <div className={`w-6 h-1 ${isDark ? 'bg-purple-500/30' : 'bg-purple-400/50'} rounded-full`}></div>
                    </div>
                  </div>
                </button>
                
                <button onClick={()=>navigate('/saved')} className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-slate-300/50 hover:bg-white/80'} backdrop-blur-sm border rounded-3xl p-6 transition-all duration-300 active:scale-95 group relative overflow-hidden shadow-lg`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl ${isDark ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10' : 'bg-gradient-to-br from-red-300/20 to-orange-300/20'}`}></div>
                  <div className="relative">
                    <div className={`w-14 h-14 ${isDark ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-red-600 to-orange-600'} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <h4 className={`font-semibold text-sm mb-1 transition-colors ${isDark ? 'text-white group-hover:text-red-300' : 'text-gray-800 group-hover:text-red-600'}`}>Saved</h4>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Favorite providers</p>
                    <div className="mt-3 flex justify-center">
                      <div className={`w-6 h-1 ${isDark ? 'bg-red-500/30' : 'bg-red-400/50'} rounded-full`}></div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </main>

          {/* Bottom Navigation */}
          <nav className={themeStyles.bottomNav}>
            <div className="flex items-center justify-around max-w-md mx-auto">
              <button className={themeStyles.navActiveButton}>
                <Home className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Home</span>
              </button>
              
              <button onClick={() => navigate('/chat')} className={themeStyles.navButton} aria-label="AI Search">
                <Search className={`w-6 h-6 transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`} />
                <span className={`text-xs transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`}>Search</span>
              </button>
              
              <button onClick={() => navigate('/history')} className={themeStyles.navButton}>
                <History className={`w-6 h-6 transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`} />
                <span className={`text-xs transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`}>History</span>
              </button>
              
              <button onClick={()=>navigate('/saved')} className={themeStyles.navButton}>
                <Heart className={`w-6 h-6 transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`} />
                <span className={`text-xs transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`}>Saved</span>
              </button>
              
              <button onClick={() => navigate('/profile')} className={themeStyles.navButton}>
                <User className={`w-6 h-6 transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`} />
                <span className={`text-xs transition-colors ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-slate-500 group-hover:text-gray-800'}`}>Profile</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;