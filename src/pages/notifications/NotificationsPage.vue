<template>
    <div class="mx-auto space-y-4 md:space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-xl md:text-2xl font-bold flex items-center gap-2">
                    <Bell class="w-5 h-5 md:w-6 md:h-6" />
                    Thông báo
                </h1>
                <p class="text-sm md:text-base text-base-content/60 mt-1">Quản lý thông báo nhắc nhở task</p>
            </div>
        </div>

        <!-- Notification Settings -->
        <div class="space-y-4 md:space-y-6">
            <NotificationSettings />

            <!-- Notification History -->
            <div class="card bg-base-100 shadow-sm border border-base-200">
                <div class="card-body p-4 md:p-6">
                    <h3 class="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                        <History class="w-4 h-4 md:w-5 md:h-5" />
                        Lịch sử thông báo
                    </h3>

                    <div v-if="notificationHistory.length === 0" class="text-center py-6 md:py-8">
                        <Bell class="w-10 h-10 md:w-12 md:h-12 mx-auto text-base-content/30 mb-3" />
                        <p class="text-sm md:text-base text-base-content/60">Chưa có thông báo nào</p>
                    </div>

                    <div v-else class="space-y-2 md:space-y-3">
                        <div v-for="notification in notificationHistory" :key="notification.id"
                            class="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-base-200/50 rounded-lg">
                            <div
                                class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bell class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-xs md:text-sm">{{ notification.title }}</h4>
                                <p class="text-xs text-base-content/60 mt-1 line-clamp-2">{{ notification.body }}</p>
                                <p class="text-xs text-base-content/40 mt-1">
                                    {{ formatTime(notification.timestamp) }}
                                </p>
                            </div>
                            <div class="shrink-0">
                                <span class="badge badge-xs md:badge-sm"
                                    :class="notification.read ? 'badge-ghost' : 'badge-primary'">
                                    {{ notification.read ? 'Đã đọc' : 'Mới' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div>
                <div class="card bg-base-100 shadow-sm border border-base-200">
                    <div class="card-body p-3 md:p-4">
                        <h4 class="font-semibold text-xs md:text-sm mb-2">Nhắc nhở hôm nay</h4>
                        <p class="text-xs text-base-content/60 mb-3">Kiểm tra task hôm nay</p>
                        <button class="btn btn-outline btn-xs md:btn-sm w-full" @click="checkTodayTasks"
                            :disabled="!canNotify || isChecking">
                            {{ isChecking ? 'Đang kiểm tra...' : 'Kiểm tra' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Notification Preferences -->
            <div class="card bg-base-100 shadow-sm border border-base-200">
                <div class="card-body p-4 md:p-6">
                    <h3 class="font-semibold text-base md:text-lg mb-3 md:mb-4">Tùy chọn thông báo</h3>

                    <div class="space-y-3 md:space-y-4">
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-xs md:text-sm">Nhắc nhở task hôm nay</h4>
                                <p class="text-xs text-base-content/60">Thông báo về task cần làm hôm nay</p>
                            </div>
                            <input type="checkbox" class="toggle toggle-primary toggle-sm md:toggle-md" checked />
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-xs md:text-sm">Cảnh báo deadline</h4>
                                <p class="text-xs text-base-content/60">Nhắc nhở trước khi task hết hạn</p>
                            </div>
                            <input type="checkbox" class="toggle toggle-primary toggle-sm md:toggle-md" checked />
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-xs md:text-sm">Thông báo quá hạn</h4>
                                <p class="text-xs text-base-content/60">Cảnh báo task đã quá hạn</p>
                            </div>
                            <input type="checkbox" class="toggle toggle-primary toggle-sm md:toggle-md" checked />
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium text-xs md:text-sm">Nhắc nhở theo độ ưu tiên</h4>
                                <p class="text-xs text-base-content/60">Thông báo dựa trên mức độ ưu tiên</p>
                            </div>
                            <input type="checkbox" class="toggle toggle-primary toggle-sm md:toggle-md" checked />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bell, History } from 'lucide-vue-next'
import { useHead } from '@vueuse/head'
import NotificationSettings from '../../components/notifications/NotificationSettings.vue'
import { useNotifications } from '../../composables/useNotifications'
import { useTasksStore } from '../../stores/tasksStore'

interface NotificationHistoryItem {
    id: number
    title: string
    body: string
    timestamp: string
    read: boolean
    type?: string
    task_id?: number
}

useHead({
    title: 'Thông báo | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý thông báo nhắc nhở task' },
        { name: 'keywords', content: 'Thông báo, Nhắc nhở, Task, PWA' },
    ],
})

const notifications = useNotifications()
const tasksStore = useTasksStore()

const { isSupported, canNotify, requestPermission, checkTodayTasks: checkTodayTasksComposable, scheduleTaskReminders, checkOverdueTasks: checkOverdueTasksComposable, getHistory } = notifications

const isChecking = ref(false)
const notificationHistory = ref<NotificationHistoryItem[]>([])

// Load notification history from API
async function loadNotificationHistory() {
    try {
        const history = await getHistory(50)
        notificationHistory.value = history.map(item => ({
            id: item.id!,
            title: item.title,
            body: item.body,
            timestamp: item.sent_at || new Date().toISOString(),
            read: !!item.read_at,
            type: item.type,
            task_id: item.task_id
        }))
    } catch (error) {
        console.error('Failed to load notification history:', error)
    }
}

function formatTime(timestamp: string | Date): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (hours > 24) {
        return date.toLocaleDateString('vi-VN')
    } else if (hours > 0) {
        return `${hours} giờ trước`
    } else if (minutes > 0) {
        return `${minutes} phút trước`
    } else {
        return 'Vừa xong'
    }
}

// async function sendTestNotification() {
//     if (!canNotify.value) {
//         console.warn('Notifications not enabled')
//         return
//     }

//     isTesting.value = true
//     try {
//         await notifications.showTaskReminder({
//             id: 999,
//             title: 'Test Notification',
//             date: new Date().toISOString().slice(0, 10),
//             priority: 'medium',
//             done: false,
//             description: null,
//             status: 0,
//             tags: [],
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//             user_id: 'test'
//         })

//         // Add to history
//         notificationHistory.value.unshift({
//             id: Date.now(),
//             title: '🔔 Test Notification',
//             body: 'Thông báo test đã được gửi',
//             timestamp: new Date(),
//             read: false
//         })
//     } catch (error) {
//         console.error('Failed to send test notification:', error)
//     } finally {
//         isTesting.value = false
//     }
// }

async function checkTodayTasks() {
    if (!canNotify.value) {
        console.warn('Notifications not enabled')
        return
    }

    isChecking.value = true
    try {
        await checkTodayTasksComposable(tasksStore.tasks)

        // Reload history to show new notification
        await loadNotificationHistory()
    } catch (error) {
        console.error('Failed to check today tasks:', error)
    } finally {
        isChecking.value = false
    }
}

onMounted(async () => {
    await tasksStore.fetchTasks()
    await loadNotificationHistory()

    if (isSupported.value) {
        await requestPermission()

        // Initial check and scheduling
        await checkTodayTasksComposable(tasksStore.tasks)
        await checkOverdueTasksComposable(tasksStore.tasks)
        await scheduleTaskReminders(tasksStore.tasks)
    }
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
