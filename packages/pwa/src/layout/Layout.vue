<script lang="ts" setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="">
    <div
      class="bg-primary-surface grid min-h-screen grid-rows-[min-content_1fr]"
    >
      <AppHeader />
      <div class="relative h-full">
        <div id="error" class="left-4/6 z-100 absolute right-4 top-2"></div>
        <slot />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
