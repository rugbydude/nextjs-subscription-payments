"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import type { Story } from "@/types/database"

type CreateStoryForm = Omit<Story, "id" | "user_id" | "created_at" | "updated_at">

const initialForm: CreateStoryForm = {
  title: "",
  description: "",
  acceptance_criteria: [],
  status: "todo",
  priority: "medium",
  story_points: 0,
  epic_id: ""
}

export default function CreateStory() {
  const [form, setForm] = useState<CreateStoryForm>(initialForm)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("stories")
        .insert([form])

      if (error) throw error

      toast.success("Story created successfully!")
      router.push("/dashboard/stories")
    } catch (error) {
      console.error("Error creating story:", error)
      toast.error("Failed to create story")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Story</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Acceptance Criteria</label>
          {form.acceptance_criteria.map((criteria, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={criteria}
                onChange={(e) => {
                  const newCriteria = [...form.acceptance_criteria]
                  newCriteria[index] = e.target.value
                  setForm(prev => ({ ...prev, acceptance_criteria: newCriteria }))
                }}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const newCriteria = form.acceptance_criteria.filter((_, i) => i !== index)
                  setForm(prev => ({ ...prev, acceptance_criteria: newCriteria }))
                }}
                className="px-3 py-1 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm(prev => ({
              ...prev,
              acceptance_criteria: [...prev.acceptance_criteria, ""]
            }))}
            className="text-blue-500 hover:text-blue-700"
          >
            + Add Criteria
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Story"}
        </button>
      </form>
    </div>
  )
}
