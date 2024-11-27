// types/dashboard.ts
export interface DashboardStats {
  totalProjects: number;
  totalEpics: number;
  totalStories: number;
}

export interface DashboardProject {
  id: string;
  title: string;
  created_at: string;
  status: string;
}

export interface DashboardStory {
  id: string;
  title: string;
  created_at: string;
  priority: string;
}
