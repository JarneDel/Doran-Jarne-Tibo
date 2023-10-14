<script lang="ts">
import { defineComponent, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { LucideX } from 'lucide-vue-next'

export default defineComponent({
  name: 'Modal',
  emits: ['close'],
  props: {
    title: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: 'max-w-2xl',
    },
  },
  components: {
    LucideX,
  },
  setup(_, ctx) {
    const target = ref(null)
    onClickOutside(target, e => {
      ctx.emit('close')
    })
    return {
      target,
    }
  },
})
</script>

<template>
  <div
    class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
  >
    <div
      ref="target"
      class="m-4 flex w-full flex-col overflow-y-auto rounded bg-white p-6 pt-4 shadow-lg"
      :class="maxWidth"
    >
      <div class="mb-1 flex flex-row items-center justify-between">
        <!--        <h2 class="text-2xl font-bold">{{ title }}</h2>-->
        <slot name="title"></slot>
        <button
          @click="$emit('close')"
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 self-end rounded-full p-2"
        >
          <LucideX />
        </button>
      </div>
      <main>
        <slot></slot>
      </main>
      <!--  Buttons    -->
      <div class="flex justify-between">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
