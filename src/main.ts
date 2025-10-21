import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createNotivue } from 'notivue'
import VueEcharts from 'vue-echarts'

import router from './router'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'echarts' 
import 'notivue/animations.css'
import 'v-calendar/style.css'
import 'notivue/notification.css'
import './style.css'

import { registerSW } from 'virtual:pwa-register'

const head = createHead()
const app = createApp(App)
const pinia = createPinia()
const notivue = createNotivue()

app.component('VChart', VueEcharts)
app.use(router)
app.use(head)
app.use(VCalendar, {})
app.use(pinia)
app.use(notivue)

app.mount('#app')

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('Có bản cập nhật mới. Tải lại trang?')) {
            updateSW()
        }
    },
    onOfflineReady() {
        console.log('✅ Ứng dụng TaskWan đã sẵn sàng để dùng offline!')
    }
})
