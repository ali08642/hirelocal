import React from 'react';
import AdminLayout from './AdminLayout';
import KPICard from './KPICard';
import ChartCard from './ChartCard';
import ActivityFeed from './ActivityFeed';
import LineChart from './charts/LineChart';
import DonutChart from './charts/DonutChart';
import HeatMap from './charts/HeatMap';
import { useAdminTheme, themeClass } from './theme-config';
import { useTheme } from '../../theme/useTheme';
import { 
  Users, 
  Activity, 
  Zap, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { theme: globalTheme } = useTheme();
  const theme = useAdminTheme();
  const isDark = globalTheme === 'dark';

  // Mock data
  const kpiData = [
    {
      title: 'Total Users',
      value: '12,459',
      change: { value: 12.5, type: 'increase' as const },
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Active Sessions',
      value: '847',
      change: { value: 8.2, type: 'increase' as const },
      icon: Activity,
      color: 'green' as const
    },
    {
      title: 'API Calls Today',
      value: '23,891',
      change: { value: 3.1, type: 'decrease' as const },
      icon: Zap,
      color: 'purple' as const
    },
    {
      title: 'Top Category',
      value: 'Electricians',
      icon: TrendingUp,
      color: 'orange' as const
    }
  ];

  const usageData = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 150 },
    { label: 'Wed', value: 180 },
    { label: 'Thu', value: 140 },
    { label: 'Fri', value: 200 },
    { label: 'Sat', value: 160 },
    { label: 'Sun', value: 190 }
  ];

  const categoryData = [
    { label: 'Electricians', value: 35, color: '#3B82F6' },
    { label: 'Plumbers', value: 25, color: '#10B981' },
    { label: 'Contractors', value: 20, color: '#F59E0B' },
    { label: 'Cleaners', value: 12, color: '#EF4444' },
    { label: 'Others', value: 8, color: '#8B5CF6' }
  ];

  const geoData = [
    { x: 25, y: 40, value: 1250, location: 'New York' },
    { x: 60, y: 35, value: 980, location: 'Chicago' },
    { x: 80, y: 70, value: 1450, location: 'Los Angeles' },
    { x: 45, y: 55, value: 750, location: 'Houston' },
    { x: 35, y: 25, value: 650, location: 'Boston' },
    { x: 70, y: 45, value: 850, location: 'Denver' },
  ];

  const handleRefresh = () => {
    console.log('Refreshing dashboard data...');
  };

  return (
    <AdminLayout 
      currentPage="dashboard"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className={`text-3xl font-bold ${theme.primaryText}`}>
              Dashboard Overview
            </h1>
            <p className={`${theme.secondaryText} mt-1`}>
              Monitor your platform's performance and user activity
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* === DARK THEME REFRESH BUTTON === */}
            {isDark && (
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            )}
            
            {/* === LIGHT THEME REFRESH BUTTON === */}
            {!isDark && (
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-300 text-slate-700 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-sm shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            )}
            
            <div className={`text-xs ${theme.secondaryText}`}>
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              color={kpi.color}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Usage Over Time */}
          <ChartCard 
            title="Usage Over Time"
            isDark={isDark}
            actions={
              /* === DARK THEME SELECT === */
              isDark ? (
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="7d" className="bg-slate-800">Last 7 days</option>
                  <option value="30d" className="bg-slate-800">Last 30 days</option>
                  <option value="90d" className="bg-slate-800">Last 90 days</option>
                </select>
              ) : (
                /* === LIGHT THEME SELECT === */
                <select className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                  <option value="7d" className="bg-white">Last 7 days</option>
                  <option value="30d" className="bg-white">Last 30 days</option>
                  <option value="90d" className="bg-white">Last 90 days</option>
                </select>
              )
            }
          >
            <LineChart data={usageData} color="#3B82F6" isDark={isDark} />
          </ChartCard>

          {/* Popular Categories */}
          <ChartCard title="Popular Categories" isDark={isDark}>
            <DonutChart data={categoryData} isDark={isDark} />
          </ChartCard>
        </div>

        {/* Geographic Distribution and Activity Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Geographic Distribution */}
          <ChartCard 
            title="Geographic Distribution" 
            className="xl:col-span-2"
            isDark={isDark}
            actions={
              <button className={`${theme.accentText} hover:opacity-80 text-sm transition-colors`}>
                View Details
              </button>
            }
          >
            <HeatMap data={geoData} isDark={isDark} />
          </ChartCard>

          {/* Recent Activity Feed */}
          <ActivityFeed isDark={isDark} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;