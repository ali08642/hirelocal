import React from 'react';
import { Users, MessageCircle, Star, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import GlassCard from './shared/GlassCard';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const stats = [
    { label: 'Total Users', value: '2,847', icon: Users, change: '+12%' },
    { label: 'Active Chats', value: '543', icon: MessageCircle, change: '+8%' },
    { label: 'Avg Rating', value: '4.7', icon: Star, change: '+0.3' },
    { label: 'Revenue', value: '$12,450', icon: DollarSign, change: '+18%' },
  ];

  const recentActivity = [
    { action: 'New user registration', user: 'John Doe', time: '2 min ago' },
    { action: 'Service completed', user: 'PlumberPro', time: '5 min ago' },
    { action: 'Payment received', user: 'Alice Smith', time: '8 min ago' },
    { action: 'New service provider', user: 'ElectricianExpert', time: '12 min ago' },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-blue-200">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <GlassCard key={index} variant="premium" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-blue-400" />
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-blue-200 text-sm">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Charts Section */}
      <GlassCard className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-end justify-center">
          <div className="text-blue-200 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chart visualization would go here</p>
          </div>
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-blue-200 text-sm">{activity.user}</p>
              </div>
              <span className="text-blue-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;
