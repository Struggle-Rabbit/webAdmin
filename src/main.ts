import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:uno.css'
import './styles/reset.scss'
import './styles/variables.scss'
import './styles/dark.scss'
import App from './App.vue'
import router from './router'
import { permissionDirective } from './directives/permission'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

async function bootstrap() {
  if (import.meta.env.DEV) {
    await import('./mock')
  }

  const app = createApp(App)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(createPinia())
  app.use(ElementPlus)
  app.use(router)
  app.directive('permission', permissionDirective)
  app.mount('#app')
}

bootstrap()
