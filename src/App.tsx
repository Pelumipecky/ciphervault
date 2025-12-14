import TelegramChatButton from './components/ui/TelegramChatButton'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Home from '@/pages/Home'
import Deposit from '@/pages/Deposit'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Packages from '@/pages/Packages'
import FAQ from '@/pages/FAQ'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import AdminLogin from '@/pages/AdminLogin'
import AdminDashboard from '@/pages/dashboard/AdminDashboard'
import UserDashboard from '@/pages/dashboard/UserDashboard'
import Markets from '@/pages/Markets'
import Downloads from '@/pages/Downloads'
import PDFGuides from '@/pages/PDFGuides'
import YouTubeVideos from '@/pages/YouTubeVideos'
import ProtectedRoute from '@/components/ProtectedRoute'
import RoleProtectedRoute, { AdminRoute, SuperAdminRoute, UserRoute } from '@/components/RoleProtectedRoute'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { getDashboardRoute } from '@/utils/roles'
import ThirdPartyChatbotWidget from '@/components/ui/ThirdPartyChatbotWidget'
import SmartsuppWidget from '@/components/ui/SmartsuppWidget'
import FloatingChatRow from '@/components/ui/FloatingChatRow'
import WhatsAppChatButton from '@/components/ui/WhatsAppChatButton'
import DevIndicator from '@/components/DevIndicator'

function RoleBasedRedirect() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />
  }

  const dashboardRoute = getDashboardRoute(user.role)
  return <Navigate to={dashboardRoute} replace />
}

function App() {
  console.log('🎨 App component rendering...')
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
        {/* Public routes with Navbar and Footer */}
        <Route path="/" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <Home />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <About />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/contact" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <Contact />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/packages" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <Packages />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/faq" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <FAQ />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/downloads" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <Downloads />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/downloads/guides" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <PDFGuides />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/downloads/videos" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <YouTubeVideos />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/deposit" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <Deposit />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/markets" element={
          <div className="app-layout">
            <Navbar />
            <main className="app-layout__content">
              <Markets />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Login - Separate login for administrators */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* User Dashboard - Only for regular users */}
        <Route path="/dashboard" element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        } />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users-management" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/transactions" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/investment-plans" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/loans-management" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/* Super Admin Only Routes */}
        <Route path="/admin/system-settings" element={
          <SuperAdminRoute>
            <AdminDashboard />
          </SuperAdminRoute>
        } />
        {/* Catch all route - redirects based on user role */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>

      {/* Dev mount indicator (visible in development only) */}
      <DevIndicator />
      </AuthProvider>
      {/* Floating third-party chatbot widget (Tawk.to, Intercom, etc.) */}
      {/* Always show chatbot widget unless you want to restrict by env */}

      <SmartsuppWidget />
      <FloatingChatRow />
    </ThemeProvider>
  )
}

export default App
