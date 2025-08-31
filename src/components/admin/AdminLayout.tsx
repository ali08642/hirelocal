import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Building2, 
  Search, 
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getThemeStyles, themeClass } from './theme-config';
import UnifiedThemeToggle from '../shared/UnifiedThemeToggle';
import { useTheme } from '../../theme/useTheme';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  currentPage
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const { theme: globalTheme } = useTheme();
  const isDark = globalTheme === 'dark';
  const theme = getThemeStyles(isDark);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', badge: 3 },
    { id: 'search-logs', label: 'Search Logs', icon: Search, path: '/admin/search-logs' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const notifications = [
    { id: 1, message: 'New user registration', time: '2 minutes ago', type: 'info' },
    { id: 2, message: 'High API usage detected', time: '5 minutes ago', type: 'warning' },
    { id: 3, message: 'Provider verification pending', time: '10 minutes ago', type: 'info' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout button clicked!');
    setIsLoggingOut(true);
    
    // Clear any stored authentication data
    // Note: In actual implementation, avoid localStorage in artifacts
    setTimeout(() => {
      setIsLoggingOut(false);
      console.log('Navigating to login page');
      navigate('/admin/login');
    }, 500);
  };

  return (
    <div className={theme.mainBackground + " min-h-screen"}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className={`flex h-full flex-col ${theme.sidebarBackground} ${theme.border} border-r`}>
          {/* === DARK THEME LOGO === */}
          {isDark && (
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Admin Portal</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-white/10 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* === LIGHT THEME LOGO === */}
          {!isDark && (
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800">Admin Portal</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-700 hover:bg-slate-100 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={
                    /* === DARK THEME MENU ITEM === */
                    isDark ? `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }` :
                    /* === LIGHT THEME MENU ITEM === */
                    `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-200/80 text-slate-800 shadow-lg shadow-slate-300/30'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={themeClass(isDark, 
                      "bg-red-500 text-white text-xs px-2 py-1 rounded-full",
                      "bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-sm"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t ${theme.border}`}>
            <div className={`text-xs ${theme.secondaryText} text-center`}>
              HireLocalGPT Admin v2.0
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className={`${theme.headerBackground} ${theme.border} border-b px-4 lg:px-6 py-4 relative z-[200] pointer-events-auto`}>
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden ${theme.primaryText} ${theme.buttonHover} p-2 rounded-lg`}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <div className="hidden lg:block">
              <h1 className={`text-xl font-semibold ${theme.primaryText} capitalize`}>
                {currentPage.replace('-', ' ')}
              </h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <UnifiedThemeToggle />              {/* Notifications */}
              <div className="relative z-[210] pointer-events-auto">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative ${theme.primaryText} ${theme.buttonHover} p-2 rounded-lg transition-colors`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className={`absolute right-0 mt-2 w-80 ${theme.dropdownBg} ${theme.border} border rounded-xl shadow-2xl z-[230]`} onClick={(e)=>e.stopPropagation()}>
                    <div className={`p-4 border-b ${theme.border}`}>
                      <h3 className={`${theme.primaryText} font-semibold`}>Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b ${theme.divider} ${themeClass(isDark, 'hover:bg-white/5', 'hover:bg-slate-50')}`}>
                          <p className={`${theme.primaryText} text-sm`}>{notification.message}</p>
                          <p className={`${theme.secondaryText} text-xs mt-1`}>{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className={`p-3 border-t ${theme.border}`}>
                      <button className={`${theme.accentText} text-sm hover:opacity-80`}>
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile */}
              <div className="relative z-[210] pointer-events-auto">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 ${theme.primaryText} ${theme.buttonHover} p-2 rounded-lg transition-colors`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="Admin"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium">Admin User</div>
                    <div className={`text-xs ${theme.secondaryText}`}>Super Admin</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${theme.dropdownBg} ${theme.border} border rounded-xl shadow-2xl z-[230]`} onClick={(e)=>e.stopPropagation()}>
                    <div className="p-2" onClick={(e) => e.stopPropagation()}>
                      <button className={`w-full text-left px-3 py-2 ${theme.primaryText} ${themeClass(isDark, 'hover:bg-white/10', 'hover:bg-slate-100')} rounded-lg text-sm`}>
                        Profile Settings
                      </button>
                      <button className={`w-full text-left px-3 py-2 ${theme.primaryText} ${themeClass(isDark, 'hover:bg-white/10', 'hover:bg-slate-100')} rounded-lg text-sm`}>
                        Account Security
                      </button>
                      <hr className={`my-2 ${theme.border}`} />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                        }}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-red-500 ${themeClass(isDark, 'hover:bg-red-500/10', 'hover:bg-red-50')} rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-6 relative z-10">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Click away handlers for dropdowns */}
      {isNotificationsOpen && (
        <div
          className="fixed inset-0 z-[150] pointer-events-auto"
          onClick={() => setIsNotificationsOpen(false)}
        />
      )}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[150] pointer-events-auto"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;