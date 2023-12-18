<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ServicesSelect',
  props: {
    name: {
      type: String,
    },
    content: {
      type: Object as PropType<{ id: string; name: string }[]>,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
    emptyOption: {
      type: Object as PropType<
        | {
            value: string
            text: string
          }
        | false
      >,
    },
  },
  emits: ['change'],
})
</script>

<template>
  <select
    :id="id"
    :name="name"
    class="p1 b-2 hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark bg-primary-surface b-primary-light col-start-1 row-start-1 rounded px-4 py-1.5 outline-none transition-colors hover:bg-white focus:bg-white"
    @change="$emit('change', ($event.target as HTMLSelectElement).value)"
  >
    <option v-if="emptyOption" :value="emptyOption.value">
      {{ emptyOption.text }}
    </option>
    <option v-for="service of content" :key="service.id" :value="service.id">
      {{ service.name }}
    </option>
  </select>
</template>

<style scoped></style>
