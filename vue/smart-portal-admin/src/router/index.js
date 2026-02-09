import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Content from '../pages/Content.vue'
import Users from '../pages/Users.vue'
import Permissions from '../pages/Permissions.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/content',
    name: 'Content',
    component: Content
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/permissions',
    name: 'Permissions',
    component: Permissions
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
