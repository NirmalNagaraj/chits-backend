import { supabase } from "../../../config/supabase"
import type { ChitPayment, ChitPaymentRequest, ChitPaymentResponse, TransactionHistoryEntry } from "../../../types"

export async function processChitPayment(paymentData: ChitPaymentRequest): Promise<ChitPaymentResponse> {
  try {
    // First, get the current payment record for this user and chit
    const { data: currentPayment, error: fetchError } = await supabase
      .from("chit_payments")
      .select("*")
      .eq("user_id", paymentData.user_id)
      .eq("chit_id", paymentData.chit_id)
      .eq("is_paid", false)
      .order("created_at", { ascending: false })
      .limit(1)

    if (fetchError) {
      throw new Error(`Failed to fetch current payment: ${fetchError.message}`)
    }

    if (!currentPayment || currentPayment.length === 0) {
      throw new Error("No pending payment found for this user and chit")
    }

    const payment = currentPayment[0] as ChitPayment

    // Calculate new amount paid and balance
    const newAmountPaid = payment.amount_paid + paymentData.amount
    const newBalance = payment.due_amount - newAmountPaid
    const isPaid = newAmountPaid >= payment.due_amount

    const newTransaction: TransactionHistoryEntry = {
      timestamp: new Date().toISOString(),
      amount: paymentData.amount,
      mode: paymentData.payment_mode,
    }

    const existingHistory = payment.transaction_history || []
    const updatedHistory = [...existingHistory, newTransaction]

    // Update the payment record
    const { data: updatedPayment, error: updateError } = await supabase
      .from("chit_payments")
      .update({
        amount_paid: newAmountPaid,
        balance: newBalance,
        is_paid: isPaid,
        paid_on: isPaid ? new Date().toISOString() : payment.paid_on,
        payment_mode: paymentData.payment_mode,
        transaction_history: updatedHistory, // Store updated transaction history
      })
      .eq("id", payment.id)
      .select()

    if (updateError) {
      throw new Error(`Failed to update payment: ${updateError.message}`)
    }

    if (!updatedPayment || updatedPayment.length === 0) {
      throw new Error("Failed to retrieve updated payment")
    }

    const updated = updatedPayment[0] as ChitPayment

    return {
      payment_id: updated.id,
      user_id: updated.user_id,
      chit_id: updated.chit_id,
      due_amount: updated.due_amount,
      amount_paid: updated.amount_paid,
      balance: updated.balance || 0,
      is_paid: updated.is_paid,
      paid_on: updated.paid_on || "",
      payment_mode: updated.payment_mode || "",
      weekly_installment: updated.weekly_installment,
      transaction_history: updated.transaction_history || [], // Include transaction history in response
    }
  } catch (error) {
    throw new Error(`Payment processing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
