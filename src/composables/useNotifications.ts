import { ref, computed } from 'vue'
import { notificationService } from '../services/notificationService'
import type { Task } from '../types/task'

export function useNotifications() {
    const permission = ref<NotificationPermission>('default')
    const isSupported = ref(false)

    // Check if notifications are supported
    if ('Notification' in window) {
        isSupported.value = true
        permission.value = Notification.permission
    }

    const canNotify = computed(() => permission.value === 'granted')

    async function requestPermission(): Promise<boolean> {
        if (!isSupported.value) {
            console.warn('Notifications not supported')
            return false
        }

        const granted = await notificationService.requestPermission()
        permission.value = Notification.permission
        return granted
    }

    async function showTaskReminder(task: Task): Promise<void> {
        if (!canNotify.value) {
            const granted = await requestPermission()
            if (!granted) return
        }

        await notificationService.showTaskReminder({
            id: task.id,
            title: task.title,
            date: task.date,
            priority: task.priority
        })
    }

    async function scheduleDeadlineReminder(task: Task, minutesBefore: number = 30): Promise<void> {
        if (!canNotify.value) {
            const granted = await requestPermission()
            if (!granted) return
        }

        await notificationService.scheduleDeadlineReminder({
            id: task.id,
            title: task.title,
            date: task.date,
            priority: task.priority
        }, minutesBefore)
    }

    async function checkTodayTasks(tasks: Task[]): Promise<void> {
        if (!canNotify.value) {
            const granted = await requestPermission()
            if (!granted) return
        }

        await notificationService.checkTodayTasks(tasks)
    }

    async function checkOverdueTasks(tasks: Task[]): Promise<void> {
        if (!canNotify.value) {
            const granted = await requestPermission()
            if (!granted) return
        }

        await notificationService.scheduleOverdueReminders(tasks)
    }

    // Schedule reminders for tasks based on their priority and due date
    async function scheduleTaskReminders(tasks: Task[]): Promise<void> {
        if (!canNotify.value) {
            const granted = await requestPermission()
            if (!granted) return
        }

        const now = new Date()

        for (const task of tasks) {
            if (task.done) continue

            const taskDate = new Date(task.date)
            const timeDiff = taskDate.getTime() - now.getTime()

            // Skip if task is overdue
            if (timeDiff < 0) continue

            // Schedule reminders based on priority
            let reminderMinutes: number
            switch (task.priority) {
                case 'high':
                    reminderMinutes = 60 // 1 hour before
                    break
                case 'medium':
                    reminderMinutes = 30 // 30 minutes before
                    break
                case 'low':
                default:
                    reminderMinutes = 15 // 15 minutes before
                    break
            }

            await scheduleDeadlineReminder(task, reminderMinutes)
        }
    }

    // Show immediate notification for tasks due soon
    async function showUrgentReminders(tasks: Task[]): Promise<void> {
        if (!canNotify.value) {
            const granted = await requestPermission()
            if (!granted) return
        }

        const now = new Date()
        const urgentTasks = tasks.filter(task => {
            if (task.done) return false
            
            const taskDate = new Date(task.date)
            const timeDiff = taskDate.getTime() - now.getTime()
            const hoursLeft = timeDiff / (1000 * 60 * 60)
            
            // Show urgent for tasks due within 2 hours
            return hoursLeft <= 2 && hoursLeft > 0
        })

        for (const task of urgentTasks) {
            await showTaskReminder(task)
        }
    }

    return {
        permission,
        isSupported,
        canNotify,
        requestPermission,
        showTaskReminder,
        scheduleDeadlineReminder,
        checkTodayTasks,
        checkOverdueTasks,
        scheduleTaskReminders,
        showUrgentReminders
    }
}
