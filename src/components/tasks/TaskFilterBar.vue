<template>
    <div class="flex flex-wrap items-center gap-2">
        <button class="btn btn-xs" :class="{ 'btn-primary': modelValue === 'all' }" @click="$emit('update:modelValue', 'all')">Tất cả</button>
        <button class="btn btn-xs" :class="{ 'btn-primary': modelValue === 'today' }" @click="$emit('update:modelValue', 'today')">Hôm nay</button>
        <button class="btn btn-xs" :class="{ 'btn-primary': modelValue === 'done' }" @click="$emit('update:modelValue', 'done')">Đã xong</button>
        <button class="btn btn-xs" :class="{ 'btn-primary': modelValue === 'todo' }" @click="$emit('update:modelValue', 'todo')">Chưa xong</button>
    </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: 'all' | 'today' | 'done' | 'todo' }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
</style>