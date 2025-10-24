<template>
    <div v-if="tasks.length">
        <draggable 
            v-if="draggable" 
            v-model="localTasks" 
            item-key="id" 
            @end="onDragEnd" 
            class="space-y-3"
            :animation="200"
            :ghost-class="'opacity-50'"
            :chosen-class="'scale-105'"
            :drag-class="'rotate-2'"
            handle=".cursor-move"
        >
            <template #item="{ element }">
                <TaskItem :task="element" @edit="$emit('edit', element)" @delete="$emit('delete', element)"
                    @view="$emit('view', element)" @update="$emit('update', $event)"
                    @status-change="$emit('status-change', $event)" />
            </template>
        </draggable>

        <div v-else class="space-y-3">
            <TaskItem v-for="task in tasks" :key="task.id" :task="task" @edit="$emit('edit', task)"
                @delete="$emit('delete', task)" @view="$emit('view', task)" @update="$emit('update', $event)"
                @status-change="$emit('status-change', $event)" />
        </div>
    </div>

    <EmptyState v-else text="Chưa có task nào" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TaskItem from './TaskItem.vue'
import draggable from 'vuedraggable';
import EmptyState from '../ui/EmptyState.vue'

const props = defineProps<{
    tasks: any[],
    draggable?: boolean
}>()
const emit = defineEmits(['edit', 'delete', 'view', 'update', 'status-change', 'reorder'])

const localTasks = ref([...props.tasks])

watch(() => props.tasks, (val) => {
    localTasks.value = [...val]
})

function onDragEnd() {
    emit('reorder', localTasks.value)
}
</script>
