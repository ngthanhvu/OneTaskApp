<template>
    <div class="mx-auto space-y-6 md:space-y-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Calendar class="w-6 h-6" />
                Calendar
            </h1>
            <div class="flex items-center gap-2">
                <button class="btn btn-outline btn-sm" @click="previousMonth">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <button class="btn btn-outline btn-sm" @click="nextMonth">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Calendar Container -->
        <div class="bg-base-100 rounded-2xl shadow-md border border-base-300 p-4 sm:p-6">
            <!-- Month Header -->
            <div class="flex items-center justify-center mb-6">
                <h2 class="text-xl sm:text-2xl font-semibold">{{ currentMonthYear }}</h2>
            </div>

            <!-- Day Headers -->
            <div class="grid grid-cols-7 gap-2 mb-4">
                <div v-for="day in dayHeaders" :key="day"
                    class="text-center text-sm font-medium text-base-content/70 py-2">
                    {{ day }}
                </div>
            </div>

            <!-- Calendar Grid -->
            <div class="grid grid-cols-7 gap-2">
                <div v-for="(day, index) in calendarDays" :key="index"
                    class="bg-base-200 rounded-lg p-3 min-h-[80px] cursor-pointer transition-colors hover:bg-base-300"
                    :class="{
                        'bg-primary text-primary-content': isSelected(day),
                        'bg-success/20 border border-success': isToday(day),
                        'text-base-content/50': !day.isCurrentMonth
                    }" @click="selectDate(day)">
                    <!-- Date Number -->
                    <div class="text-sm font-bold mb-1">{{ day.date }}</div>

                    <!-- Task Count -->
                    <div class="text-xs"
                        :class="day.taskCount > 0 ? 'text-primary font-medium' : 'text-base-content/50'">
                        {{ day.taskCount }} {{ day.taskCount === 1 ? 'task' : 'tasks' }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Selected Date Tasks -->
        <div v-if="selectedDateTasks.length > 0"
            class="bg-base-100 rounded-2xl shadow-md border border-base-300 p-4 sm:p-6">
            <h3 class="text-lg font-semibold mb-4">
                Tasks for {{ selectedDateFormatted }}
            </h3>
            <div class="space-y-2">
                <div v-for="task in selectedDateTasks" :key="task.id"
                    class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" v-model="task.done" class="checkbox checkbox-sm" />
                        <span class="font-medium" :class="{ 'line-through text-base-content/50': task.done }">
                            {{ task.title }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span v-if="task.priority" class="badge badge-sm"
                            :class="task.priority === 'high' ? 'badge-error' : task.priority === 'low' ? 'badge-ghost' : 'badge-info'">
                            {{ task.priority }}
                        </span>
                        <button class="btn btn-xs btn-outline" @click="viewTask(task)">
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="selectedDate"
            class="bg-base-100 rounded-2xl shadow-md border border-base-300 p-4 sm:p-6 text-center">
            <div class="text-base-content/50">
                <Calendar class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tasks for {{ selectedDateFormatted }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useHead } from '@vueuse/head'
import { useTasksStore } from '../stores/tasksStore'
import type { Task } from '../types/task'

useHead({
    title: 'Lịch | Task Wan',
    meta: [
        { name: 'description', content: 'Calendar view for task management' },
        { name: 'keywords', content: 'Calendar, Task, Schedule' },
    ],
})

const tasksStore = useTasksStore()
const currentDate = ref(new Date())
const selectedDate = ref<string | null>(null)

const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    })
})

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    const firstDay = new Date(year, month, 1)
    // const lastDay = new Date(year, month + 1, 0)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const days = []
    const currentDateObj = new Date(startDate)

    for (let i = 0; i < 42; i++) {
        const dateString = currentDateObj.toISOString().slice(0, 10)
        const isCurrentMonth = currentDateObj.getMonth() === month
        const isToday = dateString === new Date().toISOString().slice(0, 10)

        const tasksForDate = (tasksStore.tasks as unknown as Task[]).filter(t => {
            const taskDate = normalizeDateString((t as any).due_at ?? t.date)
            return taskDate === dateString
        })

        days.push({
            date: currentDateObj.getDate(),
            dateString,
            isCurrentMonth,
            isToday,
            taskCount: tasksForDate.length
        })

        currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return days
})

const selectedDateTasks = computed(() => {
    if (!selectedDate.value) return []

    return (tasksStore.tasks as unknown as Task[]).filter(t => {
        const taskDate = normalizeDateString((t as any).due_at ?? t.date)
        return taskDate === selectedDate.value
    })
})

const selectedDateFormatted = computed(() => {
    if (!selectedDate.value) return ''
    const date = new Date(selectedDate.value)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

function normalizeDateString(input: unknown): string | null {
    if (!input) return null
    if (typeof input === 'string') {
        const ymd = input.slice(0, 10)
        if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd
    }
    const parsed = new Date(input as any)
    if (isNaN(parsed.getTime())) return null
    return parsed.toISOString().slice(0, 10)
}

function isSelected(day: any): boolean {
    return selectedDate.value === day.dateString
}

function isToday(day: any): boolean {
    return day.isToday
}

function selectDate(day: any) {
    selectedDate.value = day.dateString
}

function previousMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function viewTask(task: Task) {
    console.log('View task:', task)
}

onMounted(async () => {
    await tasksStore.fetchTasks()
})
</script>

<style scoped>
/* Custom calendar styling */
.calendar-day {
    transition: all 0.2s ease;
}

.calendar-day:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>