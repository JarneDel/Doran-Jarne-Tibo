<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'StyledLable',
  props: {
    type: {
      type: String as PropType<'sport' | 'room' | 'material'>,
      default: 'sport',
    },
  },
})
</script>

<template>
  <p
    :class="{
      sport: type === 'sport',
      room: type === 'room',
      material: type === 'material',
    }"
    class="mt-1 rounded-full border-2 px-4 py-px"
  >
  <slot></slot>
  </p>
</template>

<style scoped>
.sport {
  @apply bg-sports border-sports bg-opacity-50 ;
}

.room {
  @apply bg-rooms border-rooms bg-opacity-50 ;
}

.material {
  @apply bg-materials border-materials bg-opacity-50 ;
}
</style>
