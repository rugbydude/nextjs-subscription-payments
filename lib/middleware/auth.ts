// lib/middleware/auth.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function validateAuth() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Not authenticated", status: 401 }
  }

  return { userId: session.user.id }
}

export async function validateTokens(userId: string, cost: number) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from("token_balances")
    .select("balance")
    .eq("user_id", userId)
    .single()

  if (error || !data || data.balance < cost) {
    return { error: "Insufficient tokens", status: 403 }
  }

  return { balance: data.balance }
}
