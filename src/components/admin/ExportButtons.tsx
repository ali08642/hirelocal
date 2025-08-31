import React from 'react';
import { Download, FileText, Table, File } from 'lucide-react';

interface ExportButtonsProps {
  onExport: (format: 'pdf' | 'csv' | 'excel') => void;
  className?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ onExport, className = '' }) => {
  const exportOptions = [
    { format: 'pdf' as const, label: 'PDF', icon: FileText, color: 'from-red-500 to-red-600' },
    { format: 'csv' as const, label: 'CSV', icon: Table, color: 'from-green-500 to-green-600' },
    { format: 'excel' as const, label: 'Excel', icon: File, color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-gray-400 text-sm mr-2 hidden sm:block">Export:</span>
      {exportOptions.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.format}
            onClick={() => onExport(option.format)}
            className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${option.color} text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm hover:scale-105`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
      <button className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm">
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">All</span>
      </button>
    </div>
  );
};

export default ExportButtons;
