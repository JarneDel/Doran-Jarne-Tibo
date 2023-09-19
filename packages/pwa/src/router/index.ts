import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Temp.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
            component: () => import('@/views/NotFound.vue'),
        }
    ],
})

router.beforeEach((to, _, next) => {
    next()
})
