import { nextTick, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const setPageTitle = (title: string) => {
  nextTick(() => {
    document.title = title
  })
}

const MOBILE_VIEWPORT_SIZE = ref(640)

const sidebarIsOpen = useLocalStorage('isOpen', false)


export default () => ({
  setPageTitle,
  MOBILE_VIEWPORT_SIZE,
  sidebarIsOpen,
})
