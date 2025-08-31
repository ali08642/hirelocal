import React, { useState } from 'react';
import { Shield, Search, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import { UnifiedThemeToggle } from '../shared';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      if (formData.email === 'admin@servicegpt.com' && formData.password === 'admin123') {
        alert('Login successful! (Demo)');
        navigate('/admin');
      } else {
        alert('Invalid credentials. Use admin@servicegpt.com / admin123');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Theme toggle is now handled by UnifiedThemeToggle component

  // ============================================
  // DARK THEME (EXISTING - UNTOUCHED)
  // ============================================
  if (theme === 'dark') {
    return (
      <>
        <UnifiedThemeToggle />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative w-full max-w-md">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">ServiceGPT</div>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
              </div>
              <p className="text-gray-400 text-sm">Secure access to administrative dashboard</p>
            </div>

            {/* Login Form */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="admin@servicegpt.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/5 border-white/10"
                    />
                    <label className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Sign in to Admin Portal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-blue-400 text-sm font-medium mb-2">Demo Credentials:</div>
                <div className="text-gray-300 text-sm">
                  <div>Email: admin@servicegpt.com</div>
                  <div>Password: admin123</div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Protected by enterprise-grade security
                </p>
              </div>
            </div>

            {/* Back to Main Site */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate('/', { replace: true })}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ← Back to main site
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // LIGHT THEME (NEW SILVER METALLIC)
  // ============================================
  return (
    <>
      <UnifiedThemeToggle />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 flex items-center justify-center p-4">
        {/* Light Theme Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-300/40 to-gray-400/30"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Light Theme Metallic Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-40"></div>

        <div className="relative w-full max-w-md">
          {/* Light Theme Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800 rounded-xl flex items-center justify-center shadow-2xl border border-gray-300">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-800 drop-shadow-sm">ServiceGPT</div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-slate-600" />
              <h1 className="text-xl font-semibold text-slate-800">Admin Portal</h1>
            </div>
            <p className="text-slate-600 text-sm">Secure access to administrative dashboard</p>
          </div>

          {/* Light Theme Login Form */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-300/60 rounded-2xl p-8 shadow-2xl relative">
            {/* Light Theme Metallic Inner Border */}
            <div className="absolute inset-0 rounded-2xl border border-gray-400/30 pointer-events-none"></div>
            
            <div className="space-y-6 relative">
              {/* Light Theme Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-300/80 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all shadow-inner"
                    placeholder="admin@servicegpt.com"
                  />
                </div>
              </div>

              {/* Light Theme Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50/80 border border-gray-300/80 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all shadow-inner"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Light Theme Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-400 rounded bg-gray-50"
                  />
                  <label className="ml-2 block text-sm text-slate-600">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-slate-600 hover:text-slate-800 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Light Theme Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 hover:from-slate-600 hover:via-gray-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-600/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Sign in to Admin Portal</span>
                  </>
                )}
              </button>
            </div>

            {/* Light Theme Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-100/60 border border-slate-300/60 rounded-lg shadow-inner">
              <div className="text-slate-700 text-sm font-medium mb-2">Demo Credentials:</div>
              <div className="text-slate-600 text-sm">
                <div>Email: admin@servicegpt.com</div>
                <div>Password: admin123</div>
              </div>
            </div>

            {/* Light Theme Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Protected by enterprise-grade security
              </p>
            </div>
          </div>

          {/* Light Theme Back to Main Site */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="text-slate-600 hover:text-slate-800 text-sm transition-colors font-medium"
            >
              ← Back to main site
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// No default export needed as we're using named export