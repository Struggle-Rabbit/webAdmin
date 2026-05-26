import request from './request'
import type { LoginParams, RegisterParams, LoginResult, UserInfo } from '@/types'

export function loginApi(params: LoginParams) {
  return request.post<any, LoginResult>('/auth/login', params)
}

export function registerApi(params: RegisterParams) {
  return request.post<any, UserInfo>('/auth/register', params)
}

export function getUserInfoApi() {
  return request.get<any, UserInfo>('/auth/userinfo')
}
