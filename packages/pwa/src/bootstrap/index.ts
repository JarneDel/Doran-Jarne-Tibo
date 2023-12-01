import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'
import useFirebase from '@/composables/useFirebase.ts'
import useLastRoute from '@/composables/useLastRoute.ts'
import useUser from '@/composables/useUser'
import { nextTick } from 'vue'

const { firebaseUser, logout } = useFirebase()
const { lastRoute } = useLastRoute()
export const SITE_NAME = 'Sport complex'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: SITE_NAME + ' - Home',
      },
    },
    {
      path: '/staff-register/:id',
      component: () => import('@/views/auth/StaffRegister.vue'),
      meta: {
        title: SITE_NAME + ' - Register',
      },
    },
    {
      path: '/staff-register/logged-in',
      component: () => import('@/views/auth/StaffRegisterLoggedIn.vue'),
      meta: {
        title: SITE_NAME + ' - Already registered',
      },
    },
    {
      path: '/repair',
      component: () => import('@/views/CreateRepairRequest.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/components/wrapper/adminWrapper.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
        title: SITE_NAME + ' - Admin',
      },
      children: [
        {
          path: 'groups',
          component: () => import('@/views/admin/Groups.vue'),
          meta: {
            title: SITE_NAME + ' - Groups',
          },
        },
        {
          path: 'inventory/new',
          component: () => import('@/views/admin/inventory/New.vue'),
          meta: {
            title: 'Create new item | ' + SITE_NAME,
          },
        },
        {
          path: 'inventory',
          component: () => import('@/views/admin/inventory/Overview.vue'),
          meta: {
            title: SITE_NAME + ' - Inventory',
          },
          children: [
            {
              // title only for static pages
              path: ':id',
              component: () => import('@/views/admin/inventory/Item.vue'),
            },
            {
              path: ':id/edit',
              component: () => import('@/views/admin/inventory/Edit.vue'),
            },
          ],
        },
        {
          path: 'rooms',
          component: () => import('@/views/admin/rooms/Ro' + 'oms.vue'),
          children: [
            {
              path: 'id/:id',
              component: () => import('@/views/admin/rooms/Item.vue'),
              props: true,
            },
            {
              path: 'id/:id/edit',
              component: () => import('@/views/admin/rooms/Edit.vue'),
            },
            {
              path: 'create',
              component: () => import('@/views/admin/rooms/Create.vue'),
            },
          ],
          meta: {
            shouldBeAuthenticated: true,
            title: SITE_NAME + ' - Rooms',
          },
        },
        {
          path: 'rooms/type/:type',
          component: () => import('@/views/admin/rooms/Rooms.vue'),
          props: true,
          meta: {
            shouldBeAuthenticated: true,
            title: SITE_NAME + ' - Rooms',
          },
        },
        {
          path: 'rooms/create/type/:type',
          component: () => import('@/views/admin/rooms/Create.vue'),
          meta: {
            shouldBeAuthenticated: true,
            title: SITE_NAME + ' - Rooms',
          },
        },
        {
          path: 'reservations',
          component: () =>
            import('@/views/admin/reservations/Reservations.vue'),
          children: [
            {
              path: 'id/:id',
              component: () => import('@/views/admin/reservations/Item.vue'),
              props: true,
            },
          ],
          meta: {
            shouldBeAuthenticated: true,
            title: SITE_NAME + ' - Reservations',
          },
        },
        {
          path: 'reservations/type/:type',
          component: () =>
            import('@/views/admin/reservations/Reservations.vue'),
          props: true,
          meta: {
            shouldBeAuthenticated: true,
            title: SITE_NAME + ' - Reservations',
          },
        },
        {
          path: 'repair-requests',
          component: () =>
            import('@/views/admin/repairRequests/RepairRequests.vue'),
          children: [
            {
              path: 'id/:id',
              component: () => import('@/views/admin/repairRequests/Item.vue'),
              props: true,
            },
            {
              path: 'id/:id/edit',
              component: () => import('@/views/admin/repairRequests/Edit.vue'),
            },
          ],
          meta: {
            shouldBeAuthenticated: true,
          },
        },
        {
          path: 'sport-equipment',
          component: () =>
            import('@/views/admin/sportEquipment/SportEquipment.vue'),
          children: [
            {
              path: 'id/:id',
              component: () => import('@/views/admin/sportEquipment/Item.vue'),
              props: true,
            },
            {
              path: 'id/:id/edit',
              component: () => import('@/views/admin/sportEquipment/Edit.vue'),
            },
          ],
          meta: {
            shouldBeAuthenticated: true,
          },
        },
        {
          path: 'sport-equipment/create',
          component: () => import('@/views/admin/sportEquipment/Create.vue'),
          meta: {
            shouldBeAuthenticated: true,
          },
        },
        {
          path: 'sports',
          component: () => import('@/views/admin/sports/Sports.vue'),
          children: [
            {
              path: 'id/:id',
              component: () => import('@/views/admin/sports/Item.vue'),
              props: true,
            },
            {
              path: 'id/:id/edit',
              component: () => import('@/views/admin/sports/Edit.vue'),
            },
          ],
          meta: {
            shouldBeAuthenticated: true,
          },
        },
        {
          path: 'sports/create',
          component: () => import('@/views/admin/sports/Create.vue'),
          meta: {
            shouldBeAuthenticated: true,
          },
        },
        {
          path: 'staff',
          component: () => import('@/views/admin/staff/Staff.vue'),
          meta: {
            title: SITE_NAME + ' - Staff',
            allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
          },
        },
        {
          path: 'vacation',
          component: () =>
            import('@/views/admin/vacation/VacationOverview.vue'),
          meta: {
            allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
            title: SITE_NAME + ' - Vacation Requests',
          },
        },
        {
          path: 'vacation/:uid',
          component: () =>
            import('@/views/admin/vacation/VacationOverview.vue'),
          meta: {
            allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
            title: SITE_NAME + ' - Vacation Requests',
          },
        },
        {
          path: '403',
          component: () => import('@/views/403.vue'),
          meta: {
            title: "403: You don't have permission to access this page.",
          },
        },
        {
          path: ':pathMatch(.*)*',
          component: () => import('@/views/NotFound.vue'),
        },
      ],
    },
    {
      path: '/staff',
      component: () => import('@/components/wrapper/StaffWrapper.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['STAFF'],
        title: 'Staff Home | ' + SITE_NAME,
      },
      children: [
        {
          path: '',
          component: () => import('@/views/staff/StaffOverview.vue'),
          children: [
            {
              path: 'request-vacation',
              component: () => import('@/views/staff/RequestVacation.vue'),
              meta: {
                title: 'Request Vacation | ' + SITE_NAME,
              },
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/views/auth/Wrapper.vue'),
      children: [
        {
          path: '/login',
          component: () => import('@/views/auth/Login.vue'),
          meta: {
            title: 'Login | ' + SITE_NAME,
          },
        },
        {
          path: '/register',
          component: () => import('@/views/auth/Register.vue'),
          meta: {
            title: 'Register | ' + SITE_NAME,
          },
        },
        {
          path: '/password-reset',
          component: () => import('@/views/auth/PasswordReset.vue'),
          meta: {
            title: 'Password Reset | ' + SITE_NAME,
          },
        },
      ],
      meta: {
        avoidAuth: true,
      },
    },
    {
      path: '/profile',
      component: () => import('@/views/Profile.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['GROUP', 'ADMIN', 'SUPER_ADMIN', 'STAFF'],
        title: 'Profile | ' + SITE_NAME,
      },
    },
    {
      path: '/account',
      component: () => import('@/views/Account.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['GROUP', 'ADMIN', 'SUPER_ADMIN', 'STAFF'],
        title: 'Account | ' + SITE_NAME,
      },
    },
    {
      path: '/reservation',
      component: () => import('@/components/wrapper/reservationWrapper.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/reservations/Reservation.vue'),
        },
        {
          path: 'add',
          component: () => import('@/views/reservations/AddReservation.vue'),
        },
        {
          path: 'edit/:id',
          component: () => import('@/views/reservations/ChangeReservation.vue'),
        },
      ],
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['GROUP'],
        title: 'Reservation | ' + SITE_NAME,
      },
    },
    {
      path: '/403',
      component: () => import('@/views/403.vue'),
      meta: {
        title: "403: You don't have permission to access this page.",
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

const redirectToLogin = (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  next('/login?redirect=' + to.path)
}
const redirectToHome = (next: NavigationGuardNext) => {
  const { customUser } = useUser()
  if (!customUser.value) {
    next('/login')
    return
  }
  if (['ADMIN', 'SUPER_ADMIN'].includes(customUser.value.userByUid.role)) {
    next('/admin')
    return
  }
  if (customUser.value.userByUid.role === 'STAFF') {
    next('/staff')
    return
  }
  // Todo: redirect to group page
  next('/profile')
}
const unauthorized = (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (to.path.includes('/admin')) {
    next('/admin/403')
    return
  }
  next('/403')
}

const logoutUser = (
  from: RouteLocationNormalized,
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { userLogout } = useUser()
  console.log(from.query)
  const redirect = to.query.redirect as string | undefined
  logout().then(() => {
    userLogout()
    if (redirect) {
      next(redirect)
      return
    }
    next('/login')
  })
}

const isRoleAllowed = (role: string, allowedRoles: string[]) => {
  if (allowedRoles.length === 0) return true
  return allowedRoles.includes(role)
}

const setPageTitle = (to: RouteLocationNormalized) => {
  // check if page is static
  nextTick(() => {
    document.title = (to.meta.title as string) || SITE_NAME
  })
}

router.beforeEach((to, from, next) => {
  console.debug('Meta', to.meta)
  setPageTitle(to)
  // get user from database
  const { customUser } = useUser()
  // @ts-ignore
  const allowedRoles: string[] = to.meta.allowedRoles || []
  // when user is not logged in and route requires authentication redirect to login
  switch (true) {
    case to.meta.shouldBeAuthenticated && !firebaseUser.value:
      redirectToLogin(to, next)
      break
    // when user is logged in and route should be avoided redirect to home
    case to.meta.avoidAuth && firebaseUser.value:
      redirectToHome(next)
      break
    // logout user
    case to.path === '/logout':
      logoutUser(from, to, next)
      break
    // when route is not allowed for user role redirect to 403
    case customUser.value &&
      !isRoleAllowed(customUser.value.userByUid.role, allowedRoles):
      unauthorized(to, next)
      break
    default:
      next()
  }
})

router.afterEach((to, from) => {
  lastRoute.value = from.path
})
