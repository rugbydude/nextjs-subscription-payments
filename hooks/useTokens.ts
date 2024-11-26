// hooks/useTokens.ts
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"

export function useTokens() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("token_balances")
        .select("balance")
        .eq("user_id", session.user.id)
        .single()

      if (error) throw error
      setBalance(data?.balance || 0)
    } catch (error) {
      toast.error("Failed to fetch token balance")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const consumeTokens = async (amount: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("Please sign in to use tokens")
      }

      if (balance === null) {
        throw new Error("Token balance not loaded")
      }

      if (balance < amount) {
        throw new Error(`Insufficient tokens. You need ${amount} tokens but have ${balance}`)
      }

      const { error } = await supabase.rpc("consume_tokens", {
        amount_to_consume: amount
      })

      if (error) throw error
      
      setBalance(prev => (prev ?? 0) - amount)
      return true
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return false
    }
  }

  return { balance, loading, consumeTokens, refreshBalance: fetchBalance }
}
