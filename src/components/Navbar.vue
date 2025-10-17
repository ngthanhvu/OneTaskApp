<template>
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-10">
        <div class="flex items-center gap-2 flex-1">
            <div class="block md:hidden">
                <h1 class="text-[16px] font-semibold">👋Hello, {{ fullName || 'Guest' }}!</h1>
                <p class="text-[12px]">Hôm nay là <span class="font-medium">{{ todayFormatted }}</span></p>
            </div>
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
                        <img :src="profile?.avatar_url || user?.user_metadata?.avatar_url || '/image.png'" />
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user, profile } = storeToRefs(authStore)

const theme = ref<'light' | 'dark'>('light')
const search = ref('')
const photoUrl = ref<string | null>(null)
const fullName = ref('')

onMounted(async () => {
    theme.value = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    document.documentElement.setAttribute('data-theme', theme.value)

    if (!authStore.user) {
        await authStore.fetchUser()
    } else {
        photoUrl.value = authStore.user?.user_metadata?.avatar_url || null;
        fullName.value = authStore.user?.user_metadata?.full_name || null
    }
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
