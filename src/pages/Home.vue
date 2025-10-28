<template>
    <div class="min-h-screen bg-base-200 p-4 md:p-6">
        <!-- Greeting Header -->
        <div class="hidden md:block mb-8">
            <h1 class="text-3xl font-bold text-base-content mb-2">👋 {{ greeting }}, {{ fullName || 'Guest' }}!</h1>
            <p class="text-base-content/70 text-lg">
                Hôm nay là <span class="font-medium">{{ todayFormatted }}</span>
            </p>
        </div>

        <!-- Top Statistics Bar -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <!-- Tổng công việc -->
                <div class="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-base-content">{{ totalTasks }}</div>
                        <div class="text-sm text-base-content/70">Tổng công việc</div>
                    </div>
                </div>

                <!-- Đã hoàn thành -->
                <div class="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
                    <div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <CheckCircle class="w-5 h-5 text-success" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-base-content">{{ doneTasks }}</div>
                        <div class="text-sm text-base-content/70">Đã hoàn thành</div>
                    </div>
                </div>

                <!-- Đang thực hiện -->
                <div class="flex items-center gap-3 bg-base-100 rounded-xl p-4 shadow-sm border border-base-300">
                    <div class="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Loader2 class="w-5 h-5 text-warning" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-base-content">{{ remainingTasks }}</div>
                        <div class="text-sm text-base-content/70">Đang thực hiện</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column: Calendar + Projects + Schedule -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Calendar + My Projects Row -->
                <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
                    <!-- Calendar Card (Compact) -->
                    <div class="flex justify-start">
                        <div
                            class="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 md:p-6 w-full max-w-[360px]">
                            <h2 class="text-lg md:text-xl font-semibold flex items-center gap-2 mb-3 md:mb-4">
                                <CalendarDaysIcon class="w-4 h-4 md:w-5 md:h-5" />
                                <span class="hidden sm:inline">Lịch công việc</span>
                                <span class="sm:hidden">Lịch</span>
                            </h2>
                            <div class="bg-base-200 rounded-xl p-2 md:p-3 flex justify-center">
                                <VCalendar is-expanded color="primary" :attributes="calendarAttrs"
                                    @dayclick="onDayClick" />
                            </div>
                        </div>
                    </div>

                    <!-- My Projects Section -->
                    <div class="bg-base-100 rounded-xl shadow-sm border border-base-300">
                        <div class="p-6">
                            <!-- Header -->
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-xl font-semibold text-base-content">Dự án</h2>
                                <div class="flex items-center gap-3">
                                    <select class="select select-bordered select-sm">
                                        <option>Tuần này</option>
                                        <option>Tuần trước</option>
                                        <option>Tháng này</option>
                                    </select>
                                    <button class="btn btn-sm btn-outline">Xem tất cả</button>
                                </div>
                            </div>

                            <!-- Projects Table (Desktop) -->
                            <div class="hidden md:block overflow-x-auto">
                                <table class="table w-full">
                                    <thead>
                                        <tr class="border-base-300">
                                            <th class="text-base-content/70 font-medium">Tên công việc</th>
                                            <th class="text-base-content/70 font-medium">Giao cho</th>
                                            <th class="text-base-content/70 font-medium">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="task in recentTasks.slice(0, 3)" :key="task.id"
                                            class="hover:bg-base-200/50">
                                            <td>
                                                <div class="flex items-center gap-3">
                                                    <div
                                                        class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                        <CheckSquare class="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div class="font-medium text-base-content">{{ task.title }}
                                                        </div>
                                                        <div
                                                            class="flex items-center gap-2 text-xs text-base-content/60">
                                                            <span class="flex items-center gap-1">
                                                                <Users class="w-3 h-3" />
                                                                {{ Math.floor(Math.random() * 10) + 1 }}
                                                            </span>
                                                            <span class="flex items-center gap-1">
                                                                <Paperclip class="w-3 h-3" />
                                                                {{ Math.floor(Math.random() * 10) + 1 }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="flex items-center gap-2">
                                                    <div class="avatar">
                                                        <div
                                                            class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                            <User class="w-3 h-3 text-primary" />
                                                        </div>
                                                    </div>
                                                    <span class="text-sm text-base-content">{{ fullName || 'Người dùng'
                                                        }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="badge badge-sm"
                                                    :class="task.done ? 'badge-success' : 'badge-warning'">
                                                    {{ task.done ? 'Hoàn thành' : 'Đang làm' }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Projects List (Mobile) -->
                            <div class="md:hidden space-y-2">
                                <div v-for="task in recentTasks.slice(0, 3)" :key="task.id"
                                    class="relative p-3 rounded-lg border border-base-300 hover:bg-base-200/50">
                                    <span class="badge badge-xs rounded-full px-2.5 absolute top-2 right-2"
                                        :class="task.done ? 'badge-success' : 'badge-warning'">
                                        {{ task.done ? 'Hoàn thành' : 'Đang làm' }}
                                    </span>
                                    <div class="flex items-center justify-between gap-3">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div
                                                class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <CheckSquare class="w-4 h-4 text-primary" />
                                            </div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-medium truncate">{{ task.title }}</p>
                                                <div class="flex items-center gap-3 text-xs text-base-content/60 mt-1">
                                                    <span class="flex items-center gap-1">
                                                        <Users class="w-3 h-3" />
                                                        {{ Math.floor(Math.random() * 10) + 1 }}
                                                    </span>
                                                    <span class="flex items-center gap-1">
                                                        <Paperclip class="w-3 h-3" />
                                                        {{ Math.floor(Math.random() * 10) + 1 }}
                                                    </span>
                                                </div>
                                                <div class="flex items-center gap-2 text-xs mt-1">
                                                    <div class="avatar placeholder">
                                                        <div class="w-5 h-5 rounded-full bg-primary/20">
                                                            <User class="w-3 h-3 text-primary" />
                                                        </div>
                                                    </div>
                                                    <span class="truncate">{{ fullName || 'Người dùng' }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Schedule Section (uses real tasks by selected date) -->
                <div class="bg-base-100 rounded-xl shadow-sm border border-base-300">
                    <div class="p-6">
                        <!-- Header -->
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl font-semibold text-base-content">Lịch trình</h2>
                            <button class="btn btn-sm btn-ghost">
                                <MoreHorizontal class="w-4 h-4" />
                            </button>
                        </div>

                        <!-- Week Quick Picker -->
                        <div class="mb-6">
                            <div class="grid grid-cols-7 gap-2 mb-4">
                                <div v-for="day in weekDays" :key="day.date"
                                    class="text-center p-2 rounded-lg cursor-pointer transition-colors"
                                    :class="day.isToday ? 'bg-primary text-primary-content' : 'hover:bg-base-200'"
                                    @click="quickPickDay(day.date)">
                                    <div class="text-xs font-medium">{{ day.day }}</div>
                                    <div class="text-sm font-semibold">{{ day.date }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Schedule Events -->
                        <div class="space-y-3">
                            <div v-for="task in tasksOfSelectedDate" :key="task.id"
                                class="flex items-center gap-3 p-3 rounded-lg border border-base-300">
                                <div class="w-1 h-12 rounded-full"
                                    :class="task.done ? 'bg-success' : (task.priority === 'high' ? 'bg-error' : task.priority === 'medium' ? 'bg-warning' : 'bg-info')">
                                </div>
                                <div class="flex-1">
                                    <div class="font-medium text-base-content"
                                        :class="{ 'line-through text-base-content/50': task.done }">
                                        {{ task.title }}
                                    </div>
                                    <div class="text-sm text-base-content/70">{{ task.date }}</div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="badge badge-sm" :class="task.done ? 'badge-success' : 'badge-warning'">
                                        {{ task.done ? 'Hoàn thành' : 'Đang chờ' }}
                                    </span>
                                    <button class="btn btn-xs btn-ghost" @click="openDetail(task)">
                                        <MoreHorizontal class="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div v-if="tasksOfSelectedDate.length === 0" class="text-center py-8 text-base-content/50">
                                Không có công việc nào cho ngày này
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Notes + Quick Add + Recent -->
            <div class="space-y-6">
                <!-- Notes (from Supabase) -->
                <div class="bg-base-100 rounded-xl shadow-sm border border-base-300">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-base-content">Ghi chú</h3>
                            <button class="btn btn-sm btn-primary" @click="openNoteModal()">Thêm</button>
                        </div>
                        <div class="space-y-3">
                            <div v-for="note in notes" :key="note.id"
                                class="flex items-start gap-3 p-2 rounded-lg hover:bg-base-200">
                                <input type="checkbox" class="checkbox checkbox-sm mt-1" :checked="note.completed"
                                    @change="toggleNote(note)" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium truncate"
                                        :class="{ 'line-through text-base-content/50': note.completed }">{{ note.title
                                        }}</div>
                                    <div class="text-sm text-base-content/70 break-words">{{ note.description }}</div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button class="btn btn-ghost btn-xs" @click="openNoteModal(note)">Sửa</button>
                                    <button class="btn btn-ghost btn-xs text-error"
                                        @click="deleteNote(note.id)">Xóa</button>
                                </div>
                            </div>
                            <p v-if="!notes.length" class="text-sm text-base-content/50">Chưa có ghi chú nào.</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Add Task -->
                <div class="bg-base-100 rounded-xl shadow-sm border border-base-300">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-base-content mb-4">Thêm nhanh</h3>
                        <form @submit.prevent="quickAdd()" class="space-y-3">
                            <input v-model="quickTitle" type="text" placeholder="Tiêu đề công việc..."
                                class="input input-bordered w-full" />
                            <select v-model="quickPriority" class="select select-bordered w-full">
                                <option value="low">Ưu tiên thấp</option>
                                <option value="medium">Ưu tiên trung bình</option>
                                <option value="high">Ưu tiên cao</option>
                            </select>
                            <button type="submit" class="btn btn-primary w-full" :disabled="!quickTitle.trim()">
                                Thêm công việc
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Recent Tasks -->
                <div class="bg-base-100 rounded-xl shadow-sm border border-base-300 mb-15">
                    <div class="p-6">
                        <h3 class="text-lg font-semibold text-base-content mb-4">Gần đây</h3>
                        <div class="space-y-3">
                            <div v-for="task in recentTasks.slice(0, 5)" :key="task.id"
                                class="flex items-center justify-between p-2 rounded-lg hover:bg-base-200">
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" v-model="task.done" class="checkbox checkbox-sm" />
                                    <span class="text-sm" :class="{ 'line-through text-base-content/50': task.done }">
                                        {{ task.title }}
                                    </span>
                                </div>
                                <button class="btn btn-xs btn-outline" @click="openDetail(task)">
                                    Xem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

        <!-- Modal Note -->
        <dialog ref="noteModal" class="modal">
            <div class="modal-box w-full max-w-md">
                <h3 class="font-bold text-lg mb-3">{{ noteEditingId ? 'Sửa ghi chú' : 'Thêm ghi chú' }}</h3>
                <form class="space-y-3" @submit.prevent="saveNote">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Tiêu đề</span>
                        </label>
                        <input v-model="noteFormTitle" class="input input-bordered w-full" placeholder="Nhập tiêu đề" />
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Nội dung</span>
                        </label>
                        <textarea v-model="noteFormDescription" class="textarea textarea-bordered w-full" rows="4"
                            placeholder="Nhập nội dung..."></textarea>
                    </div>
                    <div class="modal-action">
                        <button type="button" class="btn" @click="closeNoteModal">Hủy</button>
                        <button type="submit" class="btn btn-primary" :disabled="!noteFormTitle.trim()">Lưu</button>
                    </div>
                </form>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { Clock, CheckCircle, Loader2, CheckSquare, Users, Paperclip, User, MoreHorizontal, CalendarDays as CalendarDaysIcon } from 'lucide-vue-next'
import { computed, ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useTasksStore } from '../stores/tasksStore'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabaseClient'

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
    title: 'Bảng điều khiển | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const tasksStore = useTasksStore()
const authStore = useAuthStore()
const fullName = computed(() => authStore.profile?.full_name || '')

// Greeting function
function getGreetingByHour(date: Date) {
    const hour = date.getHours()
    if (hour < 11) return 'Chào buổi sáng'
    if (hour < 14) return 'Chào buổi trưa'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
}

const greeting = ref<string>(getGreetingByHour(new Date()))
const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

// Task statistics
const totalTasks = computed(() => (tasksStore.tasks as unknown as Task[]).length)
const doneTasks = computed(() => (tasksStore.tasks as unknown as Task[]).filter(t => t.done).length)
const remainingTasks = computed(() => totalTasks.value - doneTasks.value)
const recentTasks = computed(() => ([...((tasksStore.tasks as unknown as Task[]))]).sort((a, b) => b.id - a.id).slice(0, 5))

// Quick add functionality
const quickTitle = ref('')
const quickPriority = ref<'low' | 'medium' | 'high'>('medium')

function quickAdd() {
    if (!quickTitle.value.trim()) return
    tasksStore.addTask({
        title: quickTitle.value.trim(),
        date: new Date().toISOString().split('T')[0] || '',
        done: false,
        description: '',
        priority: quickPriority.value,
        tags: [],
    })
    quickTitle.value = ''
}

// Calendar data
const selectedDate = ref(new Date().getDate().toString())
const weekDays = computed(() => {
    const today = new Date()
    const days = []
    for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - today.getDay() + i)
        days.push({
            day: date.toLocaleDateString('en', { weekday: 'short' }),
            date: date.getDate().toString(),
            isToday: date.getDate() === today.getDate()
        })
    }
    return days
})

function quickPickDay(day: string) {
    selectedDate.value = day
}

// VCalendar attributes using real tasks
const calendarAttrs = computed(() => {
    const tasks = tasksStore.tasks as unknown as Task[]
    const dots = tasks.map(t => {
        const parts = (t.date || '').split('-')
        const y = Number(parts[0] || new Date().getFullYear())
        const m = Number(parts[1] || new Date().getMonth() + 1)
        const d = Number(parts[2] || new Date().getDate())
        return { dates: new Date(y, m - 1, d), dot: { color: 'var(--p)' } }
    })
    return [
        { key: 'today', dates: new Date(), highlight: { color: 'info', fillMode: 'light' } },
        ...dots,
    ]
})

function onDayClick(day: any) {
    selectedDate.value = String(day.date.getDate())
}

// Tasks for selected date
const tasksOfSelectedDate = computed(() => {
    const today = new Date()
    const selectedDay = parseInt(selectedDate.value)
    const selectedDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

    return (tasksStore.tasks as unknown as Task[]).filter(task => task.date === selectedDateStr)
})

// Modal functions
const detailModal = ref<HTMLDialogElement | null>(null)
const detailTask = ref<Task | null>(null)

function openDetail(task: Task) {
    detailTask.value = { ...task }
    detailModal.value?.showModal()
}

function closeDetail() {
    detailModal.value?.close()
}

// Notes state and functions (Supabase)
type NoteItem = {
    id: number
    user_id: string
    title: string
    description: string | null
    completed: boolean
    created_at: string
    updated_at: string
}

const notes = ref<NoteItem[]>([])
const noteModal = ref<HTMLDialogElement | null>(null)
const noteEditingId = ref<number | null>(null)
const noteFormTitle = ref('')
const noteFormDescription = ref('')
async function fetchNotes() {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
    notes.value = (data as NoteItem[]) || []
}
function openNoteModal(note?: NoteItem) {
    if (note) {
        noteEditingId.value = note.id
        noteFormTitle.value = note.title
        noteFormDescription.value = note.description || ''
    } else {
        noteEditingId.value = null
        noteFormTitle.value = ''
        noteFormDescription.value = ''
    }
    noteModal.value?.showModal()
}
function closeNoteModal() {
    noteModal.value?.close()
}
async function saveNote() {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!noteFormTitle.value.trim()) return
    if (noteEditingId.value) {
        const { data, error } = await supabase
            .from('notes')
            .update({ title: noteFormTitle.value.trim(), description: noteFormDescription.value.trim() })
            .eq('id', noteEditingId.value)
            .select('*')
            .single()
        if (!error && data) {
            const i = notes.value.findIndex(n => n.id === noteEditingId.value)
            if (i > -1) notes.value[i] = data as NoteItem
        }
    } else {
        const payload = { title: noteFormTitle.value.trim(), description: noteFormDescription.value.trim(), completed: false, user_id: user?.id }
        const { data, error } = await supabase.from('notes').insert(payload).select('*').single()
        if (!error && data) notes.value.unshift(data as NoteItem)
    }
    closeNoteModal()
}
async function toggleNote(n: NoteItem) {
    const { data, error } = await supabase.from('notes').update({ completed: !n.completed }).eq('id', n.id).select('*').single()
    if (!error && data) {
        const i = notes.value.findIndex(x => x.id === n.id)
        if (i > -1) notes.value[i] = data as NoteItem
    }
}
async function deleteNote(id: number) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (!error) notes.value = notes.value.filter(x => x.id !== id)
}

onMounted(async () => {
    await tasksStore.fetchTasks()
    await authStore.fetchUserProfile({ force: true })
    await fetchNotes()
})
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
    background-color: color-mix(in oklab, hsl(var(--in)) 15%, transparent);
    color: #81aacc;
}

:deep(.vc-highlight-bg-solid) {
    background-color: hsl(var(--p));
}

:deep(.vc-highlight-content-solid) {
    color: hsl(var(--pc));
}
</style>
