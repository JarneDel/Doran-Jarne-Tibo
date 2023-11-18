<script lang="ts">
import { computed, defineComponent } from 'vue';
import Logo from '@/components/generic/Logo.vue';
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
} from 'lucide-vue-next';
import { useLocalStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useUser from '@/composables/useUser.ts'


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
  },
  setup() {
    const isClosed = useLocalStorage('isClosed', false);
    const { currentRoute } = useRouter();
    const { customUser } = useUser()
    const role = computed(() => customUser.value?.userByUid.role)
    const { t } = useI18n();
    const section = computed(() => currentRoute.value.path.split('/')[2]);
    const pages = computed(() => {
      return [
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
          roles: ['ADMIN', 'SUPER_ADMIN']
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
        },
      ].filter(page => {
        return page.roles.includes(role.value ?? "")
      })
    })

    return { isClosed, section, pages }
  },
})
</script>

<template>
  <div
    :class="{
      'w-1/6 min-w-54': !isClosed,
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
        class="px4 flex items-center gap-4 py-2"
      >
        <component :is="page.icon" />
        <h2 v-if="!isClosed" class="font-500">{{ page.content }}</h2>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
