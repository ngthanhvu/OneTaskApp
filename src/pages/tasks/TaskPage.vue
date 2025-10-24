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

        <!-- Calendar Navigation -->
        <div class="bg-base-100 rounded-xl p-3 sm:p-4 shadow-sm border border-base-300">
            <div class="flex items-center justify-between mb-3 sm:mb-4">
                <h3 class="font-semibold text-sm sm:text-lg">Chọn ngày</h3>
                <div class="flex items-center gap-1 sm:gap-2">
                    <button class="btn btn-xs sm:btn-sm btn-outline" @click="previousWeek">
                        <ChevronLeft class="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button class="btn btn-xs sm:btn-sm btn-outline" @click="nextWeek">
                        <ChevronRight class="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            <!-- Week View -->
            <div class="grid grid-cols-7 gap-1 sm:gap-2">
                <div v-for="(day, index) in weekDays" :key="index"
                    class="flex flex-col items-center justify-center p-1.5 sm:p-3 rounded-lg transition-colors cursor-pointer min-h-[50px] sm:min-h-[80px]"
                    :class="{
                        'bg-primary text-primary-content': selectedDate === day.date,
                        'bg-base-200 hover:bg-base-300 text-base-content': selectedDate !== day.date,
                        'bg-success/20 border border-success text-base-content': day.isToday && selectedDate !== day.date
                    }" @click="selectDate(day.date)">
                    <span class="text-xs font-medium">{{ day.dayName }}</span>
                    <span class="text-sm sm:text-lg font-bold">{{ day.dayNumber }}</span>
                    <div class="mt-0.5 sm:mt-1 min-h-[10px] sm:min-h-[16px] flex items-center">
                        <span v-if="day.taskCount > 0" class="badge badge-xs"
                            :class="day.taskCount > 3 ? 'badge-error' : day.taskCount > 1 ? 'badge-warning' : 'badge-success'">
                            {{ day.taskCount }}
                        </span>
                    </div>
                </div>
            </div>
        </div>


        <!-- Mobile Kanban - Vertical Stack -->
        <div class="md:hidden space-y-4">
            <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 bg-base-200 rounded-lg p-3">
                    <h3 class="font-semibold text-sm">Chưa làm</h3>
                    <span class="badge badge-ghost badge-sm">{{ selectedDateBacklog.length }}</span>
                </div>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    <TaskList :tasks="selectedDateBacklog" @edit="openForm" @delete="deleteTask" @view="openDetail"
                        @update="updateTask" @status-change="updateTask" />
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 bg-base-200 rounded-lg p-3">
                    <h3 class="font-semibold text-sm">Đang làm</h3>
                    <span class="badge badge-info badge-outline badge-sm">{{ selectedDateInProgress.length }}</span>
                </div>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    <TaskList :tasks="selectedDateInProgress" @edit="openForm" @delete="deleteTask" @view="openDetail"
                        @update="updateTask" @status-change="updateTask" />
                </div>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 bg-base-200 rounded-lg p-3">
                    <h3 class="font-semibold text-sm">Đã làm</h3>
                    <span class="badge badge-success badge-outline badge-sm">{{ selectedDateDoneList.length }}</span>
                </div>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    <TaskList :tasks="selectedDateDoneList" @edit="openForm" @delete="deleteTask" @view="openDetail"
                        @update="updateTask" @status-change="updateTask" />
                </div>
            </div>
        </div>

        <!-- Desktop Kanban - Grid Layout -->
        <div class="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-300px)]">
            <div class="space-y-2 h-full flex flex-col">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="font-semibold truncate">Chưa làm</h3>
                    <span class="badge badge-ghost shrink-0">{{ selectedDateBacklog.length }}</span>
                </div>
                <div class="flex-1 p-2 border-2 border-dashed border-base-300 rounded-lg transition-colors overflow-y-auto"
                    :class="{ 'border-primary bg-primary/5': dragOverColumn === 0 }"
                    @dragover.prevent="dragOverColumn = 0" @dragleave="dragOverColumn = null"
                    @drop.prevent="handleDrop(0, $event)">
                    <TaskList :tasks="selectedDateBacklog" :draggable="true" @reorder="reorderTasks(0, $event)"
                        @edit="openForm" @delete="deleteTask" @view="openDetail" @update="updateTask"
                        @status-change="updateTask" />
                </div>
            </div>
            <div class="space-y-2 h-full flex flex-col">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="font-semibold truncate">Đang làm</h3>
                    <span class="badge badge-info badge-outline shrink-0">{{ selectedDateInProgress.length }}</span>
                </div>
                <div class="flex-1 p-2 border-2 border-dashed border-base-300 rounded-lg transition-colors overflow-y-auto"
                    :class="{ 'border-primary bg-primary/5': dragOverColumn === 1 }"
                    @dragover.prevent="dragOverColumn = 1" @dragleave="dragOverColumn = null"
                    @drop.prevent="handleDrop(1, $event)">
                    <TaskList :tasks="selectedDateInProgress" :draggable="true" @reorder="reorderTasks(1, $event)"
                        @edit="openForm" @delete="deleteTask" @view="openDetail" @update="updateTask"
                        @status-change="updateTask" />
                </div>
            </div>
            <div class="space-y-2 h-full flex flex-col">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="font-semibold truncate">Đã làm</h3>
                    <span class="badge badge-success badge-outline shrink-0">{{ selectedDateDoneList.length }}</span>
                </div>
                <div class="flex-1 p-2 border-2 border-dashed border-base-300 rounded-lg transition-colors overflow-y-auto"
                    :class="{ 'border-primary bg-primary/5': dragOverColumn === 2 }"
                    @dragover.prevent="dragOverColumn = 2" @dragleave="dragOverColumn = null"
                    @drop.prevent="handleDrop(2, $event)">
                    <TaskList :tasks="selectedDateDoneList" :draggable="true" @reorder="reorderTasks(2, $event)"
                        @edit="openForm" @delete="deleteTask" @view="openDetail" @update="updateTask"
                        @status-change="updateTask" />
                </div>
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
                        <p class="text-base-content/70 whitespace-pre-line break-words" v-if="detailTask?.description">
                            {{
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
import { LayoutList, Plus, FileText, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useHead } from '@vueuse/head'
import TaskList from '../../components/tasks/TaskList.vue'
import TaskForm from '../../components/tasks/TaskForm.vue'
import TaskFilterBar from '../../components/tasks/TaskFilterBar.vue'
import { useTasksStore } from '../../stores/tasksStore'
import { useNotifications } from '../../composables/useNotifications'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../../types/task'

useHead({
    title: 'Chi tiết công việc | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const tasksStore = useTasksStore()
const notifications = useNotifications()
const modal = ref<HTMLDialogElement | null>(null)
const currentTask = ref<any>(null)
const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<any | null>(null)
const filter = ref<'all' | 'today' | 'done' | 'todo' | 'overdue'>('all')
const today = new Date().toISOString().slice(0, 10)
const dragOverColumn = ref<number | null>(null)
const selectedDate = ref<string>(today)
const currentWeekStart = ref<Date>(new Date())

function toYmdLocal(date: Date): string {
    return date.toISOString().slice(0, 10)
}

function normalizeDateString(input: unknown): string | null {
    if (!input) return null
    if (typeof input === 'string') {
        const ymd = input.slice(0, 10)
        if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd
    }
    const parsed = new Date(input as any)
    if (isNaN(parsed.getTime())) return null
    return toYmdLocal(parsed)
}

// const filteredTasks = computed(() => {
//     const list = tasksStore.tasks as unknown as Task[]
//     if (filter.value === 'today') {
//         return list.filter(t => {
//             const due = normalizeDateString((t as any).due_at ?? t.date)
//             return due === today
//         })
//     }
//     if (filter.value === 'done') return list.filter(t => t.done)
//     if (filter.value === 'todo') return list.filter(t => !t.done)
//     if (filter.value === 'overdue') {
//         const todayYmd = toYmdLocal(new Date())
//         return list.filter(t => {
//             const due = normalizeDateString((t as any).due_at ?? t.date)
//             return !t.done && due && due < todayYmd
//         })
//     }
//     return list
// })
// const backlog = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 0))
// const inProgress = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 1))
// const doneList = computed(() => filteredTasks.value.filter(t => (t.status ?? 0) === 2))

// Calendar functionality
const weekDays = computed(() => {
    const startOfWeek = new Date(currentWeekStart.value)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // Start from Sunday

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + index)
        const dateString = toYmdLocal(date)
        const isToday = dateString === today

        // Count tasks for this date
        const tasksForDate = (tasksStore.tasks as unknown as Task[]).filter(t => {
            const taskDate = normalizeDateString((t as any).due_at ?? t.date)
            return taskDate === dateString
        })

        return {
            date: dateString,
            dayName: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
            dayNumber: date.getDate(),
            isToday,
            taskCount: tasksForDate.length
        }
    })
})

// Tasks for selected date
const selectedDateTasks = computed(() => {
    const tasks = (tasksStore.tasks as unknown as Task[]).filter(t => {
        const taskDate = normalizeDateString((t as any).due_at ?? t.date)
        return taskDate === selectedDate.value
    })
    return tasks
})

const selectedDateBacklog = computed(() => selectedDateTasks.value.filter(t => (t.status ?? 0) === 0))
const selectedDateInProgress = computed(() => selectedDateTasks.value.filter(t => (t.status ?? 0) === 1))
const selectedDateDoneList = computed(() => selectedDateTasks.value.filter(t => (t.status ?? 0) === 2))

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

async function reorderTasks(status: number, newList: any[]) {
    try {
        await tasksStore.reorderTasks(status as any, newList)
    } catch (error) {
        console.error('Failed to reorder tasks:', error)
        await tasksStore.refresh()
    }
}

function handleDrop(targetStatus: number, event: DragEvent) {
    dragOverColumn.value = null

    const taskData = event.dataTransfer?.getData('application/json')
    if (!taskData) return

    try {
        const task = JSON.parse(taskData)
        if (task && task.id) {
            updateTask({ ...task, status: targetStatus })
        }
    } catch (error) {
        console.error('Failed to parse dragged task:', error)
    }
}

// Calendar navigation functions
function selectDate(date: string) {
    selectedDate.value = date
}

function previousWeek() {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() - 7)
    currentWeekStart.value = newDate
}

function nextWeek() {
    const newDate = new Date(currentWeekStart.value)
    newDate.setDate(newDate.getDate() + 7)
    currentWeekStart.value = newDate
}

onMounted(async () => {
    await tasksStore.fetchTasks()

    // Request notification permission and setup reminders
    if (notifications.isSupported.value) {
        try {
            const granted = await notifications.requestPermission()
            if (granted) {
                // Check for today's tasks and overdue tasks
                await notifications.checkTodayTasks(tasksStore.tasks)
                await notifications.checkOverdueTasks(tasksStore.tasks)

                // Schedule deadline reminders for upcoming tasks
                await notifications.scheduleTaskReminders(tasksStore.tasks)
            } else {
                console.warn('Notification permission not granted')
            }
        } catch (error) {
            console.error('Failed to setup notifications:', error)
        }
    }
})
</script>
