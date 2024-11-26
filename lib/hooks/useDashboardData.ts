// lib/hooks/useDashboardData.ts
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { DashboardStats, RecentProject, RecentStory } from "@/types/dashboard"

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalStories: 0,
    totalEpics: 0,
    completedStories: 0
  })
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [recentStories, setRecentStories] = useState<RecentStory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const [
          { data: projects },
          { data: stories },
          { data: epics }
        ] = await Promise.all([
          supabase.from("projects").select("count").single(),
          supabase.from("stories").select("count").single(),
          supabase.from("epics").select("count").single()
        ])

        setStats({
          totalProjects: projects?.count || 0,
          totalStories: stories?.count || 0,
          totalEpics: epics?.count || 0,
          completedStories: 0 // TODO: Add completed stories count
        })

        const { data: recentProjs } = await supabase
          .from("projects")
          .select("id, title, status, updated_at")
          .order("updated_at", { ascending: false })
          .limit(5)

        setRecentProjects(recentProjs || [])

        const { data: recentStories } = await supabase
          .from("stories")
          .select(`
            id,
            title,
            priority,
            epics (
              title
            )
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        setRecentStories(recentStories || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  return { stats, recentProjects, recentStories, loading }
}
