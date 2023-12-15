<script lang="ts">
import { defineComponent } from 'vue'
import useUser from '@/composables/useUser.ts'

export default defineComponent({
  name: 'AdminOverview',
  setup() {
    const { customUser } = useUser()

    return {
      customUser,
    }
  },
})
</script>

<template></template>

<style scoped></style>
