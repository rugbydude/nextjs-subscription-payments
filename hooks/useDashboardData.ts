// hooks/useDashboardData.ts
"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"
import type { DashboardStats, DashboardProject, DashboardStory } from "@/types/dashboard"

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalEpics: 0,
    totalStories: 0
  })
  const [recentProjects, setRecentProjects] = useState<DashboardProject[]>([])
  const [recentStories, setRecentStories] = useState<DashboardStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError("Not authenticated")
          return
        }

        const [
          { count: projectCount },
          { count: epicCount },
          { count: storyCount },
          { data: projects },
          { data: stories }
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("epics").select("*", { count: "exact", head: true }),
          supabase.from("stories").select("*", { count: "exact", head: true }),
          supabase.from("projects")
            .select("id, title, created_at, status")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("stories")
            .select("id, title, created_at, priority")
            .order("created_at", { ascending: false })
            .limit(5)
        ])

        setStats({
          totalProjects: projectCount || 0,
          totalEpics: epicCount || 0,
          totalStories: storyCount || 0
        })
        setRecentProjects(projects || [])
        setRecentStories(stories || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data")
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  return { stats, recentProjects, recentStories, loading, error }
}
