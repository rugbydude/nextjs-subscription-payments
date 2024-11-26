"use client"

import { useState } from "react"
import { useTokens } from "../hooks/useTokens"
import { toast } from "react-hot-toast"

interface AIStoryGeneratorProps {
  onStoryGenerated: (story: string) => void
  epicId?: string // Optional epic ID if generating story for specific epic
}

const AI_GENERATION_COST = 1 // tokens per generation

export default function AIStoryGenerator({ onStoryGenerated, epicId }: AIStoryGeneratorProps) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const { balance, loading: balanceLoading, consumeTokens } = useTokens()
  const [error, setError] = useState<string | null>(null)

  const validateInput = () => {
    if (!title.trim()) {
      setError("Title is required")
      return false
    }
    if (title.length > 100) {
      setError("Title must be less than 100 characters")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset error state
    setError(null)

    // Validate input
    if (!validateInput()) {
      return
    }

    setLoading(true)

    try {
      // Validate token balance
      if (balance === null) {
        throw new Error("Please wait for token balance to load")
      }

      if (balance < AI_GENERATION_COST) {
        throw new Error(`Insufficient tokens. You need ${AI_GENERATION_COST} tokens to generate a story, but you have ${balance}`)
      }

      // Attempt to consume tokens first
      const success = await consumeTokens(AI_GENERATION_COST)
      if (!success) {
        throw new Error("Failed to consume tokens")
      }

      // Make API request
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          title,
          epicId // Include epicId if provided
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate story")
      }

      if (!data.success || !data.story) {
        throw new Error("Invalid response from server")
      }

      // Success handling
      onStoryGenerated(data.story)
      toast.success(data.message || "Story generated successfully!")
      setTitle("") // Reset form
      
    } catch (error) {
      // Error handling
      const message = error instanceof Error ? error.message : "Failed to generate story"
      setError(message)
      toast.error(message)
      console.error("Story generation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getButtonText = () => {
    if (loading) return "Generating..."
    if (balanceLoading) return "Loading balance..."
    if (balance === null) return "Loading..."
    if (balance < AI_GENERATION_COST) return `Insufficient tokens (${balance}/${AI_GENERATION_COST})`
    return `Generate Story (${AI_GENERATION_COST} token)`
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Story Generator</h2>
        <span className="text-sm text-gray-500">
          Balance: {balanceLoading ? "Loading..." : `${balance ?? 0} tokens`}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Story Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError(null) // Clear error on input change
            }}
            placeholder="Enter a descriptive title for your user story"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
              ${error ? 'border-red-300' : 'border-gray-300'}`}
            disabled={loading}
            maxLength={100}
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {100 - title.length} characters remaining
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || balanceLoading || !balance || balance < AI_GENERATION_COST}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200"
        >
          {getButtonText()}
        </button>
      </form>

      {/* Help text */}
      <div className="mt-4 text-sm text-gray-500">
        <p>This will generate a detailed user story including:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>User role and goal</li>
          <li>Acceptance criteria</li>
          <li>Priority level</li>
          <li>Story points estimate</li>
        </ul>
      </div>
    </div>
  )
}
