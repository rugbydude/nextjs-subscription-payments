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
    const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([])
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from("projects")
                    .select("id, title")
                    .order("created_at", { ascending: false })

                if (error) throw error
                setProjects(data || [])
            } catch (error) {
                console.error("Error fetching projects:", error)
                toast.error("Failed to load projects")
            }
        }

        fetchProjects()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error("Please sign in")
                router.push("/signin")
                return
            }

            const { error } = await supabase
                .from("epics")
                .insert([{
                    ...form,
                    user_id: session.user.id
                }])
                .select()
                .single()

            if (error) throw error

            toast.success("Epic created successfully!")
            router.push("/dashboard/epics")
        } catch (error: any) {
            console.error("Error creating epic:", error)
            toast.error(error.message || "Failed to create epic")
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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm(prev => ({ 
                                ...prev, 
                                status: e.target.value as CreateEpicDTO["status"]
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="todo">Todo</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <select
                            value={form.priority}
                            onChange={(e) => setForm(prev => ({ 
                                ...prev, 
                                priority: e.target.value as CreateEpicDTO["priority"]
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
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
