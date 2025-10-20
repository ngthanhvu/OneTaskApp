<template>
    <div class="card bg-base-100 shadow-sm border border-base-200">
        <div class="card-body p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 class="font-semibold text-sm">Thông báo nhắc nhở</h3>
                        <p class="text-xs text-base-content/60">
                            {{ statusText }}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div v-if="isSupported" class="flex items-center gap-2">
                        <div class="badge" :class="permissionClass">
                            {{ permissionText }}
                        </div>
                        <button 
                            v-if="!canNotify" 
                            class="btn btn-primary btn-sm"
                            @click="requestPermission"
                            :disabled="isRequesting"
                        >
                            {{ isRequesting ? 'Đang xin phép...' : 'Bật thông báo' }}
                        </button>
                        <button 
                            v-else 
                            class="btn btn-ghost btn-sm"
                            @click="testNotification"
                            :disabled="isTesting"
                        >
                            {{ isTesting ? 'Đang gửi...' : 'Test' }}
                        </button>
                    </div>
                    <div v-else class="text-xs text-base-content/50">
                        Không hỗ trợ
                    </div>
                </div>
            </div>
            
            <!-- Notification features info -->
            <div v-if="canNotify" class="mt-3 p-3 bg-base-200/50 rounded-lg">
                <h4 class="font-medium text-sm mb-2">Tính năng thông báo:</h4>
                <ul class="text-xs text-base-content/70 space-y-1">
                    <li>• Nhắc nhở task hôm nay</li>
                    <li>• Cảnh báo task sắp hết hạn</li>
                    <li>• Thông báo task quá hạn</li>
                    <li>• Nhắc nhở theo độ ưu tiên</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell } from 'lucide-vue-next'
import { useNotifications } from '../../composables/useNotifications'

const notifications = useNotifications()
const isRequesting = ref(false)
const isTesting = ref(false)

const { isSupported, canNotify, permission } = notifications

const statusText = computed(() => {
    if (!isSupported.value) {
        return 'Trình duyệt không hỗ trợ thông báo'
    }
    
    if (canNotify.value) {
        return 'Đã bật thông báo nhắc nhở'
    }
    
    return 'Chưa bật thông báo'
})

const permissionText = computed(() => {
    switch (permission.value) {
        case 'granted':
            return 'Đã bật'
        case 'denied':
            return 'Đã từ chối'
        case 'default':
        default:
            return 'Chưa xin phép'
    }
})

const permissionClass = computed(() => {
    switch (permission.value) {
        case 'granted':
            return 'badge-success'
        case 'denied':
            return 'badge-error'
        case 'default':
        default:
            return 'badge-warning'
    }
})

async function requestPermission() {
    isRequesting.value = true
    try {
        await notifications.requestPermission()
    } finally {
        isRequesting.value = false
    }
}

async function testNotification() {
    isTesting.value = true
    try {
        await notifications.showTaskReminder({
            id: 999,
            title: 'Test Notification',
            date: new Date().toISOString().slice(0, 10),
            priority: 'medium',
            done: false,
            description: null,
            status: 0,
            tags: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: 'test'
        })
    } finally {
        isTesting.value = false
    }
}
</script>
