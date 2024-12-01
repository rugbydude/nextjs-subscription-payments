import Link from 'next/link';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
        </div>
        <CircularProgress value={project.progress} size={50} />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Tasks</p>
          <p className="text-sm font-medium">{project.totalTasks} total</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Due Date</p>
          <p className="text-sm font-medium">
            {new Date(project.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.team.slice(0, 3).map((member) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          ))}
          {project.team.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              +{project.team.length - 3}
            </div>
          )}
        </div>
        
        <Link
          href={`/projects/${project.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
