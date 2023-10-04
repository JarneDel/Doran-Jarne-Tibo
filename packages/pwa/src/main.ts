import { createApp } from 'vue'
import App from './App.vue'
import { router } from './bootstrap'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import useFirebase from '@/composables/useFirebase.ts'
import { i18n } from '@/bootstrap/i18n.ts'

const { restoreUser } = useFirebase()

;(async () => {
  await restoreUser()
  createApp(App).use(router).use(i18n).mount('#app')
})()
