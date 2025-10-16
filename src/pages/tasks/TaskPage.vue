<template>
    <div class="mx-auto space-y-10">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold">Tất cả Task</h1>
            <div class="flex items-center gap-2">
                <TaskFilterBar v-model="filter" />
                <button class="btn btn-primary" @click="openForm()">+ Thêm task</button>
            </div>
        </div>

        <TaskList :tasks="filteredTasks" @edit="openForm" @delete="deleteTask" @view="openDetail" />

        <!-- Modal form -->
        <dialog ref="modal" class="modal">
            <div class="modal-box">
                <TaskForm :task="currentTask" @submit="saveTask" @cancel="closeForm" />
                <div class="modal-action">
                    <button class="btn" @click="closeForm">Đóng</button>
                </div>
            </div>
        </dialog>

        <!-- Modal detail -->
        <dialog ref="detailModal" class="modal">
            <div class="modal-box w-full max-w-2xl" v-if="detailTask">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-lg">Chi tiết Task</h3>
                    <button class="btn btn-sm btn-ghost" @click="closeDetail">✖</button>
                </div>
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <h4 class="text-xl font-semibold" :class="{ 'line-through text-base-content/50': detailTask?.done }">{{ detailTask?.title }}</h4>
                            <div class="mt-1 flex items-center gap-2">
                                <span class="badge badge-outline">Ngày: {{ detailTask?.date }}</span>
                                <span class="badge" :class="detailTask?.done ? 'badge-success' : 'badge-warning'">{{ detailTask?.done ? 'Đã xong' : 'Chưa xong' }}</span>
                            </div>
                        </div>
                        <label class="label cursor-pointer gap-2">
                            <span class="label-text text-sm">{{ detailTask?.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong' }}</span>
                            <input type="checkbox" v-model="detailTask.done" class="toggle toggle-primary toggle-sm" />
                        </label>
                    </div>
                    <div>
                        <h5 class="font-medium mb-1">Mô tả</h5>
                        <p class="text-base-content/70 whitespace-pre-line" v-if="detailTask?.description">{{ detailTask?.description }}</p>
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
import { ref, reactive, computed } from 'vue'
import TaskList from '../../components/tasks/TaskList.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'
import TaskFilterBar from '../../components/tasks/TaskFilterBar.vue'

const tasks = reactive<any[]>([
    { id: 1, title: 'Viết báo cáo', date: '2025-10-16', done: false },
    { id: 2, title: 'Học Vue 3 + DaisyUI', date: '2025-10-17', done: true },
])
const modal = ref<HTMLDialogElement | null>(null)
const currentTask = ref<any>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<any | null>(null)
const filter = ref<'all' | 'today' | 'done' | 'todo'>('all')
const today = new Date().toISOString().slice(0, 10)
const filteredTasks = computed(() => {
    if (filter.value === 'today') return tasks.filter(t => t.date === today)
    if (filter.value === 'done') return tasks.filter(t => t.done)
    if (filter.value === 'todo') return tasks.filter(t => !t.done)
    return tasks
})

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
</script>
