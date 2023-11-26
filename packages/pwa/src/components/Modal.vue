<script lang="ts">
import { defineComponent } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { OnClickOutside } from '@vueuse/components'
import { LucideX } from 'lucide-vue-next'
import { FocusTrap } from 'focus-trap-vue'

export default defineComponent({
  name: 'Modal',
  emits: ['close'],
  props: {
    maxWidth: {
      type: String,
      default: 'max-w-2xl',
    },
    minWidth: {
      type: String,
      default: 'min-w-0',
    },
  },
  components: {
    FocusTrap,
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
  <teleport to="#app">
    <div class="modal"></div>
    <transition appear name="fade">
      <div
        class="fixed inset-0 z-40 cursor-pointer bg-black opacity-40"
        @click="$emit('close')"
      ></div>
    </transition>
    <transition appear name="pop">
      <FocusTrap :active="true">
        <div
          ref="target"
          :class="[maxWidth, minWidth]"
          class="m-a fixed inset-0 z-50 h-fit w-fit max-w-lg transform-none rounded-lg bg-white p-6 shadow"
        >
          <div class="mb-1 flex flex-row items-baseline justify-between">
            <!--        <h2 class="text-2xl font-bold">{{ title }}</h2>-->
            <slot name="title"></slot>
            <button
              class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 self-end rounded-full p-2"
              @click="$emit('close')"
            >
              <LucideX :size="20" />
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
      </FocusTrap>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.2s cubic-bezier(0.5, 0, 0.5, 1),
    opacity 0.2s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3);
}
</style>
