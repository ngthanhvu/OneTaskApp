<template>
    <div class="h-screen flex items-center justify-center bg-base-200 overflow-hidden">
        <div class="card w-full max-w-lg shadow-xl bg-base-100">
            <div class="card-body">
                <!-- Logo / Title -->
                <h2 class="text-3xl font-bold text-center mb-6">
                    <span class="text-primary">OneApp</span> Admin
                </h2>

                <!-- Login form -->
                <form @submit.prevent="handleLogin" class="space-y-5">
                    <!-- Email -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Email</span>
                        </label>
                        <input type="email" v-model="email" placeholder="admin@example.com"
                            class="input input-bordered w-full" />
                    </div>

                    <!-- Password -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Password</span>
                        </label>
                        <input type="password" v-model="password" placeholder="••••••••"
                            class="input input-bordered w-full" />
                        <label class="label flex justify-between text-sm mt-3">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="remember" class="checkbox checkbox-sm" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" class="text-primary hover:underline">Forgot password?</a>
                        </label>
                    </div>

                    <!-- Submit -->
                    <div class="form-control mt-3">
                        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
                            <span v-if="!loading">Login</span>
                            <span v-else class="loading loading-spinner"></span>
                        </button>
                    </div>
                </form>

                <!-- Footer -->
                <p class="text-center text-sm mt-6 text-base-content/70">
                    ©{{ new Date().getFullYear() }} OneApp. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)

function handleLogin() {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        // giả lập đăng nhập thành công
        router.push('/')
    }, 1000)
}
</script>
