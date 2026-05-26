import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore()
    const { value } = binding

    if (value && Array.isArray(value)) {
      const hasPermission = value.some((perm: string) => authStore.hasPermission(perm))
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else if (value && typeof value === 'string') {
      if (!authStore.hasPermission(value)) {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
