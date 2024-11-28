// components/epics/EpicForm.tsx
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface EpicFormProps {
  epic?: {
    id: string
    title: string
    description: string
    project_id: string
    status: string
    priority: string
  }
}

export default function EpicForm({ epic }: EpicFormProps) {
  const [form, setForm] = useState(epic || {
    title: "",
    description: "",
    project_id: "",
    status: "todo",
    priority: "medium"
  })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title")
      setProjects(data || [])
    }
    fetchProjects()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (epic?.id) {
        await supabase
          .from("epics")
          .update(form)
          .eq("id", epic.id)
      } else {
        await supabase
          .from("epics")
          .insert([form])
      }

      toast.success(epic ? "Epic updated" : "Epic created")
      router.push("/dashboard/epics")
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
        <label className="block text-sm font-medium mb-2">Project</label>
        <select
          value={form.project_id}
          onChange={(e) => setForm({ ...form, project_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : epic ? "Update Epic" : "Create Epic"}
      </button>
    </form>
  )
}
