<template>
    <div class="mx-auto space-y-6 md:space-y-10">
        <!-- Mobile Header -->
        <div class="md:hidden space-y-4">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <LayoutList class="w-4 h-4" />
                    Tất cả Task
                </h1>
                <button class="btn btn-primary btn-sm" @click="openForm()">
                    <Plus class="w-4 h-4" />
                </button>
            </div>
            <div class="w-full">
                <TaskFilterBar v-model="filter" />
            </div>
        </div>

        <!-- Desktop Header -->
        <div class="hidden md:flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold flex items-center gap-2">
                <LayoutList class="w-5 h-5" />
                Tất cả Task
            </h1>
            <div class="flex items-center gap-2">
                <TaskFilterBar v-model="filter" />
                <button class="btn btn-primary gap-2" @click="openForm()">
                    <Plus class="w-4 h-4" />
                    Thêm task
                </button>
            </div>
        </div>

        <!-- Mobile Kanban - Vertical Stack -->
        <div class="md:hidden space-y-4">
            <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 bg-base-200 rounded-lg p-3">
                    <h3 class="font-semibold text-sm">Chưa làm</h3>
                    <span class="badge badge-ghost badge-sm">{{ backlog.length }}</span>
                </div>
                <div class="space-y-2">
                    <TaskList :tasks="backlog" @edit="openForm" @delete="deleteTask" @view="openDetail" @update="updateTask"
                        @status-change="updateTask" />
                </div>
            </div>
            
            <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 bg-base-200 rounded-lg p-3">
                    <h3 class="font-semibold text-sm">Đang làm</h3>
                    <span class="badge badge-info badge-outline badge-sm">{{ inProgress.length }}</span>
                </div>
                <div class="space-y-2">
                    <TaskList :tasks="inProgress" @edit="openForm" @delete="deleteTask" @view="openDetail"
                        @update="updateTask" @status-change="updateTask" />
                </div>
            </div>
            
            <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 bg-base-200 rounded-lg p-3">
                    <h3 class="font-semibold text-sm">Đã làm</h3>
                    <span class="badge badge-success badge-outline badge-sm">{{ doneList.length }}</span>
                </div>
                <div class="space-y-2">
                    <TaskList :tasks="doneList" @edit="openForm" @delete="deleteTask" @view="openDetail"
                        @update="updateTask" @status-change="updateTask" />
                </div>
            </div>
        </div>

        <!-- Desktop Kanban - Grid Layout -->
        <div class="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="font-semibold truncate">Chưa làm</h3>
                    <span class="badge badge-ghost shrink-0">{{ backlog.length }}</span>
                </div>
                <TaskList :tasks="backlog" @edit="openForm" @delete="deleteTask" @view="openDetail" @update="updateTask"
                    @status-change="updateTask" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="font-semibold truncate">Đang làm</h3>
                    <span class="badge badge-info badge-outline shrink-0">{{ inProgress.length }}</span>
                </div>
                <TaskList :tasks="inProgress" @edit="openForm" @delete="deleteTask" @view="openDetail"
                    @update="updateTask" @status-change="updateTask" />
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="font-semibold truncate">Đã làm</h3>
                    <span class="badge badge-success badge-outline shrink-0">{{ doneList.length }}</span>
                </div>
                <TaskList :tasks="doneList" @edit="openForm" @delete="deleteTask" @view="openDetail"
                    @update="updateTask" @status-change="updateTask" />
            </div>
        </div>

        <!-- Modal form -->
        <dialog ref="modal" class="modal">
            <div class="modal-box">
                <TaskForm :task="currentTask" @submit="saveTask" @cancel="closeForm" />
            </div>
        </dialog>

        <!-- Modal detail -->
        <dialog ref="detailModal" class="modal">
            <div class="modal-box w-full max-w-2xl" v-if="detailTask">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg flex items-center gap-2">
                        <FileText class="w-4 h-4" />
                        Chi tiết Task
                    </h3>
                    <button class="btn btn-sm btn-ghost" @click="closeDetail">✖</button>
                </div>
                <div class="space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-lg sm:text-xl font-semibold break-words"
                                :class="{ 'line-through text-base-content/50': detailTask?.done }">{{ detailTask?.title
                                }}</h4>
                            <div class="mt-2 flex flex-wrap items-center gap-2">
                                <span class="badge badge-outline">Ngày: {{ detailTask?.date }}</span>
                                <span class="badge" :class="detailTask?.done ? 'badge-success' : 'badge-warning'">{{
                                    detailTask?.done ? 'Đã xong' : 'Chưa xong' }}</span>
                            </div>
                        </div>
                        <label class="label cursor-pointer gap-2 shrink-0">
                            <span class="label-text text-sm">{{
                                detailTask?.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'
                            }}</span>
                            <input type="checkbox" v-model="detailTask.done" class="toggle toggle-primary toggle-sm" />
                        </label>
                    </div>
                    <div>
                        <h5 class="font-medium mb-2">Mô tả</h5>
                        <p class="text-base-content/70 whitespace-pre-line break-words" v-if="detailTask?.description">{{
                            detailTask?.description }}</p>
                        <p class="text-base-content/50 italic" v-else>Không có mô tả</p>
                    </div>
                </div>
                <div class="modal-action">
                    <button class="btn w-full sm:w-auto" @click="closeDetail">Đóng</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { LayoutList, Plus, FileText } from 'lucide-vue-next'
import { useHead } from '@vueuse/head'
import TaskList from '../../components/tasks/TaskList.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'
import TaskFilterBar from '../../components/tasks/TaskFilterBar.vue'
import { useTasksStore } from '../../stores/tasksStore'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../../types/task'

useHead({
    title: 'Task | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const tasksStore = useTasksStore()
const tasks = tasksStore.tasks as unknown as Task[]
const modal = ref<HTMLDialogElement | null>(null)
const currentTask = ref<any>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<any | null>(null)
const filter = ref<'all' | 'today' | 'done' | 'todo'>('all')
const today = new Date().toISOString().slice(0, 10)
const filteredTasks = computed(() => {
    const list = tasksStore.tasks as unknown as Task[]
    if (filter.value === 'today') return list.filter(t => t.date === today)
    if (filter.value === 'done') return list.filter(t => t.done)
    if (filter.value === 'todo') return list.filter(t => !t.done)
    return list
})
const backlog = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 0))
const inProgress = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 1))
const doneList = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 2))

function openForm(task?: Task) {
    currentTask.value = task ? { ...task } : null
    modal.value?.showModal()
}
function closeForm() {
    modal.value?.close()
}
async function saveTask(task: Task | CreateTaskInput) {
    if ('id' in task && task.id) {
        await tasksStore.updateTask(task.id as number, task as UpdateTaskInput)
    } else {
        await tasksStore.addTask({
            title: (task as CreateTaskInput).title,
            date: (task as CreateTaskInput).date,
            description: (task as CreateTaskInput).description ?? null,
            priority: (task as CreateTaskInput).priority ?? 'medium',
            status: (task as CreateTaskInput).status ?? 0,
            tags: (task as CreateTaskInput).tags ?? [],
            done: (task as CreateTaskInput).done ?? false,
        })
    }
    closeForm()
}
async function deleteTask(task: Task) {
    await tasksStore.removeTask(task.id)
}

function openDetail(task: Task) {
    detailTask.value = { ...task }
    detailModal.value?.showModal()
}
function closeDetail() {
    detailModal.value?.close()
}

async function updateTask(updated: Partial<Task> & { id: number }) {
    await tasksStore.updateTask(updated.id, updated)
}

onMounted(async () => {
    await tasksStore.fetchTasks()
})
</script>
