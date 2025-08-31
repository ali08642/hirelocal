import React from 'react';
import { themeClass } from '../theme-config';

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  isDark?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  color = '#3B82F6',
  isDark = true
}) => {
  // Mock implementation - in real app, use Chart.js, Recharts, or similar
  console.log('Chart data:', data); // Temporary to avoid unused warning
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* === DARK THEME CHART === */}
        {isDark && (
          <>
            {/* Mock Chart Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent rounded-lg"></div>
            
            {/* Mock Chart Line */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="darkLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <line key={i} x1={i * 60} y1="0" x2={i * 60} y2="200" />
                ))}
              </g>
              
              {/* Mock Data Line */}
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,150 60,120 120,80 180,100 240,60 300,90 360,40"
              />
              
              {/* Data Points */}
              {[0, 60, 120, 180, 240, 300, 360].map((x, i) => {
                const y = [150, 120, 80, 100, 60, 90, 40][i];
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={color}
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                );
              })}
            </svg>
            
            {/* Mock Legend */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-400">
              Usage Trend (↗ 12.5%)
            </div>
          </>
        )}
        
        {/* === LIGHT THEME CHART === */}
        {!isDark && (
          <>
            {/* Mock Chart Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-100/30 to-transparent rounded-lg"></div>
            
            {/* Mock Chart Line */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="lightLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.6" />
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.1)"/>
                </filter>
              </defs>
              
              {/* Grid Lines */}
              <g stroke="rgba(100,116,139,0.2)" strokeWidth="1">
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} />
                ))}
                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                  <line key={i} x1={i * 60} y1="0" x2={i * 60} y2="200" />
                ))}
              </g>
              
              {/* Mock Data Line */}
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,150 60,120 120,80 180,100 240,60 300,90 360,40"
                filter="url(#shadow)"
              />
              
              {/* Data Points */}
              {[0, 60, 120, 180, 240, 300, 360].map((x, i) => {
                const y = [150, 120, 80, 100, 60, 90, 40][i];
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={color}
                    filter="url(#shadow)"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                );
              })}
            </svg>
            
            {/* Mock Legend */}
            <div className="absolute bottom-2 left-2 text-xs text-slate-600">
              Usage Trend (↗ 12.5%)
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LineChart;