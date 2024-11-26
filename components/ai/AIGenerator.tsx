"use client"

import { useState } from "react"
import { generateContent } from "@/lib/ai/aiService"
import type { AIRequest } from "@/types"
import { toast } from "@/components/ui/Toasts/use-toast"

export default function AIGenerator({ 
  type, 
  context, 
  onGenerate 
}: { 
  type: AIRequest["type"]
  context?: AIRequest["context"]
  onGenerate: (content: any) => void 
}) {
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const result = await generateContent({
        type,
        context,
        count,
        prompt: `Generate ${count} ${type}(s)`
      })
      onGenerate(result)
    } catch (error: any) {
      console.error("Generation failed:", error)
      
      // Extract the most relevant error message
      let errorMessage = "Failed to generate content"
      if (error.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      // If there's a more detailed error from the API
      if (error.details) {
        console.error("Detailed error:", error.details)
        if (error.details.includes("API key")) {
          errorMessage = "Invalid API key configuration. Please contact support."
        }
      }

      toast({
        title: "AI Generation Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">AI Generator</h3>
      <div className="flex gap-4 items-center">
        <input
          type="number"
          min="1"
          max="10"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20 p-2 border rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Generating..." : `Generate ${type}s`}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Generate AI-powered {type}s to help you get started. You can edit them afterward.
      </p>
    </div>
  )
}
