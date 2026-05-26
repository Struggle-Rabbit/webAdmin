import request from './request'
import type { MenuInfo } from '@/types'

export function getMenuListApi() {
  return request.get<any, { list: MenuInfo[]; total: number }>('/menus')
}

export function createMenuApi(data: Partial<MenuInfo>) {
  return request.post<any, MenuInfo>('/menus', data)
}

export function updateMenuApi(id: number, data: Partial<MenuInfo>) {
  return request.put<any, MenuInfo>(`/menus/${id}`, data)
}

export function deleteMenuApi(id: number) {
  return request.delete<any, null>(`/menus/${id}`)
}
