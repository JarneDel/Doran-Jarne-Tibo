<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'New.vue',
  setup() {
    const { push } = useRouter()
    return {
      push,
    }
  },
})
</script>

<template></template>

<style scoped></style>
