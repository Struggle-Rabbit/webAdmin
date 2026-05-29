import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', ignoreAuth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/RegisterView.vue'),
    meta: { title: '注册', ignoreAuth: true },
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403', ignoreAuth: true },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', ignoreAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '仪表盘', icon: 'Odometer', affix: true },
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'roles',
        name: 'RoleList',
        component: () => import('@/views/role/RoleList.vue'),
        meta: { title: '角色管理', icon: 'Avatar' },
      },
      {
        path: 'menus',
        name: 'MenuView',
        component: () => import('@/views/menu/MenuView.vue'),
        meta: { title: '菜单管理', icon: 'Menu' },
      },
      {
        path: 'logs',
        name: 'LogView',
        component: () => import('@/views/log/LogView.vue'),
        meta: { title: '系统日志', icon: 'Document' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/user/ProfileView.vue'),
        meta: { title: '个人中心', icon: 'UserFilled', hidden: true },
      },
    ],
  },
]
