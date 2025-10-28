<template>
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div class="flex items-center gap-2 flex-1">
            <div class="block md:hidden">
                <h1 class="text-[16px] font-semibold">👋Hello, {{ fullName || 'Guest' }}!</h1>
                <p class="text-[12px]">Hôm nay là <span class="font-medium">{{ todayFormatted }}</span></p>
            </div>
            <div class="form-control hidden md:flex">
                <label class="input focus:outline-none focus:ring-1 focus:ring-primary">
                    <Search />
                    <input type="search" class="grow" v-model="search" placeholder="Search" />
                    <kbd class="kbd kbd-sm">⌘</kbd>
                    <kbd class="kbd kbd-sm">K</kbd>
                </label>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <button class="btn btn-ghost btn-circle" @click="toggleTheme">
                <Sun v-if="theme === 'light'" class="w-5 h-5" />
                <Moon v-else class="w-5 h-5" />
            </button>
            <router-link to="/notifications" class="hidden md:flex btn btn-ghost btn-circle">
                <BellRing class="w-5 h-5" />
            </router-link>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Sun, Moon, BellRing, Search } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { profile, user } = storeToRefs(authStore)

const theme = ref<'light' | 'dark'>('light')
const search = ref('')
const fullName = computed(() => profile.value?.full_name || user.value?.user_metadata?.full_name || '')

onMounted(async () => {
    theme.value = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    document.documentElement.setAttribute('data-theme', theme.value)

    if (!authStore.user) {
        await authStore.fetchUser()
    }
    await authStore.fetchUserProfile({ force: true })
})
const todayFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
}
</script>

<style scoped></style>
