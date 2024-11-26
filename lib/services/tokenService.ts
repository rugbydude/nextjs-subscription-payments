// lib/services/tokenService.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getTokenBalance() {
  const supabase = createClientComponentClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("token_balances")
    .select("balance")
    .eq("user_id", session.user.id)
    .single()

  if (error) throw error
  return data?.balance || 0
}

export async function useTokens(amount: number) {
  const supabase = createClientComponentClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Not authenticated")

  const { data: balance, error: balanceError } = await supabase
    .from("token_balances")
    .select("balance")
    .eq("user_id", session.user.id)
    .single()

  if (balanceError) throw balanceError
  if (!balance || balance.balance < amount) {
    throw new Error("Insufficient tokens")
  }

  const { error: updateError } = await supabase
    .from("token_balances")
    .update({ balance: balance.balance - amount })
    .eq("user_id", session.user.id)

  if (updateError) throw updateError
  return balance.balance - amount
}
