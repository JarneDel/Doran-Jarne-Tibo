import { createRouter, createWebHistory } from 'vue-router'
import useFirebase from '@/composables/useFirebase.ts'

const { firebaseUser, logout } = useFirebase()

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/rooms',
      component: () => import('@/views/rooms/Wrapper.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/rooms/Rooms.vue'),
        },
        // {
        //   path: ':id',
        //   component: () => import('@/views/rooms/Room.vue'),
        // },
      ],
      meta: {
        shouldBeAuthenticated: true,
      },
    },
    {
      path: '/admin',
      component: () => import('@/components/wrapper/adminWrapper.vue'),
      children: [
        {
          path: 'groups',
          component: () => import('@/views/admin/Groups.vue'),
        },
        {
          path: 'inventory/new',
          component: () => import('@/views/administration/inventory/New.vue'),
        },

        {
          path: 'inventory',
          component: () =>
            import('@/views/administration/inventory/Overview.vue'),
          children: [
            {
              path: ':id',
              component: () =>
                import('@/views/administration/inventory/Item.vue'),
            },
            {
              path: ':id/edit',
              component: () =>
                import('@/views/administration/inventory/Edit.vue'),
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
  if (to.meta.shouldBeAuthenticated && !firebaseUser.value) {
    next('/login')
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
