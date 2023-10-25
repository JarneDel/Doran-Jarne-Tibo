<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StyledInputText',
  props: {
    modelValue: {},
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    required: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    min: {
      type: Number,
      required: false,
    },
  },
  emits: ['update:modelValue'],
})
</script>

<template>
  <label class="block">
    <span class="c-primary-text font-medium">{{ label }}</span>
    <br />
    <input
      :autocomplete="autocomplete"
      :min="min"
      :name="name"
      :required="required"
      :type="type"
      :value="modelValue"
      class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
      @input="
        e => $emit('update:modelValue', (e.target as HTMLInputElement).value)
      "
    />
  </label>
</template>

<style scoped></style>
