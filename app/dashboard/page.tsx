// app/dashboard/page.tsx
"use client"

import { Suspense } from "react"
import { useDashboardData } from "@/lib/hooks/useDashboardData"
import StatsCard from "@/components/stats/StatsCard"

export default function Dashboard() {
  const { stats, recentProjects, recentStories, loading } = useDashboardData()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to QuantumScribe</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Projects" value={stats.totalProjects} />
        <StatsCard title="Total Epics" value={stats.totalEpics} />
        <StatsCard title="Total Stories" value={stats.totalStories} />
        <StatsCard 
          title="Completed Stories" 
          value={stats.completedStories}
          change={stats.totalStories > 0 ? (stats.completedStories / stats.totalStories) * 100 : 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
            {loading ? (
              <p>Loading projects...</p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <div key={project.id} className="flex justify-between items-center">
                    <span>{project.title}</span>
                    <span className="text-sm text-gray-500">{project.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Stories</h2>
            {loading ? (
              <p>Loading stories...</p>
            ) : (
              <div className="space-y-4">
                {recentStories.map(story => (
                  <div key={story.id} className="flex justify-between items-center">
                    <span>{story.title}</span>
                    <span className="text-sm text-gray-500">{story.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
