import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import router from './router'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

import './style.css'

const head = createHead()
const app = createApp(App)

app.use(router)
app.use(head)
app.use(VCalendar, {})

app.mount('#app')
