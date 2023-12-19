<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Bell } from 'lucide-vue-next'
import { useSubscription } from '@vue/apollo-composable'
import { VACATION_REQUESTED_SUBSCRIPTION } from '@/graphql/vacation.request.query.ts'
import { usePreferredReducedMotion } from '@vueuse/core'

interface notification {
  msg: string
  shown: boolean
  id: number
  cta: string
}

export default defineComponent({
  name: 'Notifications.vue',
  components: { Bell },
  setup() {
    const motionPreference = usePreferredReducedMotion()

    let currentId = 0
    const notifications = ref<notification[]>([])

    const addNotification = (msg: string, cta: string) => {
      const id = currentId++
      notifications.value.push({ msg, shown: true, id: currentId, cta: cta })
      if (motionPreference.value == 'reduce') return
      setTimeout(() => {
        notifications.value[id].shown = false
      }, 10000)
    }

    const { onResult: onNewVacationRequest } = useSubscription(
      VACATION_REQUESTED_SUBSCRIPTION,
    )
    onNewVacationRequest(param => {
      if (param.data?.vacationRequested.type !== 'new') return
      addNotification(
        'New vacation request from ' + param.data?.vacationRequested.fromName,
        '/admin/vacation/' + param.data?.vacationRequested.fromUid,
      )
    })

    return {
      notifications,
      addNotification,
    }
  },
})
</script>

<template>
  <template v-for="notification of notifications">
    <teleport to="#error">
      <transition appear name="slide">
        <div v-show="notification.shown">
          <RouterLink
            :to="notification.cta"
            class="moving-line bg-primary relative mb-4 flex flex-row gap-2 rounded border-0 px-6 py-4 text-white"
          >
            <Bell class="animate-bell"></Bell>
            <span class="mr-8 inline-block align-middle">{{
              notification.msg
            }}</span>
            <button
              class="absolute right-0 top-0 mr-6 mt-4 bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none"
              @click="notification.shown = false"
            >
              <span>×</span>
            </button>
          </RouterLink>
        </div>
      </transition>
    </teleport>
  </template>
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
  animation-duration: 10s;
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
