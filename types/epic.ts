export interface Epic {
    id: string
    title: string
    description: string
    status: "todo" | "in_progress" | "done"
    priority: "low" | "medium" | "high"
    project_id: string
    user_id: string
    created_at: string
    projects?: {
        title: string
    }
}

export interface CreateEpicDTO {
    title: string
    description: string
    project_id: string
    status: Epic["status"]
    priority: Epic["priority"]
}
