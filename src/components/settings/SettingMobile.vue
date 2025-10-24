<template>
    <div class="mx-auto bg-base-100 flex flex-col">
        <!-- Header -->
        <div class="px-4 py-6 border-b border-base-300">
            <h1 class="text-xl font-semibold text-base-content">Cài đặt</h1>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto">
            <!-- Settings Section -->
            <div class="px-4 py-4">
                <div class="bg-base-100 rounded-lg shadow-sm border border-base-300">
                    <div class="px-4 py-3">
                        <h2 class="text-lg font-medium mb-4 text-base-content">Cài đặt</h2>

                        <!-- Profile -->
                        <router-link to="/profile" class="flex items-center justify-between py-3 border-b border-base-300">
                            <div class="flex items-center space-x-3">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <User class="w-5 h-5 text-base-content/70" />
                                </div>
                                <span class="text-base text-base-content">Trang cá nhân</span>
                            </div>
                            <ChevronRight class="w-5 h-5 text-base-content/50" />
                        </router-link>

                        <!-- Notifications -->
                        <router-link to="/notifications" class="flex items-center justify-between py-3 border-b border-base-300">
                            <div class="flex items-center space-x-3">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <Bell class="w-5 h-5 text-base-content/70" />
                                </div>
                                <span class="text-base text-base-content">Thông báo</span>
                            </div>
                            <ChevronRight class="w-5 h-5 text-base-content/50" />
                        </router-link>

                        <div class="flex items-center justify-between py-3">
                            <div class="flex items-center space-x-3">
                                <div class="w-6 h-6 flex items-center justify-center">
                                    <BotMessageSquare class="w-5 h-5 text-base-content/70" />
                                </div>
                                <span class="text-base text-base-content">Telegram</span>
                            </div>
                            <ChevronRight class="w-5 h-5 text-base-content/50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 py-6 border-base-300 bg-base-100">
            <button @click="confirmLogout"
                class="flex items-center justify-center w-full py-3 hover:bg-error/10 rounded-lg transition-colors bg-error">
                <LogOut class="w-5 h-5 mr-2" /> Đăng xuất
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { LogOut, User, Bell, BotMessageSquare, ChevronRight } from 'lucide-vue-next'

const emit = defineEmits<{
    'confirm-logout': []
}>()

function confirmLogout() {
    emit('confirm-logout')
}
</script>

<style scoped></style>