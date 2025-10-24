<template>
    <div class="max-w-3xl mx-auto p-3 sm:p-4">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold">Công việc hôm nay</h1>
            <span class="badge badge-primary badge-outline">{{ today }}</span>
        </div>
        <TaskList :tasks="todayTasks" @edit="openForm" @delete="deleteTask" @view="openDetail" @update="updateTask" @status-change="updateTask" />

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
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xl font-semibold break-words" :class="{ 'line-through text-base-content/50': detailTask?.done }">{{ detailTask?.title }}</h4>
                            <div class="mt-2 flex flex-wrap items-center gap-2">
                                <span class="badge badge-outline">Ngày: {{ detailTask?.date }}</span>
                                <span class="badge" :class="detailTask?.done ? 'badge-success' : 'badge-warning'">{{ detailTask?.done ? 'Đã xong' : 'Chưa xong' }}</span>
                            </div>
                        </div>
                        <label class="label cursor-pointer gap-2 shrink-0">
                            <span class="label-text text-sm">{{ detailTask?.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong' }}</span>
                            <input type="checkbox" v-model="detailTask.done" class="toggle toggle-primary toggle-sm" />
                        </label>
                    </div>
                    <div>
                        <h5 class="font-medium mb-2">Mô tả</h5>
                        <p class="text-base-content/70 whitespace-pre-line break-words" v-if="detailTask?.description">{{ detailTask?.description }}</p>
                        <p class="text-base-content/50 italic" v-else>Không có mô tả</p>
                    </div>
                </div>
                <div class="modal-action">
                    <button class="btn" @click="closeDetail">Đóng</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import TaskList from '../../components/tasks/TaskList.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'
import { FileText } from 'lucide-vue-next'
import { useTasksStore } from '../../stores/tasksStore'
import type { Task, CreateTaskInput, UpdateTaskInput } from '../../types/task'

useHead({
    title: 'Task today | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const tasksStore = useTasksStore()

const today = new Date().toISOString().slice(0, 10)
const todayTasks = computed(() => (tasksStore.tasks as unknown as Task[]).filter(t => t.date === today))

const modal = ref<HTMLDialogElement | null>(null)
const currentTask = ref<any>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<any | null>(null)

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
        await tasksStore.addTask(task as CreateTaskInput)
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
    await tasksStore.fetchTasks({ date: today })
})
</script>
