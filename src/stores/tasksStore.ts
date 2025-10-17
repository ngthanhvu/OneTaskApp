import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task'
import { useTasksApi, type TasksFilter } from '../composables/useTasksApi'
import { useAuthStore } from './authStore'

export const useTasksStore = defineStore('tasks', () => {
    const auth = useAuthStore()
    const api = useTasksApi()

    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const lastFilter = ref<TasksFilter | null>(null)

    const tasksById = computed(() => {
        const map = new Map<number, Task>()
        for (const t of tasks.value) map.set(t.id, t)
        return map
    })

    async function fetchTasks(filter: TasksFilter = {}) {
        if (!auth.user) return []
        loading.value = true
        error.value = null
        try {
            lastFilter.value = { ...filter }
            const data = await api.list(auth.user.id, filter)
            tasks.value = data
            return data
        } catch (e: any) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    async function refresh() {
        return fetchTasks(lastFilter.value ?? {})
    }

    async function getTask(taskId: number) {
        if (!auth.user) return null
        if (tasksById.value.has(taskId)) return tasksById.value.get(taskId) as Task
        return api.get(taskId, auth.user.id)
    }

    async function addTask(input: CreateTaskInput) {
        if (!auth.user) throw new Error('Not authenticated')
        const created = await api.create(auth.user.id, input)
        tasks.value = [created, ...tasks.value]
        return created
    }

    async function updateTask(taskId: number, input: UpdateTaskInput) {
        if (!auth.user) throw new Error('Not authenticated')
        const updated = await api.update(taskId, auth.user.id, input)
        tasks.value = tasks.value.map(t => (t.id === taskId ? updated : t))
        return updated
    }

    async function removeTask(taskId: number) {
        if (!auth.user) throw new Error('Not authenticated')
        await api.remove(taskId, auth.user.id)
        tasks.value = tasks.value.filter(t => t.id !== taskId)
    }

    async function toggleDone(taskId: number, done: boolean) {
        return updateTask(taskId, { done })
    }

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        refresh,
        getTask,
        addTask,
        updateTask,
        removeTask,
        toggleDone,
    }
})


