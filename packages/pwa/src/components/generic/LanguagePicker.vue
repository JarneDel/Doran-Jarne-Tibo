<script lang="ts" setup>
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n.ts'
import useLanguage from '@/composables/useLanguage.ts'
import { Check } from 'lucide-vue-next'
import { PropType } from 'vue'

defineEmits(['update:isOpen'])
defineProps({
  isOpen: {},
  ignoreClassList: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
})

const { setLocale, locale: currentLocale } = useLanguage()
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="z-99 min-w-50 -right-13 absolute top-16">
      <div class="relative">
        <div class="triangle"></div>
        <ul class="rounded bg-white py-2 shadow-lg">
          <li
            v-for="(locale, key) of SUPPORTED_LOCALES"
            :key="key"
            class="flex h-10 w-full items-center justify-between gap-2 px-5"
          >
            <button
              :class="{
                'c-primary': key === currentLocale,
                'hover:c-black c-neutral-5 ': key !== currentLocale,
              }"
              class="flex w-full items-center justify-between gap-2 motion-safe:transition-colors"
              @click="
                () => {
                  setLocale(key)
                  $emit('update:isOpen', false)
                }
              "
            >
              <span>
                {{ locale }}
              </span>
              <Check v-if="key === currentLocale" class="ml-2 inline-block" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.triangle {
  position: absolute;
  top: -10px;
  right: calc(50% - 10px);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
