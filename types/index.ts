// types/index.ts
export interface Project {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "archived"
}

export interface Epic {
  id: string
  projectId: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
}

export interface UserStory {
  id: string
  epicId: string
  title: string
  description: string
  acceptanceCriteria: string[]
  points: number
}

export interface TokenBalance {
  userId: string
  balance: number
  lastUpdated: Date
}

export interface AIRequest {
  prompt: string
  type: "epic" | "story" | "task"
  context?: {
    projectId?: string
    epicId?: string
  }
  count: number
}
