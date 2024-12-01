"use client"

import { useDashboardData } from "../../hooks/useDashboardData"
import DashboardGrid from "../../components/dashboard/DashboardGrid"
import StatsCard from "../../components/stats/StatsCard"
import Card from "../../components/ui/Card"
import { IconProject, IconSprint, IconTask } from "../../components/icons/stats"
import TokenBalance from "../../components/tokens/TokenBalance"
import ErrorBoundary from "../../components/ErrorBoundary"
import LoadingSpinner from "../../components/ui/LoadingSpinner"

export default function Dashboard() {
  const { stats, loading, error } = useDashboardData()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  )
  
  if (error) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
      <p className="text-gray-600">{error}</p>
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Welcome to QuantumScribe</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Projects"
              value={stats.totalProjects}
              trend={stats.projectsTrend}
              icon={IconProject}
            />
            <StatsCard
              title="Active Sprints"
              value={stats.activeSprints}
              trend={stats.sprintsTrend}
              icon={IconSprint}
            />
            <StatsCard
              title="Completed Tasks"
              value={stats.completedTasks}
              trend={stats.tasksTrend}
              icon={IconTask}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <ErrorBoundary>
                <DashboardGrid />
              </ErrorBoundary>
            </div>
            
            <div className="space-y-6">
              <ErrorBoundary>
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Stories</h2>
                  <div className="space-y-4">
                    {stats.recentStories.map(story => (
                      <div
                        key={story.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{story.title}</p>
                          <p className="text-sm text-gray-500">{story.projectName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          story.priority === 'High' ? 'bg-red-100 text-red-800' :
                          story.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {story.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </ErrorBoundary>

              <ErrorBoundary>
                <TokenBalance />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
