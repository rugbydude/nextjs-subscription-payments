import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { IconSpinner } from '@/components/ui/IconSpinner';
import { CreateUserStoryInput, StoryPriority, StoryType, StorySize, UserStory } from '@/types/story';

interface UserStoryFormProps {
  projectId: string;
  epicId?: string;
  onSuccess?: (story: UserStory) => void;
}

export function UserStoryForm({ projectId, epicId, onSuccess }: UserStoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateUserStoryInput>({
    project_id: projectId,
    epic_id: epicId,
    title: '',
    description: '',
    type: 'Feature',
    priority: 'Medium',
  });

  const [aiSuggestions, setAiSuggestions] = useState<UserStory['ai_suggestions']>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateStory = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          project_id: projectId,
          epic_id: epicId,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate story');

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        type: data.type || prev.type,
        priority: data.priority || prev.priority,
        size: data.size || prev.size,
      }));
      setAiSuggestions(data.ai_suggestions);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create story');

      const story = await response.json();
      router.refresh();
      onSuccess?.(story);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create story');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter user story title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="As a [user type], I want to [action] so that [benefit]"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                {(['Feature', 'Bug', 'Technical', 'Enhancement'] as StoryType[]).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <Select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                {(['High', 'Medium', 'Low'] as StoryPriority[]).map(priority => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <Select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
              >
                <option value="">Select size</option>
                {(['XS', 'S', 'M', 'L', 'XL'] as StorySize[]).map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          {aiSuggestions && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">AI Suggestions</h4>
              {aiSuggestions.acceptance_criteria && (
                <div className="mb-2">
                  <h5 className="text-xs font-medium text-blue-800">Suggested Acceptance Criteria:</h5>
                  <ul className="list-disc list-inside text-sm text-blue-700">
                    {aiSuggestions.acceptance_criteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSuggestions.story_points && (
                <div className="text-sm text-blue-700">
                  <strong>Suggested Story Points:</strong> {aiSuggestions.story_points}
                </div>
              )}
              {aiSuggestions.risks && aiSuggestions.risks.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-xs font-medium text-blue-800">Potential Risks:</h5>
                  <ul className="list-disc list-inside text-sm text-blue-700">
                    {aiSuggestions.risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateStory}
            disabled={isGenerating || isLoading}
          >
            {isGenerating ? (
              <>
                <IconSpinner className="mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              'Generate with AI'
            )}
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <IconSpinner className="mr-2 h-4 w-4" />
                Creating...
              </>
            ) : (
              'Create Story'
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
} 