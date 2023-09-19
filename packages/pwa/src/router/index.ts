import {createRouter, createWebHistory} from 'vue-router'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Home.vue'),
        },
        {
            path: "/shop",
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
                }
            ]
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
                    path: "inventory",
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/administration/inventory/Inventory.vue'),
                        },
                    ]
                }
            ]
        },
        {
            path: '/login',
            component: () => import('@/views/auth/Login.vue'),
        },
        {
            path: '/register',
            component: () => import('@/views/auth/Register.vue'),
        },
        {
            path: "/password-reset",
            component: () => import('@/views/auth/PasswordReset.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/NotFound.vue'),
        },
    ],
})

router.beforeEach((to, _, next) => {
    next()
})
