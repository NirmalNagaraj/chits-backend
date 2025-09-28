import { supabase } from "../../../config/supabase"
import type { DeactivateLoanResponse } from "../../../types"

export async function deactivateLoan(loan_id: string, reason?: string): Promise<DeactivateLoanResponse> {
  // First check if loan exists and is active
  const { data: existingLoan, error: fetchError } = await supabase
    .from("loans")
    .select("*")
    .eq("loan_id", loan_id)
    .single()

  if (fetchError) {
    throw new Error(`Loan not found: ${fetchError.message}`)
  }

  if (!existingLoan.is_active) {
    throw new Error("Loan is already inactive")
  }

  // Update loan to inactive
  const { data, error } = await supabase
    .from("loans")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("loan_id", loan_id)
    .select("*")
    .single()

  if (error) {
    throw new Error(`Failed to deactivate loan: ${error.message}`)
  }

  // Convert UTC to IST
  const istTime = new Date(data.updated_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return {
    loan_id: data.loan_id,
    user_id: data.user_id,
    is_active: data.is_active,
    deactivated_at: istTime,
    reason: reason,
  }
}
