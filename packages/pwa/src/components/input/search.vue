<script lang="ts">
import { defineComponent } from 'vue'
import { LucideSearch } from 'lucide-vue-next'

export default defineComponent({
  name: 'search',
  components: { LucideSearch },
  emits: ['input'],
  props: {
    placeholder: {
      type: String,
      default: 'Search',
    },
  },
})
</script>

<template>
  <label class="grid grid-cols-1 grid-rows-1">
    <input
      :placeholder="placeholder"
      class="p1 b-2 hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark bg-primary-surface b-primary-light col-start-1 row-start-1 w-full rounded px-4 py-1.5 outline-none transition-colors hover:bg-white focus:bg-white"
      type="text"
      @input.capture="$emit('input', ($event.target as HTMLInputElement).value)"
    />
    <LucideSearch class="m2 col-start-1 row-start-1 mx-3 justify-self-end" />
  </label>
</template>
