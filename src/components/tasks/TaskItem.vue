<template>
    <div class="group p-4 rounded-xl bg-base-100/80 shadow-sm hover:shadow-md border border-base-200 hover:border-base-300 transition-all 
        flex flex-col justify-between min-h-[12rem] sm:min-h-[13rem] max-h-[auto] cursor-move relative"
        draggable="true"
        @dragstart="onDragStart"
        @dragend="onDragEnd">
        <!-- Drag Handle -->
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-4 h-4 flex flex-col gap-0.5 cursor-move">
                <div class="w-1 h-1 bg-base-content/30 rounded-full"></div>
                <div class="w-1 h-1 bg-base-content/30 rounded-full"></div>
                <div class="w-1 h-1 bg-base-content/30 rounded-full"></div>
                <div class="w-1 h-1 bg-base-content/30 rounded-full"></div>
            </div>
        </div>

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

                <!-- Tags -->
                <div v-if="Array.isArray(local.tags) && local.tags.length" class="mt-2 flex flex-wrap gap-1">
                    <span v-for="tag in local.tags" :key="tag" class="badge badge-ghost badge-xs">#{{ tag }}</span>
                </div>

                <!-- Nút sửa / xoá -->
                <div class="flex items-center gap-1 transition-opacity shrink-0">
                    <button class="btn btn-ghost btn-xs" title="Sửa" @click="$emit('edit', local)">
                        <Pencil class="w-3 h-3" />
                    </button>
                    <button class="btn btn-ghost btn-xs text-error" title="Xoá" @click="openConfirm(local)">
                        <Trash2 class="w-3 h-3" />
                    </button>
                </div>
            </div>

            <!-- Chọn trạng thái -->
            <div v-if="local.status != null" class="mt-3 flex items-center gap-2">
                <span class="text-xs text-base-content/60">Trạng thái:</span>
                <div class="flex gap-1">
                    <button class="btn btn-xs" :class="local.status === 0 ? 'btn-primary' : 'btn-outline'"
                        @click="changeStatus(0)">
                        Chưa làm
                    </button>
                    <button class="btn btn-xs" :class="local.status === 1 ? 'btn-primary' : 'btn-outline'"
                        @click="changeStatus(1)">
                        Đang làm
                    </button>
                    <button class="btn btn-xs" :class="local.status === 2 ? 'btn-primary' : 'btn-outline'"
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

        <dialog ref="confirmModal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg text-error">Xác nhận xoá</h3>
                <p class="py-3 text-sm">Bạn có chắc chắn muốn xoá task này không?</p>

                <div class="modal-action">
                    <button class="btn btn-outline btn-sm" @click="closeConfirm">Huỷ</button>
                    <button class="btn btn-error btn-sm" @click="confirmDelete">Xoá</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { FileText, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps<{ task: any }>()
const emit = defineEmits(['edit', 'delete', 'update', 'view', 'status-change'])

const local = reactive({ ...props.task })
const confirmModal = ref<HTMLDialogElement | null>(null)
const taskToDelete = ref<any>(null)

function openConfirm(task: any) {
    taskToDelete.value = task
    confirmModal.value?.showModal()
}

function closeConfirm() {
    confirmModal.value?.close()
}

function confirmDelete() {
    if (taskToDelete.value) {
        emit('delete', taskToDelete.value)
    }
    closeConfirm()
}

const descriptionPreview = computed(() => local.description?.trim() || 'Không có mô tả')
const statusLabel = computed(() => (local.status === 1 ? 'Đang làm' : local.status === 2 ? 'Đã làm' : 'Chưa làm'))
const priorityLabel = computed(() => (local.priority === 'high' ? 'High' : local.priority === 'low' ? 'Low' : 'Medium'))
const priorityClass = computed(() => (local.priority === 'high' ? 'badge-error' : local.priority === 'low' ? 'badge-ghost' : 'badge-info'))

function changeStatus(newStatus: number) {
    local.status = newStatus
    emit('status-change', { ...local })
}

function onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/json', JSON.stringify(local))
        event.dataTransfer.effectAllowed = 'move'
    }
}

function onDragEnd() {
    // Clean up any visual feedback
}

watch(() => props.task, val => Object.assign(local, val))
</script>