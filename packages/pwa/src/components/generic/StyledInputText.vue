<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StyledInputText',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
  },
})
</script>

<template>
  <label>
    <span>{{ label }}</span>
    <br />
    <input
      :type="type"
      class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark rounded bg-white px-4 py-1.5 outline-none transition-colors"
    />
  </label>
</template>

<style scoped></style>
