import React, { useState } from 'react';
import { Search, X, Menu, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/useTheme';

interface NavbarProps {
  showCreateAccount?: boolean;
  currentPage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showCreateAccount = true, 
  currentPage = 'home'
}) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        {/* === DARK THEME NAVBAR CONTAINER === */}
        {isDark && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-lg transition-all duration-500">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white transition-all duration-300 group-hover:text-blue-400">HireLocalGPT</span>
                </button>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-4 py-3 shadow-lg transition-all duration-500 hover:bg-white/8">
                <button 
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-8 py-2.5 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                    currentPage === 'home' 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 scale-105' 
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="relative z-10">Home</span>
                </button>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className={`px-8 py-2.5 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                    currentPage === 'how-it-works' 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 scale-105' 
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="relative z-10">How it Works</span>
                </button>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="px-8 py-2.5 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:shadow-md hover:scale-105 rounded-full transition-all duration-300 font-medium relative overflow-hidden"
                >
                  <span className="relative z-10">Contact Us</span>
                </button>
              </div>

              {/* Right Side Actions */}
              <div className="hidden lg:flex items-center space-x-6">
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white px-6 py-2.5 rounded-lg hover:bg-white/10 hover:shadow-md transition-all duration-300 font-medium hover:scale-105"
                >
                  Sign In
                </button>
                {showCreateAccount && (
                  <button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-white/10 hover:bg-white/20 border border-blue-400/20 text-white backdrop-blur-sm px-8 py-2.5 rounded-full transition-all duration-300 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-0.5"
                  >
                    <span>Get Started</span>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden text-white hover:bg-white/10 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
              >
                <div className="relative">
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 transform rotate-90 transition-transform duration-300" />
                  ) : (
                    <Menu className="w-6 h-6 transform transition-transform duration-300" />
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-6 pt-6 border-t border-white/10 transition-all duration-500">
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md ${
                      currentPage === 'home' 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      navigate('/how-it-works');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md ${
                      currentPage === 'how-it-works' 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500'
                    }`}
                  >
                    How it Works
                  </button>
                  <button 
                    onClick={() => {navigate('/contact'); setIsMobileMenuOpen(false);}} 
                    className="text-left px-6 py-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                  >
                    Contact Us
                  </button>
                  
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <button 
                      onClick={toggleTheme}
                      className="w-full flex items-center px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md space-x-3"
                    >
                      {isDark ? (
                        <>
                          <Sun className="w-5 h-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-6 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                    >
                      Sign In
                    </button>
                    {showCreateAccount && (
                      <button 
                        onClick={() => {
                          navigate('/auth');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-white/10 hover:bg-white/20 border border-blue-400/20 text-white backdrop-blur-sm px-6 py-4 rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <span>Get Started</span>
                        <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === LIGHT THEME NAVBAR CONTAINER (GRAYISH METALLIC) === */}
        {!isDark && (
          <div className="bg-gradient-to-r from-gray-100/90 via-slate-200/85 to-gray-100/90 backdrop-blur-xl border border-gray-400/30 rounded-2xl px-6 py-4 shadow-2xl shadow-gray-500/40 transition-all duration-500 relative overflow-hidden">
            {/* Metallic shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-slate-300/20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-gray-200/30 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center justify-between relative z-10">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-gray-400/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-slate-700">HireLocalGPT</span>
                </button>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden lg:flex items-center bg-gray-200/60 backdrop-blur-lg border border-gray-300/60 rounded-full px-4 py-3 shadow-lg shadow-gray-400/20 transition-all duration-500 hover:bg-gray-100/70 hover:shadow-xl">
                <button 
                  onClick={() => {
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-8 py-2.5 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                    currentPage === 'home' 
                      ? 'text-white bg-gradient-to-r from-slate-600 to-gray-700 shadow-lg shadow-slate-500/40 scale-105' 
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-gray-600 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="relative z-10">Home</span>
                </button>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className={`px-8 py-2.5 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                    currentPage === 'how-it-works' 
                      ? 'text-white bg-gradient-to-r from-slate-600 to-gray-700 shadow-lg shadow-slate-500/40 scale-105' 
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-gray-600 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="relative z-10">How it Works</span>
                </button>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="px-8 py-2.5 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-gray-600 hover:shadow-md hover:scale-105 rounded-full transition-all duration-300 font-medium relative overflow-hidden"
                >
                  <span className="relative z-10">Contact Us</span>
                </button>
              </div>

              {/* Right Side Actions */}
              <div className="hidden lg:flex items-center space-x-6">
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 rounded-lg bg-gray-200/60 hover:bg-gray-300/70 border border-gray-300/60 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:shadow-md"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-gray-900 px-6 py-2.5 rounded-lg hover:bg-gray-200/70 hover:shadow-md transition-all duration-300 font-medium hover:scale-105"
                >
                  Sign In
                </button>
                {showCreateAccount && (
                  <button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white backdrop-blur-sm border border-slate-400/30 px-8 py-2.5 rounded-full transition-all duration-300 font-semibold flex items-center space-x-2 shadow-lg shadow-slate-500/30 hover:shadow-xl hover:shadow-slate-500/50 transform hover:scale-110 hover:-translate-y-0.5"
                  >
                    <span>Get Started</span>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden text-gray-800 hover:bg-gray-200/70 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
              >
                <div className="relative">
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 transform rotate-90 transition-transform duration-300" />
                  ) : (
                    <Menu className="w-6 h-6 transform transition-transform duration-300" />
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-400/30 transition-all duration-500 relative z-10">
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => {
                      navigate('/');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md ${
                      currentPage === 'home' 
                        ? 'text-white bg-gradient-to-r from-slate-600 to-gray-700 shadow-lg shadow-slate-500/40' 
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-gray-600'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      navigate('/how-it-works');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left px-6 py-4 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md ${
                      currentPage === 'how-it-works' 
                        ? 'text-white bg-gradient-to-r from-slate-600 to-gray-700 shadow-lg shadow-slate-500/40' 
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-gray-600'
                    }`}
                  >
                    How it Works
                  </button>
                  <button 
                    onClick={() => {navigate('/contact'); setIsMobileMenuOpen(false);}} 
                    className="text-left px-6 py-4 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-slate-500 hover:to-gray-600 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                  >
                    Contact Us
                  </button>
                  
                  <div className="pt-6 border-t border-gray-400/30 space-y-4">
                    <button 
                      onClick={toggleTheme}
                      className="w-full flex items-center px-6 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-200/70 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md space-x-3"
                    >
                      {isDark ? (
                        <>
                          <Sun className="w-5 h-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-6 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-200/70 rounded-xl transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                    >
                      Sign In
                    </button>
                    {showCreateAccount && (
                      <button 
                        onClick={() => {
                          navigate('/auth');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white backdrop-blur-sm border border-slate-400/30 px-6 py-4 rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-lg hover:shadow-slate-500/40 flex items-center justify-center space-x-2"
                      >
                        <span>Get Started</span>
                        <div className="w-2 h-2 bg-white/70 rounded-full animate-ping" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;