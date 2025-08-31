import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Shield, BarChart3, Users, Settings, Database } from 'lucide-react';

const AdminComingSoonScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-pink-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-40 min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/admin')}
            className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium tracking-wide">ADMIN FEATURE UNDER DEVELOPMENT</span>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Admin Tools</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
            Advanced administration features are being developed. These powerful tools will enhance your management capabilities.
          </p>

          {/* Feature Preview */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Upcoming Admin Features:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <span>User Management & Roles</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-400" />
                </div>
                <span>System Configuration</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-orange-400" />
                </div>
                <span>Data Management Tools</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Back to Admin Dashboard
            </button>
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComingSoonScreen;
