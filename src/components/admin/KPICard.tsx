import React from 'react';
// import { LucideIcon } from 'lucide-react'; // Mock for demo
import { getThemeStyles, themeClass } from './theme-config';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  isDark?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  isDark = true
}) => {
  const theme = getThemeStyles(isDark);

  const changeColorClass = change?.type === 'increase' 
    ? themeClass(isDark, 'text-green-400', 'text-green-600') 
    : themeClass(isDark, 'text-red-400', 'text-red-600');
  const changeIcon = change?.type === 'increase' ? '↗' : '↘';

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.cardHover} transition-all duration-300 group relative z-1`}>
      <div className="flex items-center justify-between mb-4">
        {/* === DARK THEME ICON === */}
        {isDark && (
          <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconGradients[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        
        {/* === LIGHT THEME ICON === */}
        {!isDark && (
          <div className={`w-12 h-12 bg-gradient-to-br ${theme.iconGradients[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${changeColorClass} ${themeClass(isDark, 'bg-white/5', 'bg-slate-100/70')} px-2 py-1 rounded-lg`}>
            <span>{changeIcon}</span>
            <span>{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className={`text-2xl lg:text-3xl font-bold ${theme.primaryText}`}>{value}</h3>
        <p className={`${theme.secondaryText} text-sm`}>{title}</p>
      </div>
    </div>
  );
};

export default KPICard;