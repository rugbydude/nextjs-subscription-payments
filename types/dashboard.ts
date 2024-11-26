// types/dashboard.ts
export interface DashboardStats {
  totalProjects: number
  totalStories: number
  totalEpics: number
  completedStories: number
}

export interface RecentProject {
  id: string
  title: string
  status: string
  updatedAt: string
}

export interface RecentStory {
  id: string
  title: string
  priority: string
  epicTitle?: string
}
