<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'StyledButton',
  props: {
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
    px: {
      type: Number,
      default: 4,
    },
    py: {
      type: Number,
      default: 2,
    },
  },
  emits: ['click'],
})
</script>

<template>
  <button
    :type="type"
    class="bg-secondary active:bg-secondary-400 focus-visible-outline-none transition-color rounded border-2 border-transparent hover:border-black focus:outline-none focus-visible:border-black focus-visible:border-black"
    :style="`padding: ${py / 4}rem ${px / 4}rem;`"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
