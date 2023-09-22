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
    // todo: remove this route
    {
      path: '/test',
      component: () => import('@/views/Temp.vue'),
    },
    {
      path: '/shop',
      component: () => import('@/views/Shop.vue'),
    },
    {
      path: '/rooms',
      component: () => import('@/views/rooms/Wrapper.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/rooms/Rooms.vue'),
        },
        {
          path: ':id',
          component: () => import('@/views/rooms/Room.vue'),
        },
      ],
      meta: {
        shouldBeAuthenticated: true,
      },
    },
    {
      path: '/administration',
      component: () => import('@/views/administration/Wrapper.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/administration/Administration.vue'),
        },
        {
          path: 'inventory',
          children: [
            {
              path: '',
              component: () =>
                import('@/views/administration/inventory/Inventory.vue'),
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
