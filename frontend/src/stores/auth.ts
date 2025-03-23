import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import request from '@/utils/axios';
import type { User, LoginCredentials, RegisterData } from '@/store/types';
import { Role, Permission } from '../types/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);
  const permissions = ref<Set<string>>(new Set());
  const roles = ref<Set<string>>(new Set());

  // 从用户数据中提取权限和角色
  const extractPermissionsAndRoles = (userData: User) => {
    const newPermissions = new Set<string>();
    const newRoles = new Set<string>();

    if (userData.roles) {
      userData.roles.forEach(role => {
        newRoles.add(role.name);
        if (role.permissions) {
          role.permissions.forEach(permission => {
            newPermissions.add(permission.name);
          });
        }
      });
    }

    permissions.value = newPermissions;
    roles.value = newRoles;
  };

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const response = await request.post('/api/auth/login', {
        email,
        password
      });

      const { token: newToken, user: userData } = response;
      token.value = newToken;
      user.value = userData;
      localStorage.setItem('token', newToken);
      extractPermissionsAndRoles(userData);

      return true;
    } catch (error: any) {
      console.error('登录失败:', error.message);
      throw error;
    }
  };

  // 注册
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await request.post('/api/auth/register', {
        username,
        email,
        password
      });
      return true;
    } catch (error: any) {
      console.error('注册失败:', error.message);
      throw error;
    }
  };

  // 登出
  const logout = () => {
    token.value = null;
    user.value = null;
    permissions.value.clear();
    roles.value.clear();
    localStorage.removeItem('token');
  };

  // 检查是否有指定权限
  const hasPermission = (permission: string) => {
    return permissions.value.has(permission);
  };

  // 检查是否有指定角色
  const hasRole = (role: string) => {
    return roles.value.has(role);
  };

  // 检查是否有任意一个指定角色
  const hasAnyRole = (roleList: string[]) => {
    return roleList.some(role => roles.value.has(role));
  };

  // 检查是否有所有指定角色
  const hasAllRoles = (roleList: string[]) => {
    return roleList.every(role => roles.value.has(role));
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return;

    try {
      const response = await request.get('/api/auth/me');
      user.value = response;
      extractPermissionsAndRoles(response);
    } catch (error: any) {
      console.error('获取用户信息失败:', error.message);
      logout();
      throw error;
    }
  };

  // 计算属性：是否已登录
  const isAuthenticated = computed(() => !!token.value);

  // 计算属性：是否是管理员
  const isAdmin = computed(() => hasRole('admin'));

  // 计算属性：是否是教师
  const isTeacher = computed(() => hasRole('teacher'));

  // 计算属性：是否是学生
  const isStudent = computed(() => hasRole('student'));

  return {
    token,
    user,
    permissions,
    roles,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    fetchUserInfo,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent
  };
}); 