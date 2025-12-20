import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabaseAuth, UserRecord } from '@/lib/supabaseUtils'
import { UserRole, getDashboardRoute, hasPermission as checkPerm, hasRoleLevel as checkRoleLevel, UserPermissions } from '@/utils/roles'

interface User {
  email: string
  name?: string
  userName?: string
  role: UserRole
  idnum?: string
  balance?: number
  bonus?: number
  referralCount?: number
  avatar?: string
  completedTrades?: number
  phoneNumber?: string
  address?: string
  city?: string
  country?: string
  referralCode?: string
  referralBonusTotal?: number
  id?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string }>
  signup: (email: string, password: string, userData?: Partial<UserRecord>) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  loading: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for saved session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('activeUser')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)

          // Optionally refresh from database
          try {
            const freshUserData = await supabaseAuth.getUserBySession()
            if (freshUserData) {
              const mappedUser = {
                email: freshUserData.email || '',
                name: freshUserData.name,
                userName: freshUserData.userName,
                role: freshUserData.role || 'user',
                idnum: freshUserData.idnum,
                balance: freshUserData.balance,
                bonus: freshUserData.bonus,
                referralCount: freshUserData.referralCount,
                avatar: freshUserData.avatar,
                completedTrades: freshUserData.completedTrades,
              }
              setUser(mappedUser)
              localStorage.setItem('activeUser', JSON.stringify(mappedUser))
            }
          } catch (err) {
            console.log('Could not refresh user data:', err)
          }
        }
      } catch (error) {
        console.error('Error loading user session:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string }> => {
    try {
      setLoading(true)
      const loggedInUser = await supabaseAuth.login(email, password)

      if (!loggedInUser) {
        return { success: false }
      }

      const userRole: UserRole = loggedInUser.role || 'user'
      const redirectTo = getDashboardRoute(userRole)

      const userData: User = {
        email: loggedInUser.email || '',
        name: loggedInUser.name,
        userName: loggedInUser.userName,
        role: userRole,
        idnum: loggedInUser.idnum,
        balance: loggedInUser.balance,
        bonus: loggedInUser.bonus,
        referralCount: loggedInUser.referralCount,
        avatar: loggedInUser.avatar,
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('activeUser', JSON.stringify(userData))

      return { success: true, redirectTo }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, userData: Partial<UserRecord> = {}): Promise<boolean> => {
    try {
      setLoading(true)
      const newUser = await supabaseAuth.signup(email, password, userData)

      const mappedUser: User = {
        email: newUser.email || '',
        name: newUser.name,
        userName: newUser.userName,
        role: newUser.role || 'user',
        idnum: newUser.idnum,
        balance: newUser.balance,
        bonus: newUser.bonus,
        referralCount: newUser.referralCount,
        avatar: newUser.avatar,
      }

      setUser(mappedUser)
      localStorage.setItem('user', JSON.stringify(mappedUser))
      localStorage.setItem('activeUser', JSON.stringify(mappedUser))

      return true
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('activeUser')
    localStorage.removeItem('adminData')
    sessionStorage.clear()
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return checkPerm(user.role, permission as keyof UserPermissions)
  }

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return checkRoleLevel(user.role, role)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('activeUser', JSON.stringify(updatedUser))
      sessionStorage.setItem('activeUser', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated: !!user,
      loading,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
