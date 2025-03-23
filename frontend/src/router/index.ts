import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MainLayout from '@/layouts/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('@/views/tasks/TaskList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'tasks/create',
          name: 'taskCreate',
          component: () => import('@/views/task/TaskFormView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'tasks/:id/edit',
          name: 'taskEdit',
          component: () => import('@/views/task/TaskFormView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'tasks/:id',
          name: 'taskDetail',
          component: () => import('@/views/tasks/TaskDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('@/views/admin/AdminLayout.vue'),
          meta: { requiresAuth: true },
          children: [
            {
              path: 'users',
              name: 'userManagement',
              component: () => import('@/views/admin/UserManagement.vue'),
              meta: { requiresAuth: true, permission: 'system:user:view' }
            },
            {
              path: 'roles',
              name: 'roleManagement',
              component: () => import('@/views/admin/RoleManagement.vue'),
              meta: { requiresAuth: true, permission: 'system:role:view' }
            },
            {
              path: 'permissions',
              name: 'permissionManagement',
              component: () => import('@/views/admin/PermissionManagement.vue'),
              meta: { requiresAuth: true, permission: 'system:permission:view' }
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredPermission = to.meta.permission as string;

  if (requiresAuth && !authStore.token) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (requiredPermission && !(await authStore.hasPermission(requiredPermission))) {
    next('/');
  } else {
    next();
  }
});

export default router; 