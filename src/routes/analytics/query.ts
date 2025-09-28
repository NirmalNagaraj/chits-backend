import { supabase } from "../../config/supabase"
import type { AnalyticsResponse } from "../../types"

export async function getAnalyticsData(): Promise<AnalyticsResponse> {
  try {


    // Get total persons applied for chits (distinct users in chits table)
    const { data: chitUsers, error: chitUsersError } = await supabase.from("chits").select("user_id")

    if (chitUsersError) {
      throw new Error(`Failed to fetch chit users: ${chitUsersError.message}`)
    }

    const uniqueChitUsers = new Set(chitUsers?.map((u) => u.user_id) || [])
    const total_persons_applied_for_chits = uniqueChitUsers.size

    // Get total persons applied for loans (distinct users in loans table)
    const { data: loanUsers, error: loanUsersError } = await supabase.from("loans").select("user_id")

    if (loanUsersError) {
      throw new Error(`Failed to fetch loan users: ${loanUsersError.message}`)
    }

    const uniqueLoanUsers = new Set(loanUsers?.map((u) => u.user_id) || [])
    const total_persons_applied_for_loans = uniqueLoanUsers.size

    // Get total number of chits
    const { count: total_number_of_chits, error: chitsCountError } = await supabase
      .from("chits")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (chitsCountError) {
      throw new Error(`Failed to count chits: ${chitsCountError.message}`)
    }

    // Get total pending loans (active loans)
    const { count: total_pending_loans, error: pendingLoansError } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    if (pendingLoansError) {
      throw new Error(`Failed to count pending loans: ${pendingLoansError.message}`)
    }

    // Get total pending chits (unpaid chit payments)
    const { count: total_pending_chits, error: pendingChitsError } = await supabase
      .from("chit_payments")
      .select("*", { count: "exact", head: true })
      .eq("is_paid", false)

    if (pendingChitsError) {
      throw new Error(`Failed to count pending chits: ${pendingChitsError.message}`)
    }

    // Get amount in chits (sum of amount_paid from chit_payments)
    const { data: chitPayments, error: chitPaymentsError } = await supabase.from("chit_payments").select("amount_paid")

    if (chitPaymentsError) {
      throw new Error(`Failed to fetch chit payments: ${chitPaymentsError.message}`)
    }

    const amount_in_chits = chitPayments?.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0) || 0

    // Get amount pending to be paid (sum of balance from chit_payments)
    const { data: chitBalances, error: chitBalancesError } = await supabase
      .from("chit_payments")
      .select("balance")
      .eq("is_paid", false)

    if (chitBalancesError) {
      throw new Error(`Failed to fetch chit balances: ${chitBalancesError.message}`)
    }

    const amount_pending_to_be_paid_chits = chitBalances?.reduce((sum, payment) => sum + (payment.balance || 0), 0) || 0

    // Get amount provided for loans (sum of borrowed_amount from loans)
    const { data: loanAmounts, error: loanAmountsError } = await supabase.from("loans").select("borrowed_amount")

    if (loanAmountsError) {
      throw new Error(`Failed to fetch loan amounts: ${loanAmountsError.message}`)
    }

    const amount_provided_for_loans = loanAmounts?.reduce((sum, loan) => sum + (loan.borrowed_amount || 0), 0) || 0

    // Get amount paid for loans (sum of amount_paid from loans)
    const { data: loanPayments, error: loanPaymentsError } = await supabase.from("loans").select("amount_paid")

    if (loanPaymentsError) {
      throw new Error(`Failed to fetch loan payments: ${loanPaymentsError.message}`)
    }

    const amount_paid_for_loans = loanPayments?.reduce((sum, loan) => sum + (loan.amount_paid || 0), 0) || 0

    // Get count of unpaid chits
    const { count: count_of_unpaid_chits, error: unpaidChitsError } = await supabase
      .from("chit_payments")
      .select("*", { count: "exact", head: true })
      .eq("is_paid", false)

    if (unpaidChitsError) {
      throw new Error(`Failed to count unpaid chits: ${unpaidChitsError.message}`)
    }

    // Get count of unpaid loans
    const { count: count_of_unpaid_loans, error: unpaidLoansError } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("is_paid", false)

    if (unpaidLoansError) {
      throw new Error(`Failed to count unpaid loans: ${unpaidLoansError.message}`)
    }

    const analyticsData: AnalyticsResponse = {
      total_persons_applied_for_chits: total_persons_applied_for_chits,
      total_persons_applied_for_loans: total_persons_applied_for_loans,
      total_number_of_active_chits: total_number_of_chits || 0,
      total_pending_loans: total_pending_loans || 0,
      total_pending_chits: total_pending_chits || 0,
      amount_in_chits: amount_in_chits,
      amount_pending_to_be_paid_chits: amount_pending_to_be_paid_chits,
      amount_provided_for_loans: amount_provided_for_loans,
      amount_paid_for_loans: amount_paid_for_loans,
      count_of_unpaid_chits: count_of_unpaid_chits || 0,
      count_of_unpaid_loans: count_of_unpaid_loans || 0,
    }

    console.log("[v0] Analytics data compiled successfully:", analyticsData)
    return analyticsData
  } catch (error) {
    console.error("[v0] Error in getAnalyticsData:", error)
    throw new Error(`Analytics data collection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
