import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthApi } from '../composables/useAuthApi'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const profile = ref<any>(null)
    const profileLoaded = ref(false)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const api = useAuthApi()

    async function fetchUser() {
        const currentUser = await api.getUser()
        user.value = currentUser
        return currentUser
    }

    async function fetchUserProfile(options: { force?: boolean } = {}) {
        if (!user.value) return null
        if (profileLoaded.value && !options.force) return profile.value

        const { data: profileData, error: fetchError } = await api.fetchProfile(user.value.id)

        if (fetchError && (fetchError as any).code !== 'PGRST116') {
            console.error('Error fetching profile:', fetchError)
            return null
        }

        if (profileData) profile.value = profileData
        profileLoaded.value = true
        return profile.value
    }

    async function saveUserProfile(payload: { full_name?: string; avatar_url?: string | null }) {
        if (!user.value) return null
        loading.value = true
        try {
            const hasFullName = Object.prototype.hasOwnProperty.call(payload, 'full_name')
            const hasAvatar = Object.prototype.hasOwnProperty.call(payload, 'avatar_url')
            const nextFullNameForDb = hasFullName
                ? (payload.full_name ?? '')
                : (profile.value?.full_name ?? '')
            const nextAvatarForDb = hasAvatar
                ? (payload.avatar_url ?? null)
                : (profile.value?.avatar_url ?? null)

            const upserted = await api.upsertProfile({
                id: user.value.id,
                full_name: nextFullNameForDb,
                avatar_url: nextAvatarForDb,
            })
            if (!upserted) {
                const fresh = await api.fetchProfile(user.value.id)
                if (fresh.data) {
                    profile.value = fresh.data
                } else {
                    profile.value = {
                        ...profile.value,
                        ...payload,
                        id: user.value.id,
                    }
                }
            } else {
                profile.value = { ...profile.value, ...upserted }
            }
            profileLoaded.value = true
            const nextFullName = nextFullNameForDb
            const nextAvatarUrl = nextAvatarForDb
            await api.updateUserMetadata({
                full_name: nextFullName,
                avatar_url: nextAvatarUrl,
            })

            user.value = {
                ...user.value,
                user_metadata: {
                    ...(user.value?.user_metadata ?? {}),
                    full_name: nextFullName,
                    avatar_url: nextAvatarUrl,
                },
            }
            return profile.value
        } catch (e) {
            console.error('Error saving user profile:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    async function login(email: string, password: string) {
        loading.value = true
        error.value = null
        try {
            const data = await api.signInWithPassword(email, password)
            user.value = data.user
        } catch (err: any) {
            error.value = err.message
            loading.value = false
            throw err
        }
        loading.value = false
        await fetchUserProfile()
        return user.value
    }

    async function register(email: string, password: string) {
        loading.value = true
        error.value = null
        try {
            const data = await api.signUp(email, password)
            user.value = data.user
            return data.user
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await api.signOut()
        } catch (err: any) {
            error.value = err.message
            throw err
        }
        user.value = null
        profile.value = null
        profileLoaded.value = false
    }

    async function forgotPassword(email: string) {
        loading.value = true;
        try {
            const redirectUrl = `${window.location.origin}/reset-password`;
            await api.resetPassword(email, redirectUrl);
            return true
        } catch (err: any) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function clearAvatar() {
        if (!user.value) return null
        if (!profileLoaded.value) {
            await fetchUserProfile({ force: true })
        }
        const updated = await saveUserProfile({ avatar_url: null })
        return updated
    }

    api.onAuthStateChange(async (_event, session) => {
        user.value = session?.user ?? null
        if (user.value) {
            await fetchUserProfile({ force: !profileLoaded.value })
        } else {
            profile.value = null
            profileLoaded.value = false
        }
    })

    return {
        user,
        profile,
        profileLoaded,
        loading,
        error,
        login,
        register,
        logout,
        fetchUser,
        forgotPassword,
        fetchUserProfile,
        saveUserProfile,
        clearAvatar,
    }
})
