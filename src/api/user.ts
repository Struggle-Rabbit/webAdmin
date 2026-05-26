import request from './request'
import type { UserInfo, PageResult } from '@/types'

export interface UserQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: number | string
  role?: string
}

export function getUserListApi(params: UserQueryParams) {
  return request.get<any, PageResult<UserInfo>>('/users', { params })
}

export function createUserApi(data: Partial<UserInfo>) {
  return request.post<any, UserInfo>('/users', data)
}

export function updateUserApi(id: number, data: Partial<UserInfo>) {
  return request.put<any, UserInfo>(`/users/${id}`, data)
}

export function deleteUserApi(id: number) {
  return request.delete<any, null>(`/users/${id}`)
}

export function toggleUserStatusApi(id: number) {
  return request.patch<any, UserInfo>(`/users/${id}/status`)
}
