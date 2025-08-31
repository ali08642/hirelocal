import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles, Wrench } from 'lucide-react';

const ComingSoonScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-40 min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Wrench className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium tracking-wide">UNDER DEVELOPMENT</span>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Coming</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Soon
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
            This feature is currently being crafted with care. We're working hard to bring you an amazing experience.
          </p>

          {/* Feature Preview */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
            <h3 className="text-white font-semibold text-lg mb-3">What's Coming:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Enhanced User Experience</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Advanced Features</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Seamless Integration</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Performance Optimizations</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Go Back
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonScreen;
