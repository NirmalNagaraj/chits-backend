import { supabase } from "../../../config/supabase"
import type { Loan, LoanApplicationRequest } from "../../../types"

export async function createLoanApplication(loanData: LoanApplicationRequest): Promise<Loan> {
  const { data, error } = await supabase
    .from("loans")
    .insert({
      user_id: loanData.user_id,
      interest_rate: loanData.interest_rate,
      interest_type: loanData.interest_type,
      borrowed_amount: loanData.borrowed_amount,
      balance: loanData.borrowed_amount, 
      amount_paid: 0,
      is_active: true,
    })
    .select("*")
    .limit(1)

  if (error) {
    throw new Error(`Failed to create loan application: ${error.message}`)
  }

  if (!data || data.length === 0) {
    throw new Error("Failed to create loan application: No data returned")
  }

  return data[0]
}

export async function validateUserExists(userId: string): Promise<boolean> {
  const { data, error } = await supabase.from("users").select("user_id").eq("user_id", userId).limit(1)

  if (error) {
    throw new Error(`Failed to validate user: ${error.message}`)
  }

  return data && data.length > 0
}
