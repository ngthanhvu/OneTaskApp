<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div class="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-6 sm:p-8">
            <!-- Header -->
            <h2 class="text-3xl font-bold text-center mb-8">
                <span class="text-primary">Task Wan</span> Admin
            </h2>

            <!-- Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
                <!-- Email -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold">Email</span>
                    </label>
                    <div class="relative">
                        <Mail class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                        <input v-model="email" type="email" placeholder="admin@example.com"
                            class="input input-bordered w-full pl-10" />
                    </div>
                </div>

                <!-- Password -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold">Password</span>
                    </label>
                    <div class="relative">
                        <KeyRound class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                        <input v-model="password" type="password" placeholder="••••••••"
                            class="input input-bordered w-full pl-10" />
                    </div>

                    <!-- Remember + Forgot -->
                    <div class="flex justify-between items-center mt-3 text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="remember" class="checkbox checkbox-sm" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" class="text-primary hover:underline">Forgot password?</a>
                    </div>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-primary w-full flex items-center justify-center gap-2"
                    :disabled="loading">
                    <LogIn v-if="!loading" class="w-5 h-5" />
                    <span v-if="!loading">Login</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                </button>
            </form>

            <!-- Footer -->
            <p class="text-center text-sm mt-8 text-base-content/70">
                © {{ new Date().getFullYear() }} Task Wan. All rights reserved.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, KeyRound, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)

async function handleLogin() {
    if (!email.value || !password.value) return
    if (remember.value) {
        localStorage.setItem('email', email.value)
        localStorage.setItem('password', password.value)
        localStorage.setItem('remember', 'true')
    } else {
        localStorage.removeItem('email')
        localStorage.removeItem('password')
        localStorage.removeItem('remember')
    }
    loading.value = true
    try {
        await authStore.login(email.value, password.value)
        router.push('/')
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    const saveEmail = localStorage.getItem('email')
    const savePassword = localStorage.getItem('password')
    const saveRemember = localStorage.getItem('remember')
    if(saveEmail && savePassword) {
        email.value = saveEmail
        password.value = savePassword
        remember.value = saveRemember === 'true'
    }
})
</script>

<style scoped>
/* Nền sáng tối tự động dựa theme DaisyUI */
.card {
    transition: all 0.3s ease;
}
</style>
