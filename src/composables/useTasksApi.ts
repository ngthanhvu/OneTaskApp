import { supabase } from '../lib/supabaseClient'
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task'

export type TasksFilter = {
    date?: string
    status?: number | number[]
    done?: boolean
    priority?: 'low' | 'medium' | 'high'
    tag?: string
}

export function useTasksApi() {
    async function list(userId: string, filter: TasksFilter = {}) {
        let query = supabase.from('tasks').select('*').eq('user_id', userId).order('date', { ascending: true }).order('created_at', { ascending: true })

        if (filter.date) query = query.eq('date', filter.date)
        if (typeof filter.done === 'boolean') query = query.eq('done', filter.done)
        if (filter.priority) query = query.eq('priority', filter.priority)
        if (filter.status !== undefined) {
            if (Array.isArray(filter.status)) query = query.in('status', filter.status)
            else query = query.eq('status', filter.status)
        }
        if (filter.tag) query = query.contains('tags', [filter.tag])

        const { data, error } = await query
        if (error) throw error
        return data as Task[]
    }

    async function get(taskId: number, userId: string) {
        const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).eq('user_id', userId).single()
        if (error) throw error
        return data as Task
    }

    async function create(userId: string, input: CreateTaskInput) {
        const payload = {
            title: input.title,
            date: input.date,
            description: input.description ?? null,
            status: input.status ?? 0,
            priority: input.priority ?? 'medium',
            tags: input.tags ?? [],
            done: input.done ?? false,
            user_id: userId,
        }
        const { data, error } = await supabase.from('tasks').insert(payload).select('*').single()
        if (error) throw error
        return data as Task
    }

    async function update(taskId: number, userId: string, input: UpdateTaskInput) {
        const { data, error } = await supabase.from('tasks').update({
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.date !== undefined ? { date: input.date } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.status !== undefined ? { status: input.status } : {}),
            ...(input.priority !== undefined ? { priority: input.priority } : {}),
            ...(input.tags !== undefined ? { tags: input.tags } : {}),
            ...(input.done !== undefined ? { done: input.done } : {}),
        }).eq('id', taskId).eq('user_id', userId).select('*').single()
        if (error) throw error
        return data as Task
    }

    async function remove(taskId: number, userId: string) {
        const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', userId)
        if (error) throw error
    }

    return {
        list,
        get,
        create,
        update,
        remove,
    }
}


