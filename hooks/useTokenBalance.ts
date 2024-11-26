// hooks/useTokenBalance.ts
"use client"

import { useState, useEffect } from "react"
import { getTokenBalance } from "@/lib/services/tokenService"

export function useTokenBalance() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBalance() {
      try {
        const balance = await getTokenBalance()
        setBalance(balance)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch balance"))
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  return { balance, loading, error }
}
