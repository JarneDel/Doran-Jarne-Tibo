import { computed, ref } from 'vue'
import {
  Bike,
  Box,
  CalendarClock,
  Contact2,
  Dumbbell,
  Palmtree,
  Tractor,
  Users,
  Warehouse,
  Wrench,
} from 'lucide-vue-next'

import { i18n } from '@/bootstrap/i18n.ts'
import { AdminNavigationItem } from '@/interface/navigation.interface.ts'

const t = i18n.global.t

const pages = ref<AdminNavigationItem[]>([
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
    roles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
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
])

export default function useNavigation() {
  return {
    pages: pages,
    pagesAdmin: computed(() =>
      pages.value.filter(page => page.roles.includes('ADMIN')),
    ),
    pagesStaff: computed(() =>
      pages.value.filter(page => page.roles.includes('STAFF')),
    ),
    pagesSuperAdmin: computed(() =>
      pages.value.filter(page => page.roles.includes('SUPER_ADMIN')),
    ),
  }
}
