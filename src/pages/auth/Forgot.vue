<template>
    <!-- Mobile Layout -->
    <div class="md:hidden flex items-center justify-center min-h-screen bg-base-200 px-4">
        <div class="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
            <div class="card-body space-y-5">
                <!-- Header -->
                <div class="text-center space-y-2">
                    <h1 class="text-2xl sm:text-3xl font-bold text-primary">Quên mật khẩu</h1>
                    <p class="text-sm text-base-content/70">
                        Nhập email để nhận liên kết đặt lại mật khẩu.
                    </p>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleForgotPassword" class="space-y-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">Email</span>
                        </label>
                        <input v-model="email" type="email" placeholder="example@gmail.com"
                            class="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary"
                            required />
                    </div>

                    <button class="btn btn-primary w-full mt-2" type="submit" :disabled="loading || !email">
                        <span v-if="!loading" class="flex">
                        <RefreshCcw class="mr-1" />Gửi liên kết đặt lại</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>
                </form>

                <!-- Back to login -->
                <div class="text-center">
                    <router-link to="/login" class="link link-hover text-primary text-sm font-medium">
                        ← Quay lại đăng nhập
                    </router-link>
                </div>
            </div>
        </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:flex min-h-screen">
        <!-- Left Side - Primary Background -->
        <div class="flex-1 bg-primary relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute inset-0">
                <!-- Wave patterns -->
                <div class="absolute top-10 left-10 w-32 h-32 border-2 border-base-100/20 rounded-full"></div>
                <div class="absolute top-20 right-20 w-20 h-20 border border-base-100/30 rounded-full"></div>
                <div class="absolute bottom-20 left-20 w-16 h-16 bg-base-100/10 rounded-full"></div>
                <div class="absolute bottom-32 right-32 w-24 h-24 border border-base-100/20 rounded-full"></div>

                <!-- Geometric shapes -->
                <div class="absolute top-32 left-32 w-8 h-8 border-2 border-base-100/40 rotate-45"></div>
                <div class="absolute top-40 right-40 w-6 h-6 bg-base-100/20 rounded-full"></div>
                <div class="absolute bottom-40 left-40 w-4 h-4 bg-base-100/30 rounded-full"></div>

                <!-- Grid pattern -->
                <div class="absolute top-20 right-10 w-12 h-12 grid grid-cols-3 gap-1">
                    <div class="w-2 h-2 bg-base-100/20 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/30 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/20 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/30 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/20 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/30 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/20 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/30 rounded-full"></div>
                    <div class="w-2 h-2 bg-base-100/20 rounded-full"></div>
                </div>
            </div>

            <!-- Welcome Content -->
            <div class="relative z-10 flex flex-col justify-center items-center h-full text-base-100 px-12">
                <h1 class="text-4xl font-bold mb-4 text-center">Quên mật khẩu?</h1>
                <p class="text-xl text-base-100/90 text-center max-w-md">
                    Đừng lo lắng! Chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
                </p>
            </div>
        </div>

        <!-- Right Side - Reset Form -->
        <div class="flex-1 bg-base-100 flex items-center justify-center p-8">
            <div class="w-full max-w-md">
                <!-- Header -->
                <h2 class="text-3xl font-bold text-base-content mb-8 text-center">Đặt lại mật khẩu</h2>

                <!-- Form -->
                <form @submit.prevent="handleForgotPassword" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-base-content mb-2">Email</label>
                        <div class="relative">
                            <Mail class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                            <input v-model="email" type="email" placeholder="Nhập email của bạn"
                                class="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                                required />
                        </div>
                    </div>

                    <button class="btn btn-primary w-full flex items-center justify-center gap-2" type="submit" :disabled="loading || !email">
                        <RefreshCcw v-if="!loading" class="w-5 h-5" />
                        <span v-if="!loading">Gửi liên kết đặt lại</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>

                    <!-- Back to login -->
                    <div class="text-center">
                        <router-link to="/login" class="text-primary hover:text-primary-focus font-medium">
                            ← Quay lại đăng nhập
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RefreshCcw, Mail } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import { push } from 'notivue'
import { useHead } from '@vueuse/head'

useHead({
    title: 'Forgot Password | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const email = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleForgotPassword = async () => {
    if (!email.value) {
        push.error('Vui lòng nhập email hợp lệ!')
        return
    }

    loading.value = true
    try {
        await authStore.forgotPassword(email.value)
        push.success('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!')
        setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
        console.error(err)
        push.error(err.message || 'Không thể gửi email, vui lòng thử lại!')
    } finally {
        loading.value = false
    }
}
</script>
