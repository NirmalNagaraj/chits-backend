import { supabase } from "../../../config/supabase"
import type { UnpaidChitsResponse, UnpaidChitEntry } from "../../../types"

export async function getUnpaidChits(): Promise<UnpaidChitsResponse> {
  try {
    // Get unpaid chit payments with user details
    const { data: unpaidPayments, error: unpaidError } = await supabase
      .from("chit_payments")
      .select(`
        user_id,
        balance,
        users!inner(name, mobile)
      `)
      .eq("is_paid", false)

    if (unpaidError) {
      throw new Error(`Failed to fetch unpaid chits: ${unpaidError.message}`)
    }

    if (!unpaidPayments || unpaidPayments.length === 0) {
      return {
        unpaid_chits: [],
        total_users_with_unpaid_chits: 0,
        total_unpaid_amount: 0,
      }
    }

    // Group by user_id and sum the balances
    const userMap = new Map<string, UnpaidChitEntry>()
    let totalUnpaidAmount = 0

    for (const payment of unpaidPayments) {
      const userId = payment.user_id
      const balance = payment.balance || 0
      const userData = payment.users as any

      totalUnpaidAmount += balance

      if (userMap.has(userId)) {
        const existing = userMap.get(userId)!
        existing.total_amount_to_be_paid += balance
        existing.unpaid_chits_count += 1
      } else {
        userMap.set(userId, {
          user_id: userId,
          name: userData.name,
          mobile: userData.mobile,
          total_amount_to_be_paid: balance,
          unpaid_chits_count: 1,
        })
      }
    }

    // Convert map to array and sort by amount (highest first)
    const unpaidChits = Array.from(userMap.values()).sort(
      (a, b) => b.total_amount_to_be_paid - a.total_amount_to_be_paid,
    )

    return {
      unpaid_chits: unpaidChits,
      total_users_with_unpaid_chits: unpaidChits.length,
      total_unpaid_amount: totalUnpaidAmount,
    }
  } catch (error) {
    throw new Error(`Failed to retrieve unpaid chits: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
