import { supabase } from "../../../config/supabase"
import type { Chit, ChitPayment } from "../../../types"

export const getActiveChits = async (): Promise<Chit[]> => {
  const { data, error } = await supabase.from("chits").select("*").eq("is_active", true)

  if (error) {
    throw new Error(`Failed to fetch active chits: ${error.message}`)
  }

  return data || []
}

export const getCurrentWeek = async (): Promise<number> => {
  const { data, error } = await supabase.from("config").select("value").eq("attribute", "chits_installment").limit(1)

  if (error) {
    throw new Error(`Failed to fetch current week: ${error.message}`)
  }

  if (!data || data.length === 0 || !data[0]?.value) {
    throw new Error("Chits installment configuration not found")
  }

  return Number.parseInt(data[0].value, 10)
}

export const createWeeklyPayments = async (activeChits: Chit[], currentWeek: number): Promise<ChitPayment[]> => {
  const paymentRecords = activeChits.map((chit) => {
    const dueAmount = Number(chit.total_chits) * 100 // Each chit is worth 100 rs
    return {
      user_id: chit.user_id,
      chit_id: chit.chit_id,
      due_amount: dueAmount,
      amount_paid: 0,
      balance: dueAmount, // balance = due_amount - amount_paid (0 initially)
      weekly_installment: currentWeek,
      is_paid: false,
    }
  })

  const { data, error } = await supabase.from("chit_payments").insert(paymentRecords).select()

  if (error) {
    throw new Error(`Failed to create payment records: ${error.message}`)
  }

  return data || []
}

export const incrementWeekInConfig = async (currentWeek: number): Promise<void> => {
  const newWeek = currentWeek + 1

  const { error } = await supabase
    .from("config")
    .update({ value: newWeek.toString() })
    .eq("attribute", "chits_installment")

  if (error) {
    throw new Error(`Failed to increment week in config: ${error.message}`)
  }
}

export const processWeeklyChitsUpdate = async () => {
  try {
    // Get current week from config
    const currentWeek = await getCurrentWeek()

    // Get all active chits
    const activeChits = await getActiveChits()

    if (activeChits.length === 0) {
      return {
        message: "No active chits found",
        current_week: currentWeek,
        payments_created: 0,
        chits_processed: [],
      }
    }

    // Create payment records for all active chits
    const createdPayments = await createWeeklyPayments(activeChits, currentWeek)

    // Increment the week in config
    await incrementWeekInConfig(currentWeek)

    return {
      message: `Successfully created ${createdPayments.length} payment records for week ${currentWeek}`,
      current_week: currentWeek,
      payments_created: createdPayments.length,
      chits_processed: createdPayments,
    }
  } catch (error) {
    throw error
  }
}
