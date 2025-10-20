<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200">
        <div class="card w-full max-w-md bg-base-100 shadow-xl p-8">
            <h1 class="text-2xl font-bold mb-4 text-center">Đặt lại mật khẩu</h1>
            <form @submit.prevent="handleReset">
                <input v-model="newPassword" type="password" class="input input-bordered w-full mb-4"
                    placeholder="Mật khẩu mới" />
                <button class="btn btn-primary w-full" type="submit" :disabled="loading">
                    <span v-if="!loading">Cập nhật mật khẩu</span>
                    <span v-else class="loading loading-spinner loading-sm"></span>
                </button>
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

async function handleReset() {
    if (!newPassword.value || newPassword.value.length < 6) {
        push.error('Mật khẩu phải có ít nhất 6 ký tự!')
        return
    }

    loading.value = true
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword.value })
        if (error) throw error
        push.success('Cập nhật mật khẩu thành công! Hãy đăng nhập lại.')
        setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
        push.error(err.message || 'Có lỗi xảy ra!')
    } finally {
        loading.value = false
    }
}
</script>
