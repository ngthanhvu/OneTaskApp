<template>
    <div class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold">Công việc hôm nay</h1>
            <span class="badge badge-primary badge-outline">{{ today }}</span>
        </div>
        <TaskList :tasks="todayTasks" />
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import TaskList from '../../components/tasks/TaskList.vue'

const tasks = reactive<any[]>([
    { id: 1, title: 'Họp với team', date: '2025-10-16', done: false },
    { id: 2, title: 'Code dashboard', date: '2025-10-17', done: false },
])

const today = new Date().toISOString().slice(0, 10)
const todayTasks = computed(() => tasks.filter(t => t.date === today))
</script>
