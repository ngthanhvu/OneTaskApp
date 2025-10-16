<template>
    <div class="flex flex-col items-center justify-center py-12 text-center text-base-content/60">
        <slot name="icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-3 opacity-70" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 13h6m-3-3v6m9 1V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14z" />
            </svg>
        </slot>
        <p class="text-lg">{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{ text?: string }>()
</script>
