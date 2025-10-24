<template>
    <div class="bg-base-200">
        <div class="md:hidden">
            <SettingMobile @confirm-logout="confirmLogout" />
        </div>

        <div class="hidden md:block overflow-hidden">
            <SettingDesktop 
                v-model:telegram-bot-token="telegramBotToken"
                v-model:telegram-chat-id="telegramChatId"
                :loading="loading"
                @save-telegram-settings="saveTelegramSettings"
                @test-telegram-connection="testTelegramConnection"
            />
        </div>

        <ConfirmModal ref="logoutConfirm" title="Xác nhận đăng xuất"
            message="Bạn có chắc muốn đăng xuất khỏi tài khoản không?" actions="Đăng xuất" type="error"
            @confirm="handleLogout" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'
import { push } from 'notivue'
import { useHead } from '@vueuse/head'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import SettingDesktop from '../components/settings/SettingDesktop.vue'
import SettingMobile from '../components/settings/SettingMobile.vue'

useHead({
    title: 'Cài đặt | Task Wan',
    meta: [
        { name: 'description', content: 'Cài đặt tài khoản và thông báo Task Wan' },
        { name: 'keywords', content: 'Cài đặt, Task, Quản lý công việc' },
    ],
})

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const logoutConfirm = ref<InstanceType<typeof ConfirmModal> | null>(null)
const loading = ref(false)

// Telegram settings
const telegramBotToken = ref('')
const telegramChatId = ref('')

function confirmLogout() {
    logoutConfirm.value?.open()
}

function handleLogout() {
    authStore.logout()
    router.push('/login')
}

async function saveTelegramSettings() {
    if (!telegramBotToken.value || !telegramChatId.value) {
        push.error('Vui lòng nhập đầy đủ thông tin bot!')
        return
    }

    loading.value = true
    try {
        // TODO: Implement API call to save telegram settings
        // await authStore.saveTelegramSettings({
        //     botToken: telegramBotToken.value,
        //     chatId: telegramChatId.value
        // })
        push.success('Lưu cài đặt Telegram thành công!')
    } catch (err) {
        console.error(err)
        push.error('Lưu cài đặt thất bại!')
    } finally {
        loading.value = false
    }
}

async function testTelegramConnection() {
    if (!telegramBotToken.value || !telegramChatId.value) {
        push.error('Vui lòng nhập đầy đủ thông tin bot!')
        return
    }

    loading.value = true
    try {
        // TODO: Implement API call to test telegram connection
        // await authStore.testTelegramConnection()
        push.success('Kết nối Telegram thành công!')
    } catch (err) {
        console.error(err)
        push.error('Kết nối Telegram thất bại!')
    } finally {
        loading.value = false
    }
}

async function loadSettings() {
    if (!user.value) return
    
    // TODO: Load telegram settings from API
    // const settings = await authStore.getTelegramSettings()
    // telegramBotToken.value = settings.botToken || ''
    // telegramChatId.value = settings.chatId || ''
}

onMounted(async () => {
    if (!authStore.user) await authStore.fetchUser()
    await loadSettings()
})
</script>

<style scoped>

</style>