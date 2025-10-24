<template>
    <div class="flex flex-col">
        <!-- Header -->
        <div class="px-4 py-6 border-b border-base-300">
            <h1 class="text-2xl sm:text-3xl font-bold mb-2">Cài đặt</h1>
            <p class="text-base-content/70">Quản lý cài đặt tài khoản và thông báo</p>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-4">
            <!-- Telegram Bot Settings -->
            <div class="card bg-base-100 shadow-md border border-base-300">
                <div class="card-body">
                    <h2 class="card-title text-lg mb-4">Bot Telegram</h2>
                    <p class="text-sm text-base-content/70 mb-4">
                        Kết nối với bot Telegram để nhận thông báo về công việc
                    </p>

                    <div class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-medium">Bot Token</span>
                            </label>
                            <input :value="props.telegramBotToken" @input="updateBotToken(($event.target as HTMLInputElement).value)" type="text" placeholder="Nhập bot token từ @BotFather"
                                class="input input-bordered w-full focus:ring-1 focus:ring-primary" />
                            <div class="label">
                                <span class="label-text-alt text-base-content/60">
                                    Lấy token từ @BotFather trên Telegram
                                </span>
                            </div>
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text font-medium">Chat ID</span>
                            </label>
                            <input :value="props.telegramChatId" @input="updateChatId(($event.target as HTMLInputElement).value)" type="text" placeholder="Nhập Chat ID của bạn"
                                class="input input-bordered w-full focus:ring-1 focus:ring-primary" />
                            <div class="label">
                                <span class="label-text-alt text-base-content/60">
                                    Chat ID để bot gửi thông báo (có thể lấy từ @userinfobot)
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3">
                            <button class="btn btn-primary" @click="saveTelegramSettings" :disabled="props.loading">
                                <span v-if="!props.loading">Lưu cài đặt</span>
                                <span v-else class="loading loading-spinner loading-sm"></span>
                            </button>
                            <button class="btn btn-outline" @click="testTelegramConnection" :disabled="props.loading">
                                <span v-if="!props.loading">Test kết nối</span>
                                <span v-else class="loading loading-spinner loading-sm"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    telegramBotToken: string
    telegramChatId: string
    loading: boolean
}>()

const emit = defineEmits<{
    'update:telegramBotToken': [value: string]
    'update:telegramChatId': [value: string]
    'save-telegram-settings': []
    'test-telegram-connection': []
}>()

function saveTelegramSettings() {
    emit('save-telegram-settings')
}

function testTelegramConnection() {
    emit('test-telegram-connection')
}

function updateBotToken(value: string) {
    emit('update:telegramBotToken', value)
}

function updateChatId(value: string) {
    emit('update:telegramChatId', value)
}
</script>

<style scoped></style>