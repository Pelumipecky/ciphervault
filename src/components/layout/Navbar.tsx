import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
// import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Packages', href: '/packages' },
  { label: 'Markets', href: '/markets' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' }
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const closeMenu = () => setIsOpen(false)

  const handleNavClick = () => {
    closeMenu()
  }

  const handleLogout = () => {
    logout()
    closeMenu()
    setUserMenuOpen(false)
    navigate('/')
  }

  const handleDashboard = () => {
    closeMenu()
    setUserMenuOpen(false)
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <img src="/images/ciphervaultlogobig.svg" alt="Cypher Vault Investments" height={36} />
        </Link>
        <nav className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
          
          <div className="navbar__links-list">
          {navLinks.map(({ label, href }) => (
            href.startsWith('/#') ? (
              <a key={label} href={href} onClick={handleNavClick}>
                {t(`nav.${label.toLowerCase()}`)}
              </a>
            ) : (
              <NavLink key={label} to={href} onClick={handleNavClick}>
                {t(`nav.${label.toLowerCase()}`)}
              </NavLink>
            )
          ))}
          </div>
          <div className="navbar__cta-group">
            {isAuthenticated && user ? (
              <div 
                ref={userMenuRef}
                className="navbar__user-dropdown"
                style={{ position: 'relative' }}
              >
                {/* User Profile Button */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="navbar__user-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    background: userMenuOpen 
                      ? 'linear-gradient(135deg, rgba(240, 185, 11, 0.2), rgba(240, 185, 11, 0.1))' 
                      : 'rgba(240, 185, 11, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(240, 185, 11, 0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 185, 11, 0.2), rgba(240, 185, 11, 0.1))'
                    e.currentTarget.style.borderColor = 'rgba(240, 185, 11, 0.4)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(240, 185, 11, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    if (!userMenuOpen) {
                      e.currentTarget.style.background = 'rgba(240, 185, 11, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(240, 185, 11, 0.25)'
                    }
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Avatar */}
                  {user.avatar ? (
                    <img 
                      src={`/images/${user.avatar}.svg`} 
                      alt="Avatar"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(240, 185, 11, 0.3)',
                        boxShadow: '0 2px 8px rgba(240, 185, 11, 0.3)'
                      }}
                      onError={(e) => {
                        // Fallback to initial if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0b90b, #d4a00a)',
                      display: user.avatar ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontWeight: '700',
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(240, 185, 11, 0.3)'
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {/* Name & Role */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ 
                      color: '#fff', 
                      fontSize: '14px',
                      fontWeight: '600',
                      maxWidth: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.2'
                    }}>
                      {user.name || user.email?.split('@')[0]}
                    </div>
                    <div style={{
                      color: '#f0b90b',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {user.role === 'superadmin' ? 'Super Admin' : user.role}
                    </div>
                  </div>
                  {/* Dropdown Arrow */}
                  <i 
                    className={userMenuOpen ? 'icofont-rounded-up' : 'icofont-rounded-down'}
                    style={{ 
                      color: '#f0b90b', 
                      fontSize: '14px',
                      transition: 'transform 0.3s ease'
                    }}
                  ></i>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="navbar__user-menu"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: '0',
                      minWidth: '200px',
                      background: 'linear-gradient(145deg, #1e2329, #181a20)',
                      border: '1px solid rgba(240, 185, 11, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                      overflow: 'hidden',
                      zIndex: 1000,
                      animation: 'fadeInDown 0.2s ease'
                    }}
                  >
                    {/* User Info Header */}
                    <div style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(240, 185, 11, 0.05)'
                    }}>
                      <div style={{ 
                        color: '#fff', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {user.name || 'User'}
                      </div>
                      <div style={{ 
                        color: 'rgba(255,255,255,0.5)', 
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {user.email}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '8px' }}>
                      <button
                        onClick={handleDashboard}
                        className="navbar__menu-item"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          color: '#fff',
                          fontSize: '14px',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(240, 185, 11, 0.1)'
                          e.currentTarget.style.color = '#f0b90b'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#fff'
                        }}
                      >
                        <i className="icofont-dashboard" style={{ fontSize: '18px', width: '20px' }}></i>
                        <span>{t('nav.dashboard')}</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="navbar__menu-item"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          color: '#fff',
                          fontSize: '14px',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)'
                          e.currentTarget.style.color = '#f87171'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#fff'
                        }}
                      >
                        <i className="icofont-logout" style={{ fontSize: '18px', width: '20px' }}></i>
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="btn btn--primary" to="/signup" onClick={handleNavClick}>
                  {t('nav.signup')}
                </Link>
                <Link className="btn btn--ghost" to="/login" onClick={handleNavClick}>
                  {t('nav.login')}
                </Link>
              </>
            )}
            {/* Desktop-only Language switcher should be after signin links */}
            <div className="navbar__lang-wrap">
              <LanguageSwitcher variant="navbar" />
            </div>
          </div>
          {/* For mobile overlay: Language switcher shown after CTA group */}
          <div className="navbar__mobile-lang md:hidden">
            <LanguageSwitcher variant="navbar" />
          </div>
        </nav>
        <button
          className="navbar__toggle"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
          onClick={closeMenu}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Dropdown animation styles */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
