import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../lib/supabaseClient';
import MainLayout from '../layouts/MainLayout.vue';

import Home from '../pages/Home.vue';

import TaskPage from '../pages/tasks/TaskPage.vue';
import TaskToday from '../pages/tasks/TaskToday.vue';
import TaskDetail from '../pages/tasks/TaskDetail.vue';

import Login from '../pages/auth/Login.vue';
import Profile from '../pages/auth/Profile.vue';

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: Home,
                meta: { requiresAuth: true }
            },
            {
                path: 'profile',
                name: 'profile',
                component: Profile,
                meta: { requiresAuth: true }
            }
        ]
    },
    {
        path: '/tasks',
        component: MainLayout,
        children: [
            { path: '', name: 'TaskPage', component: TaskPage, meta: { requiresAuth: true } },
            { path: 'today', name: 'TaskToday', component: TaskToday, meta: { requiresAuth: true } },
            { path: ':id', name: 'TaskDetail', component: TaskDetail, meta: { requiresAuth: true } },
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _from, next) => {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const isLoggedIn = !!session?.user

    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'login' })
    } else if (to.name === 'login' && isLoggedIn) {
        next({ name: 'home' })
    } else {
        next()
    }
})

export default router;
