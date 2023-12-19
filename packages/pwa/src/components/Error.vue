<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { Bell } from 'lucide-vue-next'
import { usePreferredReducedMotion } from '@vueuse/core'

export default defineComponent({
  name: 'Error',
  components: { Bell },
  props: {
    msg: {
      default: 'Error',
      required: false,
    },
    translate: {
      type: Boolean,
      default: false,
      required: false,
    },
    duration: {
      type: Number,
      default: 5000,
      required: false,
    },
    isPermanent: {
      type: Boolean,
      default: false,
      required: false,
    },
    isShown: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isShown'],
  setup(props, ctx) {
    const prefersReducedMotion = usePreferredReducedMotion()
    const durationms = computed(() => {
      return props.duration + 'ms'
    })
    watch(
      () => props.isShown,
      val => {
        console.log(prefersReducedMotion)
        if (val && prefersReducedMotion.value == 'no-preference') {
          setTimeout(() => {
            ctx.emit('update:isShown', false)
          }, props.duration)
        }
      },
      { immediate: true },
    )

    return { durationms }
  },
})
</script>

<template>
  <teleport to="#error">
    <transition appear name="slide">
      <div v-show="isShown">
        <div
          class="moving-line relative mb-4 flex flex-row gap-2 rounded border-0 bg-red-500 px-6 py-4 text-white"
        >
          <Bell class="animate-bell"></Bell>
          <span v-if="translate" class="mr-8 inline-block align-middle">{{
            $t(msg)
          }}</span>
          <span v-else class="mr-8 inline-block align-middle">{{ msg }}</span>
          <button
            class="absolute right-0 top-0 mr-6 mt-4 bg-transparent text-2xl font-semibold leading-none"
            @click="$emit('update:isShown', false)"
          >
            <span>×</span>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.moving-line::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
  transform-origin: bottom left;
  animation: moving-line linear;
  animation-duration: v-bind(durationms);
}

.animate-bell {
  animation: animate-bell 500ms ease-in-out 2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.2s linear,
    opacity 0.2s linear;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes moving-line {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

@keyframes animate-bell {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }

  50% {
    transform: rotate(0deg);
  }

  75% {
    transform: rotate(-15deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }

  .moving-line::after {
    animation: none;
  }
  .animate-bell {
    animation: none;
  }
}
</style>
