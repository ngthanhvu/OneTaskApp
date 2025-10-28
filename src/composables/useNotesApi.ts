import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

export interface NoteItem {
    id: number
    user_id: string
    title: string
    description: string | null
    completed: boolean
    created_at: string
    updated_at: string
}

export function useNotesApi() {
    const notes = ref<NoteItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchNotes() {
        loading.value = true
        error.value = null
        const { data, error: err } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false })
        if (err) error.value = err.message
        notes.value = (data as NoteItem[]) || []
        loading.value = false
    }

    async function addNote(payload?: Partial<NoteItem>) {
        const insert = {
            title: payload?.title ?? 'New note',
            description: payload?.description ?? '',
            completed: false,
        }
        const { data, error: err } = await supabase.from('notes').insert(insert).select('*').single()
        if (err) throw err
        if (data) notes.value.unshift(data as NoteItem)
    }

    async function toggleNote(note: NoteItem) {
        const { data, error: err } = await supabase
            .from('notes')
            .update({ completed: !note.completed })
            .eq('id', note.id)
            .select('*')
            .single()
        if (err) throw err
        const idx = notes.value.findIndex(n => n.id === note.id)
        if (idx > -1 && data) notes.value[idx] = data as NoteItem
    }

    async function deleteNote(id: number) {
        const { error: err } = await supabase.from('notes').delete().eq('id', id)
        if (err) throw err
        notes.value = notes.value.filter(n => n.id !== id)
    }

    return { notes, loading, error, fetchNotes, addNote, toggleNote, deleteNote }
}


