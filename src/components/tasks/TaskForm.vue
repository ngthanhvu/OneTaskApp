<template>
    <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Basic info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control md:col-span-2">
                <label class="label">
                    <span class="label-text">Tên task <span class="text-red-500">*</span></span>
                </label>
                <input v-model="form.title" class="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2" placeholder="Nhập tiêu đề..." required />
                <label class="label">
                    <small>Đặt tên rõ ràng để dễ tìm kiếm sau này</small>
                </label>
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Ngày <span class="text-red-500">*</span></span></label>
                <input v-model="form.date" type="date" class="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2" required />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Ngày hết hạn <small>(tuỳ chọn)</small></span></label>
                <input v-model="dueDate" type="date" class="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2" />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Trạng thái <span class="text-red-500">*</span></span></label>
                <select v-model="form.done" class="select select-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2">
                    <option :value="false">Chưa xong</option>
                    <option :value="true">Đã hoàn thành</option>
                </select>
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Ưu tiên <span class="text-red-500">*</span></span></label>
                <select v-model="form.priority" class="select select-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2">
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                </select>
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Tags <small>(phân tách bằng dấu phẩy)</small> <span class="text-red-500">*</span></span></label>
                <input v-model="tagsInput" class="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2" placeholder="ví dụ: work, urgent" />
            </div>
        </div>

        <!-- Description -->
        <div class="form-control">
            <label class="label"><span class="label-text">Mô tả <span class="text-red-500">*</span></span></label>
            <textarea v-model="form.description" class="textarea textarea-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary mt-2"
                placeholder="Ghi chú chi tiết, checklist..." rows="4" />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" class="btn btn-ghost" @click="$emit('cancel')">Huỷ</button>
            <button class="btn btn-primary">{{ form.id ? 'Cập nhật' : 'Thêm task' }}</button>
        </div>
    </form>
    
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
const props = defineProps<{ task?: any }>()
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
    id: props.task?.id || null,
    title: props.task?.title || '',
    date: props.task?.date || new Date().toISOString().slice(0, 10),
    due_at: props.task?.due_at || null,
    description: props.task?.description || '',
    done: props.task?.done || false,
    priority: props.task?.priority || 'medium',
    tags: (props.task?.tags as string[] | undefined) || [],
})

const tagsInput = ref<string>(Array.isArray(form.tags) ? form.tags.join(', ') : '')
const dueDate = ref<string>('')
if (form.due_at) {
    const d = new Date(form.due_at)
    dueDate.value = d.toLocaleDateString('en-CA')
}

watchEffect(() => {
    form.tags = tagsInput.value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
})

function submitForm() {
    // Build due_at from date only (local timezone)
    let dueAt: string | null = null
    if (dueDate.value) {
        const local = new Date(dueDate.value)
        local.setHours(23, 59, 0, 0) // Set to end of day
        dueAt = local.toISOString()
    }

    emit('submit', { ...form, due_at: dueAt })
}
</script>
