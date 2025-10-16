import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

import Home from '../pages/Home.vue';
import About from '../pages/About.vue';

import Login from '../pages/auth/Login.vue';

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: Home
            },
            {
                path: '/about',
                name: 'about',
                component: About
            }
        ]
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

export default router;
