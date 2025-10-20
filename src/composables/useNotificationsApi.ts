import { supabase } from '../lib/supabaseClient'
import type { Task } from '../types/task'

export interface NotificationPreferences {
    id?: number
    user_id: string
    daily_reminders: boolean
    deadline_warnings: boolean
    overdue_alerts: boolean
    priority_based: boolean
    reminder_minutes: number
    created_at?: string
    updated_at?: string
}

export interface NotificationHistory {
    id?: number
    user_id: string
    title: string
    body: string
    type: 'daily' | 'deadline' | 'overdue' | 'test' | 'priority'
    task_id?: number
    sent_at?: string
    read_at?: string
    clicked_at?: string
}

export interface ScheduledNotification {
    id?: number
    user_id: string
    task_id: number
    notification_type: 'deadline' | 'priority'
    scheduled_for: string
    sent: boolean
    created_at?: string
}

export function useNotificationsApi() {
    // Get user's notification preferences
    async function getPreferences(userId: string): Promise<NotificationPreferences | null> {
        const { data, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            throw error
        }

        return data
    }

    // Create or update notification preferences
    async function updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
        const { data, error } = await supabase
            .from('notification_preferences')
            .upsert({
                user_id: userId,
                ...preferences,
                updated_at: new Date().toISOString()
            })
            .select('*')
            .single()

        if (error) throw error
        return data
    }

    // Get notification history
    async function getHistory(userId: string, limit: number = 50): Promise<NotificationHistory[]> {
        const { data, error } = await supabase
            .from('notification_history')
            .select('*')
            .eq('user_id', userId)
            .order('sent_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    }

    // Add notification to history
    async function addToHistory(notification: Omit<NotificationHistory, 'id' | 'sent_at'>): Promise<NotificationHistory> {
        const { data, error } = await supabase
            .from('notification_history')
            .insert({
                ...notification,
                sent_at: new Date().toISOString()
            })
            .select('*')
            .single()

        if (error) throw error
        return data
    }

    // Mark notification as read
    async function markAsRead(notificationId: number): Promise<void> {
        const { error } = await supabase
            .from('notification_history')
            .update({ read_at: new Date().toISOString() })
            .eq('id', notificationId)

        if (error) throw error
    }

    // Mark notification as clicked
    async function markAsClicked(notificationId: number): Promise<void> {
        const { error } = await supabase
            .from('notification_history')
            .update({ clicked_at: new Date().toISOString() })
            .eq('id', notificationId)

        if (error) throw error
    }

    // Schedule a notification
    async function scheduleNotification(notification: Omit<ScheduledNotification, 'id' | 'created_at'>): Promise<ScheduledNotification> {
        const { data, error } = await supabase
            .from('scheduled_notifications')
            .insert(notification)
            .select('*')
            .single()

        if (error) throw error
        return data
    }

    // Get scheduled notifications for a user
    async function getScheduledNotifications(userId: string): Promise<ScheduledNotification[]> {
        const { data, error } = await supabase
            .from('scheduled_notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('sent', false)
            .order('scheduled_for', { ascending: true })

        if (error) throw error
        return data || []
    }

    // Mark scheduled notification as sent
    async function markScheduledAsSent(notificationId: number): Promise<void> {
        const { error } = await supabase
            .from('scheduled_notifications')
            .update({ sent: true })
            .eq('id', notificationId)

        if (error) throw error
    }

    // Clean up old scheduled notifications
    async function cleanupOldScheduledNotifications(): Promise<void> {
        const { error } = await supabase
            .from('scheduled_notifications')
            .delete()
            .lt('scheduled_for', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // 7 days ago

        if (error) throw error
    }

    // Get tasks that need notifications
    async function getTasksForNotifications(userId: string): Promise<{
        todayTasks: Task[]
        overdueTasks: Task[]
        upcomingTasks: Task[]
    }> {
        const today = new Date().toISOString().slice(0, 10)
        const now = new Date()

        // Get today's tasks
        const { data: todayTasks, error: todayError } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('date', today)
            .eq('done', false)

        if (todayError) throw todayError

        // Get overdue tasks
        const { data: overdueTasks, error: overdueError } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .lt('date', today)
            .eq('done', false)

        if (overdueError) throw overdueError

        // Get upcoming tasks (next 7 days)
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
        const { data: upcomingTasks, error: upcomingError } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .gt('date', today)
            .lte('date', nextWeek)
            .eq('done', false)

        if (upcomingError) throw upcomingError

        return {
            todayTasks: todayTasks || [],
            overdueTasks: overdueTasks || [],
            upcomingTasks: upcomingTasks || []
        }
    }

    return {
        getPreferences,
        updatePreferences,
        getHistory,
        addToHistory,
        markAsRead,
        markAsClicked,
        scheduleNotification,
        getScheduledNotifications,
        markScheduledAsSent,
        cleanupOldScheduledNotifications,
        getTasksForNotifications
    }
}
