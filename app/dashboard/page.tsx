'use client';

import { useEffect, useState } from 'react';
import { getProjects } from '../../utils/supabase/queries';
import Layout from '../../components/Layout';
import ProjectCard from '../../components/ProjectCard';
import AIStoryGenerator from '../../components/AIStoryGenerator';
import type { Project } from '../../types/project';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data || []);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleStoryGenerated = (story: string) => {
    setGeneratedStory(story);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600">Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {projects.length === 0 && (
            <p className="text-gray-500">No projects yet. Create your first project to get started!</p>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Story Generator</h2>
          <AIStoryGenerator onStoryGenerated={handleStoryGenerated} />
          {generatedStory && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-900">Generated User Story</h3>
              <div className="mt-2 p-4 bg-white rounded-lg shadow">
                <p className="text-gray-600">{generatedStory}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
