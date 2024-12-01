export interface DashboardStats {
  totalProjects: number;
  projectsTrend: number;
  activeSprints: number;
  sprintsTrend: number;
  completedTasks: number;
  tasksTrend: number;
  recentStories: DashboardStory[];
}

export interface DashboardStory {
  id: string;
  title: string;
  projectName: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface DashboardProject {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalTasks: number;
  dueDate: string;
  team: TeamMember[];
  status: 'active' | 'completed' | 'on_hold';
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface DashboardData {
  stats: DashboardStats;
} 