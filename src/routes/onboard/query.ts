import { supabase } from "../../config/supabase"

export interface CreateUserParams {
  name: string
  total_chits: number
  mobile: number
}

export interface UserResult {
  id: number
  created_at: string
  user_id: string
  name: string
  total_chits: number
  mobile: number
}

export interface ChitResult {
  id: number
  created_at: string
  chit_id: string
  total_chits: number
  is_active: boolean
  user_id: string
}

export interface OnboardResult {
  user: UserResult
  chit: ChitResult
}

/**
 * Create a new user and associated chit entry in the database
 * @param params - User creation parameters
 * @returns Promise<OnboardResult> - Created user and chit data
 */
export const createUser = async (params: CreateUserParams): Promise<OnboardResult> => {
  const { name, total_chits, mobile } = params

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        name,
        total_chits,
        mobile,
      })
      .select("id, created_at, user_id, name, total_chits, mobile")
      .single()

    if (userError) {
      console.error("Supabase error in createUser:", userError)
      throw new Error(`Failed to create user: ${userError.message}`)
    }

    const { data: chitData, error: chitError } = await supabase
      .from("chits")
      .insert({
        total_chits,
        user_id: userData.user_id,
      })
      .select("id, created_at, chit_id, total_chits, is_active, user_id")
      .single()

    if (chitError) {
      console.error("Supabase error in createChit:", chitError)
      await supabase.from("users").delete().eq("user_id", userData.user_id)
      throw new Error(`Failed to create chit: ${chitError.message}`)
    }

    return {
      user: userData,
      chit: chitData,
    }
  } catch (error) {
    console.error("Database error in createUser:", error)
    throw new Error("Failed to create user and chit")
  }
}

/**
 * Check if a mobile number already exists
 * @param mobile - Mobile number to check
 * @returns Promise<boolean> - True if mobile exists
 */
export const checkMobileExists = async (mobile: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("users").select("id").eq("mobile", mobile).limit(1)

    if (error) {
      console.error("Supabase error in checkMobileExists:", error)
      throw new Error(`Failed to check mobile number: ${error.message}`)
    }

    return data && data.length > 0
  } catch (error) {
    console.error("Database error in checkMobileExists:", error)
    throw new Error("Failed to check mobile number")
  }
}
