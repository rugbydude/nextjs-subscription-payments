// components/projects/ProjectsList.tsx
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { toast } from "react-hot-toast"
import type { Project } from "@/types/database"

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .order("created_at", { ascending: false })

                if (error) throw error
                setProjects(data || [])
            } catch (error) {
                console.error("Error:", error)
                toast.error("Failed to load projects")
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [supabase])

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from("projects")
                .delete()
                .eq("id", id)

            if (error) throw error

            setProjects(prev => prev.filter(p => p.id !== id))
            toast.success("Project deleted")
        } catch (error) {
            console.error("Error:", error)
            toast.error("Failed to delete project")
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            {projects.map(project => (
                <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        <div className="space-x-2">
                            <Link 
                                href={`/dashboard/projects/${project.id}/edit`}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
