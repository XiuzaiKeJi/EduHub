import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { login, register, logout } from '@/api/auth';
import type { User, LoginCredentials, RegisterData } from '@/store/types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null as User | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const { token, user } = await login(credentials);
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        return true;
      } catch (error) {
        return false;
      }
    },

    async register(userData: RegisterData) {
      try {
        const { token, user } = await register(userData);
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        return true;
      } catch (error) {
        return false;
      }
    },

    async logout() {
      try {
        await logout();
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
}); 