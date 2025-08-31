import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'premium' | 'elevated';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl backdrop-blur-lg';
      case 'elevated':
        return 'bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-2xl backdrop-blur-lg';
      default:
        return 'bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-xl backdrop-blur-lg';
    }
  };

  const hoverStyles = hover ? 'hover:shadow-lg dark:hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300' : '';

  return (
    <div
      className={`
        ${getVariantStyles()}
        ${hoverStyles}
        rounded-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
