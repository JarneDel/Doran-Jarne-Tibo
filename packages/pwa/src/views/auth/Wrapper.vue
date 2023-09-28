<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div
      class="bg-primary-surface rounded-2 border-3 min-w-md border-primary-light p-8"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
