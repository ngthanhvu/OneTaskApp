<template>
    <div
        class="group p-4 rounded-xl bg-base-100/80 shadow-sm hover:shadow-md border border-base-200 hover:border-base-300 transition-all">
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <span class="truncate font-medium" :class="{ 'line-through text-base-content/50': local.done }">{{
                        local.title }}</span>
                    <span class="badge badge-ghost badge-sm">{{ local.date }}</span>
                </div>
                <p v-if="local.description" class="text-sm text-base-content/60 mt-1 line-clamp-3">{{
                    local.description }}</p>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button class="btn btn-ghost btn-xs" title="Sửa" @click="$emit('edit', local)">✏️</button>
                <button class="btn btn-ghost btn-xs text-error" title="Xoá" @click="$emit('delete', local)">🗑️</button>
            </div>
        </div>
        <div class="mt-3 flex items-center justify-between">
            <button class="link link-primary text-sm" @click="$emit('view', local)">Xem chi tiết</button>
            <label class="label cursor-pointer gap-2">
                <span class="label-text text-sm">{{ local.done ? 'Đã xong' : 'Chưa xong' }}</span>
                <input type="checkbox" v-model="local.done" class="toggle toggle-primary toggle-sm"
                    @change="$emit('update', local)" />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
const props = defineProps<{ task: any }>()
defineEmits(['edit', 'delete', 'update', 'view'])
const local = reactive({ ...props.task })
watch(() => props.task, val => Object.assign(local, val))
</script>
