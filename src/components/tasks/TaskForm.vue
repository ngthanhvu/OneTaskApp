<template>
    <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Basic info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control md:col-span-2">
                <label class="label">
                    <span class="label-text">Tên task</span>
                </label>
                <input v-model="form.title" class="input input-bordered w-full" placeholder="Nhập tiêu đề..." required />
                <label class="label">
                    <span class="label-text-alt">Đặt tên rõ ràng để dễ tìm kiếm sau này</span>
                </label>
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Ngày</span></label>
                <input v-model="form.date" type="date" class="input input-bordered w-full" required />
            </div>
            <div class="form-control">
                <label class="label"><span class="label-text">Trạng thái</span></label>
                <select v-model="form.done" class="select select-bordered w-full">
                    <option :value="false">Chưa xong</option>
                    <option :value="true">Đã hoàn thành</option>
                </select>
            </div>
        </div>

        <!-- Description -->
        <div class="form-control">
            <label class="label"><span class="label-text">Mô tả</span></label>
            <textarea v-model="form.description" class="textarea textarea-bordered w-full"
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
import { reactive } from 'vue'
const props = defineProps<{ task?: any }>()
const emit = defineEmits(['submit'])

const form = reactive({
    id: props.task?.id || null,
    title: props.task?.title || '',
    date: props.task?.date || new Date().toISOString().slice(0, 10),
    description: props.task?.description || '',
    done: props.task?.done || false,
})

function submitForm() {
    emit('submit', { ...form })
}
</script>
