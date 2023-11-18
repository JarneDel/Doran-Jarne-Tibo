import { nextTick } from 'vue'

const setPageTitle = (title: string) => {
  nextTick(() => {
    document.title = title
  })
}

export default () => ({
  setPageTitle,
})
