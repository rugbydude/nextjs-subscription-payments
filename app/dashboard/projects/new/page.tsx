"use client"

import * as React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import type { CreateProjectDTO } from "@/types/project"

const initialForm: CreateProjectDTO = {
    title: "",
    description: "",
    status: "active",
    priority: "medium",
    progress: 0
}

export default function CreateProject() {
    const [form, setForm] = React.useState<CreateProjectDTO>(initialForm)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const supabase = createClientComponentClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from("projects")
                .insert([form])

            if (error) throw error

            toast.success("Project created successfully!")
            router.push("/dashboard/projects")
        } catch (error) {
            console.error("Error creating project:", error)
            toast.error("Failed to create project")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields here */}
            </form>
        </div>
    )
}
