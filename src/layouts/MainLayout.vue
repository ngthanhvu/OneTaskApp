<template>
    <div class="flex min-h-screen">
        <!-- Sidebar: hidden on mobile, visible on md+ -->
        <div class="hidden md:block">
            <Sidebar />
        </div>
        <main class="flex-1 px-3 pb-16 md:pb-0">
            <Navbar />
            <div class="p-5">
                <router-view />
            </div>
        </main>

        <!-- Mobile bottom dock navigation (DaisyUI dock) -->
        <nav class="dock md:hidden z-50 fixed bottom-0 left-0 right-0">
            <router-link to="/" :class="[{ 'dock-active': $route.name === 'home' }]">
                <Home class="size-[1.2em]" /><span class="dock-label">Home</span>
            </router-link>
            <router-link to="/tasks" :class="[{ 'dock-active': $route.name === 'TaskPage' }]">
                <ListCheck class="size-[1.2em]" /><span class="dock-label">Tasks</span>
            </router-link>
            <router-link to="/tasks/today" :class="[{ 'dock-active': $route.name === 'TaskToday' }]">
                <CalendarDays class="size-[1.2em]" /><span class="dock-label">Hôm nay</span>
            </router-link>
            <router-link to="/profile" :class="[{ 'dock-active': $route.name === 'profile' }]">
                <User class="size-[1.2em]" /><span class="dock-label">Profile</span>
            </router-link>
        </nav>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import { Home, ListCheck, CalendarDays, User } from 'lucide-vue-next'
</script>

<style scoped></style>