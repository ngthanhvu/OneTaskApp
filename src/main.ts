import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createNotivue } from 'notivue'

import router from './router'
import App from './App.vue'
import VCalendar from 'v-calendar'

import 'notivue/animations.css'
import 'v-calendar/style.css'
import 'notivue/notification.css'
import './style.css'

// === PWA register (vite-plugin-pwa) ===
import { registerSW } from 'virtual:pwa-register'

// Khởi tạo app Vue
const head = createHead()
const app = createApp(App)
const pinia = createPinia()
const notivue = createNotivue()

app.use(router)
app.use(head)
app.use(VCalendar, {})
app.use(pinia)
app.use(notivue)

app.mount('#app')

// === Service Worker setup ===
const updateSW = registerSW({
    onNeedRefresh() {
        // Thông báo người dùng khi có bản mới
        if (confirm('Có bản cập nhật mới. Tải lại trang?')) {
            updateSW()
        }
    },
    onOfflineReady() {
        console.log('✅ Ứng dụng TaskWan đã sẵn sàng để dùng offline!')
    }
})
