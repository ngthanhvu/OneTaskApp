<template>
    <aside class="w-64 bg-base-100 border-r border-base-300 h-screen flex flex-col sticky top-0">
        <div class="p-4 border-b border-base-300">
            <h1 class="text-2xl font-bold flex items-center gap-2">
                <LayoutDashboard class="w-6 h-6 text-primary" />
                <span>Task Wan</span>
            </h1>
        </div>
        <nav class="flex-1 p-4 space-y-2">
            <RouterLink to="/" class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all">
                <div class="w-8 h-8 flex items-center justify-center rounded-xl transition-all" :class="{
                    'bg-primary text-primary-content': $route.path === '/',
                    'text-base-content/70 hover:bg-base-200': $route.path !== '/'
                }">
                    <LayoutDashboard class="w-5 h-5" />
                </div>
                <span class="font-medium">Tổng quan</span>
            </RouterLink>

            <RouterLink to="/tasks"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all relative">
                <div class="w-8 h-8 flex items-center justify-center rounded-xl transition-all" :class="{
                    'bg-primary text-primary-content': $route.path === '/tasks',
                    'text-base-content/70 hover:bg-base-200': $route.path !== '/tasks'
                }">
                    <ListChecks class="w-5 h-5" />
                </div>
                <span class="font-medium">Nhiệm vụ</span>

                <span v-if="totalTasks > 0" class="absolute right-3 bg-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{{ totalTasks }}</span>
            </RouterLink>

            <RouterLink to="/calendar"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all">
                <div class="w-8 h-8 flex items-center justify-center rounded-xl transition-all" :class="{
                    'bg-primary text-primary-content': $route.path === '/calendar',
                    'text-base-content/70 hover:bg-base-200': $route.path !== '/calendar'
                }">
                    <CalendarCheck2 class="w-5 h-5" />
                </div>
                <span class="font-medium">Lịch</span>
            </RouterLink>

            <RouterLink to="/profile"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all">
                <div class="w-8 h-8 flex items-center justify-center rounded-xl transition-all" :class="{
                    'bg-primary text-primary-content': $route.path === '/profile',
                    'text-base-content/70 hover:bg-base-200': $route.path !== '/profile'
                }">
                    <ShieldUser class="w-5 h-5" />
                </div>
                <span class="font-medium">Trang cá nhân</span>
            </RouterLink>

            <RouterLink to="/settings"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all">
                <div class="w-8 h-8 flex items-center justify-center rounded-xl transition-all" :class="{
                    'bg-primary text-primary-content': $route.path === '/settings',
                    'text-base-content/70 hover:bg-base-200': $route.path !== '/settings'
                }">
                    <Cog class="w-5 h-5" />
                </div>
                <span class="font-medium">Cài đặt</span>
            </RouterLink>
        </nav>

        <div class="p-4 border-base-300">
            <button @click="confirmLogout"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content/90 transition-all cursor-pointer">
                <div class="w-8 h-8 flex items-center bg-error justify-center rounded-xl transition-all">
                    <LogOut class="w-5 h-5 text-white" />
                </div>
                <span class="font-medium text-error">Đăng xuất</span>
            </button>
        </div>

        <ConfirmModal ref="logoutConfirm" title="Xác nhận đăng xuất"
            message="Bạn có chắc muốn đăng xuất khỏi tài khoản không?" actions="Đăng xuất" type="error"
            @confirm="handleLogout" />
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LayoutDashboard, LogOut, CalendarCheck2, ShieldUser, ListChecks, Cog} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTasksStore } from '../stores/tasksStore'
import router from '../router'
import ConfirmModal from './common/ConfirmModal.vue'

const $route = useRoute()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const logoutConfirm = ref<InstanceType<typeof ConfirmModal> | null>(null)

const totalTasks = computed(() => {
    return (tasksStore.tasks as unknown as any[]).length
})

function confirmLogout() {
    logoutConfirm.value?.open()
}

const handleLogout = () => {
    authStore.logout()
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
