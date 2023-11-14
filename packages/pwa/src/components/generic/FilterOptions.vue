<script lang="ts">
import { Component, defineComponent, PropType } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  name: 'FilterOptions',
  components: { StyledButton },
  props: {
    options: {
      type: Array as PropType<string[]>,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: Math.random().toString(),
    },
    icons: {
      type: Object as PropType<Component[]>,
      required: false,
    },
  },
  emits: ['update:modelValue'],
})
</script>

<template>
  <div class="flex flex-row items-center">
    <label
      v-for="(option, index) in options"
      :key="option"
      :class="{
        active: modelValue === option,
        inactive: modelValue !== option,
      }"
      class="btn p2 focus-visible-outline-none transition-color flex w-min items-center border-2 border-transparent hover:border-black focus:outline-none focus-visible:border-black focus-visible:border-black"
    >
      <component :is="icons[index]" v-if="icons" :size="20" class="mr-2" />
      {{ $t('filter.' + option + '.label') }}

      <input
        :checked="modelValue === option"
        :name="name"
        class="sr-only"
        type="radio"
        @change="$emit('update:modelValue', option)"
      />
    </label>
  </div>
</template>

<style scoped>
.btn:first-child {
  @apply rounded-l;
}

.btn:last-child {
  @apply rounded-r;
}

.active:focus-within {
  @apply b-black;
}

.active {
  @apply bg-secondary active:bg-secondary-400;
}

.inactive {
  @apply bg-gray-2 active:bg-gray-1;
}
</style>
