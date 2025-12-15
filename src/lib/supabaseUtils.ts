import { supabase } from '@/config/supabase'
import bcrypt from 'bcryptjs'

// Export the supabase instance for direct use
export { supabase }

// Create a typed client to avoid errors when Supabase is not configured
const db = supabase as any

// Type definitions
export interface UserRecord {
  id?: string
  idnum?: string
  name?: string
  userName?: string
  email?: string
  password?: string
  phoneNumber?: string
  country?: string
  city?: string
  address?: string
  balance?: number
  bonus?: number
  date?: string
  avatar?: string
  investmentCount?: number
  referralCount?: number
  referralBonusTotal?: number
  referralCode?: string | null
  referralCodeExpiresAt?: string | null
  referralCodeIssuedAt?: string | null
  referredByCode?: string | null
  referralLevel?: number
  authStatus?: string | null
  role?: 'user' | 'admin' | 'superadmin'
}

export interface InvestmentRecord {
  id?: string
  idnum?: string
  plan?: string
  status?: string
  capital?: number
  roi?: number
  bonus?: number
  duration?: number
  paymentOption?: string
  transactionHash?: string | null
  authStatus?: string
  creditedRoi?: number
  creditedBonus?: number
  date?: string
  created_at?: string
}

export interface WithdrawalRecord {
  id?: string
  idnum?: string
  amount?: number
  wallet?: string
  walletAddress?: string | null
  bankName?: string | null
  accountNumber?: string | null
  accountName?: string | null
  routingNumber?: string | null
  status?: string
  method?: string
  authStatus?: string
  date?: string
  created_at?: string
}

export interface LoanRecord {
  id?: string
  idnum?: string
  amount?: number
  status?: string
  interestRate?: number
  duration?: number
  authStatus?: string
  date?: string
  created_at?: string
}

export interface KycRecord {
  id?: string
  idnum?: string
  fullName?: string
  dateOfBirth?: string
  nationality?: string
  documentType?: string
  documentNumber?: string
  documentFrontUrl?: string
  documentBackUrl?: string
  selfieUrl?: string
  status?: string
  rejectionReason?: string
  submittedAt?: string
  reviewedAt?: string
  created_at?: string
  updated_at?: string
}

export interface NotificationRecord {
  id?: string
  idnum?: string
  title?: string
  message?: string
  type?: string
  read?: boolean
  created_at?: string
}

// Map database record to application format
const mapUserRecord = (record: any): UserRecord => {
  if (!record || typeof record !== 'object') return record
  const {
    authstatus,
    referral_count,
    referral_bonus_total,
    referral_code,
    referral_code_expires_at,
    referral_code_issued_at,
    referred_by_code,
    referral_level,
    ...rest
  } = record
  return {
    ...rest,
    authStatus: authstatus ?? rest.authStatus ?? null,
    referralCount: referral_count ?? rest.referralCount ?? 0,
    referralBonusTotal: referral_bonus_total ?? rest.referralBonusTotal ?? 0,
    referralCode: referral_code ?? rest.referralCode ?? null,
    referralCodeExpiresAt: referral_code_expires_at ?? rest.referralCodeExpiresAt ?? null,
    referralCodeIssuedAt: referral_code_issued_at ?? rest.referralCodeIssuedAt ?? null,
    referredByCode: referred_by_code ?? rest.referredByCode ?? null,
    referralLevel: referral_level ?? rest.referralLevel ?? 0,
  }
}

const mapInvestmentRecord = (record: any): InvestmentRecord => {
  if (!record || typeof record !== 'object') return record
  const { paymentoption, authstatus, transaction_hash, credited_roi, credited_bonus, ...rest } = record
  return {
    ...rest,
    paymentOption: paymentoption ?? record.paymentOption ?? 'Bitcoin',
    authStatus: authstatus ?? record.authStatus ?? 'unseen',
    transactionHash: transaction_hash ?? record.transactionHash ?? null,
    creditedRoi: credited_roi ?? record.creditedRoi ?? 0,
    creditedBonus: credited_bonus ?? record.creditedBonus ?? 0,
  }
}

const normalizeInvestmentPayload = (investmentData: Partial<InvestmentRecord> = {}) => ({
  idnum: investmentData.idnum,
  plan: investmentData.plan,
  status: investmentData.status || 'pending',
  capital: investmentData.capital ?? 0,
  roi: investmentData.roi ?? 0,
  bonus: investmentData.bonus ?? 0,
  duration: investmentData.duration ?? 5,
  "paymentOption": investmentData.paymentOption ?? 'Bitcoin',
  "transactionHash": investmentData.transactionHash ?? null,
  "authStatus": investmentData.authStatus ?? 'unseen',
  creditedRoi: investmentData.creditedRoi ?? 0,
  creditedBonus: investmentData.creditedBonus ?? 0,
})

// Referral helpers
const REFERRAL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const REFERRAL_CODE_LENGTH = 8
const REFERRAL_CODE_RETRY_LIMIT = 12
const REFERRAL_DEFAULT_EXPIRATION_DAYS = 30
const REFERRAL_MAX_LEVEL = 3

const addDaysToNow = (days: number) => {
  const base = new Date()
  base.setUTCDate(base.getUTCDate() + (Number.isFinite(days) ? days : REFERRAL_DEFAULT_EXPIRATION_DAYS))
  return base.toISOString()
}

const randomReferralCode = (seed = '') => {
  const sanitizedSeed = (seed || '')
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase()
  const prefix = sanitizedSeed.slice(0, 2).padEnd(2, 'G')
  let output = prefix

  while (output.length < REFERRAL_CODE_LENGTH) {
    const index = Math.floor(Math.random() * REFERRAL_CODE_ALPHABET.length)
    output += REFERRAL_CODE_ALPHABET[index]
  }

  return output
}

// Generate unique user ID
const generateUserId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `USR${timestamp}${random}`.toUpperCase()
}

// Authentication helpers
export const supabaseAuth = {
  async signup(email: string, password: string, userData: Partial<UserRecord> = {}): Promise<UserRecord> {
    // Check if email already exists
    const existingUser = await supabaseDb.getUserByEmail(email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique user ID
    const idnum = generateUserId()

    // Create user record
    const newUser = await supabaseDb.createUser({
      idnum,
      email,
      password: hashedPassword,
      balance: 0,
      bonus: 0,
      investmentCount: 0,
      referralCount: 0,
      role: 'user',
      ...userData,
    })

    return newUser
  },

  async login(emailOrUsername: string, password: string): Promise<UserRecord | null> {
    // Try to get user by email first, then by username
    let user = await supabaseDb.getUserByEmail(emailOrUsername)
    
    if (!user) {
      // If not found by email, try username
      user = await supabaseDb.getUserByUsername(emailOrUsername)
    }
    
    if (!user) {
      return null
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || '')
    if (!isValidPassword) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  async getUserBySession(): Promise<UserRecord | null> {
    const userStr = localStorage.getItem('activeUser') || sessionStorage.getItem('activeUser')
    if (!userStr) return null

    try {
      const userData = JSON.parse(userStr)
      if (userData.idnum) {
        return await supabaseDb.getUserByIdnum(userData.idnum)
      }
    } catch (error) {
      console.error('Error parsing user session:', error)
    }
    return null
  },
}

// Database operations
export const supabaseDb = {
  // User operations
  async getAllUsers(): Promise<UserRecord[]> {
    const { data, error } = await db
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []).map(mapUserRecord)
  },

  async getUserByIdnum(idnum: string): Promise<UserRecord | null> {
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('idnum', idnum)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return mapUserRecord(data)
  },

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return mapUserRecord(data)
  },

  async getUserByUsername(userName: string): Promise<UserRecord | null> {
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('userName', userName)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return mapUserRecord(data)
  },

  async createUser(userData: Partial<UserRecord>): Promise<UserRecord> {
    const { data, error } = await db
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return mapUserRecord(data)
  },

  async updateUser(idnum: string, updates: Partial<UserRecord>): Promise<UserRecord> {
    const { data, error } = await db
      .from('users')
      .update(updates)
      .eq('idnum', idnum)
      .select()
      .single()
    
    if (error) throw error
    return mapUserRecord(data)
  },

  async deleteUser(idnum: string): Promise<void> {
    const { error } = await db
      .from('users')
      .delete()
      .eq('idnum', idnum)
    
    if (error) throw error
  },

  // Investment operations
  async getAllInvestments(): Promise<InvestmentRecord[]> {
    const { data, error } = await db
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapInvestmentRecord)
  },

  async getInvestmentsByUser(idnum: string): Promise<InvestmentRecord[]> {
    const { data, error } = await db
      .from('investments')
      .select('*')
      .eq('idnum', idnum)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return (data || []).map(mapInvestmentRecord)
  },

  async createInvestment(investmentData: Partial<InvestmentRecord>): Promise<InvestmentRecord> {
    const payload = normalizeInvestmentPayload(investmentData)
    const { data, error } = await db
      .from('investments')
      .insert([payload])
      .select()
      .single()
    
    if (error) throw error
    return mapInvestmentRecord(data)
  },

  async updateInvestment(id: string, updates: Partial<InvestmentRecord>): Promise<InvestmentRecord> {
    const { data, error } = await db
      .from('investments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return mapInvestmentRecord(data)
  },

  async deleteInvestment(id: string): Promise<void> {
    const { error } = await db
      .from('investments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Withdrawal operations
  async getAllWithdrawals(): Promise<WithdrawalRecord[]> {
    const { data, error } = await db
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getWithdrawalsByUser(idnum: string): Promise<WithdrawalRecord[]> {
    const { data, error } = await db
      .from('withdrawals')
      .select('*')
      .eq('idnum', idnum)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createWithdrawal(withdrawalData: Partial<WithdrawalRecord>): Promise<WithdrawalRecord> {
    const { data, error } = await db
      .from('withdrawals')
      .insert([withdrawalData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateWithdrawal(id: string, updates: Partial<WithdrawalRecord>): Promise<WithdrawalRecord> {
    const { data, error } = await db
      .from('withdrawals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // KYC operations
  async getAllKycRequests(): Promise<KycRecord[]> {
    const { data, error } = await db
      .from('kyc_verifications')
      .select('*')
      .order('submittedAt', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getKycByUser(idnum: string): Promise<KycRecord[]> {
    const { data, error } = await db
      .from('kyc_verifications')
      .select('*')
      .eq('idnum', idnum)
      .order('submittedAt', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateKycStatus(id: string, status: string, rejectionReason?: string): Promise<KycRecord> {
    const updates: any = { status, reviewedAt: new Date().toISOString() }
    if (rejectionReason) updates.rejectionReason = rejectionReason
    
    const { data, error } = await db
      .from('kyc_verifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async createKyc(kycData: Partial<KycRecord>): Promise<KycRecord> {
    const { data, error } = await db
      .from('kyc_verifications')
      .insert([kycData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Notification operations
  async getNotificationsByUser(idnum: string): Promise<NotificationRecord[]> {
    const { data, error } = await db
      .from('notifications')
      .select('*')
      .eq('idnum', idnum)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createNotification(notificationData: Partial<NotificationRecord>): Promise<NotificationRecord> {
    const { data, error } = await db
      .from('notifications')
      .insert([notificationData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async markNotificationAsRead(id: string): Promise<NotificationRecord> {
    const { data, error } = await db
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async markAllNotificationsAsRead(idnum: string): Promise<void> {
    const { error } = await db
      .from('notifications')
      .update({ read: true })
      .eq('idnum', idnum)
      .eq('read', false)
    
    if (error) throw error
  },

  // Loan operations
  async getAllLoans(): Promise<LoanRecord[]> {
    const { data, error } = await db
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getLoansByUser(idnum: string): Promise<LoanRecord[]> {
    const { data, error } = await db
      .from('loans')
      .select('*')
      .eq('idnum', idnum)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createLoan(loan: LoanRecord): Promise<LoanRecord> {
    const { data, error } = await db
      .from('loans')
      .insert(loan)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLoan(id: string, updates: Partial<LoanRecord>): Promise<LoanRecord> {
    const { data, error } = await db
      .from('loans')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
}

// Realtime subscriptions
export const supabaseRealtime = {
  subscribeToUsers(callback: (payload: any) => void) {
    return db
      .channel('userlogs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'userlogs' }, callback)
      .subscribe()
  },

  subscribeToInvestments(callback: (payload: any) => void) {
    return db
      .channel('investments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, callback)
      .subscribe()
  },

  subscribeToWithdrawals(callback: (payload: any) => void) {
    return db
      .channel('withdrawals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, callback)
      .subscribe()
  },

  subscribeToLoans(callback: (payload: any) => void) {
    return db
      .channel('loans-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loans' }, callback)
      .subscribe()
  },

  subscribeToKyc(callback: (payload: any) => void) {
    return db
      .channel('kyc-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kyc' }, callback)
      .subscribe()
  },
}
