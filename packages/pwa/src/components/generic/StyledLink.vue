<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'StyledLink',
  props: {
    to: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<'internal' | 'external'>,
      default: 'internal',
    },
  },
})
</script>

<template>
  <RouterLink
    v-if="type === 'internal'"
    :to="to"
    class="c-primary hover:c-primary-text focus:ring-primary-light focus:c-primary-dark active:c-primary-light rounded-sm underline focus:outline-none focus:ring-2 focus:ring-offset-2 motion-safe:transition-colors"
  >
    <slot></slot>
  </RouterLink>
  <a
    v-if="type === 'external'"
    :href="to"
    class="c-primary hover:c-primary-text focus:ring-primary-light focus:c-primary-dark active:c-primary-light rounded-sm underline focus:outline-none focus:ring-2 focus:ring-offset-2 motion-safe:transition-colors"
  >
    <slot></slot>
  </a>
</template>

<style scoped></style>
