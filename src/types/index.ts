export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar?: string
  email: string
  phone?: string
  status: number
  roles: RoleInfo[]
  permissions: string[]
  createTime: string
}

export interface RoleInfo {
  id: number
  name: string
  code: string
  description?: string
  status: number
  permissions?: string[]
  createTime: string
}

export interface MenuInfo {
  id: number
  parentId: number | null
  name: string
  path: string
  component?: string
  icon?: string
  type: 'menu' | 'button'
  permission?: string
  sort: number
  visible: boolean
  children?: MenuInfo[]
  createTime: string
}

export interface LogInfo {
  id: number
  type: 'operation' | 'login'
  username: string
  action: string
  target?: string
  ip: string
  userAgent?: string
  status: number
  detail?: string
  createTime: string
}

export interface DashboardStats {
  userCount: number
  roleCount: number
  menuCount: number
  activeUserCount: number
}

export interface ChartData {
  dates: string[]
  values: number[]
}

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  nickname: string
  email: string
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
}
