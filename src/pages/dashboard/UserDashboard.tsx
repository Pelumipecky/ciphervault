import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabaseDb } from '@/lib/supabaseUtils'
import { PLAN_CONFIG, formatPercent } from '@/utils/planConfig'
import { UserRole } from '@/utils/roles'
import { fetchCryptoPrices, fetchDetailedCryptoPrices, formatPrice, formatMarketCap, CryptoPrice, CryptoPrices } from '@/utils/cryptoPrices'
import '@/styles/modern-dashboard.css'

interface UserData {
  id?: string
  idnum?: string
  name?: string
  userName?: string
  email?: string
  balance?: number
  bonus?: number
  referralCount?: number
  referralCode?: string
  phoneNumber?: string
  country?: string
  city?: string
  address?: string
  role?: UserRole
  avatar?: string
}

interface Investment {
  id?: string
  plan?: string
  capital?: number
  roi?: number
  dailyRoi?: number        // Daily ROI amount
  earnedRoi?: number       // ROI earned so far (credited daily)
  totalExpectedRoi?: number // Total expected ROI at end of duration
  bonus?: number
  status?: string
  date?: string
  startDate?: string       // When investment was activated
  duration?: number
  daysCompleted?: number   // Days that have been credited
  authStatus?: string
}

function UserDashboard() {
      // Notification type
      interface Notification {
        id: number;
        message: string;
        type: string;
        read: boolean;
        title?: string;
        created_at?: string;
      }
      // Notifications state
      const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigate = useNavigate();

  // Helper function to add notifications for account activities
  const addNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      title,
      message,
      type,
      read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also persist to localStorage
    const stored = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    stored.unshift(newNotification);
    localStorage.setItem('userNotifications', JSON.stringify(stored.slice(0, 50))); // Keep last 50
  };
  // Notifications modal state
  const [showNotifications, setShowNotifications] = useState(false);

  // Live Crypto prices state
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>({ BTC: 0, ETH: 0, USDT: 1, BNB: 0, XRP: 0, SOL: 0, DOGE: 0, ADA: 0 });
  const [cryptoDetails, setCryptoDetails] = useState<CryptoPrice[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);

  // Fetch live crypto prices
  useEffect(() => {
    async function loadCryptoPrices() {
      setCryptoLoading(true);
      try {
        const [prices, details] = await Promise.all([
          fetchCryptoPrices(),
          fetchDetailedCryptoPrices()
        ]);
        setCryptoPrices(prices);
        setCryptoDetails(details);
      } catch (error) {
        console.error('Error loading crypto prices:', error);
      }
      setCryptoLoading(false);
    }
    
    loadCryptoPrices();
    
    // Refresh prices every 60 seconds
    const interval = setInterval(loadCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Modal alert state
  const [modalAlert, setModalAlert] = useState({ show: false, type: 'info', title: '', message: '' });
  function closeAlert() { setModalAlert({ ...modalAlert, show: false }); }

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {}, confirmText: '', cancelText: '' });
  function closeConfirm() { setConfirmModal({ ...confirmModal, show: false }); }
  // ...other state and function declarations...

  // ...all state and function declarations...

  // ...all state and function declarations...

  // ...all state and function declarations...

  // ...all state and function declarations...

  useEffect(() => {
    async function initDashboard() {
      try {
        // Simulate fetching user data from localStorage/sessionStorage
        const userRaw = localStorage.getItem('activeUser') || sessionStorage.getItem('activeUser');
        if (!userRaw) {
          navigate('/login');
          return;
        }
        const userData = JSON.parse(userRaw);
        setCurrentUser(userData);

        // Simulate fetching investments from localStorage
        const investmentsRaw = localStorage.getItem('userInvestments');
        if (investmentsRaw) {
          setInvestments(JSON.parse(investmentsRaw));
        }

        // Load notifications from localStorage
        const storedNotifications = localStorage.getItem('userNotifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          // Add welcome notification if no notifications exist
          if (parsedNotifications.length === 0) {
            const welcomeNotification: Notification = {
              id: Date.now(),
              title: 'Welcome!',
              message: 'Welcome to your dashboard! Start by exploring investment plans.',
              type: 'info',
              read: false,
              created_at: new Date().toISOString()
            };
            setNotifications([welcomeNotification]);
            localStorage.setItem('userNotifications', JSON.stringify([welcomeNotification]));
          } else {
            setNotifications(parsedNotifications);
          }
        } else {
          // First time user - set welcome notification
          const welcomeNotification: Notification = {
            id: Date.now(),
            title: 'Welcome!',
            message: `Welcome ${userData.name || userData.userName || 'to your dashboard'}! Start exploring our investment plans.`,
            type: 'success',
            read: false,
            created_at: new Date().toISOString()
          };
          setNotifications([welcomeNotification]);
          localStorage.setItem('userNotifications', JSON.stringify([welcomeNotification]));
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        navigate('/login');
      }
      setLoading(false);
    }
    initDashboard();
  }, [navigate]);

  // Placeholder alert/confirm functions
  function showAlert(type: string, title: string, message: string) {
    window.alert(`${title}: ${message}`);
  }

  function showConfirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string) {
    if (window.confirm(`${title}: ${message}`)) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  }
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [profileState, setProfileState] = useState<string>('Dashboard')
  const [showSidePanel, setShowSidePanel] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    email: '',
    phoneNumber: '',
    address: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [copied, setCopied] = useState(false)
  
  // Investment modal states
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [investmentStep, setInvestmentStep] = useState<'select' | 'confirm' | 'payment' | 'success'>('select')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [investmentForm, setInvestmentForm] = useState({
    capital: '',
    paymentMethod: 'Bitcoin',
    transactionHash: '',
    bankSlip: null as File | null
  })
  const [paymentCopied, setPaymentCopied] = useState(false)
  
  // KYC modal states
  const [showKycModal, setShowKycModal] = useState(false)
  const [kycStep, setKycStep] = useState<'intro' | 'personal' | 'documents' | 'review' | 'success'>('intro')
  const [kycForm, setKycForm] = useState({
    idNumber: '',
    idType: 'passport',
    idDocument: null as File | null,
    addressDocument: null as File | null,
    selfieDocument: null as File | null
  })
  
  // Withdrawal modal states
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalStep, setWithdrawalStep] = useState<'amount' | 'method' | 'details' | 'confirm' | 'success'>('amount')
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    method: 'Bitcoin',
    walletAddress: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    routingNumber: ''
  })
  
  // Loan modal states
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [loanStep, setLoanStep] = useState<'amount' | 'terms' | 'confirm' | 'success'>('amount')
  const [loanForm, setLoanForm] = useState({
    amount: '',
    duration: '30',
    purpose: ''
  });

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/login')
  }

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${currentUser?.referralCode || currentUser?.idnum}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEditProfile = async () => {
    if (!editMode) {
      // Enter edit mode - populate form with current user data
      setEditForm({
        email: currentUser?.email || '',
        phoneNumber: currentUser?.phoneNumber || '',
        address: currentUser?.address || ''
      })
      setEditMode(true)
      return
    }

    try {
      // Validate required fields
      if (!editForm.email || !editForm.email.trim()) {
        showAlert('error', 'Validation Error', 'Email is required.')
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editForm.email)) {
        showAlert('error', 'Validation Error', 'Please enter a valid email address.')
        return
      }

      // Update user in database
      if (currentUser?.idnum) {
        await supabaseDb.updateUser(currentUser.idnum, {
          email: editForm.email.trim(),
          phoneNumber: editForm.phoneNumber?.trim() || undefined,
          address: editForm.address?.trim() || undefined
        })

        // Update local storage
        const updatedUser = { ...currentUser, ...editForm }
        setCurrentUser(updatedUser)
        localStorage.setItem('activeUser', JSON.stringify(updatedUser))
        sessionStorage.setItem('activeUser', JSON.stringify(updatedUser))

        setEditMode(false)
        addNotification('Profile Updated', 'Your profile information has been updated successfully.', 'success')
        showAlert('success', 'Profile Updated!', 'Your profile has been updated successfully.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      showAlert('error', 'Update Failed', `Failed to update profile: ${errorMessage}`)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert('error', 'Password Mismatch', 'New passwords do not match!')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showAlert('error', 'Password Too Short', 'Password must be at least 6 characters long!')
      return
    }

    try {
      // You'll need to implement password change in supabaseUtils
      addNotification(
        'Password Change Attempted',
        'A password change was requested on your account. If this was not you, please contact support.',
        'warning'
      )
      showAlert('info', 'Feature Coming Soon', 'Password change feature will be implemented soon.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error changing password:', error)
      showAlert('error', 'Password Change Failed', 'Failed to change password. Please try again.')
    }
  }

  const handleDeleteAccount = async () => {
    showConfirm(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone!',
      () => {
        // First confirmation passed, show second confirmation
        showConfirm(
          'Final Warning',
          'This will permanently delete all your data including investments and withdrawals. Are you absolutely sure?',
          async () => {
            // Proceed with account deletion
            try {
              // You'll need to implement account deletion in supabaseUtils
              showAlert('info', 'Feature Coming Soon', 'Account deletion feature will be implemented soon.')
            } catch (error) {
              console.error('Error deleting account:', error)
              showAlert('error', 'Deletion Failed', 'Failed to delete account. Please contact support.')
            }
          },
          () => {
            // Second confirmation cancelled
          },
          'Yes, Delete Everything',
          'Cancel'
        )
      },
      () => {
        // First confirmation cancelled
      },
      'Continue',
      'Cancel'
    )
  }

  // Investment modal handlers
  const paymentMethods = {
    Bitcoin: {
      name: 'Bitcoin (BTC)',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      network: 'Bitcoin Network',
      icon: '₿'
    },
    Ethereum: {
      name: 'Ethereum (ETH)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      network: 'Ethereum Network (ERC-20)',
      icon: 'Ξ'
    },
    USDT: {
      name: 'Tether (USDT)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      network: 'Ethereum Network (ERC-20)',
      icon: '₮'
    },
    Bank: {
      name: 'Bank Transfer',
      accountName: 'CipherVault Investments Ltd.',
      accountNumber: '1234567890',
      bankName: 'Global Trust Bank',
      routingNumber: 'GTB001234',
      swiftCode: 'GTBKUS33',
      icon: '🏦'
    }
  }

  const handleStartInvestment = (plan: any) => {
    setSelectedPlan(plan)
    setInvestmentForm({
      capital: plan.minCapital.toString(),
      paymentMethod: 'Bitcoin',
      transactionHash: '',
      bankSlip: null
    })
    setInvestmentStep('confirm')
    setShowInvestmentModal(true)
  }

  const handleInvestmentNext = () => {
    if (investmentStep === 'confirm') {
      const capital = parseFloat(investmentForm.capital)
      if (!capital || capital < selectedPlan.minCapital) {
        showAlert('error', 'Invalid Amount', `Minimum investment is $${selectedPlan.minCapital.toLocaleString()}`)
        return
      }
      if (selectedPlan.maxCapital && capital > selectedPlan.maxCapital) {
        showAlert('error', 'Invalid Amount', `Maximum investment is $${selectedPlan.maxCapital.toLocaleString()}`)
        return
      }
      setInvestmentStep('payment')
    } else if (investmentStep === 'payment') {
      setInvestmentStep('success')
      // Here you would typically submit to backend
    }
  }

  const handleInvestmentBack = () => {
    if (investmentStep === 'payment') {
      setInvestmentStep('confirm')
    } else if (investmentStep === 'confirm') {
      setShowInvestmentModal(false)
    }
  }

  // KYC Modal Handlers
  const handleStartKyc = () => {
    setKycStep('intro')
    setShowKycModal(true)
  }

  const handleKycNext = () => {
    if (kycStep === 'intro') {
      setKycStep('personal')
    } else if (kycStep === 'personal') {
      if (!kycForm.idNumber || !kycForm.idType) {
        showAlert('error', 'Missing Information', 'Please fill in all required fields')
        return
      }
      setKycStep('documents')
    } else if (kycStep === 'documents') {
      if (!kycForm.idDocument || !kycForm.addressDocument || !kycForm.selfieDocument) {
        showAlert('error', 'Missing Documents', 'Please upload all required documents')
        return
      }
      setKycStep('review')
    } else if (kycStep === 'review') {
      // Submit KYC
      addNotification(
        'KYC Documents Submitted',
        'Your KYC verification documents have been submitted for review. This may take 1-3 business days.',
        'info'
      )
      setKycStep('success')
    }
  }

  const handleKycBack = () => {
    if (kycStep === 'documents') {
      setKycStep('personal')
    } else if (kycStep === 'personal') {
      setKycStep('intro')
    } else if (kycStep === 'review') {
      setKycStep('documents')
    }
  }

  const closeKycModal = () => {
    setShowKycModal(false)
    setKycStep('intro')
  }

  const handleFileUpload = (type: 'idDocument' | 'addressDocument' | 'selfieDocument', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKycForm({ ...kycForm, [type]: e.target.files[0] })
    }
  }

  // Withdrawal Modal Handlers
  const handleStartWithdrawal = () => {
    setWithdrawalStep('amount')
    setShowWithdrawalModal(true)
  }

  const handleWithdrawalNext = () => {
    if (withdrawalStep === 'amount') {
      const amount = parseFloat(withdrawalForm.amount)
      if (!amount || amount < 50) {
        alert('Minimum withdrawal is $50')
        return
      }
      if (amount > (currentUser?.balance || 0)) {
        alert('Insufficient balance')
        return
      }
      setWithdrawalStep('method')
    } else if (withdrawalStep === 'method') {
      setWithdrawalStep('details')
    } else if (withdrawalStep === 'details') {
      if (withdrawalForm.method === 'Bank Transfer') {
        if (!withdrawalForm.bankName || !withdrawalForm.accountNumber || !withdrawalForm.accountName) {
          alert('Please fill in all bank details')
          return
        }
      } else {
        if (!withdrawalForm.walletAddress) {
          alert('Please enter wallet address')
          return
        }
      }
      setWithdrawalStep('confirm')
    } else if (withdrawalStep === 'confirm') {
      // Submit withdrawal
      const amount = parseFloat(withdrawalForm.amount)
      addNotification(
        'Withdrawal Requested',
        `Your withdrawal request of $${amount.toLocaleString()} via ${withdrawalForm.method} has been submitted for processing.`,
        'info'
      )
      setWithdrawalStep('success')
    }
  }

  const handleWithdrawalBack = () => {
    if (withdrawalStep === 'method') {
      setWithdrawalStep('amount')
    } else if (withdrawalStep === 'details') {
      setWithdrawalStep('method')
    } else if (withdrawalStep === 'confirm') {
      setWithdrawalStep('details')
    }
  }

  const closeWithdrawalModal = () => {
    setShowWithdrawalModal(false)
    setWithdrawalStep('amount')
    setWithdrawalForm({
      amount: '',
      method: 'Bitcoin',
      walletAddress: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      routingNumber: ''
    })
  }

  // Loan modal handlers
  const handleStartLoan = () => {
    setLoanStep('amount')
    setShowLoanModal(true)
  }

  const handleLoanNext = () => {
    if (loanStep === 'amount') {
      const amount = parseFloat(loanForm.amount)
      const maxLoan = totalCapital * 0.5
      if (!amount || amount < 100) {
        showAlert('error', 'Invalid Amount', 'Minimum loan amount is $100')
        return
      }
      if (amount > maxLoan) {
        showAlert('error', 'Invalid Amount', `Maximum loan amount is $${maxLoan.toLocaleString()}`)
        return
      }
      setLoanStep('terms')
    } else if (loanStep === 'terms') {
      if (!loanForm.purpose) {
        showAlert('error', 'Missing Information', 'Please specify the loan purpose')
        return
      }
      setLoanStep('confirm')
    } else if (loanStep === 'confirm') {
      // Submit loan request
      const amount = parseFloat(loanForm.amount)
      addNotification(
        'Loan Request Submitted',
        `Your loan request of $${amount.toLocaleString()} for ${loanForm.duration} days has been submitted for review.`,
        'info'
      )
      setLoanStep('success')
    }
  }

  const handleLoanBack = () => {
    if (loanStep === 'terms') {
      setLoanStep('amount')
    } else if (loanStep === 'confirm') {
      setLoanStep('terms')
    }
  }

  const closeLoanModal = () => {
    setShowLoanModal(false)
    setLoanStep('amount')
    setLoanForm({
      amount: '',
      duration: '30',
      purpose: ''
    })
  }

  // Helper function for copying payment details
  const copyPaymentAddress = () => {
    const method = paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods]
    const textToCopy = 'address' in method ? method.address : 
                       `Account: ${method.accountNumber}\nBank: ${method.bankName}\nRouting: ${method.routingNumber}`
    
    navigator.clipboard.writeText(textToCopy)
    setPaymentCopied(true)
    setTimeout(() => setPaymentCopied(false), 2000)
  }

  const handleSubmitInvestment = async () => {
    try {
      const capital = parseFloat(investmentForm.capital)
      const dailyRoi = capital * selectedPlan.dailyRate  // Daily earnings
      const totalExpectedRoi = dailyRoi * selectedPlan.durationDays  // Total expected over duration
      const bonus = capital * selectedPlan.referralBonus

      const newInvestment = {
        id: 'INV' + Date.now(),
        idnum: currentUser?.idnum,
        userName: currentUser?.userName || currentUser?.name,
        plan: selectedPlan.name,
        status: 'Pending',
        capital,
        dailyRoi,                    // Daily ROI amount
        earnedRoi: 0,                // Starts at 0, credited daily
        totalExpectedRoi,            // Total expected at end
        roi: 0,                      // Current ROI earned (same as earnedRoi for compatibility)
        bonus,
        duration: selectedPlan.durationDays,
        daysCompleted: 0,            // No days completed yet
        paymentOption: investmentForm.paymentMethod,
        authStatus: 'unseen',
        date: new Date().toISOString(),
        startDate: ''                // Will be set when activated by admin
      }

      // Try database first, fallback to local storage
      try {
        await supabaseDb.createInvestment(newInvestment)
      } catch (dbError) {
        console.log('Database unavailable, storing locally')
        // Store in localStorage as fallback
        const localInvestments = JSON.parse(localStorage.getItem('userInvestments') || '[]')
        localInvestments.push(newInvestment)
        localStorage.setItem('userInvestments', JSON.stringify(localInvestments))
      }

      // Update local state
      setInvestments(prev => [...prev, newInvestment])
      
      // Add notification for investment creation
      addNotification(
        'New Investment Created',
        `You invested $${capital.toLocaleString()} in ${selectedPlan.name}. Daily earnings: $${dailyRoi.toLocaleString()} for ${selectedPlan.durationDays} days.`,
        'success'
      )
      
      showAlert('success', 'Investment Created!', 
        `Your ${selectedPlan.name} investment of $${capital.toLocaleString()} has been created. You'll earn $${dailyRoi.toLocaleString()} daily for ${selectedPlan.durationDays} days once activated.`)
      
      setInvestmentStep('success')
      
      setTimeout(() => {
        setShowInvestmentModal(false)
        setInvestmentStep('select')
        setSelectedPlan(null)
        setInvestmentForm({ capital: '', paymentMethod: 'Bitcoin', transactionHash: '', bankSlip: null })
      }, 3000)
    } catch (error) {
      console.error('Error creating investment:', error)
      showAlert('error', 'Investment Failed', 
        'Unable to create investment. Please check your details and try again.')
    }
  }

  const closeInvestmentModal = () => {
    setShowInvestmentModal(false)
    setInvestmentStep('select')
    setSelectedPlan(null)
    setInvestmentForm({ capital: '', paymentMethod: 'Bitcoin', transactionHash: '', bankSlip: null })
  }

  const totalCapital = investments.reduce((sum, inv) => sum + (inv.capital || 0), 0)
  const totalROI = investments.reduce((sum, inv) => sum + (inv.roi || 0), 0)
  const totalBonus = investments.reduce((sum, inv) => sum + (inv.bonus || 0), 0)
  const totalBalance = (currentUser?.balance || 0) + (currentUser?.bonus || 0)

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="modern-dashboard">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${showSidePanel ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            <img src="/images/ciphervaultlogobig.svg" alt="CipherVault" className="sidebar-logo" />
          </Link>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <img src={`/images/${currentUser?.avatar || 'avatar_male_1'}.svg`} alt="Avatar" />
          </div>
          <div className="user-info">
            <h3>{currentUser?.name || currentUser?.userName}</h3>
            <p>{currentUser?.email}</p>
          </div>
        </div>

        {/* Notifications Button */}
        <div className="sidebar-notifications">
          <button className="sidebar-notification-btn" onClick={() => setShowNotifications(true)}>
            <i className="icofont-notification"></i>
            <span>Notifications</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="sidebar-notif-badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${profileState === 'Dashboard' ? 'active' : ''}`}
            onClick={() => { setProfileState('Dashboard'); setShowSidePanel(false); }}
          >
            <i className="icofont-dashboard-web"></i>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${profileState === 'Wallet' ? 'active' : ''}`}
            onClick={() => { setProfileState('Wallet'); setShowSidePanel(false); }}
          >
            <i className="icofont-wallet"></i>
            <span>Wallet</span>
          </button>
          <button
            className={`nav-item ${profileState === 'Profile' ? 'active' : ''}`}
            onClick={() => { setProfileState('Profile'); setShowSidePanel(false); }}
          >
            <i className="icofont-user-suited"></i>
            <span>Profile & KYC</span>
          </button>
          <button
            className={`nav-item ${profileState === 'Investments' ? 'active' : ''}`}
            onClick={() => { setProfileState('Investments'); setShowSidePanel(false); }}
          >
            <i className="icofont-chart-growth"></i>
            <span>Investments</span>
            {investments.filter(i => i.authStatus !== 'seen').length > 0 && (
              <span className="badge">{investments.filter(i => i.authStatus !== 'seen').length}</span>
            )}
          </button>
          <button
            className={`nav-item ${profileState === 'Withdrawals' ? 'active' : ''}`}
            onClick={() => { setProfileState('Withdrawals'); setShowSidePanel(false); }}
          >
            <i className="icofont-money"></i>
            <span>Withdrawals</span>
          </button>
          <button
            className={`nav-item ${profileState === 'Loans' ? 'active' : ''}`}
            onClick={() => { setProfileState('Loans'); setShowSidePanel(false); }}
          >
            <i className="icofont-money-bag"></i>
            <span>Loans</span>
          </button>
          <button
            className={`nav-item ${profileState === 'Downline' ? 'active' : ''}`}
            onClick={() => { setProfileState('Downline'); setShowSidePanel(false); }}
          >
            <i className="icofont-users-social"></i>
            <span>Downline</span>
          </button>
          <button
            className={`nav-item ${profileState === 'Support' ? 'active' : ''}`}
            onClick={() => { setProfileState('Support'); setShowSidePanel(false); }}
          >
            <i className="icofont-live-support"></i>
            <span>Support</span>
          </button>
          
          {/* Admin Panel Link - Only visible to admin users */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
            <button
              className="nav-item"
              onClick={() => navigate('/admin')}
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)',
                border: '1px solid rgba(139,92,246,0.3)',
                marginTop: '0.5rem'
              }}
            >
              <i className="icofont-shield"></i>
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
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

        <div className="dashboard-content">
          {profileState === 'Dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-wallet"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Balance</p>
                    <h2 className="stat-value">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="stat-change positive">+12.5% this month</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="icofont-money-bag"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Invested</p>
                    <h2 className="stat-value">${totalCapital.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="stat-info">{investments.length} active investments</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="icofont-chart-growth"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Returns</p>
                    <h2 className="stat-value">${totalROI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="stat-change positive">+${totalBonus.toLocaleString()} bonus</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="icofont-users"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Referrals</p>
                    <h2 className="stat-value">{currentUser?.referralCount || 0}</h2>
                    <p className="stat-info">Active network members</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-section">
                <div className="section-header">
                  <h3>Recent Investments</h3>
                  <Link to="#" className="view-all">View All →</Link>
                </div>
                <div className="activity-list">
                  {investments.length === 0 ? (
                    <div className="empty-state">
                      <i className="icofont-chart-line"></i>
                      <p>No investments yet</p>
                      <Link to="/packages" className="cta-btn">Start Investing</Link>
                    </div>
                  ) : (
                    investments.slice(0, 5).map((inv, idx) => (
                      <div key={idx} className="activity-item">
                        <div className="activity-icon">
                          <i className="icofont-money-bag"></i>
                        </div>
                        <div className="activity-details">
                          <h4>{inv.plan} Plan</h4>
                          <p>{new Date(inv.date || '').toLocaleDateString()}</p>
                        </div>
                        <div className="activity-amount">
                          <p className="amount">${(inv.capital || 0).toLocaleString()}</p>
                          <span className={`status-badge ${inv.status}`}>{inv.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <div className="section-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="actions-grid">
                  <Link to="/packages" className="action-card">
                    <i className="icofont-plus-circle"></i>
                    <h4>New Investment</h4>
                    <p>Start earning today</p>
                  </Link>
                  <button className="action-card" onClick={() => setProfileState('Withdrawals')}>
                    <i className="icofont-pay"></i>
                    <h4>Withdraw Funds</h4>
                    <p>Cash out earnings</p>
                  </button>
                  <button className="action-card" onClick={() => setProfileState('Referrals')}>
                    <i className="icofont-share"></i>
                    <h4>Refer & Earn</h4>
                    <p>Invite friends</p>
                  </button>
                  <button className="action-card" onClick={() => setProfileState('Profile')}>
                    <i className="icofont-settings"></i>
                    <h4>Settings</h4>
                    <p>Manage account</p>
                  </button>
                </div>
              </div>
            </>
          )}

          {profileState === 'Wallet' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-wallet"></i> Wallet Overview</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {cryptoLoading && <span style={{ color: '#f0b90b', fontSize: '12px' }}><i className="icofont-refresh"></i> Updating...</span>}
                  <button className="primary-btn"><i className="icofont-plus-circle"></i> Deposit</button>
                </div>
              </div>

              {/* Balance Cards - Using stats-grid like Dashboard */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-dollar-true"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Fiat Balance</p>
                    <h2 className="stat-value">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="stat-change positive"><i className="icofont-check-circled"></i> Available: ${(currentUser?.balance || 0).toLocaleString()}</p>
                    <p className="stat-info" style={{ color: '#f0b90b' }}><i className="icofont-gift"></i> Bonus: +${(currentUser?.bonus || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(247, 147, 26, 0.1)', color: '#f7931a' }}>
                    <i className="icofont-bitcoin"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Bitcoin (BTC)</p>
                    <h2 className="stat-value">0.00 BTC</h2>
                    <p className="stat-info"><i className="icofont-dollar"></i> ≈ $0.00 USD</p>
                    <p className="stat-change positive"><i className="icofont-chart-line"></i> ${formatPrice(cryptoPrices.BTC)}/BTC</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(98, 126, 234, 0.1)', color: '#627eea' }}>
                    <i className="icofont-ethereum"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Ethereum (ETH)</p>
                    <h2 className="stat-value">0.00 ETH</h2>
                    <p className="stat-info"><i className="icofont-dollar"></i> ≈ $0.00 USD</p>
                    <p className="stat-change positive"><i className="icofont-chart-line"></i> ${formatPrice(cryptoPrices.ETH)}/ETH</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-cur-dollar"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">USDT (Tether)</p>
                    <h2 className="stat-value">0.00 USDT</h2>
                    <p className="stat-info"><i className="icofont-dollar"></i> ≈ $0.00 USD</p>
                    <p className="stat-change positive"><i className="icofont-chart-line"></i> ${formatPrice(cryptoPrices.USDT)}/USDT</p>
                  </div>
                </div>
              </div>

              {/* Live Crypto Market Prices */}
              <div className="profile-card" style={{ marginTop: '24px' }}>
                <div className="profile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3><i className="icofont-chart-line-alt"></i> Live Market Prices</h3>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                    <i className="icofont-refresh"></i> Auto-updates every 60s
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>#</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>Asset</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>Price</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>24h Change</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>Market Cap</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>24h High/Low</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoDetails.map((crypto, idx) => (
                        <tr 
                          key={crypto.id} 
                          style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,185,11,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{idx + 1}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={crypto.image} 
                                alt={crypto.name} 
                                style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                              <div>
                                <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{crypto.name}</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase' }}>{crypto.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                            ${formatPrice(crypto.current_price)}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <span style={{ 
                              color: crypto.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171',
                              fontWeight: '600',
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '4px'
                            }}>
                              <i className={crypto.price_change_percentage_24h >= 0 ? 'icofont-arrow-up' : 'icofont-arrow-down'}></i>
                              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                            {formatMarketCap(crypto.market_cap)}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px' }}>
                            <div style={{ color: '#4ade80' }}>${formatPrice(crypto.high_24h)}</div>
                            <div style={{ color: '#f87171' }}>${formatPrice(crypto.low_24h)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions - Using actions-grid like Dashboard */}
              <div className="quick-actions">
                <div className="section-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="actions-grid">
                  <button className="action-card">
                    <i className="icofont-plus-circle"></i>
                    <span>Deposit</span>
                  </button>
                  <button className="action-card" onClick={handleStartWithdrawal}>
                    <i className="icofont-money"></i>
                    <span>Withdraw</span>
                  </button>
                  <button className="action-card">
                    <i className="icofont-exchange"></i>
                    <span>Transfer</span>
                  </button>
                  <button className="action-card" onClick={() => setProfileState('Investments')}>
                    <i className="icofont-chart-growth"></i>
                    <span>Invest</span>
                  </button>
                </div>
              </div>

              {/* Transaction History */}
              <div className="activity-section">
                <div className="section-header">
                  <h3><i className="icofont-history"></i> Transaction History</h3>
                  <button className="view-all">Filter <i className="icofont-filter"></i></button>
                </div>

                {investments.length === 0 ? (
                  <div className="empty-state">
                    <i className="icofont-chart-line"></i>
                    <p>No transactions yet</p>
                    <button className="cta-btn" onClick={() => setProfileState('Investments')}>Start Investing</button>
                  </div>
                ) : (
                  <div className="activity-list">
                    {investments.slice(0, 5).map((inv, idx) => (
                      <div key={idx} className="activity-item">
                        <div className="activity-icon">
                          <i className="icofont-chart-line"></i>
                        </div>
                        <div className="activity-details">
                          <h4>{inv.plan}</h4>
                          <p>{new Date(inv.date || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="activity-amount negative">
                          -${(inv.capital || 0).toLocaleString()}
                        </div>
                        <span className={`status-badge ${inv.status}`}>{inv.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {profileState === 'Investments' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-chart-line"></i> Investments</h2>
                <button className="primary-btn" onClick={() => handleStartInvestment(PLAN_CONFIG[0])}>
                  <i className="icofont-plus"></i> New Investment
                </button>
              </div>

              {/* Investment Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-money-bag"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Invested</p>
                    <h2 className="stat-value">${investments.reduce((sum, inv) => sum + (inv.capital || 0), 0).toLocaleString()}</h2>
                    <p className="stat-info">All time investment</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-chart-growth"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Active Plans</p>
                    <h2 className="stat-value">{investments.filter(inv => inv.status === 'active').length}</h2>
                    <p className="stat-info">Currently earning</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="icofont-dollar-true"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Returns</p>
                    <h2 className="stat-value">${investments.reduce((sum, inv) => sum + (inv.roi || 0), 0).toLocaleString()}</h2>
                    <p className="stat-info">Profit earned</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#a855f7' }}>
                    <i className="icofont-check-circled"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Completed</p>
                    <h2 className="stat-value">{investments.filter(inv => inv.status === 'completed').length}</h2>
                    <p className="stat-info">Finished plans</p>
                  </div>
                </div>
              </div>

              {/* Investment History */}
              {investments.length > 0 && (
                <div style={{
                  marginTop: '24px',
                  background: 'linear-gradient(145deg, #1e2329 0%, #181a20 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(240, 185, 11, 0.12)',
                  overflow: 'hidden'
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px 20px',
                    borderBottom: '1px solid rgba(240, 185, 11, 0.1)',
                    background: 'rgba(0,0,0,0.15)'
                  }}>
                    <h3 style={{
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      margin: 0
                    }}>
                      <i className="icofont-clock-time" style={{ color: '#f0b90b' }}></i>
                      Investment History
                    </h3>
                    <span style={{
                      background: 'rgba(240, 185, 11, 0.12)',
                      color: '#f0b90b',
                      padding: '5px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>{investments.length} investments</span>
                  </div>
                  
                  {/* Investment List */}
                  <div style={{ padding: '12px' }}>
                    {investments.map((inv, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 16px',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: '12px',
                          marginBottom: idx < investments.length - 1 ? '10px' : '0',
                          border: '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.2s, transform 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.background = 'rgba(240, 185, 11, 0.06)';
                          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
                          (e.currentTarget as HTMLDivElement).style.transform = 'none';
                        }}
                      >
                        {/* Icon */}
                        <div style={{ 
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                          background: inv.status === 'active' 
                            ? 'rgba(16, 185, 129, 0.15)' 
                            : inv.status === 'completed'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(251, 191, 36, 0.15)',
                          color: inv.status === 'active' 
                            ? '#10b981' 
                            : inv.status === 'completed'
                            ? '#3b82f6'
                            : '#fbbf24'
                        }}>
                          <i className={inv.status === 'active' ? 'icofont-chart-growth' : inv.status === 'completed' ? 'icofont-check-circled' : 'icofont-sand-clock'}></i>
                        </div>
                        
                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            color: '#fff', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            marginBottom: '4px'
                          }}>{inv.plan}</div>
                          <div style={{ 
                            color: 'rgba(255,255,255,0.5)', 
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{ color: '#f0b90b' }}>${(inv.capital || 0).toLocaleString()}</span>
                            <span>•</span>
                            <span>{inv.duration} days</span>
                            <span>•</span>
                            <span>{new Date(inv.date || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* Right Side */}
                        <div style={{ 
                          textAlign: 'right',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '6px'
                        }}>
                          <div style={{ 
                            color: '#4ade80', 
                            fontSize: '13px', 
                            fontWeight: '700'
                          }}>
                            {inv.status === 'active' 
                              ? `+$${(inv.earnedRoi || inv.roi || 0).toLocaleString()} earned`
                              : `+$${(inv.totalExpectedRoi || inv.roi || 0).toLocaleString()}`
                            }
                          </div>
                          {inv.status === 'active' && inv.dailyRoi && (
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                              ${inv.dailyRoi.toLocaleString()}/day
                            </div>
                          )}
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: inv.status === 'active' 
                              ? 'rgba(16, 185, 129, 0.15)' 
                              : inv.status === 'completed'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(251, 191, 36, 0.15)',
                            color: inv.status === 'active' 
                              ? '#10b981' 
                              : inv.status === 'completed'
                              ? '#3b82f6'
                              : '#fbbf24'
                          }}>
                            {inv.status === 'active' && inv.daysCompleted !== undefined 
                              ? `Day ${inv.daysCompleted}/${inv.duration}`
                              : inv.status
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Investments - 3 per row */}
              {investments.filter(inv => inv.status === 'active').length > 0 && (
                <div className="profile-card" style={{ marginTop: '24px' }}>
                  <div className="profile-card-header">
                    <h3><i className="icofont-chart-growth"></i> Active Investments</h3>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '20px',
                    padding: '20px'
                  }}>
                    {investments.filter(inv => inv.status === 'active').map((inv, idx) => {
                      const daysCompleted = inv.daysCompleted || 0;
                      const duration = inv.duration || 30;
                      const progress = Math.min((daysCompleted / duration) * 100, 100);
                      const dailyRoi = inv.dailyRoi || (inv.capital || 0) * 0.02; // fallback 2% daily
                      const earnedRoi = inv.earnedRoi || (inv.roi || 0);
                      const totalExpected = inv.totalExpectedRoi || dailyRoi * duration;
                      
                      return (
                        <div key={idx} style={{
                          background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(20, 20, 20, 0.95))',
                          border: '1px solid rgba(240, 185, 11, 0.2)',
                          borderRadius: '16px',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxSizing: 'border-box',
                          padding: '20px',
                          minHeight: '280px'
                        }}>
                          {/* Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 style={{ color: '#f0b90b', fontSize: '15px', fontWeight: '600', margin: 0 }}>{inv.plan}</h4>
                            <span style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>Active</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Progress</span>
                              <span style={{ color: '#f0b90b', fontSize: '11px', fontWeight: '600' }}>{daysCompleted}/{duration} days</span>
                            </div>
                            <div style={{ 
                              height: '6px', 
                              background: 'rgba(255,255,255,0.1)', 
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{ 
                                height: '100%', 
                                width: `${progress}%`, 
                                background: 'linear-gradient(90deg, #f0b90b, #4ade80)',
                                borderRadius: '3px',
                                transition: 'width 0.3s ease'
                              }}></div>
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>Capital</span>
                              <span style={{ color: '#fff', fontWeight: '600', fontSize: '12px' }}>${(inv.capital || 0).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>Daily Earnings</span>
                              <span style={{ color: '#4ade80', fontWeight: '600', fontSize: '12px' }}>+${dailyRoi.toLocaleString()}/day</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>Earned So Far</span>
                              <span style={{ color: '#4ade80', fontWeight: '700', fontSize: '12px' }}>+${earnedRoi.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>Total Expected</span>
                              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>${totalExpected.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Investment Plans - 3 per row */}
              <div className="profile-card" style={{ marginTop: '24px' }}>
                <div className="profile-card-header">
                  <h3><i className="icofont-star"></i> Available Investment Plans</h3>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '20px',
                  padding: '20px'
                }}>
                  {PLAN_CONFIG.map((plan) => (
                    <div 
                      key={plan.id}
                      style={{
                        background: plan.featured 
                          ? 'linear-gradient(145deg, rgba(240, 185, 11, 0.15), rgba(26, 26, 26, 0.98))'
                          : 'linear-gradient(145deg, #1e2329 0%, #181a20 100%)',
                        border: plan.featured 
                          ? '2px solid rgba(240, 185, 11, 0.5)' 
                          : '1px solid rgba(240,185,11,0.12)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        padding: '18px 16px',
                        boxShadow: plan.featured
                          ? '0 6px 24px 0 rgba(240,185,11,0.12)'
                          : '0 2px 12px 0 rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px 0 rgba(240,185,11,0.15)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.transform = 'none';
                        (e.currentTarget as HTMLDivElement).style.boxShadow = plan.featured
                          ? '0 6px 24px 0 rgba(240,185,11,0.12)'
                          : '0 2px 12px 0 rgba(0,0,0,0.15)';
                      }}
                    >
                      {plan.featured && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '-28px',
                          background: 'linear-gradient(135deg, #f0b90b, #d4a50a)',
                          color: '#000',
                          padding: '3px 36px',
                          fontSize: '10px',
                          fontWeight: '700',
                          transform: 'rotate(45deg)',
                          textTransform: 'uppercase'
                        }}>
                          Popular
                        </div>
                      )}
                      {/* Header */}
                      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                        <h4 style={{ 
                          color: plan.featured ? '#f0b90b' : '#fff', 
                          fontSize: '16px', 
                          fontWeight: '700',
                          marginBottom: '2px',
                          lineHeight: '1.2'
                        }}>{plan.name}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0 }}>{plan.subtitle}</p>
                      </div>
                      
                      {/* Daily ROI */}
                      <div style={{ 
                        textAlign: 'center', 
                        marginBottom: '12px',
                        padding: '10px 8px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderRadius: '10px'
                      }}>
                        <div style={{ 
                          color: '#4ade80', 
                          fontSize: '24px', 
                          fontWeight: '700',
                          lineHeight: '1'
                        }}>
                          {formatPercent(plan.dailyRate)}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', marginTop: '2px' }}>
                          Daily ROI
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '6px'
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>Duration</span>
                          <span style={{ color: '#fff', fontWeight: '600', fontSize: '11px' }}>{plan.durationLabel}</span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '6px'
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>Min</span>
                          <span style={{ color: '#f0b90b', fontWeight: '600', fontSize: '11px' }}>${plan.minCapital.toLocaleString()}</span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '6px'
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>Max</span>
                          <span style={{ color: '#f0b90b', fontWeight: '600', fontSize: '11px' }}>${plan.maxCapital?.toLocaleString() || '∞'}</span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '6px'
                        }}>
                          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>Total ROI</span>
                          <span style={{ color: '#4ade80', fontWeight: '600', fontSize: '11px' }}>{formatPercent(plan.dailyRate * plan.durationDays)}</span>
                        </div>
                      </div>

                      {/* Example Profit */}
                      <div style={{
                        padding: '8px 10px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        textAlign: 'center'
                      }}>
                        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', marginBottom: '2px' }}>
                          Invest ${plan.minCapital.toLocaleString()}
                        </div>
                        <div style={{ color: '#4ade80', fontSize: '13px', fontWeight: '700' }}>
                          Earn ${plan.sampleEarning.toLocaleString()}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button 
                        onClick={() => handleStartInvestment(plan)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: plan.featured 
                            ? 'linear-gradient(135deg, #f0b90b, #d4a50a)'
                            : 'linear-gradient(135deg, rgba(240, 185, 11, 0.18), rgba(240, 185, 11, 0.08))',
                          border: plan.featured ? 'none' : '1px solid rgba(240, 185, 11, 0.25)',
                          borderRadius: '8px',
                          color: plan.featured ? '#000' : '#f0b90b',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          marginTop: 'auto'
                        }}
                      >
                        <i className="icofont-plus-circle"></i> Invest Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {profileState === 'Withdrawals' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-pay"></i> Withdrawals</h2>
                <button className="primary-btn" onClick={handleStartWithdrawal}>
                  <i className="icofont-money"></i> Request Withdrawal
                </button>
              </div>

              {/* Withdrawal Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-wallet"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Available Balance</p>
                    <h2 className="stat-value">${totalBalance.toLocaleString()}</h2>
                    <p className="stat-info">Ready to withdraw</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-check-circled"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Withdrawn</p>
                    <h2 className="stat-value">$0</h2>
                    <p className="stat-info">All time</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="icofont-clock-time"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Pending</p>
                    <h2 className="stat-value">$0</h2>
                    <p className="stat-info">In progress</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#a855f7' }}>
                    <i className="icofont-ui-settings"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Daily Limit</p>
                    <h2 className="stat-value">$50,000</h2>
                    <p className="stat-info">Min: $50</p>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-info-circle"></i> How It Works</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(240,185,11,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(240,185,11,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(240,185,11,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#f0b90b',
                      fontWeight: 700
                    }}>1</div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Request</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Enter amount & details</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(59,130,246,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(59,130,246,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#3b82f6',
                      fontWeight: 700
                    }}>2</div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Verification</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Reviewed in 2-4 hours</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(147,51,234,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(147,51,234,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(147,51,234,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#a855f7',
                      fontWeight: 700
                    }}>3</div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Processing</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Transferred in 24h</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(16,185,129,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(16,185,129,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(16,185,129,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#10b981'
                    }}><i className="icofont-check"></i></div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Receive</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Funds in your wallet</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-credit-card"></i> Payment Methods</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(247,147,26,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(247,147,26,0.1)',
                    textAlign: 'center'
                  }}>
                    <i className="icofont-bitcoin" style={{ color: '#f7931a', fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Bitcoin</h5>
                    <p style={{ color: '#10b981', fontSize: '0.75rem', margin: 0 }}>Instant</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(98,126,234,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(98,126,234,0.1)',
                    textAlign: 'center'
                  }}>
                    <i className="icofont-ethereum" style={{ color: '#627eea', fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Ethereum</h5>
                    <p style={{ color: '#10b981', fontSize: '0.75rem', margin: 0 }}>Instant</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(16,185,129,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(16,185,129,0.1)',
                    textAlign: 'center'
                  }}>
                    <i className="icofont-cur-dollar" style={{ color: '#10b981', fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem', fontSize: '0.875rem' }}>USDT</h5>
                    <p style={{ color: '#10b981', fontSize: '0.75rem', margin: 0 }}>Instant</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(59,130,246,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.1)',
                    textAlign: 'center'
                  }}>
                    <i className="icofont-bank-alt" style={{ color: '#3b82f6', fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Bank</h5>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>1-2 days</p>
                  </div>
                </div>
              </div>

              {/* Withdrawal History */}
              <div className="activity-section" style={{ marginTop: '1.5rem' }}>
                <div className="section-header">
                  <h3><i className="icofont-history"></i> Withdrawal History</h3>
                  <button className="view-all">View All →</button>
                </div>
                <div className="empty-state">
                  <i className="icofont-pay"></i>
                  <p>No withdrawal history</p>
                  <small style={{ color: '#64748b' }}>Your completed withdrawals will appear here</small>
                </div>
              </div>
            </div>
          )}

          {profileState === 'Loans' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-dollar-plus"></i> Loan Management</h2>
                <button className="primary-btn" onClick={handleStartLoan}>
                  <i className="icofont-plus"></i> Request Loan
                </button>
              </div>

              {/* Loan Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-money-bag"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Investment</p>
                    <h2 className="stat-value">${totalCapital.toLocaleString()}</h2>
                    <p className="stat-info">Your collateral value</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="icofont-bank-alt"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Available to Borrow</p>
                    <h2 className="stat-value">${(totalCapital * 0.5).toLocaleString()}</h2>
                    <p className="stat-info">Up to 50% of investment</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-percentage"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Interest Rate</p>
                    <h2 className="stat-value">5%</h2>
                    <p className="stat-change positive">Low monthly rate</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#a855f7' }}>
                    <i className="icofont-tasks"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Active Loans</p>
                    <h2 className="stat-value">0</h2>
                    <p className="stat-info">No outstanding loans</p>
                  </div>
                </div>
              </div>

              {/* Loan Benefits */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-star"></i> Loan Benefits</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(16,185,129,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(16,185,129,0.1)'
                  }}>
                    <i className="icofont-flash" style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Instant Approval</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Get funds within 24 hours</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(240,185,11,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(240,185,11,0.1)'
                  }}>
                    <i className="icofont-percentage" style={{ color: '#f0b90b', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Low Interest</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Just 5% monthly rate</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(59,130,246,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.1)'
                  }}>
                    <i className="icofont-calendar" style={{ color: '#3b82f6', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Flexible Terms</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>30, 60, or 90 day terms</p>
                  </div>
                </div>
              </div>

              {/* Active Loans Section */}
              <div className="activity-section" style={{ marginTop: '1.5rem' }}>
                <div className="section-header">
                  <h3><i className="icofont-tasks"></i> Active Loans</h3>
                </div>
                <div className="empty-state">
                  <i className="icofont-dollar-plus"></i>
                  <p>No active loans</p>
                  <button className="cta-btn" onClick={handleStartLoan}>
                    <i className="icofont-plus-circle"></i> Request Your First Loan
                  </button>
                </div>
              </div>
            </div>
          )}

          {profileState === 'KYC' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-id-card"></i> KYC Verification</h2>
                <button className="primary-btn" onClick={handleStartKyc}>
                  <i className="icofont-verification-check"></i> Start Verification
                </button>
              </div>

              {/* KYC Status Cards */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-verification-check"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Verification Status</p>
                    <h2 className="stat-value">Pending</h2>
                    <p className="stat-info">Complete verification to unlock features</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-check-circled"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Steps Completed</p>
                    <h2 className="stat-value">1/4</h2>
                    <p className="stat-info">Personal info submitted</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="icofont-unlock"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Withdrawal Limit</p>
                    <h2 className="stat-value">$1,000</h2>
                    <p className="stat-change positive">+$9,000 after KYC</p>
                  </div>
                </div>
              </div>

              {/* Verification Progress Card */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-tasks-alt"></i> Verification Progress</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="info-row" style={{ 
                    background: 'rgba(16,185,129,0.1)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(16,185,129,0.2)'
                  }}>
                    <span className="label" style={{ color: '#10b981' }}>
                      <i className="icofont-check-circled"></i> Personal Information
                    </span>
                    <span className="value" style={{ color: '#10b981' }}>Completed</span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(148,163,184,0.1)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(148,163,184,0.2)'
                  }}>
                    <span className="label">
                      <i className="icofont-clock-time"></i> Identity Document
                    </span>
                    <span className="value" style={{ color: '#94a3b8' }}>Pending</span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(148,163,184,0.1)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(148,163,184,0.2)'
                  }}>
                    <span className="label">
                      <i className="icofont-clock-time"></i> Proof of Address
                    </span>
                    <span className="value" style={{ color: '#94a3b8' }}>Pending</span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(148,163,184,0.1)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(148,163,184,0.2)'
                  }}>
                    <span className="label">
                      <i className="icofont-clock-time"></i> Selfie Verification
                    </span>
                    <span className="value" style={{ color: '#94a3b8' }}>Pending</span>
                  </div>
                </div>
              </div>

              {/* Benefits Card */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-gift"></i> KYC Benefits</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(240,185,11,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(240,185,11,0.1)'
                  }}>
                    <i className="icofont-wallet" style={{ color: '#f0b90b', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Higher Limits</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Withdraw up to $10,000/day</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(16,185,129,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(16,185,129,0.1)'
                  }}>
                    <i className="icofont-lock" style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Enhanced Security</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Additional account protection</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(59,130,246,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.1)'
                  }}>
                    <i className="icofont-star" style={{ color: '#3b82f6', fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Premium Features</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Access exclusive investment plans</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profileState === 'Profile' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-user-alt-7"></i> Profile Settings</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editMode && (
                    <button 
                      className="secondary-btn" 
                      onClick={() => {
                        setEditMode(false)
                        // Reset form to current user data
                        setEditForm({
                          email: currentUser?.email || '',
                          phoneNumber: currentUser?.phoneNumber || '',
                          address: currentUser?.address || ''
                        })
                      }}
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      <i className="icofont-close"></i> Cancel
                    </button>
                  )}
                  <button className="primary-btn" onClick={handleEditProfile}>
                    <i className={editMode ? "icofont-save" : "icofont-edit"}></i> {editMode ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {/* Profile Stats */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-user"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Account Status</p>
                    <h2 className="stat-value">Active</h2>
                    <p className="stat-change positive"><i className="icofont-check-circled"></i> Verified email</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="icofont-id-card"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">KYC Status</p>
                    <h2 className="stat-value">Pending</h2>
                    <p className="stat-info">Complete verification</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="icofont-calendar"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Member Since</p>
                    <h2 className="stat-value">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</h2>
                    <p className="stat-info">Account created</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="icofont-users"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Referrals</p>
                    <h2 className="stat-value">{currentUser?.referralCount || 0}</h2>
                    <p className="stat-info">Network members</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="profile-card" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h4><i className="icofont-info-circle"></i> Account Information</h4>
                <div className="info-row">
                  <span className="label"><i className="icofont-user"></i> Full Name</span>
                  <span className="value">{currentUser?.name || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-ui-user"></i> Username</span>
                  <span className="value">{currentUser?.userName || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-email"></i> Email</span>
                  {editMode ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(240,185,11,0.3)',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        width: '300px'
                      }}
                    />
                  ) : (
                    <span className="value">{currentUser?.email || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-id"></i> Account ID</span>
                  <span className="value" style={{ fontFamily: 'monospace' }}>{currentUser?.id || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-barcode"></i> Register ID</span>
                  <span className="value" style={{ fontFamily: 'monospace' }}>{currentUser?.idnum || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-phone"></i> Phone Number</span>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      placeholder="Enter phone number"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(240,185,11,0.3)',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        width: '300px'
                      }}
                    />
                  ) : (
                    <span className="value">{currentUser?.phoneNumber || 'Not provided'}</span>
                  )}
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-flag"></i> Country</span>
                  <span className="value">{currentUser?.country || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-location-pin"></i> City</span>
                  <span className="value">{currentUser?.city || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label"><i className="icofont-home"></i> Address</span>
                  {editMode ? (
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      placeholder="Enter address"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(240,185,11,0.3)',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        width: '300px'
                      }}
                    />
                  ) : (
                    <span className="value">{currentUser?.address || 'Not provided'}</span>
                  )}
                </div>
              </div>

              {/* Referral Link */}
              <div className="profile-card" style={{ marginBottom: '1.5rem' }}>
                <h4><i className="icofont-link-alt"></i> Referral Link</h4>
                <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <i className="icofont-share"></i> Share this link to invite friends and earn commissions
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={`${window.location.origin}/signup?ref=${currentUser?.referralCode || currentUser?.idnum}`}
                    readOnly
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    onClick={copyReferralLink}
                    className="primary-btn"
                    style={{
                      whiteSpace: 'nowrap',
                      background: copied ? 'rgba(16,185,129,0.2)' : undefined,
                      color: copied ? '#10b981' : undefined,
                      border: copied ? '1px solid rgba(16,185,129,0.3)' : undefined
                    }}
                  >
                    {copied ? '✓ Copied!' : <><i className="icofont-copy"></i> Copy Link</>}
                  </button>
                </div>
              </div>

              {/* Avatar Selection - Only in Edit Mode */}
              {editMode && (
                <div className="profile-card" style={{ marginBottom: '1.5rem' }}>
                  <h4><i className="icofont-camera"></i> Choose Avatar</h4>
                  <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Select your profile picture</p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    maxWidth: '400px'
                  }}>
                    <div 
                      className={`avatar-option ${(currentUser?.avatar || 'avatar_male_1') === 'avatar_male_1' ? 'selected' : ''}`}
                      onClick={() => {
                        if (currentUser) {
                          setCurrentUser({ ...currentUser, avatar: 'avatar_male_1' })
                          localStorage.setItem('activeUser', JSON.stringify({ ...currentUser, avatar: 'avatar_male_1' }))
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        padding: '0.75rem',
                        border: (currentUser?.avatar || 'avatar_male_1') === 'avatar_male_1' ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        background: (currentUser?.avatar || 'avatar_male_1') === 'avatar_male_1' ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/images/avatar_male_1.svg" alt="Male Avatar 1" style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        marginBottom: '0.5rem',
                        objectFit: 'cover'
                      }} />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Male 1</span>
                    </div>
                    <div 
                      className={`avatar-option ${currentUser?.avatar === 'avatar_male_2' ? 'selected' : ''}`}
                      onClick={() => {
                        if (currentUser) {
                          setCurrentUser({ ...currentUser, avatar: 'avatar_male_2' })
                          localStorage.setItem('activeUser', JSON.stringify({ ...currentUser, avatar: 'avatar_male_2' }))
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        padding: '0.75rem',
                        border: currentUser?.avatar === 'avatar_male_2' ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        background: currentUser?.avatar === 'avatar_male_2' ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/images/avatar_male_2.svg" alt="Male Avatar 2" style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        marginBottom: '0.5rem',
                        objectFit: 'cover'
                      }} />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Male 2</span>
                    </div>
                    <div 
                      className={`avatar-option ${currentUser?.avatar === 'avatar_female_1' ? 'selected' : ''}`}
                      onClick={() => {
                        if (currentUser) {
                          setCurrentUser({ ...currentUser, avatar: 'avatar_female_1' })
                          localStorage.setItem('activeUser', JSON.stringify({ ...currentUser, avatar: 'avatar_female_1' }))
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        padding: '0.75rem',
                        border: currentUser?.avatar === 'avatar_female_1' ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        background: currentUser?.avatar === 'avatar_female_1' ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      <img src="/images/avatar_female_1.svg" alt="Female Avatar" style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        marginBottom: '0.5rem',
                        objectFit: 'cover'
                      }} />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Female</span>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Verification Status */}
              <div className="profile-card" style={{ marginBottom: '1.5rem' }}>
                <h4><i className="icofont-verification-check"></i> KYC Verification</h4>
                <div className="kyc-status-card">
                  <div className="status-header" style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'rgba(234,179,8,0.1)',
                      border: '1px solid rgba(234,179,8,0.3)',
                      borderRadius: '8px',
                      color: '#eab308',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '0.75rem'
                    }}>
                      <i className="icofont-clock-time"></i>
                      <span>Pending Verification</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      Complete KYC verification to unlock all features including withdrawals and higher investment limits.
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#f8fafc', fontSize: '0.875rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                      Verification Progress
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(16,185,129,0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(16,185,129,0.2)'
                      }}>
                        <i className="icofont-check-circled" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
                        <span style={{ color: '#10b981', fontWeight: 500 }}>Personal Information</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(148,163,184,0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(148,163,184,0.2)'
                      }}>
                        <i className="icofont-clock-time" style={{ color: '#94a3b8', fontSize: '1.25rem' }}></i>
                        <span style={{ color: '#94a3b8', fontWeight: 500 }}>Identity Document</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(148,163,184,0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(148,163,184,0.2)'
                      }}>
                        <i className="icofont-clock-time" style={{ color: '#94a3b8', fontSize: '1.25rem' }}></i>
                        <span style={{ color: '#94a3b8', fontWeight: 500 }}>Proof of Address</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(148,163,184,0.1)',
                        borderRadius: '8px',
                        border: '1px solid rgba(148,163,184,0.2)'
                      }}>
                        <i className="icofont-clock-time" style={{ color: '#94a3b8', fontSize: '1.25rem' }}></i>
                        <span style={{ color: '#94a3b8', fontWeight: 500 }}>Selfie Verification</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="primary-btn"
                    onClick={handleStartKyc}
                    style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                  >
                    <i className="icofont-verification-check"></i> Start KYC Verification
                  </button>
                </div>
              </div>

              {/* Change Password */}
              <div className="profile-card" style={{ marginBottom: '1.5rem' }}>
                <h4><i className="icofont-lock"></i> Change Password</h4>
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                      <i className="icofont-key"></i> Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                      <i className="icofont-key"></i> New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                      <i className="icofont-check"></i> Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="primary-btn"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <i className="icofont-check-circled"></i> Update Password
                  </button>
                </form>
              </div>

              {/* Delete Account */}
              <div className="profile-card" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                <h4 style={{ color: '#ef4444' }}><i className="icofont-warning"></i> Danger Zone</h4>
                <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                  <i className="icofont-exclamation-circle"></i> Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <i className="icofont-trash"></i> Delete Account
                </button>
              </div>
            </div>
          )}

          {profileState === 'Downline' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-users-alt-3"></i> Downline Network</h2>
                <button className="primary-btn" onClick={copyReferralLink}>
                  <i className="icofont-share"></i> {copied ? 'Copied!' : 'Share Link'}
                </button>
              </div>

              {/* Referral Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-users-alt-3"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Total Downline</p>
                    <h2 className="stat-value">{currentUser?.referralCount || 0}</h2>
                    <p className="stat-info">Network members</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-dollar"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Downline Earnings</p>
                    <h2 className="stat-value">$0</h2>
                    <p className="stat-info">Total commissions</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="icofont-chart-growth"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Commission Rate</p>
                    <h2 className="stat-value">5%</h2>
                    <p className="stat-change positive">Per referral investment</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#a855f7' }}>
                    <i className="icofont-gift"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Pending Rewards</p>
                    <h2 className="stat-value">$0</h2>
                    <p className="stat-info">Awaiting payout</p>
                  </div>
                </div>
              </div>

              {/* Referral Link Card */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-link"></i> Your Referral Link</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Share this link to invite friends and earn commissions
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={`${window.location.origin}/signup?ref=${currentUser?.referralCode || currentUser?.idnum}`}
                    readOnly
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    onClick={copyReferralLink}
                    className="primary-btn"
                    style={{
                      whiteSpace: 'nowrap',
                      background: copied ? 'rgba(16,185,129,0.2)' : undefined,
                      color: copied ? '#10b981' : undefined,
                      border: copied ? '1px solid rgba(16,185,129,0.3)' : undefined
                    }}
                  >
                    {copied ? '✓ Copied!' : <><i className="icofont-copy"></i> Copy</>}
                  </button>
                </div>
              </div>

              {/* Referral History */}
              <div className="activity-section" style={{ marginTop: '1.5rem' }}>
                <div className="section-header">
                  <h3><i className="icofont-history"></i> Referral History</h3>
                  <button className="view-all">View All →</button>
                </div>
                {currentUser?.referralCount && currentUser.referralCount > 0 ? (
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <i className="icofont-user"></i>
                      </div>
                      <div className="activity-details">
                        <h4>user***{Math.floor(Math.random() * 1000)}</h4>
                        <p>{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="activity-amount positive">
                        +$25.00
                      </div>
                      <span className="status-badge active">Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="icofont-users-alt-3"></i>
                    <p>No referrals yet</p>
                    <small style={{ color: '#64748b' }}>Share your referral link to start earning commissions</small>
                  </div>
                )}
              </div>

              {/* How It Works */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-info-circle"></i> How It Works</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(240,185,11,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(240,185,11,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(240,185,11,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#f0b90b',
                      fontWeight: 700
                    }}>1</div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Share Link</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Copy & share your unique referral link</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(16,185,129,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(16,185,129,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(16,185,129,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#10b981',
                      fontWeight: 700
                    }}>2</div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Friend Invests</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>They sign up & make an investment</p>
                  </div>
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(59,130,246,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.1)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(59,130,246,0.2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      color: '#3b82f6',
                      fontWeight: 700
                    }}>3</div>
                    <h5 style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>Earn Rewards</h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: 0 }}>Get 5% of their investment</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profileState === 'Support' && (
            <div className="page-section">
              <div className="page-header">
                <h2><i className="icofont-headphone-alt"></i> Support Center</h2>
                <button className="primary-btn" onClick={() => window.location.href = 'mailto:support@binance-clone.com'}>
                  <i className="icofont-envelope"></i> Contact Us
                </button>
              </div>

              {/* Support Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <i className="icofont-live-support"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Live Chat</p>
                    <h2 className="stat-value">Online</h2>
                    <p className="stat-change positive"><i className="icofont-ui-check"></i> Available Now</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="icofont-email"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Email Response</p>
                    <h2 className="stat-value">24h</h2>
                    <p className="stat-info">Average response time</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="icofont-ticket"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Open Tickets</p>
                    <h2 className="stat-value">0</h2>
                    <p className="stat-info">No pending issues</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#a855f7' }}>
                    <i className="icofont-clock-time"></i>
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">Availability</p>
                    <h2 className="stat-value">24/7</h2>
                    <p className="stat-info">Round the clock support</p>
                  </div>
                </div>
              </div>

              {/* Support Options */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-options"></i> Contact Options</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div style={{ 
                    padding: '1.25rem', 
                    background: 'rgba(240,185,11,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(240,185,11,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <i className="icofont-live-support" style={{ color: '#f0b90b', fontSize: '1.5rem' }}></i>
                      <div>
                        <h5 style={{ color: '#f8fafc', margin: 0 }}>Live Chat</h5>
                        <span style={{ color: '#10b981', fontSize: '0.75rem' }}>Online</span>
                      </div>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1rem' }}>Chat with our team in real-time</p>
                    <button className="primary-btn" style={{ width: '100%', padding: '0.75rem' }}>
                      <i className="icofont-speech-comments"></i> Start Chat
                    </button>
                  </div>
                  <div style={{ 
                    padding: '1.25rem', 
                    background: 'rgba(59,130,246,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59,130,246,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <i className="icofont-email" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                      <div>
                        <h5 style={{ color: '#f8fafc', margin: 0 }}>Email</h5>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>24h response</span>
                      </div>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1rem' }}>Send us a detailed message</p>
                    <button 
                      className="secondary-btn" 
                      style={{ width: '100%', padding: '0.75rem' }}
                      onClick={() => window.location.href = 'mailto:support@binance-clone.com'}
                    >
                      <i className="icofont-envelope"></i> Send Email
                    </button>
                  </div>
                  <div style={{ 
                    padding: '1.25rem', 
                    background: 'rgba(16,185,129,0.05)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(16,185,129,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <i className="icofont-ticket" style={{ color: '#10b981', fontSize: '1.5rem' }}></i>
                      <div>
                        <h5 style={{ color: '#f8fafc', margin: 0 }}>Ticket</h5>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Track issues</span>
                      </div>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1rem' }}>Create and track support tickets</p>
                    <button className="secondary-btn" style={{ width: '100%', padding: '0.75rem' }}>
                      <i className="icofont-plus"></i> Create Ticket
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="profile-card" style={{ marginTop: '1.5rem' }}>
                <h4><i className="icofont-question-circle"></i> Frequently Asked Questions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="info-row" style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                    <span className="label" style={{ color: '#f8fafc', fontWeight: 500, marginBottom: '0.5rem' }}>
                      <i className="icofont-simple-right" style={{ color: '#f0b90b', marginRight: '0.5rem' }}></i>
                      How do I make my first investment?
                    </span>
                    <span className="value" style={{ color: '#94a3b8', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                      Go to Investments, select a plan, choose payment method, and follow instructions.
                    </span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                    <span className="label" style={{ color: '#f8fafc', fontWeight: 500, marginBottom: '0.5rem' }}>
                      <i className="icofont-simple-right" style={{ color: '#f0b90b', marginRight: '0.5rem' }}></i>
                      When can I withdraw my earnings?
                    </span>
                    <span className="value" style={{ color: '#94a3b8', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                      Request withdrawal anytime from Withdrawals section. Processing takes 24-48 hours.
                    </span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                    <span className="label" style={{ color: '#f8fafc', fontWeight: 500, marginBottom: '0.5rem' }}>
                      <i className="icofont-simple-right" style={{ color: '#f0b90b', marginRight: '0.5rem' }}></i>
                      What documents do I need for KYC?
                    </span>
                    <span className="value" style={{ color: '#94a3b8', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                      Government ID, proof of address, and a selfie holding your ID.
                    </span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                    <span className="label" style={{ color: '#f8fafc', fontWeight: 500, marginBottom: '0.5rem' }}>
                      <i className="icofont-simple-right" style={{ color: '#f0b90b', marginRight: '0.5rem' }}></i>
                      How does the referral program work?
                    </span>
                    <span className="value" style={{ color: '#94a3b8', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                      Share your referral link. When friends invest, you earn 5% commission.
                    </span>
                  </div>
                  <div className="info-row" style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                    <span className="label" style={{ color: '#f8fafc', fontWeight: 500, marginBottom: '0.5rem' }}>
                      <i className="icofont-simple-right" style={{ color: '#f0b90b', marginRight: '0.5rem' }}></i>
                      What payment methods are accepted?
                    </span>
                    <span className="value" style={{ color: '#94a3b8', fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                      Bitcoin (BTC), Ethereum (ETH), USDT (Tether), and bank transfers.
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="profile-card" style={{ marginTop: '1.5rem', borderColor: 'rgba(240,185,11,0.2)' }}>
                <h4><i className="icofont-info-circle"></i> Still Need Help?</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Email</p>
                    <a href="mailto:support@binance-clone.com" style={{ color: '#f0b90b', textDecoration: 'none', fontWeight: 500 }}>
                      support@binance-clone.com
                    </a>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Response Time</p>
                    <p style={{ color: '#f8fafc', margin: 0, fontWeight: 500 }}>Within 24 hours</p>
                  </div>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Availability</p>
                    <p style={{ color: '#10b981', margin: 0, fontWeight: 500 }}>
                      <i className="icofont-clock-time"></i> 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setShowSidePanel(!showSidePanel)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Overlay */}
      {showSidePanel && (
        <div className="mobile-overlay" onClick={() => setShowSidePanel(false)}></div>
      )}

      {/* Investment Modal */}
      {showInvestmentModal && selectedPlan && (
        <div className="modal-overlay" onClick={closeInvestmentModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeInvestmentModal}>
              <i className="icofont-close"></i>
            </button>

            {/* Step 1: Select Amount & Payment Method */}
            {investmentStep === 'select' && (
              <div className="modal-content">
                <div className="modal-header">
                  <h2><i className="icofont-chart-growth"></i> Create Investment</h2>
                  <p>Configure your investment in {selectedPlan.name}</p>
                </div>

                <div className="modal-body">
                  <div className="investment-summary-card">
                    <h3>{selectedPlan.name}</h3>
                    <div className="summary-grid">
                      <div>
                        <span className="label">Daily ROI</span>
                        <span className="value">{formatPercent(selectedPlan.dailyRate)}</span>
                      </div>
                      <div>
                        <span className="label">Duration</span>
                        <span className="value">{selectedPlan.durationLabel}</span>
                      </div>
                      <div>
                        <span className="label">Total Return</span>
                        <span className="value">{formatPercent(selectedPlan.dailyRate * selectedPlan.durationDays)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Investment Amount (USD)</label>
                    <input
                      type="number"
                      value={investmentForm.capital}
                      onChange={(e) => setInvestmentForm({ ...investmentForm, capital: e.target.value })}
                      min={selectedPlan.minCapital}
                      max={selectedPlan.maxCapital || undefined}
                      placeholder={`Min: $${selectedPlan.minCapital.toLocaleString()}`}
                      className="modal-input"
                    />
                    <small className="input-hint">
                      Range: ${selectedPlan.minCapital.toLocaleString()}
                      {selectedPlan.maxCapital && ` - $${selectedPlan.maxCapital.toLocaleString()}`}
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <div className="payment-methods-grid">
                      {Object.entries(paymentMethods).map(([key, method]) => (
                        <button
                          key={key}
                          className={`payment-method-card ${investmentForm.paymentMethod === key ? 'active' : ''}`}
                          onClick={() => setInvestmentForm({ ...investmentForm, paymentMethod: key })}
                        >
                          <span className="method-icon">{method.icon}</span>
                          <span className="method-name">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {investmentForm.capital && parseFloat(investmentForm.capital) >= selectedPlan.minCapital && (
                    <div className="earnings-preview">
                      <h4>Daily Earnings Projection</h4>
                      <div className="preview-grid">
                        <div>
                          <span className="label">You Invest</span>
                          <span className="value">${parseFloat(investmentForm.capital).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="label">Daily Earnings</span>
                          <span className="value positive">
                            +${(parseFloat(investmentForm.capital) * selectedPlan.dailyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/day
                          </span>
                        </div>
                        <div>
                          <span className="label">Duration</span>
                          <span className="value">{selectedPlan.durationDays} days</span>
                        </div>
                        <div>
                          <span className="label">Total Expected (after {selectedPlan.durationDays} days)</span>
                          <span className="value">
                            ${(parseFloat(investmentForm.capital) * selectedPlan.dailyRate * selectedPlan.durationDays).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={closeInvestmentModal}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleInvestmentNext}>
                    Continue <i className="icofont-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm Details */}
            {investmentStep === 'confirm' && (
              <div className="modal-content">
                <div className="modal-header">
                  <h2><i className="icofont-verify"></i> Confirm Investment</h2>
                  <p>Review your investment details</p>
                </div>

                <div className="modal-body">
                  <div className="confirmation-card">
                    <h3>Investment Summary</h3>
                    <div className="confirm-row">
                      <span>Plan</span>
                      <strong>{selectedPlan.name}</strong>
                    </div>
                    <div className="confirm-row">
                      <span>Investment Amount</span>
                      <strong>${parseFloat(investmentForm.capital).toLocaleString()}</strong>
                    </div>
                    <div className="confirm-row">
                      <span>Daily Earnings</span>
                      <strong className="positive">+${(parseFloat(investmentForm.capital) * selectedPlan.dailyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/day</strong>
                    </div>
                    <div className="confirm-row">
                      <span>Duration</span>
                      <strong>{selectedPlan.durationLabel}</strong>
                    </div>
                    <div className="confirm-row">
                      <span>Total Expected (credited daily)</span>
                      <strong>
                        ${(parseFloat(investmentForm.capital) * selectedPlan.dailyRate * selectedPlan.durationDays).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>
                    <div className="confirm-row">
                      <span>Payment Method</span>
                      <strong>{paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods].name}</strong>
                    </div>
                  </div>

                  <div className="warning-box">
                    <i className="icofont-warning"></i>
                    <div>
                      <strong>How it works:</strong> Your earnings are credited daily to your balance. You'll receive ${(parseFloat(investmentForm.capital) * selectedPlan.dailyRate).toLocaleString()} every day for {selectedPlan.durationDays} days.
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={handleInvestmentBack}>
                    <i className="icofont-arrow-left"></i> Back
                  </button>
                  <button className="btn-primary" onClick={handleInvestmentNext}>
                    Proceed to Payment <i className="icofont-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Details */}
            {investmentStep === 'payment' && (
              <div className="modal-content">
                <div className="modal-header">
                  <h2><i className="icofont-pay"></i> Complete Payment</h2>
                  <p>Send payment to activate your investment</p>
                </div>

                <div className="modal-body">
                  <div className="payment-instructions">
                    <div className="payment-amount-box">
                      <div className="amount-label">Amount to Pay</div>
                      <div className="amount-value">${parseFloat(investmentForm.capital).toLocaleString()}</div>
                      <div className="amount-method">via {paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods].name}</div>
                    </div>

                    {investmentForm.paymentMethod !== 'Bank' ? (
                      <div className="crypto-payment-details">
                        <div className="detail-row">
                          <span className="detail-label">Network</span>
                          <span className="detail-value">
                            {'network' in paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods] 
                              ? (paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods] as any).network 
                              : ''}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Wallet Address</span>
                          <div className="address-box">
                            <code>
                              {'address' in paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods] 
                                ? (paymentMethods[investmentForm.paymentMethod as keyof typeof paymentMethods] as any).address 
                                : ''}
                            </code>
                            <button className="copy-btn" onClick={copyPaymentAddress}>
                              {paymentCopied ? <i className="icofont-check"></i> : <i className="icofont-copy"></i>}
                            </button>
                          </div>
                        </div>
                        <div className="qr-placeholder">
                          <div className="qr-box">
                            <i className="icofont-qr-code"></i>
                            <p>QR Code</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bank-payment-details">
                        <div className="detail-row">
                          <span className="detail-label">Account Name</span>
                          <span className="detail-value">{paymentMethods.Bank.accountName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Account Number</span>
                          <div className="address-box">
                            <code>{paymentMethods.Bank.accountNumber}</code>
                            <button className="copy-btn" onClick={copyPaymentAddress}>
                              {paymentCopied ? <i className="icofont-check"></i> : <i className="icofont-copy"></i>}
                            </button>
                          </div>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Bank Name</span>
                          <span className="detail-value">{paymentMethods.Bank.bankName}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Routing Number</span>
                          <span className="detail-value">{paymentMethods.Bank.routingNumber}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">SWIFT Code</span>
                          <span className="detail-value">{paymentMethods.Bank.swiftCode}</span>
                        </div>
                        <div className="detail-row" style={{ marginTop: '1.5rem' }}>
                          <span className="detail-label">Transaction Hash</span>
                          <input
                            type="text"
                            className="modal-input"
                            placeholder="Enter transaction hash"
                            value={investmentForm.transactionHash}
                            onChange={e => setInvestmentForm({ ...investmentForm, transactionHash: e.target.value })}
                            style={{ width: '100%', marginTop: '0.5rem' }}
                          />
                        </div>
                        <div className="detail-row" style={{ marginTop: '1.5rem' }}>
                          <span className="detail-label">Upload Payment Screenshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="modal-input"
                            onChange={e => setInvestmentForm({ ...investmentForm, bankSlip: e.target.files ? e.target.files[0] : null })}
                            style={{ width: '100%', marginTop: '0.5rem' }}
                          />
                          {investmentForm.bankSlip && (
                            <span style={{ color: '#f0b90b', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                              Selected file: {investmentForm.bankSlip.name}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="payment-notes">
                      <h4><i className="icofont-info-circle"></i> Important Notes</h4>
                      <ul>
                        <li>Send the exact amount specified above</li>
                        <li>Your investment will be activated after payment confirmation</li>
                        <li>Processing time: 1-3 confirmations for crypto, 1-2 business days for bank transfer</li>
                        <li>Contact support if you have any issues</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-secondary" onClick={handleInvestmentBack}>
                    <i className="icofont-arrow-left"></i> Back
                  </button>
                  <button className="btn-primary" onClick={handleSubmitInvestment}>
                    <i className="icofont-check"></i> I've Made Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && (
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
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  KYC Verification
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Step {kycStep === 'intro' ? '1' : kycStep === 'personal' ? '2' : kycStep === 'documents' ? '3' : kycStep === 'review' ? '4' : '5'} of 5
                </p>
              </div>
              <button
                onClick={closeKycModal}
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

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {kycStep === 'intro' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 24px rgba(240,185,11,0.3)'
                  }}>
                    <i className="icofont-verification-check" style={{ fontSize: '2.5rem', color: '#0f172a' }}></i>
                  </div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Verify Your Identity
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    To comply with regulations and ensure account security, we need to verify your identity.
                  </p>
                  <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h5 style={{ color: '#f0b90b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
                      What You'll Need:
                    </h5>
                    <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '2', paddingLeft: '1.5rem', margin: 0 }}>
                      <li>Valid government-issued ID (Passport, Driver's License, or National ID)</li>
                      <li>Proof of address (Utility bill or bank statement less than 3 months old)</li>
                      <li>A clear selfie holding your ID document</li>
                      <li>5-10 minutes of your time</li>
                    </ul>
                  </div>
                  <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                    <small style={{ color: '#93c5fd', fontSize: '0.75rem', lineHeight: '1.5' }}>
                      <i className="icofont-lock" style={{ marginRight: '0.5rem' }}></i>
                      Your information is encrypted and securely stored. We never share your data with third parties.
                    </small>
                  </div>
                </div>
              )}

              {kycStep === 'personal' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Personal Information
                  </h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                      ID Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={kycForm.idType}
                      onChange={(e) => setKycForm({ ...kycForm, idType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID Card</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                      ID Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={kycForm.idNumber}
                      onChange={(e) => setKycForm({ ...kycForm, idNumber: e.target.value })}
                      placeholder="Enter your ID number"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              )}

              {kycStep === 'documents' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Upload Documents
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* ID Document */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                        Identity Document <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px dashed rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload('idDocument', e)}
                          style={{ display: 'none' }}
                          id="kyc-id-upload"
                        />
                        <label htmlFor="kyc-id-upload" style={{ cursor: 'pointer', display: 'block' }}>
                          {kycForm.idDocument ? (
                            <div>
                              <i className="icofont-file-document" style={{ fontSize: '2rem', color: '#10b981', display: 'block', marginBottom: '0.5rem' }}></i>
                              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>{kycForm.idDocument.name}</span>
                            </div>
                          ) : (
                            <div>
                              <i className="icofont-upload-alt" style={{ fontSize: '2rem', color: '#f0b90b', display: 'block', marginBottom: '0.5rem' }}></i>
                              <span style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem' }}>Choose file or drag here</span>
                              <small style={{ color: '#64748b', fontSize: '0.75rem' }}>JPG, PNG or PDF (Max 5MB)</small>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Address Document */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                        Proof of Address <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px dashed rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload('addressDocument', e)}
                          style={{ display: 'none' }}
                          id="kyc-address-upload"
                        />
                        <label htmlFor="kyc-address-upload" style={{ cursor: 'pointer', display: 'block' }}>
                          {kycForm.addressDocument ? (
                            <div>
                              <i className="icofont-file-document" style={{ fontSize: '2rem', color: '#10b981', display: 'block', marginBottom: '0.5rem' }}></i>
                              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>{kycForm.addressDocument.name}</span>
                            </div>
                          ) : (
                            <div>
                              <i className="icofont-upload-alt" style={{ fontSize: '2rem', color: '#f0b90b', display: 'block', marginBottom: '0.5rem' }}></i>
                              <span style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem' }}>Choose file or drag here</span>
                              <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Utility bill or bank statement</small>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Selfie Document */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                        Selfie with ID <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px dashed rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('selfieDocument', e)}
                          style={{ display: 'none' }}
                          id="kyc-selfie-upload"
                        />
                        <label htmlFor="kyc-selfie-upload" style={{ cursor: 'pointer', display: 'block' }}>
                          {kycForm.selfieDocument ? (
                            <div>
                              <i className="icofont-file-document" style={{ fontSize: '2rem', color: '#10b981', display: 'block', marginBottom: '0.5rem' }}></i>
                              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>{kycForm.selfieDocument.name}</span>
                            </div>
                          ) : (
                            <div>
                              <i className="icofont-upload-alt" style={{ fontSize: '2rem', color: '#f0b90b', display: 'block', marginBottom: '0.5rem' }}></i>
                              <span style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem' }}>Choose file or drag here</span>
                              <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Clear photo holding your ID</small>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {kycStep === 'review' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Review Your Information
                  </h4>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>ID Type</span>
                      <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>
                        {kycForm.idType === 'passport' ? 'Passport' : kycForm.idType === 'drivers_license' ? "Driver's License" : 'National ID Card'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>ID Number</span>
                      <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>{kycForm.idNumber}</span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Documents Uploaded</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="icofont-check-circled" style={{ color: '#10b981', fontSize: '1rem' }}></i>
                          <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{kycForm.idDocument?.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="icofont-check-circled" style={{ color: '#10b981', fontSize: '1rem' }}></i>
                          <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{kycForm.addressDocument?.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="icofont-check-circled" style={{ color: '#10b981', fontSize: '1rem' }}></i>
                          <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{kycForm.selfieDocument?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '1rem' }}>
                    <small style={{ color: '#86efac', fontSize: '0.75rem', lineHeight: '1.5' }}>
                      <i className="icofont-info-circle" style={{ marginRight: '0.5rem' }}></i>
                      Please ensure all information is correct before submitting. Our team will review your documents within 24-48 hours.
                    </small>
                  </div>
                </div>
              )}

              {kycStep === 'success' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
                  }}>
                    <i className="icofont-check" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
                  </div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Documents Submitted!
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Thank you for submitting your verification documents. Our team will review them within 24-48 hours.
                  </p>
                  <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '1.5rem', textAlign: 'left' }}>
                    <h5 style={{ color: '#93c5fd', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>What happens next?</h5>
                    <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                      <li>We'll verify your documents</li>
                      <li>You'll receive an email notification</li>
                      <li>Once approved, you can access all platform features</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              {kycStep !== 'intro' && kycStep !== 'success' && (
                <button
                  onClick={handleKycBack}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Back
                </button>
              )}
              {kycStep !== 'success' && (
                <button
                  onClick={handleKycNext}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(240,185,11,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {kycStep === 'review' ? 'Submit Documents' : 'Continue'}
                </button>
              )}
              {kycStep === 'success' && (
                <button
                  onClick={closeKycModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(240,185,11,0.3)'
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
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
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Request Withdrawal
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Step {withdrawalStep === 'amount' ? '1' : withdrawalStep === 'method' ? '2' : withdrawalStep === 'details' ? '3' : withdrawalStep === 'confirm' ? '4' : '5'} of 5
                </p>
              </div>
              <button
                onClick={closeWithdrawalModal}
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

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {/* Step 1: Amount */}
              {withdrawalStep === 'amount' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Enter Withdrawal Amount
                  </h4>
                  <div style={{
                    background: 'rgba(240,185,11,0.1)',
                    border: '1px solid rgba(240,185,11,0.3)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Available Balance</p>
                    <h2 style={{ color: '#f0b90b', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                      ${totalBalance.toLocaleString()}
                    </h2>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                      Amount (USD) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={withdrawalForm.amount}
                      onChange={(e) => setWithdrawalForm({ ...withdrawalForm, amount: e.target.value })}
                      placeholder="Enter amount"
                      min="50"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    />
                    <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                      Min: $50 | Max: $50,000 per day
                    </small>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[100, 500, 1000, 5000].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setWithdrawalForm({ ...withdrawalForm, amount: amount.toString() })}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#f0b90b',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        ${amount.toLocaleString()}
                      </button>
                    ))}
                    <button
                      onClick={() => setWithdrawalForm({ ...withdrawalForm, amount: totalBalance.toString() })}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(240,185,11,0.1)',
                        border: '1px solid rgba(240,185,11,0.3)',
                        borderRadius: '8px',
                        color: '#f0b90b',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      All
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {withdrawalStep === 'method' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Select Payment Method
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {['Bitcoin', 'Ethereum', 'USDT', 'Bank Transfer'].map(method => (
                      <button
                        key={method}
                        onClick={() => setWithdrawalForm({ ...withdrawalForm, method })}
                        style={{
                          padding: '1.5rem',
                          background: withdrawalForm.method === method ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.03)',
                          border: withdrawalForm.method === method ? '2px solid #f0b90b' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'rgba(240,185,11,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          color: '#f0b90b'
                        }}>
                          {method === 'Bitcoin' ? '₿' : method === 'Ethereum' ? 'Ξ' : method === 'USDT' ? '₮' : '🏦'}
                        </div>
                        <div>
                          <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>{method}</div>
                          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            {method === 'Bank Transfer' ? '1-2 business days' : 'Instant transfer'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {withdrawalStep === 'details' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    {withdrawalForm.method === 'Bank Transfer' ? 'Bank Account Details' : 'Wallet Details'}
                  </h4>
                  {withdrawalForm.method === 'Bank Transfer' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                          Bank Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={withdrawalForm.bankName}
                          onChange={(e) => setWithdrawalForm({ ...withdrawalForm, bankName: e.target.value })}
                          placeholder="Enter bank name"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                          Account Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={withdrawalForm.accountName}
                          onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountName: e.target.value })}
                          placeholder="Enter account holder name"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                          Account Number <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={withdrawalForm.accountNumber}
                          onChange={(e) => setWithdrawalForm({ ...withdrawalForm, accountNumber: e.target.value })}
                          placeholder="Enter account number"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                          Routing Number
                        </label>
                        <input
                          type="text"
                          value={withdrawalForm.routingNumber}
                          onChange={(e) => setWithdrawalForm({ ...withdrawalForm, routingNumber: e.target.value })}
                          placeholder="Enter routing number (optional)"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                        Wallet Address <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={withdrawalForm.walletAddress}
                        onChange={(e) => setWithdrawalForm({ ...withdrawalForm, walletAddress: e.target.value })}
                        placeholder={`Enter your ${withdrawalForm.method} wallet address`}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontSize: '0.875rem',
                          fontFamily: 'monospace'
                        }}
                      />
                      <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                        Make sure to double-check your wallet address. Transactions cannot be reversed.
                      </small>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Confirm */}
              {withdrawalStep === 'confirm' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Confirm Withdrawal Request
                  </h4>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Amount</span>
                      <span style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>${parseFloat(withdrawalForm.amount).toLocaleString()}</span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Payment Method</span>
                      <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>{withdrawalForm.method}</span>
                    </div>
                    {withdrawalForm.method === 'Bank Transfer' ? (
                      <>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Bank Name</span>
                          <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>{withdrawalForm.bankName}</span>
                        </div>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Account Name</span>
                          <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>{withdrawalForm.accountName}</span>
                        </div>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Account Number</span>
                          <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>{withdrawalForm.accountNumber}</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Wallet Address</span>
                        <span style={{ color: '#f8fafc', fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{withdrawalForm.walletAddress}</span>
                      </div>
                    )}
                  </div>
                  <div style={{
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <small style={{ color: '#fbbf24', fontSize: '0.75rem', lineHeight: '1.5' }}>
                      <i className="icofont-warning" style={{ marginRight: '0.5rem' }}></i>
                      Your withdrawal will be reviewed within 2-4 hours. Funds will be transferred to your {withdrawalForm.method === 'Bank Transfer' ? 'bank account' : 'wallet'} within 24 hours after approval.
                    </small>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {withdrawalStep === 'success' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
                  }}>
                    <i className="icofont-check" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
                  </div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Withdrawal Requested!
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Your withdrawal request of <strong style={{ color: '#f0b90b' }}>${parseFloat(withdrawalForm.amount).toLocaleString()}</strong> has been submitted successfully.
                  </p>
                  <div style={{
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'left',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{ color: '#93c5fd', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>What's Next?</h5>
                    <ul style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem', margin: 0 }}>
                      <li>Our team will review your request (2-4 hours)</li>
                      <li>You'll receive an email notification once approved</li>
                      <li>Funds will be transferred within 24 hours</li>
                      <li>Check your withdrawal history for status updates</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              {withdrawalStep !== 'amount' && withdrawalStep !== 'success' && (
                <button
                  onClick={handleWithdrawalBack}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
              )}
              {withdrawalStep !== 'success' && (
                <button
                  onClick={handleWithdrawalNext}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(240,185,11,0.3)'
                  }}
                >
                  {withdrawalStep === 'confirm' ? 'Submit Request' : 'Continue'}
                </button>
              )}
              {withdrawalStep === 'success' && (
                <button
                  onClick={closeWithdrawalModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #f0b90b 0%, #f8d12f 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(240,185,11,0.3)'
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loan Modal */}
      {showLoanModal && (
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
            border: '1px solid rgba(59,130,246,0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Request Loan
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Step {loanStep === 'amount' ? '1' : loanStep === 'terms' ? '2' : loanStep === 'confirm' ? '3' : '4'} of 4
                </p>
              </div>
              <button
                onClick={closeLoanModal}
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

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {/* Step 1: Amount */}
              {loanStep === 'amount' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    How Much Do You Need?
                  </h4>
                  <div style={{
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Maximum Available</p>
                    <h2 style={{ color: '#60a5fa', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                      ${(totalCapital * 0.5).toLocaleString()}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>Based on 50% of your total investment</p>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                      Loan Amount (USD) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={loanForm.amount}
                      onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                      placeholder="Enter loan amount"
                      min="100"
                      max={totalCapital * 0.5}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    />
                    <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
                      Min: $100 | Max: ${(totalCapital * 0.5).toLocaleString()}
                    </small>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[500, 1000, 2500, 5000].map(amount => (
                      amount <= totalCapital * 0.5 && (
                        <button
                          key={amount}
                          onClick={() => setLoanForm({ ...loanForm, amount: amount.toString() })}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#60a5fa',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            fontWeight: 500
                          }}
                        >
                          ${amount.toLocaleString()}
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => setLoanForm({ ...loanForm, amount: (totalCapital * 0.5).toString() })}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Max
                    </button>
                  </div>
                  {loanForm.amount && parseFloat(loanForm.amount) >= 100 && (
                    <div style={{
                      marginTop: '1.5rem',
                      background: 'rgba(240,185,11,0.1)',
                      border: '1px solid rgba(240,185,11,0.3)',
                      borderRadius: '12px',
                      padding: '1rem'
                    }}>
                      <h5 style={{ color: '#f0b90b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                        Loan Calculation
                      </h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Principal:</span>
                        <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 600 }}>
                          ${parseFloat(loanForm.amount).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Interest (5%):</span>
                        <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 600 }}>
                          ${(parseFloat(loanForm.amount) * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(240,185,11,0.3)' }}>
                        <span style={{ color: '#f0b90b', fontSize: '0.875rem', fontWeight: 600 }}>Total Repayment:</span>
                        <span style={{ color: '#f0b90b', fontSize: '1rem', fontWeight: 700 }}>
                          ${(parseFloat(loanForm.amount) * 1.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Terms */}
              {loanStep === 'terms' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Loan Terms & Purpose
                  </h4>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                      Loan Duration <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {[
                        { value: '30', label: '30 Days', interest: '5%' },
                        { value: '60', label: '60 Days', interest: '10%' },
                        { value: '90', label: '90 Days', interest: '15%' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setLoanForm({ ...loanForm, duration: option.value })}
                          style={{
                            padding: '1.25rem',
                            background: loanForm.duration === option.value ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                            border: loanForm.duration === option.value ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>{option.label}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Interest: {option.interest}</div>
                          </div>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: loanForm.duration === option.value ? '2px solid #60a5fa' : '2px solid rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {loanForm.duration === option.value && (
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#60a5fa' }}></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                      Loan Purpose <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      value={loanForm.purpose}
                      onChange={(e) => setLoanForm({ ...loanForm, purpose: e.target.value })}
                      placeholder="Please describe how you plan to use this loan..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {loanStep === 'confirm' && (
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Review Loan Application
                  </h4>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Loan Amount</span>
                      <span style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>${parseFloat(loanForm.amount).toLocaleString()}</span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Duration</span>
                      <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>{loanForm.duration} Days</span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Interest Rate</span>
                      <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>
                        {loanForm.duration === '30' ? '5%' : loanForm.duration === '60' ? '10%' : '15%'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Total Interest</span>
                      <span style={{ color: '#f8fafc', fontSize: '0.875rem', fontWeight: 500 }}>
                        ${(parseFloat(loanForm.amount) * (loanForm.duration === '30' ? 0.05 : loanForm.duration === '60' ? 0.10 : 0.15)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>Total Repayment</span>
                      <span style={{ color: '#60a5fa', fontSize: '1.25rem', fontWeight: 700 }}>
                        ${(parseFloat(loanForm.amount) * (loanForm.duration === '30' ? 1.05 : loanForm.duration === '60' ? 1.10 : 1.15)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.5rem' }}>Purpose</span>
                      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6', margin: 0 }}>{loanForm.purpose}</p>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <small style={{ color: '#93c5fd', fontSize: '0.75rem', lineHeight: '1.5' }}>
                      <i className="icofont-info-circle" style={{ marginRight: '0.5rem' }}></i>
                      By submitting this application, you agree to repay the full amount plus interest within the specified duration. Failure to repay may result in liquidation of your investments.
                    </small>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {loanStep === 'success' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
                  }}>
                    <i className="icofont-check" style={{ fontSize: '2.5rem', color: '#fff' }}></i>
                  </div>
                  <h4 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
                    Loan Approved!
                  </h4>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Your loan of <strong style={{ color: '#60a5fa' }}>${parseFloat(loanForm.amount).toLocaleString()}</strong> has been approved and will be credited to your wallet within 24 hours.
                  </p>
                  <div style={{
                    background: 'rgba(240,185,11,0.1)',
                    border: '1px solid rgba(240,185,11,0.3)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'left',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{ color: '#f0b90b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Repayment Details</h5>
                    <div style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Due Date:</span>
                        <strong style={{ color: '#f8fafc' }}>
                          {new Date(Date.now() + parseInt(loanForm.duration) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Total to Repay:</span>
                        <strong style={{ color: '#f0b90b' }}>
                          ${(parseFloat(loanForm.amount) * (loanForm.duration === '30' ? 1.05 : loanForm.duration === '60' ? 1.10 : 1.15)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <small style={{ color: '#93c5fd', fontSize: '0.75rem', lineHeight: '1.5' }}>
                      <i className="icofont-bell" style={{ marginRight: '0.5rem' }}></i>
                      You'll receive email and SMS reminders before the due date. Track your loan status in the Loans section.
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              {loanStep !== 'amount' && loanStep !== 'success' && (
                <button
                  onClick={handleLoanBack}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
              )}
              {loanStep !== 'success' && (
                <button
                  onClick={handleLoanNext}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
                  }}
                >
                  {loanStep === 'confirm' ? 'Submit Application' : 'Continue'}
                </button>
              )}
              {loanStep === 'success' && (
                <button
                  onClick={closeLoanModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                  }}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
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
          zIndex: 99999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '1rem'
            }}>
              <h2 style={{
                color: '#f8fafc',
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0
              }}>
                Notifications
              </h2>
              <button
                onClick={() => setShowNotifications(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <i className="icofont-close"></i>
              </button>
            </div>

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '1.5rem'
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#94a3b8'
                }}>
                  <i className="icofont-notification" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif: Notification) => (
                  <div
                    key={notif.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      borderRadius: '8px',
                      background: notif.read ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.1)',
                      border: notif.read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(59,130,246,0.3)',
                      cursor: notif.read ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={async () => {
                      if (!notif.read) {
                        try {
                          await supabaseDb.markNotificationAsRead(String(notif.id))
                          setNotifications((prev: Notification[]) => prev.map((n: Notification) => 
                            n.id === notif.id ? { ...n, read: true } : n
                          ))
                        } catch (error) {
                          console.log('Could not mark notification as read:', error)
                        }
                      }
                    }}
                  >
                    <div style={{
                      marginRight: '1rem',
                      marginTop: '0.25rem'
                    }}>
                      {notif.type === 'success' && <i className="icofont-check-circled" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>}
                      {notif.type === 'error' && <i className="icofont-close-circled" style={{ color: '#ef4444', fontSize: '1.25rem' }}></i>}
                      {notif.type === 'warning' && <i className="icofont-warning" style={{ color: '#f59e0b', fontSize: '1.25rem' }}></i>}
                      {notif.type === 'info' && <i className="icofont-info-circle" style={{ color: '#3b82f6', fontSize: '1.25rem' }}></i>}
                      {!['success', 'error', 'warning', 'info'].includes(notif.type) && <i className="icofont-notification" style={{ color: '#94a3b8', fontSize: '1.25rem' }}></i>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        margin: '0 0 0.25rem 0'
                      }}>
                        {notif.title ? notif.title : 'Notification'}
                      </h4>
                      <p style={{
                        color: '#cbd5e1',
                        fontSize: '0.875rem',
                        lineHeight: '1.4',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {notif.message}
                      </p>
                      <span style={{
                        color: '#64748b',
                        fontSize: '0.75rem'
                      }}>
                        {typeof notif.created_at === 'string' && notif.created_at ? new Date(notif.created_at).toLocaleString() : ''}
                      </span>
                    </div>
                    {!notif.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        marginTop: '0.5rem'
                      }}></div>
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  color: '#94a3b8',
                  fontSize: '0.875rem'
                }}>
                  {notifications.filter((n: Notification) => !n.read).length} unread
                </span>
                <div>
                  <button
                    onClick={async () => {
                      try {
                        await supabaseDb.markAllNotificationsAsRead(currentUser?.idnum || '')
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                      } catch (error) {
                        console.log('Could not mark all notifications as read:', error)
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginRight: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Mark All Read
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
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
          backdropFilter: 'blur(8px)',
          padding: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            border: `1px solid ${
              modalAlert.type === 'success' ? 'rgba(16,185,129,0.3)' :
              modalAlert.type === 'error' ? 'rgba(239,68,68,0.3)' :
              modalAlert.type === 'warning' ? 'rgba(251,191,36,0.3)' :
              'rgba(59,130,246,0.3)'
            }`,
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease'
          }}>
            {/* Header with icon */}
            <div style={{
              background: modalAlert.type === 'success' ? 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)' :
                         modalAlert.type === 'error' ? 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.1) 100%)' :
                         modalAlert.type === 'warning' ? 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.1) 100%)' :
                         'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              borderBottom: `1px solid ${
                modalAlert.type === 'success' ? 'rgba(16,185,129,0.2)' :
                modalAlert.type === 'error' ? 'rgba(239,68,68,0.2)' :
                modalAlert.type === 'warning' ? 'rgba(251,191,36,0.2)' :
                'rgba(59,130,246,0.2)'
              }`
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: modalAlert.type === 'success' ? 'rgba(16,185,129,0.2)' :
                           modalAlert.type === 'error' ? 'rgba(239,68,68,0.2)' :
                           modalAlert.type === 'warning' ? 'rgba(251,191,36,0.2)' :
                           'rgba(59,130,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                animation: 'pulse 2s infinite'
              }}>
                {modalAlert.type === 'success' && '✅'}
                {modalAlert.type === 'error' && '❌'}
                {modalAlert.type === 'warning' && '⚠️'}
                {modalAlert.type === 'info' && 'ℹ️'}
              </div>
              <h2 style={{
                color: '#f8fafc',
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0,
                textAlign: 'center'
              }}>
                {modalAlert.title}
              </h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: '0 0 2rem 0'
              }}>
                {modalAlert.message}
              </p>

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
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)'
                }}
              >
                {modalAlert.type === 'success' ? 'Great!' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}

export default UserDashboard
