import request from './request'
import type { RoleInfo, PageResult } from '@/types'

export interface RoleQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

export function getRoleListApi(params: RoleQueryParams) {
  return request.get<any, PageResult<RoleInfo>>('/roles', { params })
}

export function createRoleApi(data: Partial<RoleInfo>) {
  return request.post<any, RoleInfo>('/roles', data)
}

export function updateRoleApi(id: number, data: Partial<RoleInfo>) {
  return request.put<any, RoleInfo>(`/roles/${id}`, data)
}

export function deleteRoleApi(id: number) {
  return request.delete<any, null>(`/roles/${id}`)
}

export function updateRolePermissionsApi(id: number, permissions: string[]) {
  return request.put<any, RoleInfo>(`/roles/${id}/permissions`, { permissions })
}
