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
      <div class="h-full">
        <slot />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
