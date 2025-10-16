<template>
    <dialog ref="dialog" class="modal" @click.self="close">
        <div class="modal-box w-full max-w-lg">
            <!-- Header -->
            <div v-if="title" class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg">{{ title }}</h3>
                <button class="btn btn-sm btn-ghost" @click="close">✖</button>
            </div>

            <!-- Body slot -->
            <div>
                <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-action">
                <slot name="footer" />
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    open: boolean
    title?: string
}>()

const emit = defineEmits(['update:open', 'close'])
const dialog = ref<HTMLDialogElement | null>(null)

watch(
    () => props.open,
    (value) => {
        if (!dialog.value) return
        value ? dialog.value.showModal() : dialog.value.close()
    },
)

function close() {
    emit('update:open', false)
    emit('close')
}
</script>
