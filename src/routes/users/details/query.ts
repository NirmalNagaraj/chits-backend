import { supabase } from "../../../config/supabase"
import type { UserDetailsResponse, UserDetailedResponse, ChitPayment, Loan } from "../../../types"

export async function getAllUsersDetails(): Promise<UserDetailsResponse[]> {
  console.log("[v0] Fetching all users basic details")

  const { data, error } = await supabase
    .from("users")
    .select("user_id, name, mobile, total_chits")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching users details:", error)
    throw new Error(`Failed to fetch users details: ${error.message}`)
  }

  if (!data || data.length === 0) {
    console.log("[v0] No users found")
    return []
  }

  console.log(`[v0] Successfully fetched ${data.length} users`)
  return data
}

export async function getUserDetailedInfo(userId: string): Promise<UserDetailedResponse | null> {
  console.log(`[v0] Fetching detailed info for user: ${userId}`)

  // Get user basic details
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_id, name, mobile, total_chits")
    .eq("user_id", userId)

  if (userError) {
    console.error("[v0] Error fetching user details:", userError)
    throw new Error(`Failed to fetch user details: ${userError.message}`)
  }

  if (!userData || userData.length === 0) {
    console.log(`[v0] No user found with ID: ${userId}`)
    return null
  }

  const user = userData[0]
  console.log(`[v0] Found user: ${user.name}`)

  // Get chit payment history
  const { data: chitPayments, error: chitError } = await supabase
    .from("chit_payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (chitError) {
    console.error("[v0] Error fetching chit payments:", chitError)
    throw new Error(`Failed to fetch chit payment history: ${chitError.message}`)
  }

  console.log(`[v0] Found ${chitPayments?.length || 0} chit payments`)

  // Get loan details
  const { data: loans, error: loanError } = await supabase
    .from("loans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (loanError) {
    console.error("[v0] Error fetching loans:", loanError)
    throw new Error(`Failed to fetch loan details: ${loanError.message}`)
  }

  console.log(`[v0] Found ${loans?.length || 0} loans`)

  // Convert timestamps to IST for transaction histories
  const convertToIST = (utcTimestamp: string): string => {
    const utcDate = new Date(utcTimestamp)
    const istOffset = 5.5 * 60 * 60 * 1000 // IST is UTC+5:30
    const istDate = new Date(utcDate.getTime() + istOffset)
    return istDate.toISOString()
  }

  // Process chit payments with IST timestamps
  const processedChitPayments: ChitPayment[] = (chitPayments || []).map((payment) => ({
    ...payment,
    transaction_history: payment.transaction_history
      ? payment.transaction_history.map((tx: any) => ({
          ...tx,
          timestamp: convertToIST(tx.timestamp),
        }))
      : null,
  }))

  // Process loans with IST timestamps
  const processedLoans: Loan[] = (loans || []).map((loan) => ({
    ...loan,
    transaction_history: loan.transaction_history
      ? loan.transaction_history.map((tx: any) => ({
          ...tx,
          timestamp: convertToIST(tx.timestamp),
        }))
      : null,
  }))

  const result: UserDetailedResponse = {
    user_id: user.user_id,
    name: user.name,
    mobile: user.mobile,
    total_chits: user.total_chits,
    chit_payment_history: processedChitPayments,
    loan_details: processedLoans,
  }

  console.log(`[v0] Successfully compiled detailed info for user: ${user.name}`)
  return result
}
