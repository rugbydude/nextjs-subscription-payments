import { useState, useEffect } from 'react';
import { Project } from '@/types/project';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Mock data for initial development
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with Next.js and Stripe integration',
    progress: 75,
    totalTasks: 24,
    dueDate: '2024-04-01',
    team: [
      { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
      { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      { id: '3', name: 'Mike Johnson', avatar: '/avatars/mike.jpg' },
    ],
    status: 'active',
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Mobile App Redesign',
    description: 'Redesigning the mobile app UI/UX for better user engagement',
    progress: 45,
    totalTasks: 18,
    dueDate: '2024-03-15',
    team: [
      { id: '2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      { id: '4', name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg' },
    ],
    status: 'active',
    created_at: '2024-01-05',
    updated_at: '2024-01-10',
  },
];

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProjects() {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/projects');
      // const data = await response.json();
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setProjects(MOCK_PROJECTS);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  };
} 