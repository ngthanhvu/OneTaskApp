<template>
    <!-- Mobile Layout -->
    <div class="md:hidden min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div class="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-6 sm:p-8">
            <h1 class="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h1>

            <!-- Bước 1: Nhập mật khẩu mới -->
            <form v-if="!mfaRequired" @submit.prevent="handleReset" class="space-y-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold">Mật khẩu mới</span>
                    </label>
                    <input v-model="newPassword" type="password" class="input input-bordered w-full"
                        placeholder="••••••••" />
                </div>
                <button class="btn btn-primary w-full" type="submit" :disabled="loading">
                    <span v-if="!loading">Cập nhật mật khẩu</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                </button>
            </form>

            <!-- Bước 2: Xác minh MFA khi Supabase yêu cầu AAL2 -->
            <form v-else @submit.prevent="verifyMfaAndUpdate" class="space-y-4">
                <div class="alert alert-info text-sm">
                    Tài khoản của bạn đã bật 2FA. Vui lòng nhập mã xác thực để tiếp tục cập nhật mật khẩu.
                </div>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold">Mã 2FA (6 chữ số)</span>
                    </label>
                    <input v-model="otp" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6"
                        class="input input-bordered w-full tracking-widest text-center" placeholder="000000" />
                    <p v-if="mfaError" class="text-error text-sm mt-2">{{ mfaError }}</p>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-primary flex-1" type="submit" :disabled="loading">
                        <span v-if="!loading">Xác minh & cập nhật</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>
                    <button type="button" class="btn btn-ghost flex-1" @click="cancelMfa" :disabled="loading">
                        Hủy
                    </button>
                </div>
            </form>
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
                <h1 class="text-4xl font-bold mb-4 text-center">Đặt lại mật khẩu</h1>
                <p class="text-xl text-base-100/90 text-center max-w-md">
                    Tạo mật khẩu mới để bảo mật tài khoản của bạn.
                </p>
            </div>
        </div>

        <!-- Right Side - Reset Form -->
        <div class="flex-1 bg-base-100 flex items-center justify-center p-8">
            <div class="w-full max-w-md">
                <!-- Header -->
                <h2 class="text-3xl font-bold text-base-content mb-8 text-center">Mật khẩu mới</h2>

                <!-- Bước 1: Nhập mật khẩu mới -->
                <form v-if="!mfaRequired" @submit.prevent="handleReset" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-base-content mb-2">Mật khẩu mới</label>
                        <div class="relative">
                            <KeyRound class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 z-10" />
                            <input v-model="newPassword" type="password" 
                                class="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Nhập mật khẩu mới" />
                        </div>
                    </div>

                    <button class="btn btn-primary w-full flex items-center justify-center gap-2" type="submit" :disabled="loading">
                        <KeyRound v-if="!loading" class="w-5 h-5" />
                        <span v-if="!loading">Cập nhật mật khẩu</span>
                        <span v-else class="loading loading-spinner loading-sm"></span>
                    </button>
                </form>

                <!-- Bước 2: Xác minh MFA -->
                <form v-else @submit.prevent="verifyMfaAndUpdate" class="space-y-6">
                    <div class="alert alert-info text-sm">
                        Tài khoản của bạn đã bật 2FA. Vui lòng nhập mã xác thực để tiếp tục cập nhật mật khẩu.
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-base-content mb-2">Mã 2FA (6 chữ số)</label>
                        <input v-model="otp" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6"
                            class="input input-bordered w-full tracking-widest text-center focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="000000" />
                        <p v-if="mfaError" class="text-error text-sm mt-2">{{ mfaError }}</p>
                    </div>

                    <div class="flex gap-3">
                        <button class="btn btn-primary flex-1" type="submit" :disabled="loading">
                            <span v-if="!loading">Xác minh & cập nhật</span>
                            <span v-else class="loading loading-spinner loading-sm"></span>
                        </button>
                        <button type="button" class="btn btn-ghost flex-1" @click="cancelMfa" :disabled="loading">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../lib/supabaseClient'
import { push } from 'notivue'
import { useRouter } from 'vue-router'
import { KeyRound } from 'lucide-vue-next'

const newPassword = ref('')
const loading = ref(false)
const router = useRouter()

// MFA state
const mfaRequired = ref(false)
const otp = ref('')
const mfaError = ref('')
const mfaFactorId = ref<string | null>(null)
const mfaChallengeId = ref<string | null>(null)

async function attemptUpdatePassword() {
    const { error } = await supabase.auth.updateUser({ password: newPassword.value })
    if (error) throw error
}

async function handleReset() {
    if (!newPassword.value || newPassword.value.length < 6) {
        push.error('Mật khẩu phải có ít nhất 6 ký tự!')
        return
    }

    loading.value = true
    try {
        await attemptUpdatePassword()
        push.success('Cập nhật mật khẩu thành công! Hãy đăng nhập lại.')
        setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
        // Nếu yêu cầu AAL2 do bật MFA
        if (err?.code === 'insufficient_aal') {
            try {
                const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()
                if (listError) throw listError

                // Lấy factor TOTP đầu tiên (theo cấu trúc ở Login.vue)
                const totpList = (factors as any)?.totp || []
                const totp = Array.isArray(totpList) && totpList.length > 0 ? totpList[0] : null
                if (!totp?.id) throw new Error('Không tìm thấy TOTP factor cho tài khoản này.')

                mfaFactorId.value = totp.id
                const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
                    factorId: mfaFactorId.value as string,
                })
                if (challengeError) throw challengeError
                mfaChallengeId.value = (challenge as any)?.id || (challenge as any)?.challengeId || null

                mfaRequired.value = true
                push.info('Vui lòng nhập mã 2FA để tiếp tục.')
            } catch (mfaErr: any) {
                push.error(mfaErr?.message || 'Không thể khởi tạo xác minh 2FA.')
            }
        } else {
            push.error(err?.message || 'Có lỗi xảy ra!')
        }
    } finally {
        loading.value = false
    }
}

async function verifyMfaAndUpdate() {
    if (!mfaFactorId.value || !mfaChallengeId.value) {
        mfaError.value = 'Thiếu thông tin phiên MFA. Vui lòng thử lại.'
        return
    }
    if (otp.value.trim().length !== 6) {
        mfaError.value = 'Mã 2FA phải gồm 6 chữ số.'
        return
    }

    loading.value = true
    mfaError.value = ''
    try {
        const { error: verifyError } = await supabase.auth.mfa.verify({
            factorId: mfaFactorId.value as string,
            challengeId: mfaChallengeId.value as string,
            code: otp.value.trim(),
        })
        if (verifyError) throw verifyError

        await attemptUpdatePassword()
        push.success('Cập nhật mật khẩu thành công! Hãy đăng nhập lại.')
        setTimeout(() => router.push('/login'), 1500)
    } catch (err: any) {
        const msg = err?.message || 'Xác minh 2FA thất bại. Vui lòng thử lại.'
        mfaError.value = msg
        push.error(msg)
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
</script>
