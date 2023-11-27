<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Logo from '@/components/generic/Logo.vue'
import {
  Box,
  CalendarClock,
  Contact2,
  Palmtree,
  PanelLeftClose,
  PanelRightClose,
  Users,
  Warehouse,
  Wrench,
  Dumbbell,
  Icon,
} from 'lucide-vue-next'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useUser from '@/composables/useUser.ts'
import { useQuery, useSubscription } from '@vue/apollo-composable'
import {
  IVacationRequestedCount,
  IVacationRequestedSubscription,
  VACATION_REQUESTED_COUNT,
  VACATION_REQUESTED_SUBSCRIPTION,
} from '@/graphql/vacation.request.query.ts'
// import { useSubscription } from '@vue/apollo-composable'
// import {
//   IVacationRequestedSubscription,
//   VACATION_REQUESTED_SUBSCRIPTION,
// } from '@/graphql/vacation.request.query.ts'

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
  },
  setup() {
    const { onResult } = useSubscription<IVacationRequestedSubscription>(
      VACATION_REQUESTED_SUBSCRIPTION,
    )
    const { onResult: onInitialResult } = useQuery<IVacationRequestedCount>(
      VACATION_REQUESTED_COUNT,
    )
    const count = ref<Number>(0)

    onInitialResult(param => {
      count.value = param.data?.pendingVacationRequestsCount.count ?? 0
    })
    onResult(param => {
      console.log(param)
      count.value = param.data?.vacationRequested.count ?? 0
    })

    const isClosed = useLocalStorage('isClosed', false)
    const { currentRoute } = useRouter()
    const { customUser } = useUser()
    const role = computed(() => customUser.value?.userByUid.role)
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
      ]
      return p.filter(page => {
        return page.roles.includes(role.value ?? '')
      })
    })

    return { isClosed, section, pages }
  },
})
</script>

<template>
  <div
    :class="{
      'min-w-54 w-1/6': !isClosed,
      'w-16': isClosed,
    }"
    class="min-h-full overflow-hidden bg-white transition-all duration-200"
  >
    <div class="mt-4 grid">
      <button
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
</template>

<style scoped></style>
