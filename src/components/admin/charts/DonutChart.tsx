import React from 'react';
import { themeClass } from '../theme-config';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  isDark?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, isDark = true }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 max-w-full max-h-full overflow-hidden">
      <div className="relative w-48 h-48 max-w-full max-h-[70%] flex-shrink-0">
        {/* SVG Chart */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* === DARK THEME CHART === */}
          {isDark && (
            <>
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="16"
              />
              
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage * 4.4} 440`;
                const strokeDashoffset = -currentAngle * 4.4;
                currentAngle += percentage;
                
                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="16"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                    strokeLinecap="round"
                  />
                );
              })}
            </>
          )}
          
          {/* === LIGHT THEME CHART === */}
          {!isDark && (
            <>
              <defs>
                <filter id="donutShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)"/>
                </filter>
              </defs>
              
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="rgba(148,163,184,0.3)"
                strokeWidth="16"
              />
              
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage * 4.4} 440`;
                const strokeDashoffset = -currentAngle * 4.4;
                currentAngle += percentage;
                
                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="16"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                    strokeLinecap="round"
                    filter="url(#donutShadow)"
                  />
                );
              })}
            </>
          )}
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-xl font-bold ${themeClass(isDark, 'text-white', 'text-slate-800')}`}>
              {total}
            </div>
            <div className={`text-xs ${themeClass(isDark, 'text-gray-400', 'text-slate-600')}`}>
              Total
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 w-full max-w-full">
        <div className="grid grid-cols-2 gap-2 text-center">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 min-w-0">
              <div 
                className={`w-2 h-2 rounded-full flex-shrink-0 ${!isDark ? 'shadow-sm' : ''}`}
                style={{ backgroundColor: item.color }}
              />
              <span className={`text-xs ${themeClass(isDark, 'text-gray-400', 'text-slate-600')} truncate`}>
                {item.label} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;