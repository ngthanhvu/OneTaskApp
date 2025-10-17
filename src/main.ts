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
