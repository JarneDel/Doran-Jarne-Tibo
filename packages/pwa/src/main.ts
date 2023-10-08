import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router";
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import useFirebase from "@/composables/useFirebase.ts";

const {restoreUser} = useFirebase()



;(async () => {
    await restoreUser();
    createApp(App).use(router).mount('#app')
})()

