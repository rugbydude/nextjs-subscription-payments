"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AIGenerator from "@/components/ai/AIGenerator"
import { useRouter } from "next/navigation"

interface FormData {
  title: string
  description: string
  acceptance_criteria: string
  epic_id: string
  priority: string
}

interface GeneratedContent {
  title: string
  description: string
  acceptance_criteria: string
}

interface Epic {
  id: string
  title: string
  project_id: string
}

export default function CreateStory() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [epics, setEpics] = useState<Epic[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    acceptance_criteria: "",
    epic_id: "",
    priority: "medium"
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push("/signin")
          return
        }

        // Get all projects for the user
        const { data: projectsData } = await supabase
          .from("projects")
          .select("id")
          .eq("user_id", session.user.id)

        if (!projectsData?.length) return

        // Get epics for all user's projects
        const { data: epicsData, error } = await supabase
          .from("epics")
          .select("id, title, project_id")
          .in("project_id", projectsData.map(p => p.id))

        if (error) throw error

        if (epicsData) {
          setEpics(epicsData)
        }
      } catch (error) {
        console.error("Error fetching epics:", error)
      }
    }

    fetchEpics()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("Not authenticated")

      if (!formData.epic_id) {
        throw new Error("Please select an epic")
      }

      // Verify the epic belongs to one of the user's projects
      const epic = epics.find(e => e.id === formData.epic_id)
      if (!epic) throw new Error("Invalid epic selected")

      const { error } = await supabase
        .from("user_stories")
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (error) throw error

      // Redirect to stories list or show success message
      router.push("/dashboard/stories")
      router.refresh()
      
    } catch (error) {
      console.error("Error creating story:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAIGeneration = async (generatedContent: GeneratedContent) => {
    setFormData(prev => ({
      ...prev,
      title: generatedContent.title,
      description: generatedContent.description,
      acceptance_criteria: generatedContent.acceptance_criteria
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Create New User Story</h1>
      
      <div className="mb-8">
        <AIGenerator
          type="story"
          onGenerate={handleAIGeneration}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Epic</label>
          <select
            value={formData.epic_id}
            onChange={(e) => setFormData(prev => ({ ...prev, epic_id: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select an Epic</option>
            {epics.map(epic => (
              <option key={epic.id} value={epic.id}>
                {epic.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Acceptance Criteria</label>
          <textarea
            value={formData.acceptance_criteria}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              acceptance_criteria: e.target.value 
            }))}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              priority: e.target.value 
            }))}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Story"}
        </button>
      </form>
    </div>
  )
}
