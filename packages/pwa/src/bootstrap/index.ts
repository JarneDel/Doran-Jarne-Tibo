import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'
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
      path: '/staff',
      component: () => import('@/components/wrapper/StaffWrapper.vue'),
      meta: {
        shouldBeAuthenticated: true,
        allowedRoles: ['STAFF', 'SUPER_ADMIN'],
      },
      children: [
        {
          path: '',
          component: () => import('@/views/staff/StaffOverview.vue'),
        },
        {
          path: 'request-vacation',
          component: () => import('@/views/staff/RequestVacation.vue'),
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
      },
    },
    {
      path: '/account',
      component: () => import('@/views/Account.vue'),
      meta: {
        shouldBeAuthenticated: true,
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
const unauthorized = (next: NavigationGuardNext) => {
  next('/403')
}

const logoutUser = (next: NavigationGuardNext) => {
  const { userLogout } = useUser()
  logout().then(() => {
    userLogout()
    next('/login')
  })
}

const isRoleAllowed = (role: string, allowedRoles: string[]) => {
  if (allowedRoles.length === 0) return true
  return allowedRoles.includes(role)
}


router.beforeEach((to, _, next) => {
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
      logoutUser(next)
      break
    // when route is not allowed for user role redirect to 403
    case customUser.value &&
      !isRoleAllowed(customUser.value.userByUid.role, allowedRoles):
      unauthorized(next)
      break
    default:
      next()
  }
})

router.afterEach((to, from) => {
  lastRoute.value = from.path
})
