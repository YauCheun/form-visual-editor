import { createApp } from 'vue'
import App from './App.vue'
import Element from 'element-plus'
const app = createApp(App)
app.use(Element)
app.mount('#app')
