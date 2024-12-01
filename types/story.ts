export type StoryPriority = 'High' | 'Medium' | 'Low';
export type StoryStatus = 'Draft' | 'Ready' | 'In Progress' | 'Review' | 'Done';
export type StoryType = 'Feature' | 'Bug' | 'Technical' | 'Enhancement';
export type StorySize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface UserStory {
  id: string;
  project_id: string;
  epic_id?: string;
  title: string;
  description: string;
  acceptance_criteria: string[];
  type: StoryType;
  priority: StoryPriority;
  status: StoryStatus;
  size: StorySize;
  story_points?: number;
  assignee_id?: string;
  reporter_id: string;
  business_value?: string;
  dependencies?: string[];
  attachments?: string[];
  created_at: string;
  updated_at: string;
  // AI-generated fields
  ai_suggestions?: {
    acceptance_criteria?: string[];
    story_points?: number;
    dependencies?: string[];
    risks?: string[];
    similar_stories?: string[];
  };
}

export interface CreateUserStoryInput {
  project_id: string;
  epic_id?: string;
  title: string;
  description: string;
  type: StoryType;
  priority: StoryPriority;
  size?: StorySize;
  business_value?: string;
}

export interface UpdateUserStoryInput {
  id: string;
  title?: string;
  description?: string;
  acceptance_criteria?: string[];
  type?: StoryType;
  priority?: StoryPriority;
  status?: StoryStatus;
  size?: StorySize;
  story_points?: number;
  assignee_id?: string;
  business_value?: string;
  dependencies?: string[];
  attachments?: string[];
} 