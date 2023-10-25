import { createRouter, createWebHistory } from 'vue-router'
import useFirebase from '@/composables/useFirebase.ts'
import useLastRoute from '@/composables/useLastRoute.ts'

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
      meta: {
        shouldBeAuthenticated: true,
      },
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
      }
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
  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    next('/login?redirect=' + to.path)
  } else if (to.meta.avoidAuth && firebaseUser.value) {
    next('/')
  } else if (to.path === '/logout') {
    logout().then(() => {
      next('/login')
    })
  } else {
    next()
  }
})

router.afterEach((to, from, failure) => {
  lastRoute.value = from.path
})
