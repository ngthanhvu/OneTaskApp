<template>
    <div
        class="group p-4 rounded-xl bg-base-100/80 shadow-sm hover:shadow-md border border-base-200 hover:border-base-300 transition-all h-52 flex flex-col justify-between">
        <!-- Nội dung chính -->
        <div>
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="truncate font-medium max-w-[12rem] sm:max-w-[16rem]"
                            :class="{ 'line-through text-base-content/50': local.done }">
                            {{ local.title }}
                        </span>
                        <span class="badge badge-ghost badge-sm shrink-0">{{ local.date }}</span>
                        <span class="badge badge-sm shrink-0" :class="local.done ? 'badge-success' : 'badge-warning'">
                            {{ local.done ? 'Đã xong' : 'Chưa xong' }}
                        </span>
                        <span v-if="local.status" class="badge badge-outline badge-sm shrink-0">{{ statusLabel }}</span>
                        <span v-if="local.priority" class="badge badge-sm shrink-0" :class="priorityClass">
                            {{ priorityLabel }}
                        </span>
                    </div>

                    <p class="text-sm text-base-content/60 mt-1 line-clamp-2">
                        {{ descriptionPreview }}
                    </p>
                </div>

                <!-- Nút sửa / xoá -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button class="btn btn-ghost btn-xs" title="Sửa" @click="$emit('edit', local)">
                        <Pencil class="w-3 h-3" />
                    </button>
                    <button class="btn btn-ghost btn-xs text-error" title="Xoá" @click="$emit('delete', local)">
                        <Trash2 class="w-3 h-3" />
                    </button>
                </div>
            </div>

            <!-- Chọn trạng thái -->
            <div v-if="local.status != null" class="mt-3 flex items-center gap-2">
                <span class="text-xs text-base-content/60">Trạng thái:</span>
                <div class="flex gap-1">
                    <button 
                        class="btn btn-xs" 
                        :class="local.status === 0 ? 'btn-primary' : 'btn-outline'"
                        @click="changeStatus(0)">
                        Chưa làm
                    </button>
                    <button 
                        class="btn btn-xs" 
                        :class="local.status === 1 ? 'btn-primary' : 'btn-outline'"
                        @click="changeStatus(1)">
                        Đang làm
                    </button>
                    <button 
                        class="btn btn-xs" 
                        :class="local.status === 2 ? 'btn-primary' : 'btn-outline'"
                        @click="changeStatus(2)">
                        Đã làm
                    </button>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-3 flex items-center justify-between">
            <button class="btn btn-ghost btn-xs gap-1" @click="$emit('view', local)">
                <FileText class="w-3 h-3" /> Xem
            </button>
            <label class="label cursor-pointer gap-2">
                <span class="label-text text-sm">{{ local.done ? 'Đã xong' : 'Chưa xong' }}</span>
                <input type="checkbox" v-model="local.done" class="toggle toggle-primary toggle-sm"
                    @change="$emit('update', local)" />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { FileText, Pencil, Trash2 } from 'lucide-vue-next'
const props = defineProps<{ task: any }>()
const emit = defineEmits(['edit', 'delete', 'update', 'view', 'status-change'])
const local = reactive({ ...props.task })
const descriptionPreview = computed(() => (local as any).description?.trim() || 'Không có mô tả')
const statusLabel = computed(() => {
    if (local.status === 1) return 'Đang làm'
    if (local.status === 2) return 'Đã làm'
    return 'Chưa làm'
})
const priorityLabel = computed(() => {
    if (local.priority === 'high') return 'High'
    if (local.priority === 'low') return 'Low'
    return 'Medium'
})
const priorityClass = computed(() => {
    if (local.priority === 'high') return 'badge-error'
    if (local.priority === 'low') return 'badge-ghost'
    return 'badge-info'
})

function changeStatus(newStatus: number) {
    local.status = newStatus
    emit('status-change', { ...local })
}

watch(() => props.task, val => Object.assign(local, val))
</script>
