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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
})
</script>

<template>
  <button
    :class="{
      primary: buttonType === 'primary',
      secondary: buttonType === 'secondary',
      danger: buttonType === 'danger',
      gray: buttonType === 'gray',
    }"
    :disabled="disabled"
    :style="`padding: ${py / 4}rem ${px / 4}rem;`"
    :type="type"
    class="focus-visible-outline-none transition-color rounded border-2 border-transparent hover:border-black focus:outline-none focus-visible:border-black"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.primary {
  @apply bg-primary active:bg-primary-400 c-white;
}

.secondary {
  @apply bg-secondary active:bg-secondary-400;
}

.danger {
  @apply bg-danger active:bg-danger-active c-white;
}

.gray {
  @apply bg-gray-2 active:bg-gray-1;
}

button:disabled {
  @apply bg-gray-2 active:bg-gray-1 hover:b-transparent;
}
</style>
