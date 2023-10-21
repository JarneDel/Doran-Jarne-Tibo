<script lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { defineComponent, PropType } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { LucideX } from 'lucide-vue-next'

export default defineComponent({
  name: 'OptionsModal',
  components: { StyledButton, LucideX },
  emits: ['update:showModal', 'button1Click', 'button2Click'],
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    button1: {
      type: Object as PropType<{
        text: string
        type: 'primary' | 'secondary' | 'danger' | 'gray'
      }>,
    },
    button2: {
      type: Object as PropType<{
        text: string
        type: 'primary' | 'secondary' | 'danger' | 'gray'
      }>,
    },
    focusButton: {
      type: Number,
      default: 1,
    },
  },
  setup: (props, ctx) => {
    onKeyStroke('Escape', () => {
      ctx.emit('update:showModal', false)
    })
  },
  watch: {
    showModal(open) {
      if (open) {
        this.$nextTick(() => {
          const focusButton = (
            this.focusButton === 2 ? this.$refs.button2 : this.$refs.button1
          ) as HTMLButtonElement | undefined
          if (focusButton) {
            focusButton.focus()
          }
        })
      }
    },
  },
})
</script>

<template>
  <teleport to="#app">
    <FocusTrap :active="showModal">
      <div ref="modal" tabindex="-1">
        <transition appear name="fade">
          <div
            v-if="showModal"
            class="fixed inset-0 z-40 cursor-pointer bg-black opacity-40"
            @click="$emit('update:showModal', false)"
          ></div>
        </transition>
        <transition appear name="pop">
          <div
            v-if="showModal"
            class="m-a fixed inset-0 z-50 h-fit w-fit max-w-sm transform-none rounded-lg bg-white p-6 shadow"
            role="dialog"
          >
            <div
              class="only-child:mla mb-4 flex flex-row items-center justify-between gap-4"
            >
              <h1 class="font-500 text-lg">{{ title }}</h1>
              <button @click="$emit('update:showModal', false)">
                <LucideX :size="20" />
              </button>
            </div>
            <div class="flex flex-row items-center justify-between gap-4">
              <StyledButton
                v-if="button1"
                ref="button1"
                :button-type="button1.type"
                :px="2"
                :py="1"
                @click="$emit('button1Click')"
              >
                {{ button1.text }}
              </StyledButton>
              <StyledButton
                v-if="button2"
                ref="button2"
                :button-type="button2.type"
                :px="2"
                :py="1"
                class="button"
                @click="$emit('button2Click')"
              >
                {{ button2.text }}
              </StyledButton>
            </div>
          </div>
        </transition>
      </div>
    </FocusTrap>
  </teleport>
</template>

<style scoped>
/* ---------------------------------- */
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
