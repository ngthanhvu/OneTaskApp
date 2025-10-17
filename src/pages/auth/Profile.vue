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
                <div
                    class="w-24 sm:w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
                    <img :src="photoUrl || '/image.png'" alt="Profile photo" />
                </div>
                <button v-if="photoUrl" @click="removePhoto"
                    class="btn btn-xs btn-circle btn-soft btn-error absolute bottom-0 right-0 -mr-1 -mb-1 tooltip tooltip-bottom" data-tip="Remove photo">
                    <CircleX class="w-4 h-4" />
                </button>
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

                <div class="mt-3">
                    <span class="label-text font-medium">Email address <span class="text-red-500">*</span></span>
                    <input v-model="email" type="email" :readonly="!isEditingEmail"
                        class="input  mt-2 w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary px-3 sm:p-2"
                        :class="{ 'input-bordered': isEditingEmail, 'p-0 sm:p-2': !isEditingEmail }" />
                    <button class="btn mt-3 btn-outline btn-md w-full sm:w-auto" @click="toggleEmailEdit">{{
                        isEditingEmail ? 'Save' : 'Change'
                        }}</button>
                </div>
            </label>
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
            <button class="btn btn-primary w-full sm:w-auto" @click="saveProfile" :disabled="loading">
                <Save v-if="!loading" />
                <span v-if="!loading">Save changes</span>
                <span v-else class="loading loading-spinner loading-sm"></span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { Save, LogOut } from 'lucide-vue-next';
import { supabase } from '../../lib/supabaseClient';
import { storeToRefs } from 'pinia';
import { CircleX } from 'lucide-vue-next';
import { push } from 'notivue'
import { useHead } from '@vueuse/head'

useHead({
    title: 'Profile | Task Wan',
    meta: [
        { name: 'description', content: 'Quản lý công việc hiệu quả với Task Wan' },
        { name: 'keywords', content: 'Task, Quản lý công việc, To do list' },
    ],
})

const router = useRouter();
const authStore = useAuthStore();
const { user, profile } = storeToRefs(authStore)

const fullName = ref('')
const email = ref('')
const photoUrl = ref<string | null>(null)
const isEditingEmail = ref(false)
const loading = ref(false)

async function uploadPhoto() {
    if (!user.value) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async e => {
        const file = (e.target as HTMLInputElement)?.files?.[0]
        if (!file) return
        if (file.size > 500 * 1024) {
            push.error('Ảnh vượt quá 500KB, vui lòng chọn ảnh nhỏ hơn!')
            return
        }

        loading.value = true
        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${user.value.id}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true, contentType: file.type })

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
            const publicUrl = data.publicUrl

            photoUrl.value = publicUrl
            await authStore.saveUserProfile({ avatar_url: publicUrl })
            push.success('Tải ảnh thành công!')
        } catch (err) {
            console.error('Upload error:', err)
            push.error('Tải ảnh thất bại, vui lòng thử lại!')
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
        const urlParts = photoUrl.value.split('/')
        const filePath = urlParts.slice(urlParts.indexOf('avatars') + 1).join('/')

        const { error } = await supabase.storage.from('avatars').remove([filePath])
        if (error) throw error

        photoUrl.value = null
        await authStore.clearAvatar()
        push.success('Xóa ảnh thành công!')
    } catch (err) {
        console.error('Remove photo error:', err)
        push.error('Xóa ảnh thất bại, vui lòng thử lại!')
    } finally {
        loading.value = false
    }
}

function toggleEmailEdit() {
    isEditingEmail.value = !isEditingEmail.value
}

async function loadUserProfile() {
    if (!user.value) return
    loading.value = true
    try {
        const data = await authStore.fetchUserProfile()
        if (!data) {
            await createUserProfile()
        }
        fullName.value = (profile.value?.full_name as string) || user.value.user_metadata?.full_name || ''
        email.value = user.value.email || ''
        photoUrl.value = (profile.value && 'avatar_url' in profile.value)
            ? (profile.value.avatar_url as string | null)
            : (user.value.user_metadata?.avatar_url || null)
    } catch (error) {
        console.error('Error loading profile:', error)
    } finally {
        loading.value = false
    }
}

async function createUserProfile() {
    if (!user.value) return

    try {
        await authStore.saveUserProfile({
            full_name: user.value.user_metadata?.full_name || '',
            avatar_url: user.value.user_metadata?.avatar_url || null
        })
        await authStore.fetchUserProfile()
    } catch (error) {
        console.error('Error creating profile:', error)
    }
}

async function saveProfile() {
    if (!user.value) return

    loading.value = true
    try {
        await authStore.saveUserProfile({ full_name: fullName.value, avatar_url: photoUrl.value })
        alert('Profile updated successfully!')

    } catch (error) {
        console.error('Error saving profile:', error)
    } finally {
        loading.value = false
    }
}

function handleLogout() {
    authStore.logout();
    router.push('/login');
}

onMounted(async () => {
    if (!authStore.user) {
        await authStore.fetchUser()
    }

    if (!authStore.profileLoaded) {
        await loadUserProfile()
    } else {
        fullName.value = profile.value?.full_name ?? user.value?.user_metadata?.full_name ?? ''
        email.value = user.value?.email ?? ''
        photoUrl.value = (profile.value && 'avatar_url' in profile.value)
            ? (profile.value.avatar_url as string | null)
            : (user.value?.user_metadata?.avatar_url ?? null)
    }
})

</script>
