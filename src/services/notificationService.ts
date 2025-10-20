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

    async showNotification(options: NotificationOptions): Promise<void> {
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

        // Auto close after 5 seconds unless requireInteraction is true
        if (!options.requireInteraction) {
            setTimeout(() => {
                notification.close()
            }, 5000)
        }

        return new Promise((resolve) => {
            notification.onclick = () => {
                window.focus()
                notification.close()
                resolve()
            }
        })
    }

    async scheduleDeadlineReminder(task: {
        id: number
        title: string
        date: string
        priority: string
    }, reminderMinutes: number = 30): Promise<void> {
        const taskDate = new Date(task.date)
        const now = new Date()
        
        const reminderTime = new Date(taskDate.getTime() - (reminderMinutes * 60 * 1000))
        
        if (reminderTime <= now) {
            return
        }

        const delay = reminderTime.getTime() - now.getTime()
        
        setTimeout(async () => {
            await this.showNotification({
                title: `⏰ Deadline sắp tới!`,
                body: `Task "${task.title}" sẽ hết hạn trong ${reminderMinutes} phút`,
                tag: `deadline-${task.id}`,
                requireInteraction: task.priority === 'high',
                actions: [
                    {
                        action: 'view',
                        title: 'Xem task',
                        icon: '/app.png'
                    },
                    {
                        action: 'complete',
                        title: 'Đánh dấu hoàn thành',
                        icon: '/app.png'
                    }
                ]
            })
        }, delay)
    }

    async showTaskReminder(task: {
        id: number
        title: string
        date: string
        priority: string
    }): Promise<void> {
        const taskDate = new Date(task.date)
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
        })
    }

    async checkTodayTasks(tasks: Array<{
        id: number
        title: string
        date: string
        priority: string
        done: boolean
    }>): Promise<void> {
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
            })
        }
    }

    async scheduleOverdueReminders(tasks: Array<{
        id: number
        title: string
        date: string
        priority: string
        done: boolean
    }>): Promise<void> {
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
            })
        }
    }
}

export const notificationService = new NotificationService()
