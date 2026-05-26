import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginParams, RegisterParams } from '@/types'
import { storage } from '@/utils/storage'
import request from '@/api/request'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(storage.get('token'))
  const userInfo = ref<UserInfo | null>(null)
  const permissions = ref<string[]>([])

  const isLoggedIn = computed(() => !!token.value)
  const hasPermission = computed(() => (perm: string) => permissions.value.includes(perm))

  async function login(params: LoginParams) {
    const res = await request.post<any, { token: string; userInfo: UserInfo }>('/auth/login', params)
    token.value = res.token
    userInfo.value = res.userInfo
    permissions.value = res.userInfo.permissions || []
    storage.set('token', res.token)
    storage.set('userInfo', res.userInfo)
  }

  async function register(params: RegisterParams) {
    await request.post<any, UserInfo>('/auth/register', params)
  }

  async function getUserInfo() {
    const res = await request.get<any, UserInfo>('/auth/userinfo')
    userInfo.value = res
    permissions.value = res.permissions || []
    storage.set('userInfo', res)
  }

  function logout() {
    token.value = null
    userInfo.value = null
    permissions.value = []
    storage.remove('token')
    storage.remove('userInfo')
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    hasPermission,
    login,
    register,
    getUserInfo,
    logout,
  }
})
