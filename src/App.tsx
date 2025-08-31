// React import not required with automatic runtime
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './components/LandingScreen'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import SimpleChatInterface from './components/SimpleChatInterface'
import ProviderResultsScreen from './components/ProviderResultsScreen'
import ChatHistory from './components/ChatHistory'
import UserProfileScreen from './components/UserProfileScreen'
import SavedProvidersScreen from './components/SavedProvidersScreen'
import HowItWorksScreen from './components/HowItWorksScreen'
import ComingSoonScreen from './components/ComingSoonScreen'
import { AdminLogin } from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import  AnalyticsDashboard  from './components/admin/AnalyticsDashboard'

import { ThemeProvider } from './theme/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RedirectIfAuthenticated } from './components/RedirectIfAuthenticated'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RedirectIfAuthenticated><LandingScreen /></RedirectIfAuthenticated>} />
              <Route path="/auth" element={<RedirectIfAuthenticated><AuthScreen /></RedirectIfAuthenticated>} />
              <Route path="/login" element={<RedirectIfAuthenticated><AuthScreen /></RedirectIfAuthenticated>} />
              <Route path="/signup" element={<RedirectIfAuthenticated><AuthScreen /></RedirectIfAuthenticated>} />
              <Route path="/how-it-works" element={<HowItWorksScreen />} />
              
              {/* User Dashboard Routes - Protected */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><SimpleChatInterface /></ProtectedRoute>} />
              <Route path="/providers" element={<ProtectedRoute><ProviderResultsScreen /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfileScreen /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedProvidersScreen /></ProtectedRoute>} />
              
              {/* Coming Soon / Placeholder Routes */}
              <Route path="/coming-soon" element={<ComingSoonScreen />} />
              <Route path="/services" element={<ComingSoonScreen />} />
              <Route path="/professionals" element={<ComingSoonScreen />} />
              <Route path="/pricing" element={<ComingSoonScreen />} />
              <Route path="/support" element={<ComingSoonScreen />} />
              
              {/* Admin Routes - These will get their own protection later */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
