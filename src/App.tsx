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
import ProtectedRoute from '@/components/ProtectedRoute'
import RoleProtectedRoute, { AdminRoute, SuperAdminRoute, UserRoute } from '@/components/RoleProtectedRoute'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { getDashboardRoute } from '@/utils/roles'

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

        {/* Super Admin Only Routes */}
        <Route path="/admin/system-settings" element={
          <SuperAdminRoute>
            <AdminDashboard />
          </SuperAdminRoute>
        } />
        {/* Catch all route - redirects based on user role */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
