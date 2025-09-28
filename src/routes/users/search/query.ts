import { supabase } from "../../../config/supabase"
import type { UserDetailsResponse } from "../../../types"

export async function searchUsers(searchQuery: string): Promise<UserDetailsResponse[]> {
  console.log(`[v0] Executing user search for query: ${searchQuery}`)

  // Check if the search query is a number (mobile search)
  const isNumericSearch = /^\d+$/.test(searchQuery)

  let query = supabase
    .from("users")
    .select("user_id, name, mobile, total_chits")
    .order("created_at", { ascending: false })

  if (isNumericSearch) {
    console.log("[v0] Performing mobile number search")
    query = query.eq("mobile", searchQuery)
  } else {
    // Search by name (case-insensitive partial match)
    console.log("[v0] Performing name search")
    query = query.ilike("name", `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error searching users:", error)
    throw new Error(`Failed to search users: ${error.message}`)
  }

  if (!data || data.length === 0) {
    console.log(`[v0] No users found for query: ${searchQuery}`)
    return []
  }

  console.log(`[v0] Found ${data.length} users matching query: ${searchQuery}`)
  return data
}
