import React from 'react';
import { getThemeStyles } from './theme-config';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  isDark?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className = '',
  actions,
  isDark = true
}) => {
  const theme = getThemeStyles(isDark);

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.cardHover} transition-all duration-300 relative z-1 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme.primaryText}`}>{title}</h3>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div className="h-80 relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;