import { supabase } from '../lib/supabaseClient'

type ProfilePayload = {
    id: string
    full_name?: string
    avatar_url?: string | null
}

export function useAuthApi() {
    async function getUser() {
        const { data, error } = await supabase.auth.getUser()
        if (error) throw error
        return data.user
    }

    async function fetchProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        if (error) return { data: null, error }
        return { data, error: null }
    }

    async function upsertProfile(payload: ProfilePayload) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: payload.id,
                full_name: payload.full_name ?? '',
                avatar_url: payload.avatar_url ?? null,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()
        if (error) throw error
        return data
    }

    async function updateUserMetadata(payload: { full_name?: string; avatar_url?: string | null }) {
        const { data, error } = await supabase.auth.updateUser({
            data: {
                full_name: payload.full_name ?? '',
                avatar_url: payload.avatar_url ?? null,
            },
        })
        if (error) throw error
        return data
    }

    async function signInWithPassword(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data
    }

    async function signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        return data
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    function onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
        return supabase.auth.onAuthStateChange(callback)
    }

    return {
        getUser,
        fetchProfile,
        upsertProfile,
        updateUserMetadata,
        signInWithPassword,
        signUp,
        signOut,
        onAuthStateChange,
    }
}


