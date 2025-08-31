
import { useTheme } from '../../theme/useTheme';

// Helper function to get theme styles using global theme
export const useAdminTheme = () => {
  const { theme } = useTheme();
  return getThemeStyles(theme === 'dark');
};

// Basic helper for direct theme style access when hooks can't be used
export const getThemeStyles = (isDark: boolean) => isDark ? themeConfig.dark : themeConfig.light;

// Utility function for conditional theme classes
export const themeClass = (isDark: boolean, darkClass: string, lightClass: string) => 
  isDark ? darkClass : lightClass;
// Theme configuration object for easy maintenance and clear separation
// Theme configuration object for easy maintenance and clear separation
export const themeConfig = {
  // === DARK THEME (EXISTING) ===
  dark: {
    // Layout backgrounds
    mainBackground: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    sidebarBackground: 'bg-black/40 backdrop-blur-xl',
    headerBackground: 'bg-black/40 backdrop-blur-xl',
    
    // Card styles
    cardBackground: 'bg-white/5 backdrop-blur-sm',
    cardBorder: 'border-white/10',
    cardHover: 'hover:bg-white/8',
    
    // Text colors
    primaryText: 'text-white',
    secondaryText: 'text-gray-400',
    accentText: 'text-blue-400',
    
    // Interactive elements
    buttonHover: 'hover:bg-white/10',
    activeBg: 'bg-white/20',
    dropdownBg: 'bg-black/95 backdrop-blur-xl',
    
    // Borders and dividers
    border: 'border-white/10',
    divider: 'border-white/5',
    
    // Focus states
    focusRing: 'focus:ring-purple-500 focus:ring-offset-slate-800',
    
    // Gradients for icons
    iconGradients: {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
    }
  },
  
  // === LIGHT THEME (NEW SILVER METALLIC) ===
  light: {
    // Layout backgrounds - Enhanced silver metallic gradient with shimmer effect
    mainBackground: 'bg-gradient-to-br from-slate-200 via-gray-300 via-slate-250 to-gray-400 bg-[length:200%_200%] animate-[shimmer_8s_ease-in-out_infinite]',
    sidebarBackground: 'bg-gradient-to-b from-white/95 via-slate-100/90 to-gray-200/85 backdrop-blur-xl shadow-2xl shadow-slate-500/25 border-r border-slate-300/50',
    headerBackground: 'bg-gradient-to-r from-white/85 via-slate-50/80 to-white/85 backdrop-blur-xl shadow-lg shadow-slate-400/30',
    
    // Card styles - Elevated metallic cards
    cardBackground: 'bg-gradient-to-br from-white to-slate-50 shadow-lg shadow-slate-300/40',
    cardBorder: 'border-slate-200',
    cardHover: 'hover:shadow-xl hover:shadow-slate-400/30 hover:from-slate-50 hover:to-white',
    
    // Text colors - High contrast for readability
    primaryText: 'text-slate-800',
    secondaryText: 'text-slate-600',
    accentText: 'text-blue-600',
    
    // Interactive elements
    buttonHover: 'hover:bg-slate-100/70',
    activeBg: 'bg-slate-200/60 shadow-inner',
    dropdownBg: 'bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-300/30',
    
    // Borders and dividers
    border: 'border-slate-200',
    divider: 'border-slate-100',
    
    // Focus states
    focusRing: 'focus:ring-blue-500 focus:ring-offset-white',
    
    // Gradients for icons - Metallic tones
    iconGradients: {
      blue: 'from-blue-500 to-blue-600 shadow-md',
      green: 'from-emerald-500 to-emerald-600 shadow-md',
      purple: 'from-violet-500 to-violet-600 shadow-md',
      orange: 'from-amber-500 to-amber-600 shadow-md',
      red: 'from-red-500 to-red-600 shadow-md',
    }
  }
};
