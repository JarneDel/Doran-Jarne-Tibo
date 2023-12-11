<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<template>
  <div class="flex min-h-screen justify-center sm:items-center">
    <div class="rounded-2 sm:min-w-md mt3xl min-w-full bg-white p-8 shadow-md">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
