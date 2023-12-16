<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',
  props: {
    hoverable: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <div
    :class="{
      'hover:shadow-xl': hoverable,
    }"
    class="rounded-lg bg-white p-6 shadow-lg transition-shadow"
  >
    <slot></slot>
  </div>
</template>

<style scoped></style>
