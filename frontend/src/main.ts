import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import './styles/main.css'
import App from './App.vue'
import router from './router'
import axios from './utils/axios'
import type { App as AppType } from 'vue'

const app: AppType = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置全局axios实例
app.config.globalProperties.$axios = axios

app.use(createPinia())
   .use(router)
   .use(ElementPlus, {
     locale: zhCn,
   })

app.mount('#app')
