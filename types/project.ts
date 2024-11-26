// types/project.ts
export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'archived';
    priority: 'low' | 'medium' | 'high';
    progress: number;
    token_usage: number;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

// types/epic.ts
export interface Epic {
    id: string;
    name: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    progress: number;
    token_usage: number;
    start_date?: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
    project_id: string;
    user_id: string;
    user_stories_count: number;
}
