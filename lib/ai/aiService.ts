import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { AIRequest } from "@/types"

interface APIError extends Error {
  status?: number
  details?: string
}

export async function generateContent(request: AIRequest) {
  const supabase = createClientComponentClient()
  
  try {
    // Check token balance
    const { data: tokenData, error: tokenError } = await supabase
      .from("token_balances")
      .select("balance")
      .single()

    if (tokenError) {
      console.error("Error fetching token balance:", tokenError)
      throw new Error("Failed to check token balance")
    }

    if (!tokenData || tokenData.balance < request.count) {
      throw new Error("Insufficient tokens. Please purchase more tokens to continue using the AI generator.")
    }

    // Call OpenAI API
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.error || "AI generation failed") as APIError
      error.status = response.status
      error.details = data.details
      throw error
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response format from AI service")
    }

    // Deduct tokens only after successful generation
    const { error: updateError } = await supabase
      .from("token_balances")
      .update({ 
        balance: tokenData.balance - request.count,
        last_updated: new Date().toISOString()
      })

    if (updateError) {
      console.error("Failed to update token balance:", updateError)
      // Continue anyway since generation was successful
    }

    return data
  } catch (error: any) {
    console.error("Error in generateContent:", error)
    
    // Enhance error with additional details if available
    const enhancedError = new Error(error.message || "Failed to generate content") as APIError
    enhancedError.status = error.status
    enhancedError.details = error.details || error.toString()
    
    throw enhancedError
  }
}
