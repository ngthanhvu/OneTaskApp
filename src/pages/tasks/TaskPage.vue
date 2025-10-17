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
import { ref, reactive, computed } from 'vue'
import { LayoutList, Plus, FileText } from 'lucide-vue-next'
import TaskList from '../../components/tasks/TaskList.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'
import TaskFilterBar from '../../components/tasks/TaskFilterBar.vue'

const tasks = reactive<any[]>([
    { id: 1, title: 'Viết báo cáo', date: '2025-10-16', done: false, status: 0, priority: 'high', tags: ['work'] },
    { id: 2, title: 'Học Vue 3 + DaisyUI', date: '2025-10-17', done: true, status: 2, priority: 'medium', tags: ['learn'] },
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
const backlog = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 0))
const inProgress = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 1))
const doneList = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 2))

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
