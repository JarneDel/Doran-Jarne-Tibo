<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'StyledButton',
  props: {
    buttonType: {
      type: String as PropType<'primary' | 'secondary' | 'danger' | 'gray'>,
      default: 'secondary',
    },
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
    class="focus-visible-outline-none transition-color rounded border-2 border-transparent hover:border-black focus:outline-none focus-visible:border-black focus-visible:border-black"
    :class="{
      primary: buttonType === 'primary',
      secondary: buttonType === 'secondary',
      danger: buttonType === 'danger',
      gray: buttonType === 'gray',
    }"
    :style="`padding: ${py / 4}rem ${px / 4}rem;`"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.primary {
  @apply bg-primary active:bg-secondary-400;
}

.secondary {
  @apply bg-secondary active:bg-secondary-400;
}

.danger {
  @apply bg-danger active:bg-danger-active;
}

.gray {
  @apply bg-gray-2 active:bg-gray-1;
}
</style>
