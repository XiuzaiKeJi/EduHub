import type { Directive } from 'vue';
import { useAuthStore } from '@/stores/auth';

export const vPermission: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value } = binding;
        const authStore = useAuthStore();

        if (value && value.length > 0) {
            const hasPermission = authStore.hasPermission(value);

            if (!hasPermission) {
                el.parentNode?.removeChild(el);
            }
        }
    }
};

export const vRole: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value } = binding;
        const authStore = useAuthStore();

        if (value && value.length > 0) {
            const hasRole = authStore.hasRole(value);

            if (!hasRole) {
                el.parentNode?.removeChild(el);
            }
        }
    }
};

export const vAnyRole: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value } = binding;
        const authStore = useAuthStore();

        if (value && value.length > 0) {
            const hasAnyRole = authStore.hasAnyRole(value);

            if (!hasAnyRole) {
                el.parentNode?.removeChild(el);
            }
        }
    }
};

export const vAllRoles: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value } = binding;
        const authStore = useAuthStore();

        if (value && value.length > 0) {
            const hasAllRoles = authStore.hasAllRoles(value);

            if (!hasAllRoles) {
                el.parentNode?.removeChild(el);
            }
        }
    }
}; 