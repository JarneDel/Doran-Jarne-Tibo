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
    max: {
      type: Number,
      required: false,
    },
    maxlength: {
      type: Number,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],

  computed: {
    inputLength(): number {
      const value = this.$props.modelValue as string
      try {
        return value.length
      } catch (e) {
        return 0
      }
    },
  },
})
</script>

<template>
  <label class="block">
    <span class="c-primary-text font-medium">{{ label }}</span>
    <br />
    <span class="flex items-center justify-center">
      <input
        :autocomplete="autocomplete"
        :disabled="disabled"
        :max="max"
        :maxlength="maxlength"
        :min="min"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :type="type"
        :value="modelValue"
        class="b-2 b-secondary-400 hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
        @input="
          e => $emit('update:modelValue', (e.target as HTMLInputElement).value)
        "
      />
      <span v-if="maxlength" class="relative -left-12 right-4 w-0 opacity-60">
        {{ inputLength }}/{{ maxlength ? maxlength : '∞' }}
      </span>
    </span>
  </label>
</template>

<style scoped></style>
