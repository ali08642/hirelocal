/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/**/*.css'],
  safelist: [
    'glass-surface',
    'interactive-element',
    'message-bubble',
    'bg-white',
    'bg-gray-800',
    'dark:bg-gray-800',
    'text-gray-900',
    'text-white',
    'dark:text-white',
    'border-gray-200',
    'dark:border-gray-700',
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme
        light: {
          bg: {
            primary: '#ffffff',
            secondary: '#f8fafc',
            tertiary: '#f1f5f9',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            muted: '#64748b',
          },
          border: {
            light: 'rgba(0,0,0,0.08)',
            medium: 'rgba(0,0,0,0.12)',
          },
          glass: {
            surface: 'rgba(255,255,255,0.9)',
            effect: 'rgba(255,255,255,0.7)',
          },
        },
        // Dark Theme
        dark: {
          bg: {
            primary: '#000000',
            secondary: '#050a12',
            tertiary: '#0b111a',
          },
          text: {
            primary: '#ffffff',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          },
          border: {
            light: 'rgba(255,255,255,0.12)',
            medium: 'rgba(255,255,255,0.2)',
          },
          glass: {
            surface: 'rgba(255,255,255,0.05)',
            effect: 'rgba(255,255,255,0.08)',
          },
        },
        // Semantic Colors
        accent: {
          light: '#2563eb',
          DEFAULT: '#3b82f6',
          dark: '#60a5fa',
        },
        success: {
          light: '#10b981',
          DEFAULT: '#22c55e',
          dark: '#34d399',
        },
        warning: {
          light: '#f59e0b',
          DEFAULT: '#fbbf24',
          dark: '#fcd34d',
        },
        error: {
          light: '#ef4444',
          DEFAULT: '#f87171',
          dark: '#fca5a5',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        glass: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass-dark': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 12px -2px rgba(0, 0, 0, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.08)',
        'glass-hover-dark': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 12px -2px rgba(0, 0, 0, 0.3), 0 4px 8px -2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#c7ddff',
          300: '#9ec5ff',
          400: '#6da3ff',
          500: '#1a73e8',
          600: '#1557b0',
          700: '#124491',
          800: '#0f3978',
          900: '#0d2f64',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};
