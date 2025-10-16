<template>
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div class="flex items-center gap-2 flex-1">
            <div class="form-control hidden md:flex">
                <input type="text" placeholder="Search..." class="input input-bordered w-60" v-model="search" />
            </div>
        </div>
        <div class="flex items-center gap-4">
            <button class="btn btn-ghost btn-circle" @click="toggleTheme">
                <Sun v-if="theme === 'light'" class="w-5 h-5" />
                <Moon v-else class="w-5 h-5" />
            </button>
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src="/image.png" alt="Profile photo"/>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {  Sun, Moon } from 'lucide-vue-next'

const theme = ref<'light' | 'dark'>('light')
const search = ref('')

onMounted(() => {
    theme.value = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
})

function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
}
</script>

<style scoped>
</style>
