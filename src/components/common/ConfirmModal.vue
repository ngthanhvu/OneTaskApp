<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box shadow-lg border border-base-300 rounded-xl">
            <h3 class="font-bold text-lg" :class="headerClass">{{ title }}</h3>
            <p class="py-3 text-sm text-base-content/70">{{ message }}</p>

            <div class="modal-action">
                <button class="btn btn-outline btn-sm" @click="close">Huỷ</button>
                <button class="btn btn-error btn-sm" @click="confirm">{{ actions }}</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    title: { type: String, default: 'Xác nhận hành động' },
    message: { type: String, default: 'Bạn có chắc muốn thực hiện thao tác này?' },
    type: { type: String, default: 'danger' }, // danger | info | warning
    actions: { type: String, default: 'Xác nhận' }
})

const emit = defineEmits(['confirm', 'cancel'])
const modalRef = ref<HTMLDialogElement | null>(null)

const headerClass = computed(() => {
    switch (props.type) {
        case 'info': return 'text-info'
        case 'warning': return 'text-warning'
        default: return 'text-error'
    }
})

function open() {
    modalRef.value?.showModal()
}

function close() {
    modalRef.value?.close()
    emit('cancel')
}

function confirm() {
    emit('confirm')
    close()
}

defineExpose({ open, close })
</script>

<style scoped>
/* Removed @apply to avoid PostCSS/Tailwind at-rule errors; utilities are applied on the element directly. */
</style>
