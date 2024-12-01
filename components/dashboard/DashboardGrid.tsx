import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';
import Button from '@/components/ui/Button/Button';
import { PlusIcon } from '@/components/icons';

export default function DashboardGrid() {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading projects: {error}</p>
        <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <Button variant="primary" className="flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first project
            </p>
            <Button variant="primary" className="mt-4">
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 