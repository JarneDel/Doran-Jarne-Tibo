<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Button',
})
</script>

<template>
  <button
    class="px4 bg-secondary hover:border-secondary-lighter active:border-secondary-lighter active:bg-secondary-400 focus-visible-outline-none rounded border-2 border-transparent py-2 focus:border-black focus:outline-none focus-visible:border-black"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
