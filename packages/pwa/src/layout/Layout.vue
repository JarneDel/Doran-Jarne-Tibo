<script lang="ts" setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="bg-primary-surface grid min-h-screen grid-rows-[min-content_1fr]">
    <AppHeader />
    <main class="relative h-full">
      <div id="error" class="left-4/6 z-100 absolute right-4 top-2"></div>
      <slot/>
    </main>
  </div>
  <AppFooter />
</template>

<style scoped></style>
