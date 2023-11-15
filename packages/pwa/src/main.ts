import { createApp } from 'vue'
import App from './App.vue'
import { router } from './bootstrap'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import useFirebase from '@/composables/useFirebase.ts'
import { i18n } from '@/bootstrap/i18n.ts'
import { FocusTrap } from 'focus-trap-vue'
import useCustomUser from '@/composables/useUser.ts'


const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser } = useCustomUser()

;(async () => {
  await restoreUser()
  if (firebaseUser.value) {
    await restoreCustomUser()
  }
  createApp(App)
    .use(router)
    .use(i18n)
    .component('FocusTrap', FocusTrap)
    .mount('#app')
})()
