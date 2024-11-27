// components/epics/EpicsList.tsx
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface Epic {
    id: string
    title: string
    description?: string
    status: "todo" | "in_progress" | "done"
    priority: "low" | "medium" | "high"
    project_id: string
    projects?: {
        title: string
    }
    created_at: string
}

export default function EpicsList() {
    const [epics, setEpics] = useState<Epic[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<Epic['status'] | 'all'>('all')
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchEpics = async () => {
            try {
                const { data, error } = await supabase
                    .from("epics")
                    .select(`
                        *,
                        projects (
                            title
                        )
                    `)
                    .order("created_at", { ascending: false })
                
                if (error) throw error
                setEpics(data || [])
            } catch (error) {
                console.error("Error fetching epics:", error)
                toast.error("Failed to load epics")
            } finally {
                setLoading(false)
            }
        }

        fetchEpics()
    }, [supabase])

    const filteredEpics = epics.filter(epic => 
        filter === 'all' ? true : epic.status === filter
    )

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Epics</h1>
                <Link 
                    href="/dashboard/epics/new"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Create Epic
                </Link>
            </div>

            <div className="mb-6">
                <div className="flex gap-2">
                    {(['all', 'todo', 'in_progress', 'done'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded ${
                                filter === status 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredEpics.map((epic) => (
                    <div 
                        key={epic.id} 
                        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{epic.title}</h3>
                                <p className="text-sm text-gray-600">
                                    Project: {epic.projects?.title}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-sm ${
                                    epic.status === "done" ? "bg-green-100 text-green-800" :
                                    epic.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                                    "bg-gray-100 text-gray-800"
                                }`}>
                                    {epic.status.replace('_', ' ')}
                                </span>
                                <span className={`px-2 py-1 rounded text-sm ${
                                    epic.priority === "high" ? "bg-red-100 text-red-800" :
                                    epic.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-gray-100 text-gray-800"
                                }`}>
                                    {epic.priority}
                                </span>
                            </div>
                        </div>
                        {epic.description && (
                            <p className="text-gray-600 text-sm mb-4">
                                {epic.description}
                            </p>
                        )}
                        <div className="flex justify-end">
                            <Link
                                href={`/dashboard/epics/${epic.id}`}
                                className="text-blue-500 hover:text-blue-600 text-sm"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredEpics.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No epics found. Create your first epic to get started.
                    </div>
                )}
            </div>
        </div>
    )
}