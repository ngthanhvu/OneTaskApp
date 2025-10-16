<template>
    <div class="mx-auto space-y-10">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold">👋 Xin chào, Vũ!</h1>
                <p class="text-base-content/70">
                    Hôm nay là <span class="font-medium">{{ todayFormatted }}</span>
                </p>
            </div>
            <button class="btn btn-primary" @click="$router.push('/tasks')">+ Thêm Task</button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
            <!-- Cột lịch -->
            <div class="flex justify-start lg:justify-start items-start">
                <div class="bg-base-100 rounded-2xl shadow-md border border-base-300 p-6 w-full max-w-[360px]">
                    <h2 class="text-xl font-semibold flex items-center gap-2 mb-4">
                        <CalendarDaysIcon class="w-5 h-5" />
                        Lịch công việc
                    </h2>
                    <div class="bg-base-200 rounded-xl p-3 flex justify-center">
                        <VCalendar is-expanded color="primary" :attributes="calendarAttrs" @dayclick="onDayClick" />
                    </div>
                </div>
            </div>

            <!-- Cột danh sách task -->
            <div class="space-y-4">
                <div class="flex items-center space-x-2 mb-2">
                    <LayoutList class="w-5 h-5" />
                    <h2 class="text-xl font-semibold">
                        Công việc ngày {{ selectedDateDisplay }}
                    </h2>
                </div>

                <div v-if="tasksOfSelected.length" class="space-y-2">
                    <div v-for="task in tasksOfSelected" :key="task.id"
                        class="p-4 rounded-xl bg-base-100 shadow-sm hover:shadow-md transition border border-base-200 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" v-model="task.done" class="checkbox checkbox-sm" />
                            <span :class="{ 'line-through text-base-content/50': task.done }">
                                {{ task.title }}
                            </span>
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
        <div>
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

        <!-- Recent tasks -->
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <ClipboardClockIcon class="w-5 h-5" />
                <h2 class="text-2xl font-semibold">Gần đây</h2>
            </div>
            <div class="bg-base-100 rounded-2xl p-4 shadow-md border border-base-200">
                <ul class="divide-y divide-base-200">
                    <li v-for="task in recentTasks" :key="task.id" class="py-3 flex items-center justify-between">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="badge badge-ghost badge-sm">{{ task.date }}</span>
                            <span class="truncate" :class="{ 'line-through text-base-content/50': task.done }">
                                {{ task.title }}
                            </span>
                        </div>
                        <button class="link link-primary text-sm" @click="openDetail(task)">Mở</button>
                    </li>
                </ul>
            </div>
        </div>

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
                            <h4 class="text-xl font-semibold"
                                :class="{ 'line-through text-base-content/50': detailTask?.done }">
                                {{ detailTask?.title }}
                            </h4>
                            <div class="mt-1 flex items-center gap-2">
                                <span class="badge badge-outline">Ngày: {{ detailTask?.date }}</span>
                                <span class="badge" :class="detailTask?.done ? 'badge-success' : 'badge-warning'">
                                    {{ detailTask?.done ? 'Đã xong' : 'Chưa xong' }}
                                </span>
                            </div>
                        </div>
                        <label class="label cursor-pointer gap-2">
                            <span class="label-text text-sm">
                                {{ detailTask?.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong' }}
                            </span>
                            <input type="checkbox" v-model="detailTask.done" class="toggle toggle-primary toggle-sm" />
                        </label>
                    </div>
                    <div>
                        <h5 class="font-medium mb-1">Mô tả</h5>
                        <p class="text-base-content/70 whitespace-pre-line" v-if="detailTask?.description">
                            {{ detailTask?.description }}
                        </p>
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
import { CalendarDaysIcon, ChartNoAxesCombinedIcon, ClipboardClockIcon, LayoutList } from 'lucide-vue-next'
import { computed, reactive, ref } from 'vue'
interface Task {
    id: number
    title: string
    date: string
    done: boolean
    description?: string
}

const tasks = reactive<Task[]>([
    { id: 1, title: 'Viết báo cáo tuần', date: '2025-10-16', done: false, description: 'Chuẩn bị báo cáo dự án' },
    { id: 2, title: 'Học Vue 3 + DaisyUI', date: '2025-10-16', done: true, description: 'Xem qua doc DaisyUI' },
    { id: 3, title: 'Dọn dẹp workspace', date: '2025-10-17', done: false, description: 'Sắp xếp lại code folder' },
])

const today = new Date().toISOString().slice(0, 10)
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

const selectedDate = ref<string>(today)
const selectedDateDisplay = computed(() =>
    new Date(selectedDate.value).toLocaleDateString('vi-VN')
)
const calendarAttrs = computed(() => [
    {
        key: 'today',
        highlight: true,
        dates: new Date(),
    },
    {
        key: 'has-task',
        dates: tasks.map(t => new Date(t.date)),
        dot: { color: 'var(--p)' },
    },
])

function onDayClick(day: any) {
    selectedDate.value = day.date.toISOString().slice(0, 10)
}
const tasksOfSelected = computed(() =>
    tasks.filter(t => t.date === selectedDate.value)
)

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
.vc-container {
    --vc-primary-600: hsl(var(--p));
    --vc-accent-600: hsl(var(--a));
    background-color: hsl(var(--b1));
    color: hsl(var(--bc));
    border-radius: 0.75rem;
}
</style>
