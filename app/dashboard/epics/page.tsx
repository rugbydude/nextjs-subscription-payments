// app/dashboard/epics/page.tsx
"use client"

import { useEffect, useState } from "react"
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
    project?: {
        title: string
    }
    created_at: string
}

export default function EpicsPage() {
    const [epics, setEpics] = useState<Epic[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<Epic["status"] | "all">("all")
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchEpics = async () => {
            try {
                const { data, error } = await supabase
                    .from("epics")
                    .select(`
                        *,
                        project:projects(title)
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
        filter === "all" ? true : epic.status === filter
    )

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

            <div className="mb-6 flex gap-2">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as Epic["status"] | "all")}
                    className="p-2 border rounded"
                >
                    <option value="all">All</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse h-24 bg-gray-100 rounded"></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredEpics.map(epic => (
                        <div 
                            key={epic.id}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{epic.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Project: {epic.project?.title}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        epic.status === "done" ? "bg-green-100 text-green-800" :
                                        epic.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {epic.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                            
                            {epic.description && (
                                <p className="mt-2 text-sm text-gray-600">{epic.description}</p>
                            )}
                            
                            <div className="mt-4 text-right">
                                <Link
                                    href={`/dashboard/epics/${epic.id}`}
                                    className="text-blue-500 hover:text-blue-600"
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
            )}
        </div>
    )
}
