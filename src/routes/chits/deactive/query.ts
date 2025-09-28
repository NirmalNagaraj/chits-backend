import { supabase } from "../../../config/supabase"
import type { DeactivateChitResponse } from "../../../types"

export async function deactivateChit(chit_id: string, reason?: string): Promise<DeactivateChitResponse> {
  // First check if chit exists and is active
  const { data: existingChit, error: fetchError } = await supabase
    .from("chits")
    .select("*")
    .eq("chit_id", chit_id)
    .single()

  if (fetchError) {
    throw new Error(`Chit not found: ${fetchError.message}`)
  }

  if (!existingChit.is_active) {
    throw new Error("Chit is already inactive")
  }

  // Update chit to inactive
  const { data, error } = await supabase
    .from("chits")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("chit_id", chit_id)
    .select("*")
    .single()

  if (error) {
    throw new Error(`Failed to deactivate chit: ${error.message}`)
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
    chit_id: data.chit_id,
    user_id: data.user_id,
    is_active: data.is_active,
    deactivated_at: istTime,
    reason: reason,
  }
}
