import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabaseDb, supabaseRealtime } from '@/lib/supabaseUtils'
import '../../styles/dashboard.css'
import '../../styles/modern-dashboard.css'

/**
 * ADMIN DASHBOARD
 *
 * HOW TO CREATE AN ADMIN USER:
 *
 * Option 1 - For Testing (Quick Setup):
 * 1. Create a regular account through the signup flow
 * 2. Login with that account
 * 3. Open browser DevTools (F12) → Console tab
 * 4. Run this command:
 *    ```javascript
 *    const user = JSON.parse(localStorage.getItem('activeUser'));
 *    user.role = 'admin'; // or 'superadmin' for full access
 *    localStorage.setItem('activeUser', JSON.stringify(user));
 *    location.reload();
 *    ```
 * 5. The "Admin Panel" link will now appear in your user dashboard sidebar
 *
 * Option 2 - Database Level (Production):
 * 1. In Supabase dashboard, navigate to your users table
 * 2. Find the user record you want to make admin
 * 3. Set role = 'admin' or 'superadmin' for that user
 * 4. User will see "Admin Panel" link after next login
 *
 * Option 3 - Code Level:
 * During signup/registration, set role: 'admin' or 'superadmin' in the user object
 * before saving to localStorage/sessionStorage or database
 *
 * Available roles: 'user', 'admin', 'superadmin'
 */

interface AdminDashboardProps {}

function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allInvestments, setAllInvestments] = useState<any[]>([])
  const [allWithdrawals, setAllWithdrawals] = useState<any[]>([])
  const [allKycRequests, setAllKycRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'investments' | 'withdrawals' | 'kyc' | 'settings'>('overview')
  const [showSidePanel, setShowSidePanel] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [newBalance, setNewBalance] = useState('')

  // Set active tab based on route
  useEffect(() => {
    const path = location.pathname
    if (path.includes('users-management')) setActiveTab('users')
    else if (path.includes('transactions')) setActiveTab('withdrawals')
    else if (path.includes('investment-plans')) setActiveTab('investments')
    else if (path.includes('system-settings')) setActiveTab('settings')
    else setActiveTab('overview')
  }, [location.pathname])

  // Modal Alert System
  const [modalAlert, setModalAlert] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }>({ show: false, type: 'info', title: '', message: '' })

  // Confirmation Modal System
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
    onCancel?: () => void
  }>({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  })

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalAlert({ show: true, type, title, message })
  }

  const closeAlert = () => {
    setModalAlert({ show: false, type: 'info', title: '', message: '' })
  }

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setConfirmModal({
      show: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    })
  }

  const closeConfirm = () => {
    setConfirmModal({
      show: false,
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: () => {},
      onCancel: () => {}
    })
  }

  useEffect(() => {
    const initAdminDashboard = async () => {
      // Check if admin is authenticated
      const adminStr = localStorage.getItem('adminData') || sessionStorage.getItem('adminData')
      const activeUserStr = localStorage.getItem('activeUser') || sessionStorage.getItem('activeUser')

      if (!adminStr && !activeUserStr) {
        navigate('/admin/login')
        return
      }

      try {
        const userData = JSON.parse(adminStr || activeUserStr || '{}')

        // Check if user has admin or superadmin role
        if (userData.role !== 'admin' && userData.role !== 'superadmin') {
          // Redirect non-admins to admin login with error message
          navigate('/admin/login')
          return
        }

        // Verify admin session is still valid
        const adminSession = localStorage.getItem('adminSession')
        if (adminSession) {
          const session = JSON.parse(adminSession)
          if (session.expiresAt && session.expiresAt < Date.now()) {
            // Session expired, clear and redirect
            localStorage.removeItem('adminSession')
            localStorage.removeItem('activeUser')
            navigate('/admin/login')
            return
          }
        }

        setCurrentAdmin(userData)

        // Fetch all data for admin
        try {
          const [users, investments, withdrawals, kycRequests] = await Promise.all([
            supabaseDb.getAllUsers(),
            supabaseDb.getAllInvestments(),
            supabaseDb.getAllWithdrawals(),
            supabaseDb.getAllKycRequests(),
          ])

          // Join investments with user data
          const investmentsWithUsers = investments.map(investment => {
            const user = users.find(u => u.idnum === investment.idnum)
            return {
              ...investment,
              userName: user?.userName || user?.name || 'Unknown User',
              userEmail: user?.email || ''
            }
          })

          // Join KYC requests with user data
          const kycWithUsers = kycRequests.map(kyc => {
            const user = users.find(u => u.idnum === kyc.idnum)
            return {
              ...kyc,
              userName: user?.userName || user?.name || 'Unknown User',
              userEmail: user?.email || ''
            }
          })

          setAllUsers(users)
          setAllInvestments(investmentsWithUsers)
          setAllWithdrawals(withdrawals)
          setAllKycRequests(kycWithUsers)
        } catch (error) {
          console.log('Could not fetch admin data (Supabase may not be configured):', error)
          // Set mock data for demo
          setAllUsers([
            { idnum: '001', userName: 'Demo User', email: 'demo@example.com', balance: 5000 },
            { idnum: '002', userName: 'Test User', email: 'test@example.com', balance: 10000 },
          ])
          setAllInvestments([
            { id: 1, userName: 'Demo User', plan: 'Starter Plan', capital: 1000, status: 'Pending', date: new Date().toISOString() },
          ])
          setAllWithdrawals([
            { id: 1, userName: 'Test User', amount: 500, method: 'Bitcoin', status: 'Pending', date: new Date().toISOString() },
          ])
        }
      } catch (error) {
        console.error('Error parsing admin data:', error)
        navigate('/login')
        return
      }

      setLoading(false)
    }

    initAdminDashboard()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminData')
    localStorage.removeItem('activeUser')
    sessionStorage.removeItem('adminData')
    sessionStorage.removeItem('activeUser')
    navigate('/login')
  }

  const handleApproveInvestment = (investmentId: number) => {
    setAllInvestments(prev => 
      prev.map(inv => inv.id === investmentId ? { ...inv, status: 'Active' } : inv)
    )
    showAlert('success', 'Investment Approved', 'Investment has been approved successfully!')
  }

  const handleRejectInvestment = (investmentId: number) => {
    setAllInvestments(prev => 
      prev.map(inv => inv.id === investmentId ? { ...inv, status: 'Rejected' } : inv)
    )
    showAlert('error', 'Investment Rejected', 'Investment has been rejected.')
  }

  const handleApproveWithdrawal = (withdrawalId: number) => {
    setAllWithdrawals(prev => 
      prev.map(w => w.id === withdrawalId ? { ...w, status: 'Approved' } : w)
    )
    showAlert('success', 'Withdrawal Approved', 'Withdrawal has been approved and completed!')
  }

  const handleRejectWithdrawal = (withdrawalId: number) => {
    setAllWithdrawals(prev => 
      prev.map(w => w.id === withdrawalId ? { ...w, status: 'Rejected' } : w)
    )
    showAlert('error', 'Withdrawal Rejected', 'Withdrawal has been rejected.')
  }

  const handleApproveKyc = async (kycId: string) => {
    try {
      await supabaseDb.updateKycStatus(kycId, 'approved')
      setAllKycRequests(prev => 
        prev.map(kyc => kyc.id === kycId ? { ...kyc, status: 'approved' } : kyc)
      )
      showAlert('success', 'KYC Approved', 'KYC verification has been approved!')
    } catch (error) {
      console.error('Error approving KYC:', error)
      showAlert('error', 'Error', 'Failed to approve KYC verification.')
    }
  }

  const handleRejectKyc = async (kycId: string, rejectionReason?: string) => {
    try {
      await supabaseDb.updateKycStatus(kycId, 'rejected', rejectionReason)
      setAllKycRequests(prev => 
        prev.map(kyc => kyc.id === kycId ? { ...kyc, status: 'rejected' } : kyc)
      )
      showAlert('error', 'KYC Rejected', 'KYC verification has been rejected.')
    } catch (error) {
      console.error('Error rejecting KYC:', error)
      showAlert('error', 'Error', 'Failed to reject KYC verification.')
    }
  }

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setNewBalance(user.balance?.toString() || '0')
    setShowUserModal(true)
  }

  const handleUpdateUserBalance = () => {
    if (!selectedUser || !newBalance) return
    
    const balance = parseFloat(newBalance)
    if (isNaN(balance) || balance < 0) {
      showAlert('error', 'Invalid Amount', 'Please enter a valid balance amount')
      return
    }

    setAllUsers(prev => 
      prev.map(u => u.idnum === selectedUser.idnum ? { ...u, balance } : u)
    )
    setSelectedUser({ ...selectedUser, balance })
    showAlert('success', 'Balance Updated', `Balance updated to $${balance.toLocaleString()}!`)
  }

  // Calculate statistics
  const totalUsers = allUsers.length
  const totalInvestments = allInvestments.reduce((sum, inv) => sum + (inv.capital || 0), 0)
  const pendingInvestments = allInvestments.filter(inv => inv.status === 'Pending').length
  const pendingWithdrawals = allWithdrawals.filter(w => w.status === 'Pending').length
  const totalWithdrawals = allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0)
  const pendingKyc = allKycRequests.filter(k => k.status === 'Pending').length

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid rgba(240,185,11,0.2)',
              borderTop: '4px solid #f0b90b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <h2 style={{ color: '#f8fafc', fontSize: '1.25rem' }}>Loading Admin Dashboard...</h2>
          </div>
        </div>
      </div>
    )
  }

  // Get current page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Dashboard Overview';
      case 'users': return 'User Management';
      case 'investments': return 'Investments';
      case 'withdrawals': return 'Withdrawals';
      case 'kyc': return 'KYC Requests';
      case 'settings': return 'System Settings';
      default: return 'Admin Panel';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <button 
          className="mobile-header-btn"
          onClick={() => setShowSidePanel(!showSidePanel)}
          aria-label="Toggle menu"
        >
          <i className="icofont-navigation-menu"></i>
        </button>
        <h1 className="mobile-header-title">{getPageTitle()}</h1>
        <div className="mobile-header-logo">
          <span style={{ color: '#f0b90b', fontWeight: 700 }}>CV</span>
        </div>
      </div>

      {/* Mobile Hamburger Button (floating) */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setShowSidePanel(!showSidePanel)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Admin Sidebar */}
      <aside className={`dashboard-sidebar ${showSidePanel ? 'show' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            {/* Admin Avatar */}
            {currentAdmin?.avatar ? (
              <img 
                src={`/images/${currentAdmin.avatar}.svg`} 
                alt="Admin Avatar"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '2px solid rgba(240, 185, 11, 0.3)',
                  boxShadow: '0 2px 8px rgba(240, 185, 11, 0.3)'
                }}
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="logo-icon" 
              style={{ 
                background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: currentAdmin?.avatar ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#0f172a',
                fontWeight: 700
              }}
            >
              👨‍💼
            </div>
            <div>
              <h1 className="logo-text" style={{ fontSize: '1.25rem', margin: 0 }}>Admin Panel</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{currentAdmin?.userName || 'Administrator'}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setShowSidePanel(false); navigate('/admin'); }}
          >
            <i className="icofont-dashboard-web"></i>
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setShowSidePanel(false); navigate('/admin/users-management'); }}
          >
            <i className="icofont-users-alt-5"></i>
            <span>Users</span>
            {totalUsers > 0 && (
              <span className="badge">{totalUsers}</span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === 'investments' ? 'active' : ''}`}
            onClick={() => { setActiveTab('investments'); setShowSidePanel(false); navigate('/admin/investment-plans'); }}
          >
            <i className="icofont-chart-growth"></i>
            <span>Investments</span>
            {pendingInvestments > 0 && (
              <span className="badge">{pendingInvestments}</span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === 'withdrawals' ? 'active' : ''}`}
            onClick={() => { setActiveTab('withdrawals'); setShowSidePanel(false); navigate('/admin/transactions'); }}
          >
            <i className="icofont-money"></i>
            <span>Withdrawals</span>
            {pendingWithdrawals > 0 && (
              <span className="badge">{pendingWithdrawals}</span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => { setActiveTab('kyc'); setShowSidePanel(false); }}
          >
            <i className="icofont-id-card"></i>
            <span>KYC Requests</span>
            {pendingKyc > 0 && (
              <span className="badge">{pendingKyc}</span>
            )}
          </button>

          {/* Super Admin Only - System Settings */}
          {currentAdmin?.role === 'superadmin' && (
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('settings'); setShowSidePanel(false); navigate('/admin/system-settings'); }}
              style={{
                marginTop: '1rem',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)',
                border: '1px solid rgba(139,92,246,0.3)'
              }}
            >
              <i className="icofont-gear"></i>
              <span>System Settings</span>
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <i className="icofont-ui-user"></i>
            <span>User Dashboard</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="icofont-sign-out"></i>
            <span>Log Out</span>
          </button>
        </div>

        {showSidePanel && (
          <button className="sidebar-close" onClick={() => setShowSidePanel(false)}>
            <i className="icofont-close"></i>
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">{activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <div className="stat-icon">
                    <i className="icofont-users-alt-5"></i>
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Users</p>
                    <h3 className="stat-value">{totalUsers}</h3>
                  </div>
                </div>

                <div className="stat-card" style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                }}>
                  <div className="stat-icon">
                    <i className="icofont-chart-line"></i>
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Total Investments</p>
                    <h3 className="stat-value">${totalInvestments.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="stat-card" style={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                }}>
                  <div className="stat-icon">
                    <i className="icofont-clock-time"></i>
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Pending Investments</p>
                    <h3 className="stat-value">{pendingInvestments}</h3>
                  </div>
                </div>

                <div className="stat-card" style={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                }}>
                  <div className="stat-icon">
                    <i className="icofont-money-bag"></i>
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">Pending Withdrawals</p>
                    <h3 className="stat-value">{pendingWithdrawals}</h3>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>
                  <i className="icofont-flash"></i> Quick Actions
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <button
                    onClick={() => setActiveTab('investments')}
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(240,185,11,0.1)',
                      border: '1px solid rgba(240,185,11,0.3)',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="icofont-check-circled" style={{ fontSize: '1.5rem', color: '#f0b90b', display: 'block', marginBottom: '0.5rem' }}></i>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Approve Investments</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{pendingInvestments} pending</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('withdrawals')}
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="icofont-pay" style={{ fontSize: '1.5rem', color: '#60a5fa', display: 'block', marginBottom: '0.5rem' }}></i>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Process Withdrawals</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{pendingWithdrawals} pending</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('kyc')}
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="icofont-verification-check" style={{ fontSize: '1.5rem', color: '#10b981', display: 'block', marginBottom: '0.5rem' }}></i>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Review KYC</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{pendingKyc} pending</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    style={{
                      padding: '1.5rem',
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="icofont-users" style={{ fontSize: '1.5rem', color: '#a78bfa', display: 'block', marginBottom: '0.5rem' }}></i>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Manage Users</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{totalUsers} total users</div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>
                  <i className="icofont-clock-time"></i> Recent Activity
                </h3>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '1.5rem'
                }}>
                  <div style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                    <p style={{ marginBottom: '0.75rem' }}>
                      <i className="icofont-check-circled" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                      System operational - All services running smoothly
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>
                      <i className="icofont-info-circle" style={{ color: '#60a5fa', marginRight: '0.5rem' }}></i>
                      {pendingInvestments + pendingWithdrawals + pendingKyc} items require your attention
                    </p>
                    <p style={{ margin: 0 }}>
                      <i className="icofont-users-alt-5" style={{ color: '#f0b90b', marginRight: '0.5rem' }}></i>
                      {totalUsers} registered users
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600 }}>
                  <i className="icofont-users-alt-5"></i> User Management
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Total Users: {totalUsers}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(240,185,11,0.1)',
                      borderBottom: '2px solid rgba(240,185,11,0.3)'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Balance</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.filter(user => user.idnum !== currentAdmin?.idnum).map((user, idx) => (
                      <tr
                        key={user.id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(240,185,11,0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{user.idnum}</td>
                        <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: 500 }}>{user.name || user.userName}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{user.email}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                          ${(user.balance || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.375rem 0.875rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 'rgba(34,197,94,0.15)',
                            color: '#4ade80',
                            border: '1px solid rgba(34,197,94,0.3)'
                          }}>
                            Active
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleViewUser(user)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'rgba(59,130,246,0.1)',
                              border: '1px solid rgba(59,130,246,0.3)',
                              borderRadius: '6px',
                              color: '#60a5fa',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: 500
                            }}
                          >
                            <i className="icofont-eye"></i> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'investments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600 }}>
                  <i className="icofont-chart-growth"></i> Investment Management
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Total: ${totalInvestments.toLocaleString()} | Pending: {pendingInvestments}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(240,185,11,0.1)',
                      borderBottom: '2px solid rgba(240,185,11,0.3)'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>User</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Plan</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInvestments.map((inv, idx) => (
                      <tr
                        key={inv.id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}
                      >
                        <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: 500 }}>{inv.userName}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{inv.plan}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                          ${(inv.capital || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                          {new Date(inv.created_at || inv.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.375rem 0.875rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: inv.status === 'Pending' ? 'rgba(251,191,36,0.15)' :
                                       inv.status === 'Active' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: inv.status === 'Pending' ? '#fbbf24' :
                                   inv.status === 'Active' ? '#4ade80' : '#ef4444',
                            border: `1px solid ${inv.status === 'Pending' ? 'rgba(251,191,36,0.3)' :
                                                 inv.status === 'Active' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                          }}>
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {inv.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleApproveInvestment(inv.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(34,197,94,0.1)',
                                  border: '1px solid rgba(34,197,94,0.3)',
                                  borderRadius: '6px',
                                  color: '#10b981',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                <i className="icofont-check"></i> Approve
                              </button>
                              <button
                                onClick={() => handleRejectInvestment(inv.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(239,68,68,0.1)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  borderRadius: '6px',
                                  color: '#ef4444',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                <i className="icofont-close"></i> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600 }}>
                  <i className="icofont-money"></i> Withdrawal Management
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Total: ${totalWithdrawals.toLocaleString()} | Pending: {pendingWithdrawals}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(240,185,11,0.1)',
                      borderBottom: '2px solid rgba(240,185,11,0.3)'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>User</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Amount</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Method</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allWithdrawals.map((withdrawal, idx) => (
                      <tr
                        key={withdrawal.id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}
                      >
                        <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: 500 }}>{withdrawal.userName}</td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#ef4444', fontWeight: 600 }}>
                          ${(withdrawal.amount || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{withdrawal.method}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                          {new Date(withdrawal.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.375rem 0.875rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: withdrawal.status === 'Pending' ? 'rgba(251,191,36,0.15)' :
                                       withdrawal.status === 'Approved' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: withdrawal.status === 'Pending' ? '#fbbf24' :
                                   withdrawal.status === 'Approved' ? '#4ade80' : '#ef4444',
                            border: `1px solid ${withdrawal.status === 'Pending' ? 'rgba(251,191,36,0.3)' :
                                                 withdrawal.status === 'Approved' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                          }}>
                            {withdrawal.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {withdrawal.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(34,197,94,0.1)',
                                  border: '1px solid rgba(34,197,94,0.3)',
                                  borderRadius: '6px',
                                  color: '#10b981',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                <i className="icofont-check"></i> Approve
                              </button>
                              <button
                                onClick={() => handleRejectWithdrawal(withdrawal.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(239,68,68,0.1)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  borderRadius: '6px',
                                  color: '#ef4444',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                <i className="icofont-close"></i> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600 }}>
                  <i className="icofont-id-card"></i> KYC Verification Requests
                </h3>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Pending: {pendingKyc}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(240,185,11,0.1)',
                      borderBottom: '2px solid rgba(240,185,11,0.3)'
                    }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>User</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Submitted</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#f0b90b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allKycRequests.map((kyc, idx) => (
                      <tr
                        key={kyc.id || idx}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}
                      >
                        <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: 500 }}>{kyc.userName}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>{kyc.userEmail}</td>
                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                          {new Date(kyc.submittedAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.375rem 0.875rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: kyc.status?.toLowerCase() === 'pending' ? 'rgba(251,191,36,0.15)' :
                                       kyc.status?.toLowerCase() === 'approved' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: kyc.status?.toLowerCase() === 'pending' ? '#fbbf24' :
                                   kyc.status?.toLowerCase() === 'approved' ? '#4ade80' : '#ef4444',
                            border: `1px solid ${kyc.status?.toLowerCase() === 'pending' ? 'rgba(251,191,36,0.3)' :
                                                 kyc.status?.toLowerCase() === 'approved' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                          }}>
                            {kyc.status || 'Unknown'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {kyc.status?.toLowerCase() === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleApproveKyc(kyc.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(34,197,94,0.1)',
                                  border: '1px solid rgba(34,197,94,0.3)',
                                  borderRadius: '6px',
                                  color: '#10b981',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                <i className="icofont-check"></i> Approve
                              </button>
                              <button
                                onClick={() => handleRejectKyc(kyc.id)}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: 'rgba(239,68,68,0.1)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  borderRadius: '6px',
                                  color: '#ef4444',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                <i className="icofont-close"></i> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Settings - Superadmin Only */}
          {activeTab === 'settings' && currentAdmin?.role === 'superadmin' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-gear"></i> System Settings</h2>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.2) 100%)',
                  color: '#a78bfa',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  <i className="icofont-crown"></i> Superadmin Only
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* User Role Management */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h3 style={{ color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="icofont-users-alt-5" style={{ color: '#f0b90b' }}></i>
                    Role Management
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Promote users to admin or superadmin roles
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <select
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select a user...</option>
                      {allUsers.map(user => (
                        <option key={user.idnum} value={user.idnum}>{user.userName || user.email}</option>
                      ))}
                    </select>
                    <select
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                    <button
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => showAlert('info', 'Coming Soon', 'Role management will be available in a future update.')}
                    >
                      Update Role
                    </button>
                  </div>
                </div>

                {/* Admin Profile Settings */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h3 style={{ color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="icofont-user" style={{ color: '#f0b90b' }}></i>
                    Admin Profile
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Customize your admin profile settings
                  </p>

                  {/* Current Avatar Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Current Avatar:</span>
                      {currentAdmin?.avatar ? (
                        <img 
                          src={`/images/${currentAdmin.avatar}.svg`} 
                          alt="Current Avatar"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '2px solid rgba(240, 185, 11, 0.3)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          color: '#0f172a',
                          fontWeight: 700
                        }}>
                          👨‍💼
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Avatar Selection */}
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="icofont-camera" style={{ color: '#f0b90b' }}></i>
                      Choose Avatar
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      maxWidth: '300px'
                    }}>
                      <div 
                        className={`avatar-option ${(currentAdmin?.avatar || 'avatar_male_1') === 'avatar_male_1' ? 'selected' : ''}`}
                        onClick={() => {
                          if (currentAdmin) {
                            const updatedAdmin = { ...currentAdmin, avatar: 'avatar_male_1' }
                            setCurrentAdmin(updatedAdmin)
                            localStorage.setItem('adminData', JSON.stringify(updatedAdmin))
                            localStorage.setItem('activeUser', JSON.stringify(updatedAdmin))
                            showAlert('success', 'Avatar Updated', 'Your admin avatar has been updated successfully!')
                          }
                        }}
                        style={{
                          cursor: 'pointer',
                          padding: '0.5rem',
                          border: (currentAdmin?.avatar || 'avatar_male_1') === 'avatar_male_1' ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          background: (currentAdmin?.avatar || 'avatar_male_1') === 'avatar_male_1' ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                      >
                        <img src="/images/avatar_male_1.svg" alt="Male Avatar 1" style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginBottom: '0.25rem',
                          objectFit: 'cover'
                        }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Male 1</span>
                      </div>
                      <div 
                        className={`avatar-option ${currentAdmin?.avatar === 'avatar_male_2' ? 'selected' : ''}`}
                        onClick={() => {
                          if (currentAdmin) {
                            const updatedAdmin = { ...currentAdmin, avatar: 'avatar_male_2' }
                            setCurrentAdmin(updatedAdmin)
                            localStorage.setItem('adminData', JSON.stringify(updatedAdmin))
                            localStorage.setItem('activeUser', JSON.stringify(updatedAdmin))
                            showAlert('success', 'Avatar Updated', 'Your admin avatar has been updated successfully!')
                          }
                        }}
                        style={{
                          cursor: 'pointer',
                          padding: '0.5rem',
                          border: currentAdmin?.avatar === 'avatar_male_2' ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          background: currentAdmin?.avatar === 'avatar_male_2' ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                      >
                        <img src="/images/avatar_male_2.svg" alt="Male Avatar 2" style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginBottom: '0.25rem',
                          objectFit: 'cover'
                        }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Male 2</span>
                      </div>
                      <div 
                        className={`avatar-option ${currentAdmin?.avatar === 'avatar_female_1' ? 'selected' : ''}`}
                        onClick={() => {
                          if (currentAdmin) {
                            const updatedAdmin = { ...currentAdmin, avatar: 'avatar_female_1' }
                            setCurrentAdmin(updatedAdmin)
                            localStorage.setItem('adminData', JSON.stringify(updatedAdmin))
                            localStorage.setItem('activeUser', JSON.stringify(updatedAdmin))
                            showAlert('success', 'Avatar Updated', 'Your admin avatar has been updated successfully!')
                          }
                        }}
                        style={{
                          cursor: 'pointer',
                          padding: '0.5rem',
                          border: currentAdmin?.avatar === 'avatar_female_1' ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          background: currentAdmin?.avatar === 'avatar_female_1' ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                      >
                        <img src="/images/avatar_female_1.svg" alt="Female Avatar" style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginBottom: '0.25rem',
                          objectFit: 'cover'
                        }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Female</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Statistics */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h3 style={{ color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="icofont-chart-bar-graph" style={{ color: '#f0b90b' }}></i>
                    System Statistics
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>Total Users</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{allUsers.length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>Admin Users</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{allUsers.filter(u => u.role === 'admin').length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#94a3b8' }}>Super Admins</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{allUsers.filter(u => u.role === 'superadmin').length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ color: '#94a3b8' }}>Total Investments</span>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{allInvestments.length}</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.1) 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid rgba(239,68,68,0.3)'
                }}>
                  <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="icofont-warning"></i>
                    Danger Zone
                  </h3>
                  <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: '1px solid rgba(239,68,68,0.5)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => showConfirm(
                        'Clear All Pending Investments',
                        'This will reject all pending investments. This action cannot be undone.',
                        () => {
                          setAllInvestments(prev => prev.map(inv => inv.status === 'Pending' ? { ...inv, status: 'Rejected' } : inv))
                          showAlert('warning', 'Investments Cleared', 'All pending investments have been rejected.')
                        }
                      )}
                    >
                      Clear Pending Investments
                    </button>
                    <button
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        border: '1px solid rgba(239,68,68,0.5)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => showConfirm(
                        'Clear All Pending Withdrawals',
                        'This will reject all pending withdrawals. This action cannot be undone.',
                        () => {
                          setAllWithdrawals(prev => prev.map(w => w.status === 'Pending' ? { ...w, status: 'Rejected' } : w))
                          showAlert('warning', 'Withdrawals Cleared', 'All pending withdrawals have been rejected.')
                        }
                      )}
                    >
                      Clear Pending Withdrawals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Overlay */}
      {showSidePanel && (
        <div className="mobile-overlay" onClick={() => setShowSidePanel(false)}></div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(8px)',
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(240,185,11,0.2)'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                User Details
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#f8fafc',
                  fontSize: '1.25rem'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>User ID</label>
                <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 500 }}>{selectedUser.idnum}</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 500 }}>{selectedUser.name || selectedUser.userName}</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 500 }}>{selectedUser.email}</div>
              </div>
              
              {/* Balance Display and Update */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Current Balance</label>
                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  ${(selectedUser.balance || 0).toLocaleString()}
                </div>
              </div>

              {/* Update Balance Section */}
              <div style={{ 
                background: 'rgba(240,185,11,0.05)', 
                border: '1px solid rgba(240,185,11,0.2)', 
                borderRadius: '12px', 
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <label style={{ 
                  color: '#f0b90b', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  display: 'block', 
                  marginBottom: '0.75rem' 
                }}>
                  <i className="icofont-dollar"></i> Update Balance
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    placeholder="Enter new balance"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(240,185,11,0.5)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                  />
                  <button
                    onClick={handleUpdateUserBalance}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <i className="icofont-check"></i> Update
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '1rem' }}>
                <small style={{ color: '#93c5fd', fontSize: '0.75rem' }}>
                  <i className="icofont-info-circle"></i> You can update user balance, view their transactions, and manage account settings directly from this panel.
                </small>
              </div>
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  showConfirm(
                    'Delete User Account',
                    'Are you sure you want to delete this user account? This action cannot be undone.',
                    () => {
                      setAllUsers(prev => prev.filter(u => u.idnum !== selectedUser.idnum))
                      setShowUserModal(false)
                      showAlert('success', 'User Deleted', 'User account deleted successfully')
                    },
                    () => {
                      // Cancelled
                    },
                    'Delete Account',
                    'Cancel'
                  )
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <i className="icofont-trash"></i> Delete User
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99998,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 20px rgba(245,158,11,0.3)'
              }}>
                <i className="icofont-warning" style={{ fontSize: '2rem', color: '#fff' }}></i>
              </div>
              <h2 style={{
                color: '#f8fafc',
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: '0 0 1rem 0'
              }}>
                {confirmModal.title}
              </h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {confirmModal.message}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  confirmModal.onConfirm()
                  closeConfirm()
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(239,68,68,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(239,68,68,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(239,68,68,0.3)'
                }}
              >
                {confirmModal.confirmText}
              </button>
              <button
                onClick={() => {
                  if (confirmModal.onCancel) confirmModal.onCancel()
                  closeConfirm()
                }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
              >
                {confirmModal.cancelText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alert System */}
      {modalAlert.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: modalAlert.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                         modalAlert.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' :
                         modalAlert.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                         'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: modalAlert.type === 'success' ? '0 8px 20px rgba(16,185,129,0.3)' :
                          modalAlert.type === 'error' ? '0 8px 20px rgba(239,68,68,0.3)' :
                          modalAlert.type === 'warning' ? '0 8px 20px rgba(245,158,11,0.3)' :
                          '0 8px 20px rgba(59,130,246,0.3)'
              }}>
                <i className={
                  modalAlert.type === 'success' ? 'icofont-check-circled' :
                  modalAlert.type === 'error' ? 'icofont-close-circled' :
                  modalAlert.type === 'warning' ? 'icofont-warning' :
                  'icofont-info-circle'
                } style={{ fontSize: '2rem', color: '#fff' }}></i>
              </div>
              <h2 style={{
                color: '#f8fafc',
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: '0 0 1rem 0'
              }}>
                {modalAlert.title}
              </h2>
              <p style={{
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {modalAlert.message}
              </p>
            </div>

            <button
              onClick={closeAlert}
              style={{
                width: '100%',
                padding: '1rem',
                background: modalAlert.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                         modalAlert.type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' :
                         modalAlert.type === 'warning' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' :
                         'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: modalAlert.type === 'success' ? '0 8px 20px rgba(16,185,129,0.3)' :
                          modalAlert.type === 'error' ? '0 8px 20px rgba(239,68,68,0.3)' :
                          modalAlert.type === 'warning' ? '0 8px 20px rgba(245,158,11,0.3)' :
                          '0 8px 20px rgba(59,130,246,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = modalAlert.type === 'success' ? '0 12px 30px rgba(16,185,129,0.4)' :
                                                modalAlert.type === 'error' ? '0 12px 30px rgba(239,68,68,0.4)' :
                                                modalAlert.type === 'warning' ? '0 12px 30px rgba(245,158,11,0.4)' :
                                                '0 12px 30px rgba(59,130,246,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = modalAlert.type === 'success' ? '0 8px 20px rgba(16,185,129,0.3)' :
                                                modalAlert.type === 'error' ? '0 8px 20px rgba(239,68,68,0.3)' :
                                                modalAlert.type === 'warning' ? '0 8px 20px rgba(245,158,11,0.3)' :
                                                '0 8px 20px rgba(59,130,246,0.3)'
              }}
            >
              {modalAlert.type === 'success' ? 'Great!' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard
