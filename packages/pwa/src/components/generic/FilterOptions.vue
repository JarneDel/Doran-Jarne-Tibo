<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'FilterOptions',
  props: {
    options: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['change'],
})
</script>

<template>
  <div>
    <button
      v-for="option of options"
      @click="$emit('change', option)"
      :key="option"
    >
      {{ $t('filter.' + option + '.label') }}
    </button>
  </div>
</template>

<style scoped></style>
