export type TaskStatus = 0 | 1 | 2 // 0: todo, 1: doing, 2: done

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
    id: number
    title: string
    date: string // ISO date (YYYY-MM-DD)
    done: boolean
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    tags: string[]
    created_at: string
    updated_at: string
    user_id: string
}

export type CreateTaskInput = {
    title: string
    date: string
    description?: string | null
    status?: TaskStatus
    priority?: TaskPriority
    tags?: string[]
    done?: boolean
}

export type UpdateTaskInput = Partial<CreateTaskInput>


