// app/dashboard/epics/new/page.tsx
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import type { CreateEpicDTO } from "@/types/epic"

const initialForm: CreateEpicDTO = {
    title: "",
    description: "",
    project_id: "",
    status: "todo",
    priority: "medium"
}

export default function CreateEpic() {
    const [form, setForm] = useState<CreateEpicDTO>(initialForm)
    const [loading, setLoading] = useState(false)
    const [projects, setProjects] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from("projects")
                .select("*")
            setProjects(data || [])
        }
        fetchProjects()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from("epics")
                .insert([form])

            if (error) throw error

            toast.success("Epic created successfully!")
            router.push("/dashboard/epics")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create epic")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Epic</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Project</label>
                    <select
                        value={form.project_id}
                        onChange={(e) => setForm(prev => ({ ...prev, project_id: e.target.value }))}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                </div>

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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Epic"}
                </button>
            </form>
        </div>
    )
}
