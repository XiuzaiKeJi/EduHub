import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import type { App as AppType } from 'vue'

const app: AppType = createApp(App)
app.use(ElementPlus)
app.mount('#app')
