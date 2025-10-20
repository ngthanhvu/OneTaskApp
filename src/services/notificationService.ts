import { useNotificationsApi } from '../composables/useNotificationsApi'

export interface NotificationOptions {
    title: string
    body: string
    icon?: string
    badge?: string
    tag?: string
    requireInteraction?: boolean
    actions?: NotificationAction[]
}

export interface NotificationAction {
    action: string
    title: string
    icon?: string
}

class NotificationService {
    private permission: NotificationPermission = 'default'
    private api = useNotificationsApi()
    private recentTags: Map<string, number> = new Map()
    private scheduledKeys: Set<string> = new Set()
    private throttleWindowMs = 10 * 60 * 1000 // 10 minutes

    async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications')
            return false
        }

        if (this.permission === 'granted') {
            return true
        }

        if (this.permission === 'denied') {
            return false
        }

        const permission = await Notification.requestPermission()
        this.permission = permission
        return permission === 'granted'
    }

    private shouldThrottle(tag?: string): boolean {
        if (!tag) return false
        const now = Date.now()
        const last = this.recentTags.get(tag)
        if (last && now - last < this.throttleWindowMs) {
            return true
        }
        this.recentTags.set(tag, now)
        return false
    }

    async showNotification(options: NotificationOptions, userId?: string, type?: string, taskId?: number): Promise<void> {
        if (this.shouldThrottle(options.tag)) {
            return
        }
        if (this.permission !== 'granted') {
            const hasPermission = await this.requestPermission()
            if (!hasPermission) {
                console.warn('Notification permission denied')
                return
            }
        }

        const notification = new Notification(options.title, {
            body: options.body,
            icon: options.icon || '/app.png',
            badge: options.badge || '/app.png',
            tag: options.tag,
            requireInteraction: options.requireInteraction || false
        })

        if (userId && type) {
            try {
                await this.api.addToHistory({
                    user_id: userId,
                    title: options.title,
                    body: options.body,
                    type: type as any,
                    task_id: taskId
                })
            } catch (error) {
                console.error('Failed to save notification to history:', error)
            }
        }

        if (!options.requireInteraction) {
            setTimeout(() => {
                notification.close()
            }, 5000)
        }

        return new Promise((resolve) => {
            notification.onclick = () => {
                window.focus()
                notification.close()
                
                if (options.tag && userId) {
                    const parts = options.tag.split('-')
                    if (parts.length > 1) {
                        const idStr = parts[1]
                        if (idStr) {
                            const notificationId = parseInt(idStr, 10)
                            if (!isNaN(notificationId)) {
                                this.api.markAsClicked(notificationId).catch(console.error)
                            }
                        }
                    }
                }
                
                resolve()
            }
        })
    }

    async scheduleDeadlineReminder(task: {
        id: number
        title: string
        date: string
        priority: string
        due_at?: string | null
    }, userId: string, reminderMinutes: number = 30): Promise<void> {
        const taskDate = new Date(task.due_at ?? task.date)
        const now = new Date()
        
        // Calculate reminder time
        const reminderTime = new Date(taskDate.getTime() - (reminderMinutes * 60 * 1000))
        
        // If reminder time is in the past, don't schedule
        if (reminderTime <= now) {
            return
        }

        // Prevent duplicate scheduling in-session
        const scheduleKey = `deadline-${task.id}`
        if (this.scheduledKeys.has(scheduleKey)) {
            return
        }
        this.scheduledKeys.add(scheduleKey)

        // Save to scheduled notifications
        try {
            await this.api.scheduleNotification({
                user_id: userId,
                task_id: task.id,
                notification_type: 'deadline',
                scheduled_for: reminderTime.toISOString(),
                sent: false
            })
        } catch (error) {
            console.error('Failed to schedule notification:', error)
        }

        const delay = reminderTime.getTime() - now.getTime()
        
        setTimeout(async () => {
            await this.showNotification({
                title: `⏰ Deadline sắp tới!`,
                body: `Task "${task.title}" sẽ hết hạn trong ${reminderMinutes} phút`,
                tag: `deadline-${task.id}`,
                requireInteraction: task.priority === 'high'
            }, userId, 'deadline', task.id)
        }, delay)
    }

    async showTaskReminder(task: {
        id: number
        title: string
        date: string
        priority: string
        due_at?: string | null
    }, userId?: string): Promise<void> {
        const taskDate = new Date(task.due_at ?? task.date)
        const now = new Date()
        const timeDiff = taskDate.getTime() - now.getTime()
        const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60))
        
        let urgency = ''
        if (hoursLeft <= 1) {
            urgency = '🚨 KHẨN CẤP'
        } else if (hoursLeft <= 6) {
            urgency = '⚠️ SẮP HẾT HẠN'
        } else {
            urgency = '📅 Nhắc nhở'
        }

        await this.showNotification({
            title: `${urgency} - ${task.title}`,
            body: `Task sẽ hết hạn ${taskDate.toLocaleDateString('vi-VN')} (${hoursLeft}h nữa)`,
            tag: `task-${task.id}`,
            requireInteraction: task.priority === 'high' || hoursLeft <= 2
        }, userId, 'priority', task.id)
    }

    async checkTodayTasks(tasks: Array<{
        id: number
        title: string
        date: string
        priority: string
        done: boolean
    }>, userId?: string): Promise<void> {
        const today = new Date().toISOString().slice(0, 10)
        const todayTasks = tasks.filter(task => 
            task.date === today && !task.done
        )

        if (todayTasks.length > 0) {
            await this.showNotification({
                title: `📋 ${todayTasks.length} task hôm nay`,
                body: `Bạn có ${todayTasks.length} task cần hoàn thành hôm nay`,
                tag: 'daily-reminder',
                requireInteraction: true
            }, userId, 'daily')
        }
    }

    async scheduleOverdueReminders(tasks: Array<{
        id: number
        title: string
        date: string
        priority: string
        done: boolean
    }>, userId?: string): Promise<void> {
        const today = new Date().toISOString().slice(0, 10)
        const overdueTasks = tasks.filter(task => 
            task.date < today && !task.done
        )

        if (overdueTasks.length > 0) {
            await this.showNotification({
                title: `🚨 ${overdueTasks.length} task quá hạn`,
                body: `Bạn có ${overdueTasks.length} task đã quá hạn cần xử lý`,
                tag: 'overdue-reminder',
                requireInteraction: true
            }, userId, 'overdue')
        }
    }

    // Get notification preferences
    async getPreferences(userId: string) {
        return await this.api.getPreferences(userId)
    }

    // Update notification preferences
    async updatePreferences(userId: string, preferences: any) {
        return await this.api.updatePreferences(userId, preferences)
    }

    // Get notification history
    async getHistory(userId: string, limit?: number) {
        return await this.api.getHistory(userId, limit)
    }

    // Mark notification as read
    async markAsRead(notificationId: number) {
        return await this.api.markAsRead(notificationId)
    }

    // Clear all notifications
    async clearHistory(userId: string) {
        return await this.api.clearHistory(userId)
    }

    // Get tasks for notifications
    async getTasksForNotifications(userId: string) {
        return await this.api.getTasksForNotifications(userId)
    }
}

export const notificationService = new NotificationService()
