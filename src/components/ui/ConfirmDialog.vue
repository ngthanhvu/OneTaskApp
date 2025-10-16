<template>
    <dialog ref="dialog" class="modal" @click.self="close">
        <div class="modal-box max-w-sm text-center">
            <h3 class="font-bold text-lg mb-4">{{ title }}</h3>
            <p class="mb-6">{{ message }}</p>
            <div class="flex justify-center gap-3">
                <button class="btn btn-outline" @click="cancel">Huỷ</button>
                <button class="btn btn-error text-white" @click="confirm">Đồng ý</button>
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    open: boolean
    title?: string
    message?: string
}>()

const emit = defineEmits(['update:open', 'confirm', 'cancel'])
const dialog = ref<HTMLDialogElement | null>(null)

watch(
    () => props.open,
    (val) => {
        if (!dialog.value) return
        val ? dialog.value.showModal() : dialog.value.close()
    },
)

function close() {
    emit('update:open', false)
}
function confirm() {
    emit('confirm')
    close()
}
function cancel() {
    emit('cancel')
    close()
}
</script>
