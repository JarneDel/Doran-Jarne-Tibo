import { createRouter, createWebHistory } from 'vue-router'
import useFirebase from '@/composables/useFirebase.ts'
import useLastRoute from '@/composables/useLastRoute.ts'
import useUser from '@/composables/useUser'

const { firebaseUser, logout } = useFirebase()
const { lastRoute } = useLastRoute()

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/admin',
      component: () => import('@/components/wrapper/adminWrapper.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
      },
      children: [
        {
          path: 'groups',
          component: () => import('@/views/admin/Groups.vue'),
        },
        {
          path: 'inventory/new',
          component: () => import('@/views/admin/inventory/New.vue'),
        },

        {
          path: 'inventory',
          component: () => import('@/views/admin/inventory/Overview.vue'),
          children: [
            {
              path: 'edit',
              component: () =>
                import('@/views/admin/inventory/SelectEditItem.vue'),
            },
            {
              path: ':id',
              component: () => import('@/views/admin/inventory/Item.vue'),
            },

            {
              path: ':id/edit',
              component: () => import('@/views/admin/inventory/Edit.vue'),
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
        },
        {
          path: '/register',
          component: () => import('@/views/auth/Register.vue'),
        },
        {
          path: '/password-reset',
          component: () => import('@/views/auth/PasswordReset.vue'),
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
      },
    },
    {
      path: '/account',
      component: () => import('@/views/Account.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['GROUP', 'ADMIN', 'SUPER_ADMIN', 'STAFF'],
      },
    },
    {
      path: '/reservation',
      component: () => import('@/views/Reservation.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['GROUP'],
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, _, next) => {
  // get user from database
  const { customUser, userLogout } = useUser()
  // @ts-ignore
  const allowedRoles: string[] = to.meta.allowedRoles || []
  // when user is not logged in and route requires authentication redirect to login
  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    next('/login?redirect=' + to.path)
  } else if (to.meta.avoidAuth && firebaseUser.value) {
    // when user is logged in and route should be avoided redirect to home
    next('/')
  } else if (to.path === '/logout') {
    // logout user
    logout().then(() => {
      userLogout()
      next('/login')
    })
  } else if (to.path === '/' && firebaseUser.value && customUser.value) {
    if (
      ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(
        customUser.value?.userByUid.role,
        )
        ) {
          next('/admin')
        } else {
      next('/reservation')
    }
  } else if (
    customUser.value &&
    !allowedRoles.includes(customUser.value?.userByUid.role)
  ) {
    next('/profile')
  } else {
    next()
  }
})

router.afterEach((to, from, failure) => {
  lastRoute.value = from.path
})
