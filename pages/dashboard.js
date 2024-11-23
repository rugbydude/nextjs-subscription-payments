import { useEffect, useState } from 'react';
import { getProjects } from '../utils/supabase/queries';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import AIStoryGenerator from '../components/AIStoryGenerator';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [generatedStory, setGeneratedStory] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      }
    };
    fetchProjects();
  }, []);

  const handleStoryGenerated = (story) => {
    setGeneratedStory(story);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <AIStoryGenerator onStoryGenerated={handleStoryGenerated} />
          {generatedStory && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-900">Generated User Story</h2>
              <p className="mt-2 text-gray-600">{generatedStory}</p>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
