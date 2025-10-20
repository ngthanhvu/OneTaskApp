<template>
    <div>
        <!-- Mobile: Dropdown -->
        <div class="sm:hidden w-full min-w-[120px]">
            <select class="select select-bordered w-full h-10 text-base" :value="modelValue"
                @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
                <option v-for="filter in filters" :key="filter.value" :value="filter.value">
                    {{ filter.label }}
                </option>
            </select>
        </div>

        <!-- Desktop: Buttons -->
        <div class="hidden sm:flex flex-wrap items-center gap-2">
            <button v-for="filter in filters" :key="filter.value" class="btn btn-xs"
                :class="{ 'btn-primary': modelValue === filter.value }"
                @click="$emit('update:modelValue', filter.value)">
                {{ filter.label }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: 'all' | 'today' | 'done' | 'todo' | 'overdue' }>()
defineEmits(['update:modelValue'])

const filters = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Hôm nay', value: 'today' },
    { label: 'Quá hạn', value: 'overdue' },
    { label: 'Đã xong', value: 'done' },
    { label: 'Chưa xong', value: 'todo' },
]
</script>
