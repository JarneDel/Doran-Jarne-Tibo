import { createApp } from 'vue'
import App from './App.vue'
import { router } from './bootstrap'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import useFirebase from '@/composables/useFirebase.ts'
import { i18n } from '@/bootstrap/i18n.ts'
import { FocusTrap } from 'focus-trap-vue'
import useCustomUser from '@/composables/useUser.ts'
import useLanguage from './composables/useLanguage'


const { restoreUser, firebaseUser } = useFirebase()
const { restoreCustomUser, } = useCustomUser()
// const { setLocale } = useLanguage()



;(async () => {
  await restoreUser()
  createApp(App)
    .use(router)
    .use(i18n)
    .component('FocusTrap', FocusTrap)
    .mount('#app')
  if (firebaseUser.value) {await restoreCustomUser()
    // if (customUser.value) 
  // setLocale(customUser.value?.userByUid.locale)
}
  createApp(App).use(router).use(i18n).mount('#app')
})()
