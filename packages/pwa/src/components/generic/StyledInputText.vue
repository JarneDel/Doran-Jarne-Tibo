<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StyledInputText',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
})
</script>

<template>
  <label>
    <span class="c-primary-text font-medium">{{ label }}</span>
    <br />
    <input
      @input="
        e => $emit('update:modelValue', (e.target as HTMLInputElement).value)
      "
      :value="modelValue"
      :type="type"
      class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark rounded bg-white px-4 py-1.5 outline-none transition-colors"
    />
  </label>
</template>

<style scoped></style>
