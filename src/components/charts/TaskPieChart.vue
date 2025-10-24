<template>
    <div class="bg-base-100 rounded-2xl p-3 sm:p-4 shadow-md border border-base-300">
        <h3 class="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
            <PieChart class="w-4 h-4" />
            <span class="hidden sm:inline">Phân bố công việc</span>
            <span class="sm:hidden">Phân bố</span>
        </h3>

        <div class="w-full h-[250px] sm:h-[300px]">
            <VChart v-if="mounted && chartOption" class="w-full h-full" :option="chartOption" autoresize
                :loading="!mounted" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { PieChart } from 'lucide-vue-next'

interface Task {
    id: number
    title: string
    date: string
    done: boolean
    priority?: 'low' | 'medium' | 'high'
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
            completed: '#81aacc',
            remaining: '#f59e0b',
            highPriority: '#ef4444',
            mediumPriority: '#f59e0b',
            lowPriority: '#6b7280'
        }
    } else {
        return {
            tooltipBg: '#ffffff',
            tooltipBorder: '#d1d5db',
            tooltipText: '#374151',
            legendText: '#374151',
            completed: '#81aacc',
            remaining: '#f59e0b',
            highPriority: '#ef4444',
            mediumPriority: '#f59e0b',
            lowPriority: '#6b7280'
        }
    }
}

const chartOption = computed(() => {
    if (!mounted.value) return null

    const colors = getThemeColors()
    const tasks = props.tasks

    const doneTasks = tasks.filter(t => t.done).length
    // const remainingTasks = tasks.filter(t => !t.done).length

    const highPriority = tasks.filter(t => !t.done && t.priority === 'high').length
    const mediumPriority = tasks.filter(t => !t.done && t.priority === 'medium').length
    const lowPriority = tasks.filter(t => !t.done && t.priority === 'low').length
    const noPriority = tasks.filter(t => !t.done && !t.priority).length

    const pieData = [
        { name: 'Đã hoàn thành', value: doneTasks, itemStyle: { color: colors.completed } },
        { name: 'Ưu tiên cao', value: highPriority, itemStyle: { color: colors.highPriority } },
        { name: 'Ưu tiên trung bình', value: mediumPriority, itemStyle: { color: colors.mediumPriority } },
        { name: 'Ưu tiên thấp', value: lowPriority, itemStyle: { color: colors.lowPriority } },
        { name: 'Chưa phân loại', value: noPriority, itemStyle: { color: colors.remaining } }
    ].filter(item => item.value > 0)

    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: colors.tooltipBg,
            borderColor: colors.tooltipBorder,
            textStyle: { color: colors.tooltipText },
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'center',
            textStyle: {
                color: colors.legendText,
                fontSize: 12
            },
            itemWidth: 12,
            itemHeight: 12
        },
        series: [
            {
                name: 'Công việc',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: 'transparent',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: colors.tooltipText
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieData
            }
        ]
    }
})

onMounted(async () => {
    await nextTick()
    mounted.value = true
})
</script>
