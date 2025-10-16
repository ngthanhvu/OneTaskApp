<template>
    <div class="mx-auto bg-base-100 rounded-2xl shadow-md border border-base-300 p-5 sm:p-8 space-y-6 sm:space-y-8">
        <!-- Header -->
        <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-1">Profile</h1>
            <p class="text-base-content/70">Cập nhật thông tin cá nhân của bạn</p>
        </div>

        <!-- Profile photo -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div class="avatar self-center sm:self-auto">
                <div class="w-24 sm:w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                    <img :src="photoUrl || '/image.png'" alt="Profile photo" />
                </div>
            </div>
            <div class="text-center sm:text-left">
                <button class="btn btn-outline btn-sm mb-2" @click="uploadPhoto">+ Upload photo</button>
                <p class="text-xs text-base-content/70">
                    Supported formats: jpg, gif, png. Max file size: 500kB.
                </p>
            </div>
        </div>

        <!-- Contact -->
        <div class="space-y-3">
            <h2 class="text-lg font-semibold mb-3">Contact</h2>
            <label class="form-control w-full">
                <span class="label-text font-medium mb-1">Full name *</span>
                <input v-model="fullName" type="text" placeholder="Type your name here"
                    class="input input-bordered w-full" />
            </label>
        </div>

        <!-- Email -->
        <div class="space-y-3">
            <h2 class="text-lg font-semibold mb-3">Email address</h2>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-base-200 rounded-xl p-3">
                <p class="truncate">{{ email }}</p>
                <button class="btn btn-outline btn-sm w-full sm:w-auto" @click="changeEmail">Change email</button>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-base-200">
            <button class="btn btn-outline w-full sm:w-auto">Cancel</button>
            <button class="btn btn-primary w-full sm:w-auto">
                <Save />
                Save changes
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Save } from 'lucide-vue-next'

const fullName = ref('')
const email = ref('john.deere@email.com')
const photoUrl = ref<string | null>(null)

function uploadPhoto() {
    // Giả lập upload
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = e => {
        const file = (e.target as HTMLInputElement)?.files?.[0]
        if (file && file.size <= 500 * 1024) {
            photoUrl.value = URL.createObjectURL(file)
        } else {
            alert('Ảnh vượt quá 500KB hoặc không hợp lệ!')
        }
    }
    input.click()
}

function changeEmail() {
    const newEmail = prompt('Nhập email mới:', email.value)
    if (newEmail) email.value = newEmail
}
</script>
