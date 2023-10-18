import { ref } from 'vue'

const lastRoute = ref<string>('')

export default () => {
  return {
    lastRoute,
  }
}
