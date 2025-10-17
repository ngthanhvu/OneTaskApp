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
                <span class="label-text font-medium">Full name <span class="text-red-500">*</span></span>
                <input v-model="fullName" type="text" placeholder="Type your name here"
                    class="input input-bordered w-full mt-2 focus:outline-none focus:ring-1 focus:ring-primary" />
            </label>
        </div>

        <!-- Email -->
        <div class="space-y-3">
            <h2 class="text-lg font-semibold mb-3">Email address</h2>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-base-200 rounded-xl p-3">
                <input v-model="email" type="email" :readonly="!isEditingEmail" class="input w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary px-3 sm:p-2"
                    :class="{ 'input-bordered': isEditingEmail, 'p-0 sm:p-2': !isEditingEmail }" />
                <button class="btn btn-outline btn-md w-full sm:w-auto" @click="toggleEmailEdit">{{ isEditingEmail ? 'Save' : 'Change' }}</button>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-base-200">
            <!-- Nút Logout cho mobile -->
            <button class="btn btn-outline btn-error w-full sm:hidden" @click="handleLogout">
                <LogOut class="w-4 h-4" />
                Logout
            </button>
            <!-- Nút Cancel cho desktop -->
            <button class="btn btn-outline hidden sm:inline-flex w-full sm:w-auto">Cancel</button>
            <button class="btn btn-primary w-full sm:w-auto">
                <Save />
                Save changes
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Save, LogOut } from 'lucide-vue-next';

const router = useRouter();

const fullName = ref('')
const email = ref('john.deere@email.com')
const photoUrl = ref<string | null>(null)
const isEditingEmail = ref(false)

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

function toggleEmailEdit() {
    isEditingEmail.value = !isEditingEmail.value
}

function handleLogout() {
    router.push('/login');
}
</script>
