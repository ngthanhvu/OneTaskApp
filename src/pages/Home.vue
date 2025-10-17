<template>
    <div class="mx-auto space-y-6 md:space-y-10">
        <!-- Mobile Header -->
        <div class="md:hidden space-y-4">
            
            <!-- Mobile Stats Cards -->
            <div class="grid grid-cols-2 gap-3">
                <div class="stat bg-base-100 shadow rounded-xl border border-base-300 p-4">
                    <div class="stat-title text-xs">Tổng Task</div>
                    <div class="stat-value text-primary text-lg">{{ totalTasks }}</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-xl border border-base-300 p-4">
                    <div class="stat-title text-xs">Đã xong</div>
                    <div class="stat-value text-success text-lg">{{ doneTasks }}</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-xl border border-base-300 p-4">
                    <div class="stat-title text-xs">Còn lại</div>
                    <div class="stat-value text-warning text-lg">{{ remainingTasks }}</div>
                </div>
                <div class="stat bg-base-100 shadow rounded-xl border border-base-300 p-4">
                    <div class="stat-title text-xs">Hôm nay</div>
                    <div class="stat-value text-lg">{{ todayTasks.length }}</div>
                </div>
            </div>
        </div>

        <!-- Desktop Header -->
        <div class="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold">👋 {{ greeting }}, Vũ!</h1>
                <p class="text-base-content/70 sm:text-lg">
                    Hôm nay là <span class="font-medium">{{ todayFormatted }}</span>
                </p>
            </div>
            <button class="btn btn-primary" @click="$router.push('/tasks')">+ Thêm Task</button>
        </div>

        <!-- Desktop Stats -->
        <div class="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="stat bg-base-100 shadow rounded-xl border border-base-300">
                <div class="stat-title">Tổng Task</div>
                <div class="stat-value text-primary">{{ totalTasks }}</div>
                <div class="stat-desc">Tính đến hôm nay</div>
            </div>

            <div class="stat bg-base-100 shadow rounded-xl border border-base-300">
                <div class="stat-title">Đã hoàn thành</div>
                <div class="stat-value text-success">{{ doneTasks }}</div>
                <div class="stat-desc">{{ donePercent }}% công việc</div>
            </div>

            <div class="stat bg-base-100 shadow rounded-xl border border-base-300">
                <div class="stat-title">Còn lại</div>
                <div class="stat-value text-warning">{{ remainingTasks }}</div>
                <div class="stat-desc">Cần hoàn thành sớm</div>
            </div>

            <div class="stat bg-base-100 shadow rounded-xl border border-base-300">
                <div class="stat-title">Hôm nay</div>
                <div class="stat-value">{{ todayTasks.length }}</div>
                <div class="stat-desc">Công việc trong ngày</div>
            </div>
        </div>

        <!-- Calendar + Tasks by selected date -->
        <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-8 items-start">
            <!-- Cột lịch -->
            <div class="flex justify-start lg:justify-start items-start">
                <div class="bg-base-100 rounded-2xl shadow-md border border-base-300 p-4 md:p-6 w-full max-w-[360px]">
                    <h2 class="text-lg md:text-xl font-semibold flex items-center gap-2 mb-3 md:mb-4">
                        <CalendarDaysIcon class="w-4 h-4 md:w-5 md:h-5" />
                        <span class="hidden sm:inline">Lịch công việc</span>
                        <span class="sm:hidden">Lịch</span>
                    </h2>
                    <div class="bg-base-200 rounded-xl p-2 md:p-3 flex justify-center">
                        <VCalendar is-expanded color="primary" :attributes="calendarAttrs" @dayclick="onDayClick" />
                    </div>
                </div>
            </div>

            <!-- Cột danh sách task -->
            <div class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div class="flex items-center gap-2 min-w-0">
                        <LayoutList class="w-4 h-4 md:w-5 md:h-5" />
                        <h2 class="text-lg md:text-xl font-semibold">Công việc ngày {{ selectedDateDisplay }}</h2>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="hidden sm:flex items-center gap-1 overflow-x-auto whitespace-nowrap max-w-[200px] sm:max-w-[260px] md:max-w-[340px]">
                            <span class="badge badge-ghost badge-xs" v-for="t in tagOptions" :key="t"
                                @click="toggleTagFilter(t)" :class="{ 'badge-primary': activeTags.includes(t) }">{{ t
                                }}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Quick Add -->
                <div class="md:hidden">
                    <form class="flex items-center gap-2" @submit.prevent="quickAdd()">
                        <input v-model="quickTitle" class="input input-sm input-bordered flex-1"
                            placeholder="Thêm nhanh..." />
                        <select v-model="quickPriority" class="select select-bordered select-sm w-20">
                            <option value="low">Low</option>
                            <option value="medium">Med</option>
                            <option value="high">High</option>
                        </select>
                        <button class="btn btn-sm btn-primary">+</button>
                    </form>
                </div>
                
                <!-- Desktop Quick Add -->
                <div class="hidden md:block">
                    <form class="flex items-center gap-2" @submit.prevent="quickAdd()">
                        <input v-model="quickTitle" class="input input-sm input-bordered w-52"
                            placeholder="Thêm nhanh..." />
                        <select v-model="quickPriority" class="select select-bordered select-sm">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button class="btn btn-sm btn-primary">Thêm</button>
                    </form>
                </div>

                <div v-if="tasksOfSelected.length" class="space-y-2">
                    <div v-for="task in tasksOfSelected" :key="task.id"
                        class="p-4 rounded-xl bg-base-100 shadow-sm hover:shadow-md transition border border-base-200 flex justify-between items-start gap-3">
                        <div class="flex items-start gap-3 min-w-0">
                            <input type="checkbox" v-model="task.done" class="checkbox checkbox-sm mt-1" />
                            <div class="min-w-0">
                                <p class="truncate max-w-[150px] sm:max-w-xs md:max-w-sm"
                                    :class="{ 'line-through text-base-content/50': task.done }">
                                    {{ task.title }}
                                </p>
                                <div class="flex items-center gap-2 flex-wrap mt-1">
                                    <span class="badge badge-sm" :class="task.done ? 'badge-success' : 'badge-warning'">
                                        {{ task.done ? 'Đã xong' : 'Chưa xong' }}
                                    </span>
                                    <span v-if="task.priority" class="badge badge-sm"
                                        :class="task.priority === 'high' ? 'badge-error' : (task.priority === 'low' ? 'badge-ghost' : 'badge-info')">
                                        {{ task.priority === 'high' ? 'High' : task.priority === 'low' ? 'Low' :
                                        'Medium' }}
                                    </span>
                                    <div v-if="task.tags?.length" class="hidden md:flex items-center gap-1">
                                        <span v-for="t in task.tags" :key="t" class="badge badge-ghost badge-xs">{{ t
                                            }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-xs btn-outline btn-primary" @click="openDetail(task)">
                            Xem
                        </button>
                    </div>
                </div>

                <p v-else class="text-base-content/70 italic">
                    Không có công việc nào trong ngày này 🎉
                </p>
            </div>
        </div>

        <!-- Progress section -->
        <div class="hidden md:block">
            <div class="flex items-center space-x-2 mb-2">
                <ChartNoAxesCombinedIcon class="w-5 h-5" />
                <h2 class="text-2xl font-semibold">Tiến độ tuần này</h2>
            </div>
            <div class="bg-base-100 p-5 rounded-2xl shadow-md border border-base-300">
                <progress class="progress progress-primary w-full" :value="donePercent" max="100"></progress>
                <p class="text-sm text-base-content/70 text-center mt-2">
                    {{ donePercent }}% công việc đã hoàn thành
                </p>
            </div>
        </div>

        <!-- Mobile Progress -->
        <div class="md:hidden">
            <div class="bg-base-100 rounded-xl p-4 shadow border border-base-300">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-sm">Tiến độ hôm nay</h3>
                    <span class="text-xs text-base-content/70">{{ donePercent }}%</span>
                </div>
                <progress class="progress progress-primary w-full h-2" :value="donePercent" max="100"></progress>
            </div>
        </div>

        <!-- Recent tasks -->
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <ClipboardClockIcon class="w-4 h-4 md:w-5 md:h-5" />
                <h2 class="text-lg md:text-2xl font-semibold">Gần đây</h2>
            </div>
            <div class="bg-base-100 rounded-2xl p-3 md:p-4 shadow-md border border-base-200">
                <ul class="divide-y divide-base-200">
                    <li v-for="task in recentTasks" :key="task.id" class="py-2 md:py-3 flex items-center justify-between">
                        <div class="flex items-center gap-2 md:gap-3 min-w-0">
                            <span class="badge badge-ghost badge-xs">{{ task.date }}</span>
                            <span class="truncate text-sm md:text-base" :class="{ 'line-through text-base-content/50': task.done }">
                                {{ task.title }}
                            </span>
                        </div>
                        <button class="btn btn-outline btn-primary btn-xs" @click="openDetail(task)">Mở</button>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Modal detail -->
        <dialog ref="detailModal" class="modal">
            <div class="modal-box w-full max-w-2xl sm:max-w-lg md:max-w-xl lg:max-w-2xl" v-if="detailTask">
                <!-- Header -->
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-bold text-lg">Chi tiết Task</h3>
                    <button class="btn btn-sm btn-ghost" @click="closeDetail">✖</button>
                </div>

                <div class="space-y-3">
                    <!-- Thông tin tiêu đề và trạng thái -->
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-lg sm:text-xl font-semibold break-words"
                                :class="{ 'line-through text-base-content/50': detailTask?.done }">
                                {{ detailTask?.title }}
                            </h4>
                            <div class="mt-1 flex flex-wrap items-center gap-2">
                                <span class="badge badge-outline">Ngày: {{ detailTask?.date }}</span>
                                <span class="badge" :class="detailTask?.done ? 'badge-success' : 'badge-warning'">
                                    {{ detailTask?.done ? 'Đã xong' : 'Chưa xong' }}
                                </span>
                            </div>
                        </div>

                        <!-- Toggle trạng thái -->
                        <label class="label cursor-pointer gap-2 sm:justify-end justify-start">
                            <span class="label-text text-sm text-nowrap">
                                {{ detailTask?.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong' }}
                            </span>
                            <input type="checkbox" v-model="detailTask.done" class="toggle toggle-primary toggle-sm" />
                        </label>
                    </div>

                    <!-- Mô tả -->
                    <div>
                        <h5 class="font-medium mb-1">Mô tả</h5>
                        <p class="text-base-content/70 whitespace-pre-line break-words" v-if="detailTask?.description">
                            {{ detailTask?.description }}
                        </p>
                        <p class="text-base-content/50 italic" v-else>Không có mô tả</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-action">
                    <button class="btn btn-outline w-full sm:w-auto" @click="closeDetail">Đóng</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { CalendarDaysIcon, ChartNoAxesCombinedIcon, ClipboardClockIcon, LayoutList } from 'lucide-vue-next'
import { computed, reactive, ref } from 'vue'
import { useHead } from '@vueuse/head'

interface Task {
    id: number
    title: string
    date: string
    done: boolean
    description?: string
    priority?: 'low' | 'medium' | 'high'
    tags?: string[]
}

useHead({
    title: 'Home | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const tasks = reactive<Task[]>([
    { id: 1, title: 'Viết báo cáo tuần', date: '2025-10-16', done: false, description: 'Chuẩn bị báo cáo dự án' },
    { id: 2, title: 'Học Vue 3 + DaisyUI', date: '2025-10-16', done: true, description: 'Xem qua doc DaisyUI' },
    { id: 3, title: 'Dọn dẹp workspace', date: '2025-10-17', done: false, description: 'Sắp xếp lại code folder' },
])

function getGreetingByHour(date: Date) {
    const hour = date.getHours()
    if (hour < 11) return 'Chào buổi sáng'
    if (hour < 14) return 'Chào buổi trưa'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
}

const greeting = ref<string>(getGreetingByHour(new Date()))

function toLocalYMD(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}
function fromYMD(ymd: string) {
    const [y, m, d] = ymd.split('-').map(Number) as [number, number, number]
    return new Date(y, (m || 1) - 1, d || 1)
}

const today = toLocalYMD(new Date())
const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

const totalTasks = computed(() => tasks.length)
const doneTasks = computed(() => tasks.filter(t => t.done).length)
const remainingTasks = computed(() => totalTasks.value - doneTasks.value)
const donePercent = computed(() =>
    totalTasks.value ? Math.round((doneTasks.value / totalTasks.value) * 100) : 0
)
const todayTasks = computed(() => tasks.filter(t => t.date === today))
const recentTasks = computed(() => [...tasks].sort((a, b) => b.id - a.id).slice(0, 5))

// Quick add & filters
const quickTitle = ref('')
const quickPriority = ref<'low' | 'medium' | 'high'>('medium')
const tagOptions = ['work', 'home', 'learn'] as const
const activeTags = ref<string[]>([])
function toggleTagFilter(tag: string) {
    const i = activeTags.value.indexOf(tag)
    if (i > -1) activeTags.value.splice(i, 1)
    else activeTags.value.push(tag)
}
function quickAdd() {
    if (!quickTitle.value.trim()) return
    const newTask: Task = {
        id: Date.now(),
        title: quickTitle.value.trim(),
        date: selectedDate.value,
        done: false,
        description: '',
        // @ts-ignore add-on fields
        priority: quickPriority.value,
        // @ts-ignore add-on fields
        tags: [...activeTags.value],
    }
    // @ts-ignore extend
    tasks.push(newTask as any)
    quickTitle.value = ''
}

const selectedDate = ref<string>(today)
const selectedDateDisplay = computed(() => fromYMD(selectedDate.value).toLocaleDateString('vi-VN'))
const calendarAttrs = computed(() => [
    {
        key: 'today',
        dates: new Date(),
        highlight: { color: 'info', fillMode: 'light' },
    },
    {
        key: 'has-task',
        dates: tasks.map(t => fromYMD(t.date)),
        dot: { color: 'var(--p)' },
    },
])

function onDayClick(day: any) {
    selectedDate.value = toLocalYMD(day.date)
}
const tasksOfSelected = computed(() => {
    const base = tasks.filter(t => t.date === selectedDate.value)
    if (!activeTags.value.length) return base
    return base.filter((t: any) => Array.isArray((t as any).tags) && (t as any).tags.some((x: string) => activeTags.value.includes(x)))
})

const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<Task | null>(null)
function openDetail(task: Task) {
    detailTask.value = { ...task }
    detailModal.value?.showModal()
}
function closeDetail() {
    detailModal.value?.close()
}
</script>

<style scoped>
/* Sync VCalendar with DaisyUI theme in both light/dark */
:deep(.vc-container) {
    --vc-primary-600: hsl(var(--p));
    --vc-primary-500: hsl(var(--p));
    --vc-accent-600: hsl(var(--a));
    background-color: hsl(var(--b1));
    color: hsl(var(--bc));
    border-radius: 0.75rem;
    border: 1px solid hsl(var(--b3));
}

:deep(.vc-header),
:deep(.vc-weeks) {
    background-color: transparent;
}

:deep(.vc-title),
:deep(.vc-nav-title),
:deep(.vc-header .vc-title) {
    color: hsl(var(--bc));
    opacity: 0.9;
}

:deep(.vc-weekday) {
    color: hsl(var(--bc));
    opacity: 0.7;
}

:deep(.vc-day) {
    background-color: transparent;
}

:deep(.vc-day.is-today .vc-day-content) {
    border-color: hsl(var(--in));
    /* info */
    background-color: color-mix(in oklab, hsl(var(--in)) 15%, transparent);
    color: #605DFF;
}

:deep(.vc-highlight-bg-solid) {
    background-color: hsl(var(--p));
}

:deep(.vc-highlight-content-solid) {
    color: hsl(var(--pc));
}

:deep(.vc-highlight-bg-solid) {
    background-color: #605DFF;
}

:deep(.vc-highlight-content-solid) {
    color: #fff;
}
</style>
