// types/project.ts
export interface TeamMember {
    id: string;
    name: string;
    avatar: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    progress: number;
    totalTasks: number;
    dueDate: string;
    team: TeamMember[];
    status: 'active' | 'completed' | 'on_hold';
    created_at: string;
    updated_at: string;
}

export type CreateProjectInput = Omit<Project, "id">;
