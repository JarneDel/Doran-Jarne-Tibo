import { nextTick, ref } from 'vue'

const setPageTitle = (title: string) => {
  nextTick(() => {
    document.title = title
  })
}

const MOBILE_VIEWPORT_SIZE = ref(768)


export default () => ({
  setPageTitle,
  MOBILE_VIEWPORT_SIZE,
})
