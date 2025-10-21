<template>
    <div class="bg-base-200 py-4 px-4">
        <div class="mx-auto">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
                <p class="text-base-content/70">Cập nhật thông tin cá nhân và bảo mật tài khoản</p>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column: Profile Photo & Basic Info -->
                <div class="lg:col-span-1">
                    <div class="card bg-base-100 shadow-md border border-base-300">
                        <div class="card-body">
                            <h2 class="card-title text-lg mb-4">Thông tin cá nhân</h2>
                            
                            <!-- Profile Photo -->
                            <div class="flex flex-col items-center space-y-4">
                                <div class="avatar relative">
                                    <div class="w-24 sm:w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                        <img :src="photoUrl || '/image.png'" alt="Profile photo" />
                                    </div>
                                    <button v-if="photoUrl" @click="removePhoto"
                                        class="btn btn-xs btn-circle btn-error absolute bottom-0 right-0 -mr-1 -mb-1">
                                        <CircleX class="w-4 h-4" />
                                    </button>
                                </div>
                                <button class="btn btn-outline btn-sm" @click="uploadPhoto">
                                    + Upload photo
                                </button>
                                <p class="text-xs text-base-content/70 text-center">
                                    Hỗ trợ JPG, PNG, GIF. Dung lượng tối đa 500KB.
                                </p>
                            </div>

                            <!-- Basic Info -->
                            <div class="space-y-4 mt-6">
                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text font-medium">Họ và tên <span class="text-red-500">*</span></span>
                                    </label>
                                    <input v-model="fullName" type="text" placeholder="Nhập họ và tên"
                                        class="input input-bordered w-full focus:ring-1 focus:ring-primary" />
                                </div>

                                <div class="form-control">
                                    <label class="label">
                                        <span class="label-text font-medium">Email <span class="text-red-500">*</span></span>
                                    </label>
                                    <input v-model="email" type="email" :readonly="!isEditingEmail"
                                        class="input w-full focus:ring-1 focus:ring-primary"
                                        :class="{ 'input-bordered': isEditingEmail, 'bg-base-200': !isEditingEmail }" />
                                    <button class="btn btn-primary btn-sm w-full mt-2" @click="toggleEmailEdit">
                                        {{ isEditingEmail ? 'Lưu' : 'Thay đổi' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Security Settings -->
                <div class="lg:col-span-2">
                    <div class="card bg-base-100 shadow-md border border-base-300">
                        <div class="card-body">
                            <h2 class="card-title text-lg mb-6">Bảo mật tài khoản</h2>

                            <!-- 2FA Section -->
                            <div class="space-y-6">
                                <!-- 2FA Setup/Status -->
                                <div class="border border-base-300 rounded-lg p-4">
                                    <h3 class="text-md font-semibold mb-4 flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full" :class="is2FAEnabled ? 'bg-success' : 'bg-warning'"></div>
                                        Xác thực hai bước (2FA)
                                    </h3>

                                    <!-- Not enabled -->
                                    <div v-if="!qrData && !is2FAEnabled">
                                        <p class="text-sm text-base-content/70 mb-4">
                                            Bật xác thực 2 bước để tăng cường bảo mật tài khoản của bạn.
                                        </p>
                                        <button class="btn btn-primary w-full sm:w-auto" @click="setup2FA" :disabled="loading">
                                            Bật xác thực hai bước
                                        </button>
                                    </div>

                                    <!-- QR Code Setup -->
                                    <div v-if="qrData" class="text-center space-y-4">
                                        <img :src="qrData.qr_code" alt="QR code" class="w-40 mx-auto" />
                                        <p class="text-sm text-base-content/70">
                                            Quét mã QR bằng ứng dụng Google Authenticator hoặc Authy.
                                        </p>
                                        <div class="text-sm text-base-content/80">
                                            <p class="font-semibold">Hoặc nhập thủ công:</p>
                                            <div class="mt-1 font-mono break-words bg-base-200 rounded p-2 inline-block">
                                                {{ qrData.secret }}
                                            </div>
                                            <button class="btn btn-outline btn-sm ml-2" @click="copyToClipboard(qrData.secret)">Sao chép</button>
                                        </div>
                                        <input v-model="otp" maxlength="6" placeholder="Nhập mã 6 số"
                                            class="input input-bordered w-full text-center" />
                                        <button class="btn btn-primary w-full" @click="confirmSetup" :disabled="!otp || loading">
                                            <span v-if="!loading">Xác nhận</span>
                                            <span v-else class="loading loading-spinner loading-sm"></span>
                                        </button>
                                    </div>

                                    <!-- Enabled -->
                                    <div v-if="is2FAEnabled && !qrData" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <p class="text-sm text-success font-medium">Xác thực hai bước đang bật</p>
                                            <p class="text-xs text-base-content/60">Tài khoản của bạn được bảo vệ thêm một lớp.</p>
                                        </div>
                                        <button class="btn btn-outline btn-error btn-sm" @click="disable2FA" :disabled="loading">
                                            Tắt 2FA
                                        </button>
                                    </div>
                                </div>

                                <!-- Password Change -->
                                <div class="border border-base-300 rounded-lg p-4">
                                    <h3 class="text-md font-semibold mb-4">Đổi mật khẩu</h3>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div class="form-control">
                                            <label class="label">
                                                <span class="label-text font-medium">Mật khẩu mới</span>
                                            </label>
                                            <input v-model="newPassword" type="password" placeholder="Nhập mật khẩu mới"
                                                class="input input-bordered w-full focus:ring-1 focus:ring-primary" />
                                        </div>
                                        <div class="form-control">
                                            <label class="label">
                                                <span class="label-text font-medium">Xác nhận mật khẩu mới</span>
                                            </label>
                                            <input v-model="confirmNewPassword" type="password" placeholder="Xác nhận mật khẩu mới"
                                                class="input input-bordered w-full focus:ring-1 focus:ring-primary" />
                                        </div>
                                    </div>
                                    <button class="btn btn-primary w-full sm:w-auto mt-4" @click="changePassword" :disabled="loading">
                                        Lưu mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
                <button class="inline-flex btn btn-outline btn-error w-full sm:w-auto sm:hidden" @click="confirmLogout">
                    <LogOut class="w-4 h-4" />
                    Đăng xuất
                </button>
                <button class="btn btn-primary w-full sm:w-auto" @click="saveProfile" :disabled="loading">
                    <Save v-if="!loading" class="w-4 h-4" />
                    <span v-if="!loading">Lưu thay đổi</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                </button>
            </div>

            <ConfirmModal ref="logoutConfirm" title="Xác nhận đăng xuất"
                message="Bạn có chắc muốn đăng xuất khỏi tài khoản không?" actions="Đăng xuất" type="error"
                @confirm="handleLogout" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { Save, LogOut, CircleX } from 'lucide-vue-next'
import { supabase } from '../../lib/supabaseClient'
import { storeToRefs } from 'pinia'
import { push } from 'notivue'
import { useHead } from '@vueuse/head'
import ConfirmModal from '../../components/common/ConfirmModal.vue'

useHead({
    title: 'Hồ sơ | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const router = useRouter()
const authStore = useAuthStore()
const { user, profile } = storeToRefs(authStore)

const logoutConfirm = ref<InstanceType<typeof ConfirmModal> | null>(null)
const fullName = ref('')
const email = ref('')
const photoUrl = ref<string | null>(null)
const isEditingEmail = ref(false)
const loading = ref(false)

const qrData = ref<any>(null)
const otp = ref('')
const is2FAEnabled = ref(false)
const factorId = ref<string | null>(null)

const newPassword = ref('')
const confirmNewPassword = ref('')

async function changePassword() {
    if (newPassword.value !== confirmNewPassword.value) {
        push.error('Mật khẩu mới không khớp!')
        return
    }
    if (!newPassword.value || newPassword.value.length < 6) {
        push.error('Mật khẩu phải có ít nhất 6 ký tự!')
        return
    }

    loading.value = true
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword.value })
        if (error) throw error
        push.success('Đổi mật khẩu thành công!')
        newPassword.value = ''
        confirmNewPassword.value = ''
    } catch (err) {
        console.error(err)
        push.error('Đổi mật khẩu thất bại. Vui lòng thử lại!')
    } finally {
        loading.value = false
    }
}

function confirmLogout() {
    logoutConfirm.value?.open()
}

async function uploadPhoto() {
    if (!user.value) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async e => {
        const file = (e.target as HTMLInputElement)?.files?.[0]
        if (!file) return
        if (file.size > 500 * 1024) {
            push.error('Ảnh vượt quá 500KB!')
            return
        }

        loading.value = true
        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${user.value.id}/${Date.now()}.${fileExt}`
            const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
            if (error) throw error
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
            photoUrl.value = data.publicUrl
            await authStore.saveUserProfile({ avatar_url: photoUrl.value })
            push.success('Cập nhật ảnh thành công!')
        } catch {
            push.error('Upload thất bại!')
        } finally {
            loading.value = false
        }
    }
    input.click()
}

async function removePhoto() {
    if (!user.value || !photoUrl.value) return
    loading.value = true
    try {
        const parts = photoUrl.value.split('/')
        const filePath = parts.slice(parts.indexOf('avatars') + 1).join('/')
        await supabase.storage.from('avatars').remove([filePath])
        photoUrl.value = null
        await authStore.clearAvatar()
        push.success('Xóa ảnh thành công!')
    } catch {
        push.error('Xóa ảnh thất bại!')
    } finally {
        loading.value = false
    }
}

function toggleEmailEdit() {
    isEditingEmail.value = !isEditingEmail.value
}

async function setup2FA() {
    loading.value = true
    try {
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })

        if (error) throw error

        qrData.value = data.totp
        factorId.value = data.id
    } catch (err) {
        console.error(err)
        push.error('Không thể bật 2FA. Vui lòng thử lại!')
    } finally {
        loading.value = false
    }
}

async function confirmSetup() {
    loading.value = true
    try {
        if (!factorId.value) throw new Error('Thiếu factorId')

        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId: factorId.value
        })
        if (challengeError) throw challengeError

        const { error: verifyError } = await supabase.auth.mfa.verify({
            factorId: factorId.value,
            challengeId: challenge.id,
            code: otp.value
        })
        if (verifyError) throw verifyError

        push.success('Xác thực 2FA thành công!')
        is2FAEnabled.value = true
        qrData.value = null
        otp.value = ''
    } catch (err) {
        console.error(err)
        push.error('Mã xác thực không hợp lệ!')
    } finally {
        loading.value = false
    }
}

async function disable2FA() {
    loading.value = true
    try {
        const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()
        if (listError) throw listError

        const factorsArray = Array.isArray(factors) ? factors : (factors as any)?.all ?? []

        if (!factorsArray || factorsArray.length === 0) {
            push.error('Không tìm thấy phương thức 2FA để hủy.')
            return
        }

        const factorId = factorsArray[0].id
        const { error } = await supabase.auth.mfa.unenroll({ factorId })
        if (error) throw error
        is2FAEnabled.value = false
        push.success('Đã tắt 2FA thành công!')
    } catch {
        push.error('Không thể tắt 2FA!')
    } finally {
        loading.value = false
    }
}

async function loadUserProfile() {
    if (!user.value) return
    fullName.value = profile.value?.full_name || ''
    email.value = user.value.email || ''
    photoUrl.value = profile.value?.avatar_url || null

    const { data } = await supabase.auth.mfa.listFactors()
    const factorsArray = Array.isArray(data) ? data : (data as any)?.all ?? []
    is2FAEnabled.value = factorsArray.length > 0
}

async function saveProfile() {
    loading.value = true
    try {
        await authStore.saveUserProfile({ full_name: fullName.value, avatar_url: photoUrl.value })
        push.success('Đã lưu thay đổi!')
    } catch {
        push.error('Lưu thất bại!')
    } finally {
        loading.value = false
    }
}
function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
        .then(() => push.success('Sao chép thành công!'))
        .catch(() => push.error('Sao chép thất bại!'))
}

function handleLogout() {
    authStore.logout()
    router.push('/login')
}

onMounted(async () => {
    if (!authStore.user) await authStore.fetchUser()
    await loadUserProfile()
})
</script>
