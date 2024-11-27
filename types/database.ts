export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  progress: number;
  token_usage: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Epic {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  token_usage: number;
  start_date?: string;
  end_date?: string;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  description?: string;
  acceptance_criteria: string[];
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  story_points: number;
  epic_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TokenBalance {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  entity_type: 'project' | 'epic' | 'story';
  entity_id: string;
  prompt: string;
  tokens_used: number;
  created_at: string;
}
