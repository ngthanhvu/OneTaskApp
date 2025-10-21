<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
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
    
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../../lib/supabaseClient'
import { push } from 'notivue'
import { useRouter } from 'vue-router'

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
