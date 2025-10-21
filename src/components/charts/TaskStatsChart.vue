<template>
    <div class="bg-base-100 rounded-2xl p-3 sm:p-4 shadow-md border border-base-300">
        <h3 class="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
            <BarChart2 class="w-4 h-4" />
            <span class="hidden sm:inline">Biểu đồ tiến độ tuần</span>
            <span class="sm:hidden">Tiến độ tuần</span>
        </h3>

        <div class="w-full h-[250px] sm:h-[300px]">
            <VChart v-if="mounted && chartOption" class="w-full h-full" :option="chartOption" autoresize
                :loading="!mounted" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { BarChart2 } from 'lucide-vue-next'

interface Task {
    id: number
    title: string
    date: string
    done: boolean
}
const mounted = ref(false)
const props = defineProps<{ tasks: Task[] }>()

const isDarkMode = computed(() => {
    return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
})

const getThemeColors = () => {
    if (isDarkMode.value) {
        return {
            tooltipBg: '#1f2937',
            tooltipBorder: '#374151',
            tooltipText: '#f9fafb',
            legendText: '#d1d5db',
            axisLabel: '#9ca3af',
            axisLine: '#4b5563',
            gridLine: '#374151',
            completed: '#605DFF',
            remaining: '#f59e0b'
        }
    } else {
        return {
            tooltipBg: '#ffffff',
            tooltipBorder: '#d1d5db',
            tooltipText: '#374151',
            legendText: '#374151',
            axisLabel: '#6b7280',
            axisLine: '#d1d5db',
            gridLine: '#e5e7eb',
            completed: '#605DFF',
            remaining: '#f59e0b'
        }
    }
}

const chartOption = computed(() => {
    if (!mounted.value) return null

    const colors = getThemeColors()
    const now = new Date()
    const days: string[] = []
    const done: number[] = []
    const remaining: number[] = []

    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(now.getDate() - i)
        const ymd = date.toISOString().slice(0, 10)
        const label = date.toLocaleDateString('vi-VN', { weekday: 'short' })
        const tasksOfDay = props.tasks.filter(t => t.date === ymd)
        const doneCount = tasksOfDay.filter(t => t.done).length
        const remainCount = tasksOfDay.length - doneCount
        days.push(label)
        done.push(doneCount)
        remaining.push(remainCount)
    }

    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: colors.tooltipBg,
            borderColor: colors.tooltipBorder,
            textStyle: { color: colors.tooltipText }
        },
        legend: {
            data: ['Đã hoàn thành', 'Còn lại'],
            textStyle: { color: colors.legendText },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            backgroundColor: 'transparent'
        },
        xAxis: {
            type: 'category',
            data: days,
            axisLabel: {
                color: colors.axisLabel,
                fontSize: 12
            },
            axisLine: { lineStyle: { color: colors.axisLine } },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: colors.axisLabel,
                fontSize: 12
            },
            splitLine: { lineStyle: { color: colors.gridLine } },
        },
        series: [
            {
                name: 'Đã hoàn thành',
                type: 'bar',
                data: done,
                color: colors.completed,
                barWidth: '35%',
                itemStyle: { borderRadius: [6, 6, 0, 0] },
            },
            {
                name: 'Còn lại',
                type: 'bar',
                data: remaining,
                color: colors.remaining,
                barWidth: '35%',
                itemStyle: { borderRadius: [6, 6, 0, 0] },
            },
        ],
    }
})

onMounted(async () => {
    await nextTick()
    mounted.value = true
})
</script>
