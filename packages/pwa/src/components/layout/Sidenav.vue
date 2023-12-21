<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Logo from '@/components/generic/Logo.vue'
import {
  Bike,
  Box,
  CalendarClock,
  Contact2,
  Dumbbell,
  Palmtree,
  PanelLeftClose,
  PanelRightClose,
  Tractor,
  Users,
  Warehouse,
  Wrench,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import useUser from '@/composables/useUser.ts'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import {
  VACATION_REQUESTED_COUNT,
  VACATION_REQUESTED_SUBSCRIPTION,
} from '@/graphql/vacation.request.query.ts'
import useA11y from '@/composables/useA11y.ts'
import { useWindowSize } from '@vueuse/core'
import { OnClickOutside } from '@vueuse/components'
import useNavigation from '@/composables/useNavigation.ts'

export default defineComponent({
  name: 'Sidenav',
  components: {
    Logo,
    Users,
    Box,
    Warehouse,
    PanelLeftClose,
    PanelRightClose,
    CalendarClock,
    Contact2,
    Palmtree,
    Wrench,
    Dumbbell,
    Bike,
    Tractor,
    OnClickOutside,
  },
  setup() {
    const pendingVacationRequestsCount = ref<number>(0)

    const { customUser } = useUser()
    const role = computed(() => customUser.value?.role)

    const { currentRoute } = useRouter()
    const section = computed(() => currentRoute.value.path.split('/')[2])

    const { sidebarIsOpen: isOpen, MOBILE_VIEWPORT_SIZE } = useA11y()
    const isMobile = computed(() => width.value < MOBILE_VIEWPORT_SIZE.value)
    const { width } = useWindowSize()

    const { pages: allPages } = useNavigation()
    const pages = computed(() => {
      return allPages.value
        .map(page => {
          if (page.name === 'vacation') {
            return { ...page, count: pendingVacationRequestsCount.value }
          }
          return page
        })
        .filter(page => page.roles.includes(role.value ?? ''))
    })
    // handle subscription and query
    const { result, onResult } = useSubscription(
      VACATION_REQUESTED_SUBSCRIPTION,
    )
    const { onResult: onInitialResult } = useQuery(VACATION_REQUESTED_COUNT, {
      fetchPolicy: 'cache-and-network',
    })

    onInitialResult(param => {
      console.log('initial result', param)
      if (result.value?.vacationRequested.count) return
      pendingVacationRequestsCount.value =
        param.data?.pendingVacationRequestsCount.count ?? 0
    })

    onResult(param => {
      console.log(param)
      pendingVacationRequestsCount.value =
        param.data?.vacationRequested.count ?? 0
    })

    // handle click outside
    const clickOutside = () => {
      console.log('click outside')
      if (isMobile.value) isOpen.value = true
    }

    return {
      isClosed: isOpen,
      section,
      pages,
      width,
      MOBILE_VIEWPORT_SIZE,
      isMobile,
      clickOutside,
    }
  },
})
</script>

<template>
  <nav class="bg-white">
    <OnClickOutside
      :options="{ ignore: ['.menu-button'] }"
      class="h-full"
      @trigger="clickOutside"
    >
      <div
        v-if="!isMobile || !isClosed"
        :class="{
          'min-w-54 w-full': !isClosed && !isMobile,
          'w-16': isClosed && !isMobile,
          'z-100 absolute left-0 top-0 w-full': isMobile,
        }"
        class="min-h-full overflow-hidden bg-white"
      >
        <div class="mt-4 grid">
          <button
            v-if="!isMobile"
            class="flex items-center gap-4 px-4 py-2"
            @click="isClosed = !isClosed"
          >
            <panel-left-close v-if="!isClosed" />
            <panel-right-close v-else />
          </button>

          <RouterLink
            v-for="page of pages"
            :key="page.name"
            :class="{
              'bg-primary-light/40': section === page.name,
              'rounded-r-md': section === page.name,
            }"
            :to="page.route"
            class="px4 relative flex items-center gap-4 py-2"
            @click="
              () => {
                if (isMobile) isClosed = true
              }
            "
          >
            <component :is="page.icon" />
            <h2 v-if="!isClosed" class="font-500">{{ page.content }}</h2>
            <div
              v-if="page.count"
              :class="{
                'bg-danger c-white h4 absolute bottom-0 right-2 flex w-4 items-center justify-center rounded':
                  isClosed,
              }"
            >
              {{ page.count }}
            </div>
          </RouterLink>
        </div>
      </div>
    </OnClickOutside>
  </nav>
</template>

<style scoped></style>
