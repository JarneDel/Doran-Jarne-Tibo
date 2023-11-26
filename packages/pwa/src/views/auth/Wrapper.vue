<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div
      class="bg-white rounded-2  min-w-md shadow-md p-8"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
