// components/stories/StoryForm.tsx
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface StoryFormProps {
  story?: {
    id?: string; // Make id optional for new stories
    title: string;
    description: string;
    epic_id: string;
    tokens_used?: number; // Make tokens_used optional
    status: string;
    priority: string;
    acceptance_criteria: string[];
  }
}

export default function StoryForm({ story }: StoryFormProps) {
  const [form, setForm] = useState(story || {
    title: "",
    description: "",
    epic_id: "",
    status: "todo",
    priority: "medium",
    acceptance_criteria: [""]
  })
  const [epics, setEpics] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEpics = async () => {
      const { data } = await supabase
        .from("epics")
        .select("id, title")
      setEpics(data || [])
    }
    fetchEpics()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!form.epic_id) {
        toast.error("Epic ID is required.");
        setLoading(false);
        return;
    }
    
    try {
      if (story?.id) {
        await supabase
          .from("stories")
          .update(form)
          .eq("id", story.id)
      } else {
        await supabase
          .from("stories")
          .insert([form])
      }

      toast.success(story ? "Story updated" : "Story created")
      router.push("/dashboard/stories")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Epic</label>
        <select
          value={form.epic_id}
          onChange={(e) => setForm({ ...form, epic_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select an epic</option>
          {epics.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Acceptance Criteria</label>
        <textarea
          value={form.acceptance_criteria.join('\n')}
          onChange={(e) => setForm({ ...form, acceptance_criteria: e.target.value.split('\n') })}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Complexity Estimate</label>
        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select complexity</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="8">8</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tokens Used</label>
        <input
          type="text"
          value={form.tokens_used || 0}
          readOnly
          className="w-full p-2 border rounded bg-gray-200"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : story ? "Update Story" : "Create Story"}
      </button>
    </form>
  )
}
