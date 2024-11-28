// types/database.ts
export interface Project {
    id: string;
    title: string;
    description?: string;
    status: "active" | "on_hold" | "completed" | "archived";
    priority: "low" | "medium" | "high" | "urgent";
    start_date?: string;
    end_date?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface Epic {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
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
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    epic_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}
