<template>
    <div class="flex items-center justify-center min-h-screen bg-base-200 px-4">
        <div class="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
            <div class="card-body space-y-5">
                <!-- Header -->
                <div class="text-center space-y-2">
                    <h1 class="text-2xl sm:text-3xl font-bold text-primary">Forgot Password</h1>
                    <p class="text-sm text-base-content/70">
                        Enter your email to receive a password reset link.
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
                        <RefreshCcw class="mr-1" />Send Reset Link</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>
                </form>

                <!-- Back to login -->
                <div class="text-center">
                    <router-link to="/login" class="link link-hover text-primary text-sm font-medium">
                        ← Back to Login
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RefreshCcw } from 'lucide-vue-next'
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
