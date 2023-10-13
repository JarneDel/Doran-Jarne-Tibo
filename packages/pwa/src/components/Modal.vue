<script lang="ts">
import { defineComponent, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:show'],
  setup(props, ctx) {
    const target = ref(null)
    onClickOutside(target, e => {
      console.log('click outside')
      ctx.emit('update:show', false)
    })
    return {
      target,
    }
  },
})
</script>

<template>
  <div
    v-if="show"
    class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
  >
    <div
      ref="target"
      class="m-4 flex w-full max-w-2xl flex-col overflow-y-auto rounded bg-white p-6 shadow"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
