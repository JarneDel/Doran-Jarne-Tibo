<script lang="ts">
import { defineComponent } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { OnClickOutside } from '@vueuse/components'
import { LucideX } from 'lucide-vue-next'

export default defineComponent({
  name: 'Modal',
  emits: ['close'],
  props: {
    maxWidth: {
      type: String,
      default: 'max-w-2xl',
    },
  },
  components: {
    LucideX,
    OnClickOutside,
  },
  setup(_, ctx) {
    onKeyStroke('Escape', () => {
      ctx.emit('close')
    })
  },
})
</script>

<template>
  <div
    class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
  >
    <on-click-outside @trigger="$emit('close')">
      <div
        ref="target"
        :class="maxWidth"
        class="m-4 flex w-full flex-col overflow-y-auto rounded bg-white p-6 pt-4 shadow-lg"
      >
        <div class="mb-1 flex flex-row items-center justify-between gap-4">
          <!--        <h2 class="text-2xl font-bold">{{ title }}</h2>-->
          <slot name="title"></slot>
          <button
            class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 self-end rounded-full p-2"
            @click="$emit('close')"
          >
            <LucideX :size="16" />
          </button>
        </div>
        <main class="my-2">
          <slot></slot>
        </main>
        <!--  Buttons    -->
        <div class="flex justify-between gap-4">
          <slot name="actions"></slot>
        </div>
      </div>
    </on-click-outside>
  </div>
</template>

<style scoped></style>
