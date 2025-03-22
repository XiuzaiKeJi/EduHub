import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(null);
  const loading = ref(false);
  const error = ref('');

  // 登录
  async function login(email: string, password: string) {
    try {
      loading.value = true;
      error.value = '';
      
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      token.value = newToken;
      user.value = userData;
      localStorage.setItem('token', newToken);
      
      // 设置axios默认header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 注册
  async function register(username: string, email: string, password: string) {
    try {
      loading.value = true;
      error.value = '';
      
      await axios.post('/api/auth/register', { username, email, password });
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 登出
  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      if (!token.value) return;
      
      loading.value = true;
      error.value = '';
      
      const response = await axios.get('/api/auth/me');
      user.value = response.data.user;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取用户信息失败';
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    token,
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchUserInfo
  };
}); 