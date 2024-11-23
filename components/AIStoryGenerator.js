import { useState } from 'react';

const AIStoryGenerator = ({ onStoryGenerated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      onStoryGenerated(data.story);
    } catch (error) {
      console.error('Error generating story:', error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900">AI-Assisted Story Generation</h3>
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your user story"
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Generating...' : 'Generate Story'}
        </button>
      </form>
    </div>
  );
};

export default AIStoryGenerator;
