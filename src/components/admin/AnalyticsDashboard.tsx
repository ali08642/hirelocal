import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ChartCard from './ChartCard';
import TimeRangeSelector from './TimeRangeSelector';
import ExportButtons from './ExportButtons';
import LineChart from './charts/LineChart';
import DonutChart from './charts/DonutChart';
import HeatMap from './charts/HeatMap';
import { 
  TrendingUp, 
  Clock, 
  Zap,
  DollarSign,
  CheckCircle
} from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for different metrics
  const tokenUsageData = [
    { label: 'Week 1', value: 15000 },
    { label: 'Week 2', value: 18000 },
    { label: 'Week 3', value: 22000 },
    { label: 'Week 4', value: 19000 },
  ];

  const userEngagementData = [
    { label: 'Active Users', value: 68, color: '#3B82F6' },
    { label: 'New Users', value: 22, color: '#10B981' },
    { label: 'Returning Users', value: 10, color: '#F59E0B' },
  ];

  const searchVolumeData = [
    { label: 'Mon', value: 320 },
    { label: 'Tue', value: 450 },
    { label: 'Wed', value: 380 },
    { label: 'Thu', value: 520 },
    { label: 'Fri', value: 610 },
    { label: 'Sat', value: 480 },
    { label: 'Sun', value: 390 },
  ];

  const categoryPopularityData = [
    { label: 'Electricians', value: 420, color: '#3B82F6' },
    { label: 'Plumbers', value: 350, color: '#10B981' },
    { label: 'Contractors', value: 280, color: '#F59E0B' },
    { label: 'Cleaners', value: 190, color: '#EF4444' },
    { label: 'Landscapers', value: 160, color: '#8B5CF6' },
  ];

  const responseTimeData = [
    { label: '00:00', value: 1.2 },
    { label: '04:00', value: 0.8 },
    { label: '08:00', value: 2.1 },
    { label: '12:00', value: 2.8 },
    { label: '16:00', value: 3.2 },
    { label: '20:00', value: 2.4 },
  ];

  const peakHoursData = [
    { x: 25, y: 30, value: 850, location: '9-10 AM' },
    { x: 40, y: 45, value: 1200, location: '12-1 PM' },
    { x: 60, y: 35, value: 950, location: '3-4 PM' },
    { x: 75, y: 50, value: 1100, location: '6-7 PM' },
    { x: 30, y: 60, value: 720, location: '8-9 PM' },
  ];

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting analytics data as ${format}`);
    // Implement export logic
  };

  const metricsCards = [
    {
      title: 'Token Usage',
      value: '74,231',
      change: '+12.5%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Avg Response Time',
      value: '2.3s',
      change: '-0.4s',
      icon: Clock,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Revenue Impact',
      value: '$12,450',
      change: '+18.7%',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-8">
        {/* Header with Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Deep insights into platform performance and user behavior</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <TimeRangeSelector 
              value={timeRange} 
              onChange={setTimeRange}
            />
            <ExportButtons onExport={handleExport} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metricsCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-lg">
                    {metric.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">{metric.value}</h3>
                  <p className="text-gray-400 text-sm">{metric.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Token Usage and User Engagement */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ChartCard 
            title="Token Usage Trends"
            className="xl:col-span-2"
            actions={
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Current month:</span>
                <span className="text-white font-semibold">74,231 tokens</span>
              </div>
            }
          >
            <LineChart data={tokenUsageData} color="#F59E0B" />
          </ChartCard>

          <ChartCard title="User Engagement">
            <DonutChart data={userEngagementData} />
          </ChartCard>
        </div>

        {/* Search Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard 
            title="Search Volume Trends"
            actions={
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+15.2%</span>
              </div>
            }
          >
            <LineChart data={searchVolumeData} color="#10B981" />
          </ChartCard>

          <ChartCard title="Category Popularity">
            <DonutChart data={categoryPopularityData} />
          </ChartCard>
        </div>

        {/* Performance and Peak Hours */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard 
            title="Response Times"
            actions={
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">Avg: 2.3s</span>
              </div>
            }
          >
            <LineChart data={responseTimeData} color="#3B82F6" />
          </ChartCard>

          <ChartCard 
            title="Peak Usage Hours"
            actions={
              <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                View Detailed Report
              </button>
            }
          >
            <HeatMap data={peakHoursData} />
          </ChartCard>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-lg font-semibold text-white">Detailed Metrics</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors self-start sm:self-auto">
              Export Full Report
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-gray-400 font-medium">Metric</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Current</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Previous</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Change</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">Daily Active Users</td>
                  <td className="py-3 text-white">8,459</td>
                  <td className="py-3 text-gray-400">7,831</td>
                  <td className="py-3 text-green-400 font-medium">+8.0%</td>
                  <td className="py-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">Search Success Rate</td>
                  <td className="py-3 text-white">94.2%</td>
                  <td className="py-3 text-gray-400">92.1%</td>
                  <td className="py-3 text-green-400 font-medium">+2.1%</td>
                  <td className="py-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">API Calls per User</td>
                  <td className="py-3 text-white">12.3</td>
                  <td className="py-3 text-gray-400">11.8</td>
                  <td className="py-3 text-green-400 font-medium">+4.2%</td>
                  <td className="py-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">Provider Response Rate</td>
                  <td className="py-3 text-white">87.5%</td>
                  <td className="py-3 text-gray-400">89.2%</td>
                  <td className="py-3 text-red-400 font-medium">-1.7%</td>
                  <td className="py-3">
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
