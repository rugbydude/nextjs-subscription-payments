// components/tokens/TokenPurchase.tsx
"use client"

import { useState } from "react"
import { purchaseTokens } from "@/lib/stripe/stripe"
import type { TokenPackage } from "@/types/stripe"

const TOKEN_PACKAGES: TokenPackage[] = [
  { id: "basic", name: "Basic", tokens: 100, price: 10, stripePriceId: "price_basic" },
  { id: "pro", name: "Pro", tokens: 500, price: 40, stripePriceId: "price_pro" },
  { id: "enterprise", name: "Enterprise", tokens: 2000, price: 140, stripePriceId: "price_enterprise" }
]

export default function TokenPurchase() {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async (package: TokenPackage) => {
    try {
      setLoading(true)
      await purchaseTokens(package)
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TOKEN_PACKAGES.map((package) => (
        <div key={package.id} className="p-6 border rounded-lg bg-white">
          <h3 className="text-xl font-bold mb-2">{package.name}</h3>
          <p className="text-3xl font-bold mb-4">${package.price}</p>
          <p className="mb-4">{package.tokens} Tokens</p>
          <button
            onClick={() => handlePurchase(package)}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Purchase"}
          </button>
        </div>
      ))}
    </div>
  )
}
