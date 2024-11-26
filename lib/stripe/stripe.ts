import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const handleSubscribe = async (priceId: string) => {
  try {
    const stripe = await stripePromise
    if (!stripe) throw new Error("Stripe failed to initialize")

    const response = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    })

    const { sessionId } = await response.json()
    const result = await stripe.redirectToCheckout({ sessionId })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
  } catch (error) {
    console.error("Subscription failed:", error)
    throw error
  }
}
