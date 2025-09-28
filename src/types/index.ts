export interface HealthResponse {
  status: "ok" | "error"
  timestamp: string
  uptime: number
  environment: string
  version: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: number
  created_at: string
  user_id: string
  name: string
  total_chits: number
  mobile: number
}

export interface CreateUserRequest {
  name: string
  total_chits: number
  mobile: number
}

export interface Chit {
  id: number
  created_at: string
  chit_id: string
  total_chits: number
  is_active: boolean
  user_id: string
}

export interface CreateChitRequest {
  total_chits: number
  user_id: string
}

export interface CreateChitResponse {
  chit_id: string
  total_chits: number
  is_active: boolean
  user_id: string
  created_at: string
}

export interface CreateUserResponse {
  user_id: string
  name: string
  total_chits: number
  mobile: number
  created_at: string
  chit: CreateChitResponse
}

export interface TransactionHistoryEntry {
  timestamp: string
  amount: number
  mode: string
}

export interface ChitPayment {
  id: number
  created_at: string
  user_id: string
  chit_id: string
  due_amount: number
  amount_paid: number
  balance: number | null
  weekly_installment: number
  payment_mode: string | null
  paid_on: string | null
  is_paid: boolean
  transaction_history: TransactionHistoryEntry[] | null
}

export interface ChitPaymentRequest {
  user_id: string
  chit_id: string
  amount: number
  payment_mode: string
}

export interface ChitPaymentResponse {
  payment_id: number
  user_id: string
  chit_id: string
  due_amount: number
  amount_paid: number
  balance: number
  is_paid: boolean
  paid_on: string
  payment_mode: string
  weekly_installment: number
  transaction_history: TransactionHistoryEntry[]
}

export interface Config {
  id: number
  created_at: string
  attribute: string | null
  value: string | null
}

export interface WeeklyChitsUpdateResponse {
  message: string
  current_week: number
  payments_created: number
  chits_processed: ChitPayment[]
}

export interface Loan {
  id: number
  created_at: string
  loan_id: string
  is_active: boolean
  user_id: string
  interest_rate: string
  interest_type: string
  borrowed_amount: number | null
  balance: number
  amount_paid: number
  transaction_history: TransactionHistoryEntry[] | null
  is_paid: boolean
}

export interface LoanApplicationRequest {
  user_id: string
  interest_rate: string
  interest_type: string
  borrowed_amount: number
}

export interface LoanApplicationResponse {
  loan_id: string
  user_id: string
  interest_rate: string
  interest_type: string
  is_active: boolean
  created_at: string
  borrowed_amount: number | null
  balance: number
}

export interface LoanPaymentRequest {
  user_id: string
  loan_id: string
  amount: number
  payment_mode: string
}

export interface LoanPaymentResponse {
  loan_id: string
  user_id: string
  borrowed_amount: number
  balance: number
  amount_paid: number
  is_active: boolean
  is_paid: boolean
  payment_mode: string
  transaction_history: TransactionHistoryEntry[]
}

export interface UserDetailsResponse {
  user_id: string
  name: string
  mobile: number
  total_chits: number
}

export interface UserDetailedResponse {
  user_id: string
  name: string
  mobile: number
  total_chits: number
  chit_payment_history: ChitPayment[]
  loan_details: Loan[]
}

export interface AnalyticsResponse {
  total_persons_applied_for_chits: number
  total_persons_applied_for_loans: number
  total_number_of_active_chits: number
  total_pending_loans: number
  total_pending_chits: number
  amount_in_chits: number
  amount_pending_to_be_paid_chits: number
  amount_provided_for_loans: number
  amount_paid_for_loans: number
  count_of_unpaid_chits: number
  count_of_unpaid_loans: number
}

export interface DeactivateChitRequest {
  chit_id: string
  reason?: string
}

export interface DeactivateChitResponse {
  chit_id: string
  user_id: string
  is_active: boolean
  deactivated_at: string
  reason?: string
}

export interface DeactivateLoanRequest {
  loan_id: string
  reason?: string
}

export interface DeactivateLoanResponse {
  loan_id: string
  user_id: string
  is_active: boolean
  deactivated_at: string
  reason?: string
}

export interface UnpaidChitEntry {
  user_id: string
  name: string
  mobile: number
  total_amount_to_be_paid: number
  unpaid_chits_count: number
}

export interface UnpaidChitsResponse {
  unpaid_chits: UnpaidChitEntry[]
  total_users_with_unpaid_chits: number
  total_unpaid_amount: number
}

export interface UserSearchRequest {
  query: string
}

export interface UserSearchResponse {
  users: UserDetailsResponse[]
  total_results: number
  search_query: string
}
