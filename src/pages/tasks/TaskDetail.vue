<template>
    <div class="max-w-2xl mx-auto space-y-5">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Chi tiết Task</h1>
            <router-link class="btn btn-ghost btn-sm" :to="{ name: 'TaskPage' }">← Quay lại</router-link>
        </div>

        <div class="bg-base-100 rounded-xl border border-base-200 p-5 shadow">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-xl font-semibold" :class="{ 'line-through text-base-content/50': task.done }">{{
                        task.title }}</h2>
                    <div class="mt-1 flex items-center gap-2">
                        <span class="badge badge-outline">Ngày: {{ task.date }}</span>
                        <span class="badge" :class="task.done ? 'badge-success' : 'badge-warning'">{{ task.done ?
                            'Đã xong' : 'Chưa xong' }}</span>
                    </div>
                </div>
                <label class="label cursor-pointer gap-2">
                    <span class="label-text text-sm">{{ task.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong' }}</span>
                    <input type="checkbox" v-model="task.done" class="toggle toggle-primary toggle-sm" />
                </label>
            </div>

            <div class="mt-4">
                <h3 class="font-medium mb-1">Mô tả</h3>
                <p class="text-base-content/70 whitespace-pre-line" v-if="task.description">{{ task.description }}</p>
                <p class="text-base-content/50 italic" v-else>Không có mô tả</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = Number(route.params.id)

// Demo data: in real app, fetch by id
const task = ref<any>({
    id,
    title: 'Chi tiết công việc',
    date: new Date().toISOString().slice(0, 10),
    done: false,
    description: 'Mô tả ví dụ cho công việc. Thêm nội dung chi tiết ở đây.'
})
</script>

<style scoped>
</style>