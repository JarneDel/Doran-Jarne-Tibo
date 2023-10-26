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

router.beforeEach((to, _, next) => {
  // get user from database
  const { customUser, userLogout } = useUser()
  const allowedRoles: string[] = (to.meta.allowedRoles as []) || []
  // console.log(to.meta.allowedRoles, customUser.value.userByUid.role)
  // console.log(to.meta.allowedRoles.includes(customUser.value.userByUid.role))
  // when user is not logged in and route requires authentication redirect to login
  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    next('/login?redirect=' + to.path)
    console.log('1')
  } else if (to.meta.avoidAuth && firebaseUser.value) {
    // when user is logged in and route should be avoided redirect to home
    console.log('2')
    next('/')
  } else if (to.path === '/logout') {
    // logout user
    console.log('3')
    logout().then(() => {
      userLogout()
      next('/login')
    })
  } else if (to.path === '/' && firebaseUser.value && customUser.value) {
    console.log('4')
    if (
      ['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(
        customUser.value?.userByUid.role,
      )
    ) {
      console.log('admin')
      next('/admin')
    } else {
      next('/profile')
    }
  } else if (
    customUser.value &&
    allowedRoles.includes(customUser.value?.userByUid.role)
  ) {
    console.log('5')
    next('/profile')
  } else {
    next()
  }
})

router.afterEach((to, from, failure) => {
  lastRoute.value = from.path
})
