import { useState, useEffect } from 'react';
import { DashboardData, DashboardStats } from '../types/dashboard';

interface UseDashboardDataReturn extends DashboardData {
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Mock data for initial development
const MOCK_DASHBOARD_DATA: DashboardData = {
  stats: {
    totalProjects: 12,
    projectsTrend: 8.5,
    activeSprints: 4,
    sprintsTrend: -2.1,
    completedTasks: 156,
    tasksTrend: 12.3,
    recentStories: [
      {
        id: '1',
        title: 'Implement user authentication',
        projectName: 'E-commerce Platform',
        priority: 'High',
      },
      {
        id: '2',
        title: 'Design new product page',
        projectName: 'E-commerce Platform',
        priority: 'Medium',
      },
      {
        id: '3',
        title: 'Optimize mobile navigation',
        projectName: 'Mobile App Redesign',
        priority: 'High',
      },
    ],
  },
};

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalProjects: 0,
      projectsTrend: 0,
      activeSprints: 0,
      sprintsTrend: 0,
      completedTasks: 0,
      tasksTrend: 0,
      recentStories: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/dashboard');
      // const data = await response.json();
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setData(MOCK_DASHBOARD_DATA);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
} 