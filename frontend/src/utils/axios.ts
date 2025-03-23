import axios from 'axios';
import router from '@/router';

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          router.push({
            name: 'login',
            query: { redirect: router.currentRoute.value.fullPath }
          });
          break;
        case 403:
          // 权限不足
          router.push({ name: 'not-found' });
          break;
        case 404:
          // 资源不存在
          router.push({ name: 'not-found' });
          break;
        default:
          // 其他错误
          console.error('API请求错误:', error.response.data);
      }
    } else {
      // 网络错误
      console.error('网络错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 