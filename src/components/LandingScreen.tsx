import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Shield, Clock, Users, Star, Wrench, Droplets, Plug, Brush, Paintbrush2, Move3D } from 'lucide-react';
import Navbar from './shared/Navbar';

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();

  const onGetStarted = () => {
    navigate('/auth');
  };
  const floatingElements = [
    { name: 'Plumber Pro', rating: '4.9', position: 'top-20 left-20', delay: '0s' },
    { name: 'ElectricExpert', rating: '4.8', position: 'top-32 right-32', delay: '2s' },
    { name: 'CleanMaster', rating: '4.7', position: 'bottom-40 left-16', delay: '4s' },
    { name: 'HandyHelper', rating: '4.9', position: 'bottom-20 right-20', delay: '1s' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden transition-colors duration-300">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
      <div className="relative z-[60]"> {/* Ensure toggle is visible above grid */}</div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-white to-gray-100/50 dark:from-gray-900/50 dark:via-black dark:to-gray-900/50"></div>
      
      {/* Large Gradient Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl dark:from-blue-500/20 dark:to-purple-600/20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl dark:from-green-500/20 dark:to-blue-600/20"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl dark:from-purple-500/10 dark:to-pink-600/10"></div>

      {/* Navigation */}
      <Navbar 
        showCreateAccount={true} 
        currentPage="home"
      />

      {/* Admin Test Button */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => navigate('/admin')}
          className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white px-4 py-2 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-2">
            <span className="text-sm">Admin</span>
            <div className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/30">
              TEST
            </div>
          </div>
        </button>
      </div>

      {/* Floating Service Provider Cards */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute ${element.position} hidden lg:block animate-float`}
          style={{
            animationDelay: element.delay,
            animationDuration: '6s',
            animationIterationCount: 'infinite'
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <p className="text-white text-sm font-medium">{element.name}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-gray-300 text-xs">{element.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Main Content - Reduced top padding and spacing */}
      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
            
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#222] dark:text-white leading-tight">
            <span>One-click for Service</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Excellence
            </span>
          </h1>

          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 text-[#333] dark:text-gray-300">
            Dive into the art of services, where innovative technology meets professional expertise
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-10 px-4 sm:px-0">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Open App →
            </button>
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200/80 dark:hover:bg-white/20 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              <span>Discover More</span>
            </button>
          </div>

          {/* Service Categories - Reduced margin and optimized for viewport */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-6">
            {[{
              label:'Plumbing', icon:Droplets, gradient:'from-cyan-500 to-blue-600'
            },{
              label:'Electrical', icon:Plug, gradient:'from-amber-500 to-orange-600'
            },{
              label:'Cleaning', icon:Brush, gradient:'from-emerald-500 to-teal-600'
            },{
              label:'Handyman', icon:Wrench, gradient:'from-indigo-500 to-purple-600'
            },{
              label:'Painting', icon:Paintbrush2, gradient:'from-pink-500 to-rose-600'
            },{
              label:'Moving', icon:Move3D, gradient:'from-violet-500 to-fuchsia-600'
            }].map(item => (
              <button
                key={item.label}
                onClick={onGetStarted}
                className="group relative bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_65%)] transition-opacity" />
                <div className={`w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 mx-auto rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-110 group-active:scale-95 transition-transform`}>
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <p className="text-gray-900 dark:text-white text-xs sm:text-sm font-medium tracking-wide">{item.label}</p>
                <div className="mt-2 h-px w-8 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Admin Portal Link */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => navigate('/admin/login')}
          className="text-slate-500 hover:text-slate-700 dark:text-gray-500 dark:hover:text-gray-300 text-xs transition-colors"
        >
          Admin Portal
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;