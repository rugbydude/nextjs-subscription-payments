// components/epics/EpicsList.tsx
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Epic } from "@/types/epic"

export default function EpicsList() {
    const [epics, setEpics] = useState<Epic[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchEpics = async () => {
            const { data } = await supabase
                .from("epics")
                .select(`
                    *,
                    projects (
                        title
                    )
                `)
                .order("created_at", { ascending: false })
            
            setEpics(data || [])
            setLoading(false)
        }

        fetchEpics()
    }, [supabase])

    if (loading) return <div>Loading epics...</div>

    return (
        <div className="space-y-4">
            {epics.map(epic => (
                <div key={epic.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold">{epic.title}</h3>
                    <p className="text-sm text-gray-600">{epic.description}</p>
                    <div className="mt-2 flex justify-between">
                        <span className={`px-2 py-1 rounded text-sm ${
                            epic.status === "done" ? "bg-green-100 text-green-800" :
                            epic.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                        }`}>
                            {epic.status}
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
            ))}
        </div>
    )
}
