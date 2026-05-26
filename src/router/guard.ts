import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    if (to.meta?.ignoreAuth) {
      next()
      return
    }

    if (!authStore.isLoggedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    if (!authStore.userInfo) {
      try {
        await authStore.getUserInfo()
      } catch {
        authStore.logout()
        next({ path: '/login' })
        return
      }
    }

    next()
  })
}
