<template>
    <div class="flex min-h-screen">
        <Sidebar />
        <main class="flex-1 px-3">
            <Navbar />
            <div class="p-5">
                <router-view />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
</script>

<style scoped></style>