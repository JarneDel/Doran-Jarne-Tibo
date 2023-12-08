<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Logo from '@/components/generic/Logo.vue'
import {
  Bike,
  Box,
  CalendarClock,
  Contact2,
  Dumbbell,
  Icon,
  Palmtree,
  PanelLeftClose,
  PanelRightClose,
  Tractor,
  Users,
  Warehouse,
  Wrench,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useUser from '@/composables/useUser.ts'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import {
  VACATION_REQUESTED_COUNT,
  VACATION_REQUESTED_SUBSCRIPTION,
} from '@/graphql/vacation.request.query.ts'
import useA11y from '@/composables/useA11y.ts'
import { useWindowSize } from '@vueuse/core'
import { OnClickOutside } from '@vueuse/components'

interface page {
  name: string
  icon: Icon
  content: string
  route: string
  roles: string[]
  count?: number
}

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
    const { result, onResult } = useSubscription(
      VACATION_REQUESTED_SUBSCRIPTION,
    )
    const { customUser } = useUser()

    const { onResult: onInitialResult } = useQuery(VACATION_REQUESTED_COUNT, {
      fetchPolicy: 'cache-and-network',
    })

    const count = ref<number>(0)

    onInitialResult(param => {
      console.log('initial result', param)
      if (result.value?.vacationRequested.count) return
      count.value = param.data?.pendingVacationRequestsCount.count ?? 0
    })
    onResult(param => {
      console.log(param)
      count.value = param.data?.vacationRequested.count ?? 0
    })

    watch(count, () => {
      console.info(count.value, 'count')
    })

    const { sidebarIsOpen: isOpen } = useA11y()
    const { currentRoute } = useRouter()
    const role = computed(() => customUser.value?.role)
    const { t } = useI18n()
    const section = computed(() => currentRoute.value.path.split('/')[2])
    const pages = computed(() => {
      const p: page[] = [
        {
          name: 'groups',
          icon: Users,
          content: t('nav.groups'),
          route: '/admin/groups',
          roles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
        },
        {
          name: 'inventory',
          icon: Box,
          content: t('nav.inventory'),
          route: '/admin/inventory',
          roles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
        },
        {
          name: 'sport-equipment',
          icon: Dumbbell,
          content: t('nav.sportEquipment'),
          route: '/admin/sport-equipment',
          roles: ['ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'rooms',
          icon: Warehouse,
          content: t('nav.rooms'),
          route: '/admin/rooms',
          roles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
        },
        {
          name: 'reservations',
          icon: CalendarClock,
          content: t('nav.reservations'),
          route: '/admin/reservations',
          roles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
        },
        {
          name: 'repair-requests',
          icon: Wrench,
          content: t('nav.repairRequests'),
          route: '/admin/repair-requests',
          roles: ['ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'staff',
          icon: Contact2,
          content: t('nav.staff'),
          route: '/admin/staff',
          roles: ['ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'vacation',
          icon: Palmtree,
          content: t('nav.vacation'),
          route: '/admin/vacation',
          roles: ['ADMIN', 'SUPER_ADMIN'],
          count: count.value,
        },
        {
          name: 'sports',
          icon: Bike,
          content: t('nav.sports'),
          route: '/admin/sports',
          roles: ['ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'services',
          icon: Tractor,
          content: t('nav.services'),
          route: '/admin/services',
          roles: ['ADMIN', 'SUPER_ADMIN'],
        },
      ]
      return p.filter(page => {
        return page.roles.includes(role.value ?? '')
      })
    })

    const { width } = useWindowSize()
    const { MOBILE_VIEWPORT_SIZE } = useA11y()
    const isMobile = computed(() => width.value < MOBILE_VIEWPORT_SIZE.value)
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
  <OnClickOutside
    :options="{ ignore: ['.menu-button'] }"
    @trigger="clickOutside"
  >
    <div
      v-if="!isMobile || !isClosed"
      :class="{
        'min-w-54 w-1/6': !isClosed && !isMobile,
        'w-16': isClosed && !isMobile,
        'z-100 absolute left-0 top-0 w-3/5': isMobile,
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
</template>

<style scoped></style>
