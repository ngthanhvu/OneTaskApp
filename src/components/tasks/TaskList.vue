<template>
    <div v-if="tasks.length" class="grid grid-cols-1 gap-3">
        <TaskItem v-for="task in tasks" :key="task.id" :task="task" @edit="$emit('edit', task)"
            @delete="$emit('delete', task)" @view="$emit('view', task)" @update="$emit('update', $event)"
            @status-change="$emit('status-change', $event)" />
    </div>
    <EmptyState v-else text="Chưa có task nào" />
</template>

<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import EmptyState from '../ui/EmptyState.vue'

defineProps<{ tasks: any[] }>()
defineEmits(['edit', 'delete', 'view', 'update', 'status-change'])
</script>
