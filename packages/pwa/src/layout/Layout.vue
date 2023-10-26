<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="">
    <div class="grid grid-rows-[min-content_1fr] min-h-screen bg-primary-surface">
      <AppHeader />
      <div class="h-full">
        <slot/>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
//q: how to make costom grid rows tailwindcss
//a: https://tailwindcss.com/docs/grid-template-rows
//q: make me a grid with 2 rows 1 min-content and 1 fr for tailwindcss
//a: grid-rows-[min-content,fr]