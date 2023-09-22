<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StyledInternalLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
})
</script>

<template>
  <RouterLink
    :to="to"
    class="c-primary hover:c-primary-text focus:ring-primary-light focus:c-primary-dark active:c-primary-light rounded-sm underline transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  >
    <slot></slot>
  </RouterLink>
</template>

<style scoped></style>
