import { supabase } from "../../../config/supabase"
import type { Loan, LoanPaymentRequest, LoanPaymentResponse, TransactionHistoryEntry } from "../../../types"

export async function processLoanPayment(paymentData: LoanPaymentRequest): Promise<LoanPaymentResponse> {
  try {
    console.log(" Processing loan payment:", paymentData)

    // First, get the current loan record for this user and loan
    const { data: currentLoan, error: fetchError } = await supabase
      .from("loans")
      .select("*")
      .eq("user_id", paymentData.user_id)
      .eq("loan_id", paymentData.loan_id)
      .eq("is_active", true)

    console.log("Query result:", currentLoan, "Error:", fetchError)

    if (fetchError) {
      console.log("Fetch error:", fetchError)
      throw new Error(`Failed to fetch current loan: ${fetchError.message}`)
    }

    if (!currentLoan || currentLoan.length === 0) {
      throw new Error("No active loan found for this user and loan ID")
    }

    if (currentLoan.length > 1) {
      throw new Error("Multiple active loans found - data integrity issue")
    }

    const loan = currentLoan[0] as Loan
    console.log(" Current balance:", loan.balance, "Payment amount:", paymentData.amount)

    if (paymentData.amount > loan.balance) {
      throw new Error(`Payment amount (${paymentData.amount}) cannot exceed remaining balance (${loan.balance})`)
    }

    // Calculate new balance
    const newBalance = loan.balance - paymentData.amount
    const isFullyPaid = newBalance === 0
    const newAmountPaid = (loan.amount_paid || 0) + paymentData.amount

    console.log("New balance:", newBalance, "Is fully paid:", isFullyPaid, "Total amount paid:", newAmountPaid)

    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000 // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset)

    // Create new transaction entry
    const newTransaction: TransactionHistoryEntry = {
      timestamp: istTime.toISOString(),
      amount: paymentData.amount,
      mode: paymentData.payment_mode,
    }

    // Append to existing transaction history
    const existingHistory = loan.transaction_history || []
    const updatedHistory = [...existingHistory, newTransaction]

    console.log(" Updating loan with new balance:", newBalance)

    const { data: updatedLoan, error: updateError } = await supabase
      .from("loans")
      .update({
        balance: newBalance,
        amount_paid: newAmountPaid,
        is_active: !isFullyPaid, // Set to false if fully paid
        is_paid: isFullyPaid, // Set to true if fully paid
        transaction_history: updatedHistory,
      })
      .eq("id", loan.id)
      .select()

    console.log(" Update result:", updatedLoan, "Update error:", updateError)

    if (updateError) {
      throw new Error(`Failed to update loan: ${updateError.message}`)
    }

    if (!updatedLoan || updatedLoan.length === 0) {
      throw new Error("Failed to retrieve updated loan")
    }

    const updated = updatedLoan[0] as Loan

    return {
      loan_id: updated.loan_id,
      user_id: updated.user_id,
      borrowed_amount: updated.borrowed_amount || 0,
      balance: updated.balance,
      amount_paid: updated.amount_paid,
      is_active: updated.is_active,
      is_paid: updated.is_paid,
      payment_mode: paymentData.payment_mode,
      transaction_history: updated.transaction_history || [],
    }
  } catch (error) {
    console.error(" Payment processing error:", error)
    throw new Error(`Loan payment processing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
