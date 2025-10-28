<template>
    <!-- Mobile Layout -->
    <div class="md:hidden min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div class="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-6 sm:p-8">
            <!-- Header -->
            <h2 class="text-3xl font-bold text-center mb-8">
                <span class="text-primary">Task Wan</span> Admin
            </h2>

            <!-- Form: Step 1 - Email & Password -->
            <form v-if="!mfaRequired" @submit.prevent="handleLogin" class="space-y-4">
                <!-- Email -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold text-sm mb-1">Email</span>
                    </label>
                    <div class="relative">
                        <Mail class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                        <input v-model="email" type="email" placeholder="admin@example.com"
                            class="input input-bordered w-full pl-10" :class="{ 'input-error': emailError }" />
                    </div>
                    <p v-if="emailError" class="text-error text-sm mt-1">{{ emailError }}</p>
                </div>

                <!-- Password -->
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold text-sm mb-1">Mật khẩu</span>
                    </label>
                    <div class="relative">
                        <KeyRound class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                        <input v-model="password" type="password" placeholder="••••••••"
                            class="input input-bordered w-full pl-10" :class="{ 'input-error': passwordError }" />
                    </div>
                    <p v-if="passwordError" class="text-error text-sm mt-1">{{ passwordError }}</p>

                    <!-- Remember + Forgot -->
                    <div class="flex justify-between items-center mt-3 text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="remember" class="checkbox checkbox-sm" />
                            <span>Ghi nhớ tôi</span>
                        </label>
                        <router-link to="/forgot-password" class="text-primary hover:underline">Quên
                            mật khẩu?</router-link>
                    </div>
                </div>
                <!-- Cloudflare Turnstile -->
                <div class="flex justify-center">
                    <Turnstile @verified="onCaptchaVerified" :dark="true" />
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-primary w-full flex items-center justify-center gap-2"
                    :disabled="loading">
                    <LogIn v-if="!loading" class="w-5 h-5" />
                    <span v-if="!loading">Đăng nhập</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                </button>

                <!-- Global error (nếu Supabase trả lỗi khác) -->
                <p v-if="globalError" class="text-error text-center text-sm mt-2">
                    {{ globalError }}
                </p>
            </form>

            <!-- Form: Step 2 - MFA TOTP -->
            <form v-else @submit.prevent="verifyMfa" class="space-y-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold">Mã xác minh 2 bước</span>
                    </label>
                    <input v-model="otp" inputmode="numeric" pattern="[0-9]*" maxlength="6"
                        placeholder="Nhập mã 6 chữ số" class="input input-bordered w-full text-center tracking-widest"
                        :class="{ 'input-error': mfaError }" />
                    <p v-if="mfaError" class="text-error text-sm mt-1">{{ mfaError }}</p>
                    <p class="text-xs text-base-content/70 mt-2">
                        Mở ứng dụng xác thực của bạn và nhập mã 6 chữ số hiện tại.
                    </p>
                </div>

                <div class="flex items-center gap-2 text-sm">
                    <input id="rememberDevice" type="checkbox" v-model="rememberDevice" class="checkbox checkbox-sm" />
                    <label for="rememberDevice" class="cursor-pointer">Ghi nhớ thiết bị này trong 30 ngày</label>
                </div>

                <button type="submit" class="btn btn-primary w-full flex items-center justify-center gap-2"
                    :disabled="loading || otp.length !== 6">
                    <LogIn v-if="!loading" class="w-5 h-5" />
                    <span v-if="!loading">Xác minh & Tiếp tục</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                </button>

                <button type="button" class="btn btn-ghost btn-sm w-full" @click="cancelMfa" :disabled="loading">
                    Quay lại đăng nhập
                </button>

                <p v-if="globalError" class="text-error text-center text-sm mt-2">
                    {{ globalError }}
                </p>
            </form>

            <!-- Footer -->
            <p class="text-center text-sm mt-8 text-base-content/70">
                © {{ new Date().getFullYear() }} Task Wan. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:flex min-h-screen">
        <!-- Left Side - Primary Gradient Background -->
        <div class="flex-1 bg-primary via-primary-focus to-primary-content relative overflow-hidden">
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
                <h1 class="text-4xl font-bold mb-4 text-center">Chào mừng quay trở lại!</h1>
                <p class="text-xl text-base-100/90 text-center max-w-md">
                    Bạn có thể đăng nhập để truy cập bằng tài khoản hiện có của mình.
                </p>
            </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="flex-1 bg-base-100 flex items-center justify-center p-8">
            <div class="w-full max-w-md">
                <!-- Header -->
                <h2 class="text-3xl font-bold text-base-content mb-8 text-center">Đăng nhập</h2>

                <!-- Form: Step 1 - Email & Password -->
                <form v-if="!mfaRequired" @submit.prevent="handleLogin" class="space-y-6">
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-base-content mb-2">Email</label>
                        <div class="relative">
                            <Mail class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                            <input v-model="email" type="email" placeholder="Username or email"
                                class="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                                :class="{ 'input-error': emailError }" />
                        </div>
                        <p v-if="emailError" class="text-error text-sm mt-1">{{ emailError }}</p>
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-base-content mb-2">Mật khẩu</label>
                        <div class="relative">
                            <KeyRound
                                class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                            <input v-model="password" type="password" placeholder="Password"
                                class="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                                :class="{ 'input-error': passwordError }" />
                        </div>
                        <p v-if="passwordError" class="text-error text-sm mt-1">{{ passwordError }}</p>
                    </div>

                    <!-- Remember + Forgot -->
                    <div class="flex justify-between items-center text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="remember" class="checkbox checkbox-sm checkbox-primary" />
                            <span class="text-base-content">Ghi nhớ tôi</span>
                        </label>
                        <router-link to="/forgot-password"
                            class="text-primary hover:text-primary-focus font-medium">Quên mật khẩu?</router-link>
                    </div>

                    <!-- Cloudflare Turnstile -->
                    <div class="flex">
                        <Turnstile @verified="onCaptchaVerified" :dark="true" />
                    </div>

                    <!-- Submit -->
                    <button type="submit" class="btn btn-primary w-full flex items-center justify-center gap-2"
                        :disabled="loading">
                        <LogIn v-if="!loading" class="w-5 h-5" />
                        <span v-if="!loading">Đăng nhập</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>

                    <!-- Global error -->
                    <p v-if="globalError" class="text-error text-center text-sm">
                        {{ globalError }}
                    </p>
                </form>

                <!-- Form: Step 2 - MFA TOTP -->
                <form v-else @submit.prevent="verifyMfa" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-base-content mb-2">Mã xác minh 2 bước</label>
                        <input v-model="otp" inputmode="numeric" pattern="[0-9]*" maxlength="6"
                            placeholder="Nhập mã 6 chữ số"
                            class="input input-bordered w-full text-center tracking-widest focus:ring-2 focus:ring-primary focus:border-primary"
                            :class="{ 'input-error': mfaError }" />
                        <p v-if="mfaError" class="text-error text-sm mt-1">{{ mfaError }}</p>
                        <p class="text-xs text-base-content/70 mt-2">
                            Mở ứng dụng xác thực của bạn và nhập mã 6 chữ số hiện tại.
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <input id="rememberDevice" type="checkbox" v-model="rememberDevice"
                            class="checkbox checkbox-sm checkbox-primary" />
                        <label for="rememberDevice" class="text-base-content cursor-pointer">Ghi nhớ thiết bị này trong
                            30
                            ngày</label>
                    </div>

                    <button type="submit" class="btn btn-primary w-full flex items-center justify-center gap-2"
                        :disabled="loading || otp.length !== 6">
                        <LogIn v-if="!loading" class="w-5 h-5" />
                        <span v-if="!loading">Xác minh & Tiếp tục</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>

                    <button type="button" class="btn btn-ghost w-full" @click="cancelMfa" :disabled="loading">
                        Quay lại đăng nhập
                    </button>

                    <p v-if="globalError" class="text-error text-center text-sm">
                        {{ globalError }}
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, KeyRound, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import { storeToRefs } from 'pinia'
import { push } from 'notivue'
import { useHead } from '@vueuse/head'
import { supabase } from '../../lib/supabaseClient';
import Turnstile from '../../components/Turnstile.vue';

useHead({
    title: 'Đăng nhập | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const emailError = ref('')
const passwordError = ref('')
const globalError = ref('')
const mfaRequired = ref(false)
const otp = ref('')
const mfaError = ref('')
const mfaFactorId = ref<string | null>(null)
const mfaChallengeId = ref<string | null>(null)
const rememberDevice = ref(false)

const TRUSTED_DEVICE_KEY = 'tw_trusted_device_until'

const captchaToken = ref<string | null>(null)

const onCaptchaVerified = (token: string) => {
    captchaToken.value = token
}

function getTrustedDeviceValid() {
    const until = localStorage.getItem(TRUSTED_DEVICE_KEY)
    if (!until) return false
    const expiresAt = Number(until)
    return Number.isFinite(expiresAt) && Date.now() < expiresAt
}

function setTrustedDevice(days: number) {
    const ms = days * 24 * 60 * 60 * 1000
    localStorage.setItem(TRUSTED_DEVICE_KEY, String(Date.now() + ms))
}

const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)

// validate cơ bản + regex
function validateForm() {
    emailError.value = ''
    passwordError.value = ''
    globalError.value = ''

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.value) emailError.value = 'Email is required.'
    else if (!emailRegex.test(email.value)) emailError.value = 'Invalid email format.'

    if (!password.value) passwordError.value = 'Password is required.'
    else if (password.value.length < 6)
        passwordError.value = 'Password must be at least 6 characters.'

    return !emailError.value && !passwordError.value
}

async function handleLogin() {
    if (!validateForm()) {
        push.error({ title: 'Validation Error', message: 'Please fix the highlighted fields.' })
        return
    }

    if (!captchaToken.value) {
        push.error({ title: 'Captcha chưa được xác minh', message: 'Vui lòng xác nhận bạn không phải robot.' })
        return
    }

    try {
        const verifyRes = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/verify-turnstile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: captchaToken.value,
            }),
        })

        const verifyData = await verifyRes.json()
        if (!verifyData.ok) {
            push.error({ title: 'Xác minh thất bại', message: 'Captcha không hợp lệ hoặc đã hết hạn.' })
            return
        }
    } catch (err) {
        push.error({ title: 'Lỗi xác minh', message: 'Không thể xác minh Captcha.' })
        return
    }

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
    globalError.value = ''
    mfaError.value = ''

    try {
        await authStore.login(email.value, password.value)

        const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        if (aalError) throw aalError

        const currentLevel = (aalData as any)?.currentLevel || (aalData as any)?.current_level
        const nextLevel = (aalData as any)?.nextLevel || (aalData as any)?.next_level

        if (currentLevel === 'aal1' && nextLevel === 'aal2') {
            if (getTrustedDeviceValid()) {
                setTimeout(() => {
                    push.success({ title: 'Login Successful', message: 'Welcome back!' })
                    router.push('/')
                }, 500)
                return
            }
            const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()
            if (listError) throw listError

            const totpList = (factors as any)?.totp || []
            const totp = Array.isArray(totpList) && totpList.length > 0 ? totpList[0] : null
            if (!totp?.id) {
                throw new Error('No TOTP factor found for this user')
            }

            mfaFactorId.value = totp.id
            const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
                factorId: mfaFactorId.value as string,
            })
            if (challengeError) throw challengeError
            mfaChallengeId.value = (challenge as any)?.id

            mfaRequired.value = true
            return
        }

        setTimeout(() => {
            push.success({ title: 'Login Successful', message: 'Welcome back!' })
            router.push('/')
        }, 500)
    } catch (err: any) {
        console.error('Login error:', err)
        const msg =
            err?.message ||
            (err?.error_description ?? 'An unexpected error occurred. Please try again.')
        globalError.value = msg

        if (msg.includes('Invalid login credentials')) {
            passwordError.value = 'Incorrect email or password.'
        } else if (msg.includes('Email not confirmed')) {
            emailError.value = 'Your email address has not been verified.'
        }

        push.error({ title: 'Login Failed', message: msg })
    } finally {
        loading.value = false
    }
}

async function verifyMfa() {
    if (!mfaFactorId.value || !mfaChallengeId.value) {
        mfaError.value = 'Missing MFA challenge. Please try logging in again.'
        return
    }
    if (otp.value.length !== 6) {
        mfaError.value = 'Please enter the 6‑digit code.'
        return
    }

    loading.value = true
    mfaError.value = ''
    globalError.value = ''
    try {
        const { error: verifyError } = await supabase.auth.mfa.verify({
            factorId: mfaFactorId.value as string,
            challengeId: mfaChallengeId.value as string,
            code: otp.value,
        })
        if (verifyError) throw verifyError

        if (rememberDevice.value) setTrustedDevice(30)

        push.success({ title: 'MFA Verified', message: 'Welcome back!' })
        router.push('/')
    } catch (err: any) {
        console.error('MFA verify error:', err)
        const msg = err?.message || 'Invalid code. Please try again.'
        mfaError.value = msg
        push.error({ title: 'Verification Failed', message: msg })
    } finally {
        loading.value = false
    }
}

function cancelMfa() {
    mfaRequired.value = false
    otp.value = ''
    mfaError.value = ''
    mfaFactorId.value = null
    mfaChallengeId.value = null
}

onMounted(() => {
    const saveEmail = localStorage.getItem('email')
    const savePassword = localStorage.getItem('password')
    const saveRemember = localStorage.getItem('remember')
    if (saveEmail && savePassword) {
        email.value = saveEmail
        password.value = savePassword
        remember.value = saveRemember === 'true'
    }
})
</script>

<style scoped>
.card {
    transition: all 0.3s ease;
}
</style>
