"use client"

import { useDashboardData } from "@/hooks/useDashboardData"
import StatsCard from "@/components/stats/StatsCard"

export default function Dashboard() {
  const { stats, recentProjects, recentStories, loading, error } = useDashboardData()

  if (loading) return <div className="p-8">Loading dashboard data...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to QuantumScribe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Projects" value={stats.totalProjects} />
        <StatsCard title="Total Epics" value={stats.totalEpics} />
        <StatsCard title="Total Stories" value={stats.totalStories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {recentProjects.map(project => (
              <div key={project.id} className="flex justify-between items-center">
                <span>{project.title}</span>
                <span className="text-sm text-gray-500">{project.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Stories</h2>
          <div className="space-y-4">
            {recentStories.map(story => (
              <div key={story.id} className="flex justify-between items-center">
                <span>{story.title}</span>
                <span className="text-sm text-gray-500">{story.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
