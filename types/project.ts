// types/project.ts
export interface Project {
    id: string;
    title: string;
    description?: string;
    status: "active" | "on_hold" | "completed" | "archived";
    priority: "low" | "medium" | "high" | "urgent";
    progress: number;
    start_date?: string;
    end_date?: string;
    metadata?: Record<string, any>;
}

export type CreateProjectInput = Omit<Project, "id">;
