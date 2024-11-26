// types/stripe/index.ts
export interface TokenPackage {
  id: string
  name: string
  tokens: number
  price: number
  stripePriceId: string
}

export interface TokenTransaction {
  id: string
  userId: string
  amount: number
  type: "purchase" | "consumption"
  timestamp: Date
}
