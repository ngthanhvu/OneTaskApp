<template>
    <aside class="w-64 bg-base-100 border-r border-base-300 h-screen flex flex-col sticky top-0">
        <div class="p-4 border-b border-base-300">
            <h1 class="text-2xl font-bold flex items-center gap-2">
                <LayoutDashboard class="w-6 h-6 text-primary" />
                <span>OneApp</span>
            </h1>
        </div>
        <nav class="flex-1 p-4 space-y-2">
            <RouterLink to="/"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all"
                :class="{ 'bg-primary text-primary-content': $route.path === '/' }">
                <LayoutDashboard class="w-5 h-5" />
                <span>Dashboard</span>
            </RouterLink>

            <RouterLink to="/tasks"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all"
                :class="{ 'bg-primary text-primary-content': $route.path === '/tasks' }">
                <CalendarCheck2 class="w-5 h-5" />
                <span>Task</span>
            </RouterLink>

            <RouterLink to="/profile"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all"
                :class="{ 'bg-primary text-primary-content': $route.path === '/profile' }">
                <Cog />
                <span>Settings</span>
            </RouterLink>
        </nav>

        <div class="p-4 border-t border-base-300">
            <button @click="handleLogout" class="btn btn-soft btn-secondary w-full">
                <DoorClosedIcon />
                Logout
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, DoorClosedIcon, CalendarCheck2, User, Cog} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import router from '../router'

const $route = useRoute()

const handleLogout = () => {
    router.push('/login')
}
</script>

<style scoped>
svg {
    transition: color 0.2s ease, opacity 0.2s ease;
}

.router-link-active svg {
    opacity: 1;
}
</style>
