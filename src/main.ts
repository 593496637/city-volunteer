import { ElMessage, ElMessageBox, provideGlobalConfig } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '~/styles/index.scss'
import 'uno.css'
// 以函数方式调用的组件需要手动引入样式
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/overlay.scss'

const app = createApp(App)
// 在应用级别提供命名空间与中文语言包，ElMessage / ElMessageBox 也能拿到
provideGlobalConfig({ namespace: 'ep', locale: zhCn }, app, true)
app.use(ElMessage).use(ElMessageBox).use(router).mount('#app')
