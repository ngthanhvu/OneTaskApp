<template>
    <div class="max-w-3xl mx-auto">
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
import { computed, reactive, ref } from 'vue'
import { useHead } from '@vueuse/head'
import TaskList from '../../components/tasks/TaskList.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'
import { FileText } from 'lucide-vue-next'

useHead({
    title: 'Task today | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const tasks = reactive<any[]>([
    { id: 1, title: 'Họp với team', date: '2025-10-16', done: false, description: 'Họp định kỳ với team dev' },
    { id: 2, title: 'Code dashboard', date: '2025-10-17', done: false, description: 'Hoàn thiện giao diện dashboard' },
])

const today = new Date().toISOString().slice(0, 10)
const todayTasks = computed(() => tasks.filter(t => t.date === today))

const modal = ref<HTMLDialogElement | null>(null)
const currentTask = ref<any>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<any | null>(null)

function openForm(task?: any) {
    currentTask.value = task ? { ...task } : null
    modal.value?.showModal()
}
function closeForm() {
    modal.value?.close()
}
function saveTask(task: any) {
    if (task.id) {
        const index = tasks.findIndex(t => t.id === task.id)
        if (index > -1) tasks[index] = task
    } else {
        task.id = Date.now()
        if (task.status == null) task.status = 0
        tasks.push(task)
    }
    closeForm()
}
function deleteTask(task: any) {
    const i = tasks.findIndex(t => t.id === task.id)
    if (i > -1) tasks.splice(i, 1)
}

function openDetail(task: any) {
    detailTask.value = { ...task }
    detailModal.value?.showModal()
}
function closeDetail() {
    detailModal.value?.close()
}

function updateTask(updated: any) {
    const index = tasks.findIndex(t => t.id === updated.id)
    if (index > -1) {
        tasks[index] = { ...tasks[index], ...updated }
    }
}
</script>
