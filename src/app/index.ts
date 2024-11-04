import { createApp } from 'vue'
import '@/app/style/global.scss'
import pinia from './pinia'
import router from './router'
import DefaultLayout from './layout/ui/default-layout.vue'

const app = createApp(DefaultLayout)
app.use(pinia).use(router).mount('#app')
