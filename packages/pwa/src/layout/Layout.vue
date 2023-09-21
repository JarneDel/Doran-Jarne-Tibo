<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
  <div class="min-h-screen">
    <div class="min-h-screen">
      <AppHeader />
      <div class="p-2">
        <slot />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
