import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

import Home from '../pages/Home.vue';

import TaskPage from '../pages/tasks/TaskPage.vue';
import TaskToday from '../pages/tasks/TaskToday.vue';
import TaskDetail from '../pages/tasks/TaskDetail.vue';

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
            }
        ]
    },
    {
        path: '/tasks',
        component: MainLayout,
        children: [
            { path: '', name: 'TaskPage', component: TaskPage },
            { path: 'today', name: 'TaskToday', component: TaskToday },
            { path: ':id', name: 'TaskDetail', component: TaskDetail },
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

export default router;
