<template>
    <div ref="turnstileEl" class="cf-challenge turnstile-container" :data-sitekey="siteKey" data-callback="onVerify"
        :data-theme="theme" 
        ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, options?: Record<string, any>) => void
            reset?: () => void
            remove?: () => void
        }
        onVerify?: (token: string) => void
    }
}

const emit = defineEmits<{
    (e: 'verified', token: string): void
}>()

const props = defineProps<{
    dark?: boolean
}>()

const turnstileEl = ref<HTMLElement | null>(null)
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string

const theme = computed(() => (props.dark ? 'dark' : 'light'))

onMounted(() => {
    window.onVerify = (token: string) => {
        emit('verified', token)
    }

    if (window.turnstile && turnstileEl.value) {
        window.turnstile.render(turnstileEl.value, {
            sitekey: siteKey,
            callback: window.onVerify,
            theme: theme.value,
        })
    }
})

onBeforeUnmount(() => {
    delete window.onVerify
})
</script>

<style scoped>
.turnstile-container {
    width: 100%;
    display: flex;
    justify-content: center;
    /* nếu muốn canh giữa */
    align-items: center;
}

/* để turnstile co giãn hợp lý trong container */
.cf-challenge iframe {
    width: 100% !important;
    max-width: 100%;
}
</style>
