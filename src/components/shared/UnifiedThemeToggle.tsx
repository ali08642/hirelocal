import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';

const UnifiedThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[100] p-3 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/20 dark:from-indigo-900/40 dark:to-purple-900/30 backdrop-blur-lg border border-yellow-300/30 dark:border-indigo-400/20 shadow-xl hover:from-yellow-400/40 hover:to-orange-400/30 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/40 transition-all duration-300 group text-yellow-600 dark:text-indigo-300 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-gray-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      )}
    </button>
  );
};

export default UnifiedThemeToggle;
