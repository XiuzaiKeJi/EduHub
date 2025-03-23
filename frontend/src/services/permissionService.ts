import { useAuthStore } from '@/stores/auth';
import axios from '@/utils/axios';

class PermissionService {
  private static instance: PermissionService;
  private listeners: Set<(permissions: Set<string>, roles: Set<string>) => void> = new Set();
  private ws: WebSocket | null = null;

  private constructor() {
    this.initializeWebSocket();
  }

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  private initializeWebSocket() {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}/ws/permissions`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PERMISSION_UPDATE') {
        this.notifyListeners(data.permissions, data.roles);
      }
    };

    this.ws.onclose = () => {
      // 断线重连
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  public addListener(listener: (permissions: Set<string>, roles: Set<string>) => void) {
    this.listeners.add(listener);
  }

  public removeListener(listener: (permissions: Set<string>, roles: Set<string>) => void) {
    this.listeners.delete(listener);
  }

  private notifyListeners(permissions: Set<string>, roles: Set<string>) {
    this.listeners.forEach(listener => listener(permissions, roles));
  }

  // 手动触发权限更新
  public async refreshPermissions() {
    const authStore = useAuthStore();
    await authStore.fetchUserInfo();
  }
}

export const permissionService = PermissionService.getInstance(); 