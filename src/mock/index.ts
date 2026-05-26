import Mock from 'mockjs'

Mock.setup({ timeout: '200-400' })

function getIdFromUrl(url: string, pattern: RegExp): number | null {
  const m = url.match(pattern)
  return m ? parseInt(m[1]) : null
}

function getQuery(url: string): Record<string, string> {
  const idx = url.indexOf('?')
  if (idx === -1) return {}
  const params: Record<string, string> = {}
  new URLSearchParams(url.slice(idx)).forEach((v, k) => { params[k] = v })
  return params
}

// ── Seed Data ──────────────────────────────────────────────

const initialRoles = [
  { id: 1, name: '超级管理员', code: 'super_admin', description: '系统最高权限', status: 1, permissions: ['*'], createTime: '2025-01-01T00:00:00Z' },
  { id: 2, name: '管理员', code: 'admin', description: '系统管理员', status: 1, permissions: ['user:list', 'user:create', 'user:edit', 'user:delete', 'role:list', 'role:create', 'role:edit', 'role:delete', 'menu:list', 'menu:create', 'menu:edit', 'menu:delete', 'log:list'], createTime: '2025-01-02T00:00:00Z' },
  { id: 3, name: '普通用户', code: 'user', description: '普通用户', status: 1, permissions: ['user:list', 'role:list', 'menu:list'], createTime: '2025-01-03T00:00:00Z' },
  { id: 4, name: '编辑者', code: 'editor', description: '内容编辑者', status: 1, permissions: ['user:list', 'user:edit'], createTime: '2025-01-04T00:00:00Z' },
  { id: 5, name: '观察者', code: 'viewer', description: '只读用户', status: 0, permissions: ['user:list'], createTime: '2025-01-05T00:00:00Z' },
  { id: 6, name: '开发者', code: 'developer', description: '开发者角色', status: 1, permissions: ['user:list', 'user:create', 'user:edit', 'role:list', 'menu:list', 'log:list'], createTime: '2025-01-06T00:00:00Z' },
]

const initialMenus = [
  { id: 1, parentId: null, name: '仪表盘', path: '/dashboard', component: 'dashboard/DashboardView.vue', icon: 'Odometer', type: 'menu', permission: '', sort: 1, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 2, parentId: null, name: '系统管理', path: '/system', component: '', icon: 'Setting', type: 'menu', permission: '', sort: 2, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 3, parentId: 2, name: '用户管理', path: '/users', component: 'user/UserList.vue', icon: 'User', type: 'menu', permission: 'user:list', sort: 1, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 4, parentId: 2, name: '角色管理', path: '/roles', component: 'role/RoleList.vue', icon: 'Avatar', type: 'menu', permission: 'role:list', sort: 2, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 5, parentId: 2, name: '菜单管理', path: '/menus', component: 'menu/MenuView.vue', icon: 'Menu', type: 'menu', permission: 'menu:list', sort: 3, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 6, parentId: null, name: '日志管理', path: '/logs', component: 'log/LogView.vue', icon: 'Document', type: 'menu', permission: 'log:list', sort: 3, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 7, parentId: 3, name: '新增用户', path: '', component: '', icon: '', type: 'button', permission: 'user:create', sort: 1, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 8, parentId: 3, name: '编辑用户', path: '', component: '', icon: '', type: 'button', permission: 'user:edit', sort: 2, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 9, parentId: 3, name: '删除用户', path: '', component: '', icon: '', type: 'button', permission: 'user:delete', sort: 3, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 10, parentId: 3, name: '导出用户', path: '', component: '', icon: '', type: 'button', permission: 'user:export', sort: 4, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 11, parentId: 4, name: '新增角色', path: '', component: '', icon: '', type: 'button', permission: 'role:create', sort: 1, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 12, parentId: 4, name: '编辑角色', path: '', component: '', icon: '', type: 'button', permission: 'role:edit', sort: 2, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 13, parentId: 4, name: '删除角色', path: '', component: '', icon: '', type: 'button', permission: 'role:delete', sort: 3, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 14, parentId: 5, name: '新增菜单', path: '', component: '', icon: '', type: 'button', permission: 'menu:create', sort: 1, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 15, parentId: 5, name: '编辑菜单', path: '', component: '', icon: '', type: 'button', permission: 'menu:edit', sort: 2, visible: true, createTime: '2025-01-01T00:00:00Z' },
  { id: 16, parentId: 5, name: '删除菜单', path: '', component: '', icon: '', type: 'button', permission: 'menu:delete', sort: 3, visible: true, createTime: '2025-01-01T00:00:00Z' },
]

const logActions = ['登录', '退出', '新增用户', '编辑用户', '删除用户', '新增角色', '编辑角色', '删除角色', '新增菜单', '编辑菜单', '删除菜单', '导出日志']
const logUsernames = ['admin', 'user1', 'user2', 'user3', 'user4']

const initialUsers = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  nickname: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `1380000${String(i + 1).padStart(4, '0')}`,
  avatar: '',
  status: i % 5 === 0 ? 0 : 1,
  roles: i % 3 === 0 ? [{ id: 1, name: '管理员', code: 'admin' }] : [{ id: 2, name: '普通用户', code: 'user' }],
  permissions: i % 3 === 0 ? ['user:list', 'user:create', 'user:edit', 'user:delete'] : ['user:list'],
  createTime: new Date(Date.now() - i * 86400000).toISOString(),
}))

// ── Mutable State ──────────────────────────────────────────

let tokenStore = ''
let users = [...initialUsers]
let roles = [...initialRoles]
let menus = JSON.parse(JSON.stringify(initialMenus))

function getLogs() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    type: i % 3 === 0 ? 'login' : ('operation' as const),
    username: logUsernames[i % logUsernames.length],
    action: logActions[i % logActions.length],
    target: `target_${i}`,
    ip: `192.168.1.${(i % 255) + 1}`,
    userAgent: 'Mozilla/5.0',
    status: i % 10 === 0 ? 0 : 1,
    detail: `执行了${logActions[i % logActions.length]}操作`,
    createTime: new Date(Date.now() - i * 3600000).toISOString(),
  }))
}

function buildTree(items: any[], parentId: number | null = null): any[] {
  return items
    .filter((item: any) => item.parentId === parentId)
    .sort((a: any, b: any) => a.sort - b.sort)
    .map((item: any) => ({
      ...item,
      children: buildTree(items, item.id),
    }))
}

// ── Auth ───────────────────────────────────────────────────

Mock.mock(/\/api\/auth\/login(\?|$)/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}')
  const user = users.find((u) => u.username === body.username)
  if (user && body.password) {
    tokenStore = `token_${user.id}`
    return { code: 0, message: '登录成功', data: { token: tokenStore, userInfo: user } }
  }
  return { code: 400, message: '用户名或密码错误', data: null }
})

Mock.mock(/\/api\/auth\/register(\?|$)/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}')
  if (body.username && body.password) {
    return {
      code: 0,
      message: '注册成功',
      data: { id: users.length + 1, ...body, status: 1, roles: [], permissions: [], createTime: new Date().toISOString() },
    }
  }
  return { code: 400, message: '参数错误', data: null }
})

Mock.mock(/\/api\/auth\/userinfo(\?|$)/, 'get', () => {
  return { code: 0, message: 'ok', data: users[0] }
})

// ── Dashboard ──────────────────────────────────────────────

Mock.mock(/\/api\/dashboard\/stats(\?|$)/, 'get', () => {
  return {
    code: 0,
    message: 'ok',
    data: {
      userCount: users.length,
      roleCount: roles.length,
      menuCount: menus.length,
      activeUserCount: users.filter((u) => u.status === 1).length,
    },
  }
})

Mock.mock(/\/api\/dashboard\/charts(\?|$)/, 'get', () => {
  const registrationTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { date: d.toISOString().slice(0, 10), count: Math.floor(Math.random() * 20) + 5 }
  })
  const roleDistribution = roles.map((r) => ({
    name: r.name,
    value: users.filter((u) => u.roles.some((ur) => ur.id === r.id)).length,
  }))
  return { code: 0, message: 'ok', data: { registrationTrend, roleDistribution } }
})

// ── Users ──────────────────────────────────────────────────

Mock.mock(/\/api\/users(\?|$)/, 'get', (options: any) => {
  const query = getQuery(options.url)
  const page = parseInt(query.page || '1')
  const pageSize = parseInt(query.pageSize || '10')
  const keyword = query.keyword || ''
  const status = query.status
  const role = query.role

  let filtered = [...users]
  if (keyword) filtered = filtered.filter((u) => u.username.includes(keyword) || u.nickname.includes(keyword))
  if (status !== undefined && status !== '') filtered = filtered.filter((u) => u.status === parseInt(status))
  if (role) filtered = filtered.filter((u) => u.roles.some((r) => r.code === role))

  const total = filtered.length
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)
  return { code: 0, message: 'ok', data: { list, total, page, pageSize } }
})

Mock.mock(/\/api\/users$/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}')
  const newUser = { id: users.length + 1, ...body, roles: body.roles || [], permissions: body.permissions || [], createTime: new Date().toISOString() }
  users.push(newUser)
  return { code: 0, message: '创建成功', data: newUser }
})

Mock.mock(/\/api\/users\/\d+$/, 'put', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/users\/(\d+)/)
  const body = JSON.parse(options.body || '{}')
  const idx = users.findIndex((u) => u.id === id)
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...body }
    return { code: 0, message: '更新成功', data: users[idx] }
  }
  return { code: 404, message: '用户不存在', data: null }
})

Mock.mock(/\/api\/users\/\d+$/, 'delete', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/users\/(\d+)/)
  users = users.filter((u) => u.id !== id)
  return { code: 0, message: '删除成功', data: null }
})

Mock.mock(/\/api\/users\/\d+\/status(\?|$)/, 'patch', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/users\/(\d+)\/status/)
  const idx = users.findIndex((u) => u.id === id)
  if (idx !== -1) {
    users[idx].status = users[idx].status === 1 ? 0 : 1
    return { code: 0, message: '状态更新成功', data: users[idx] }
  }
  return { code: 404, message: '用户不存在', data: null }
})

// ── Roles ──────────────────────────────────────────────────

Mock.mock(/\/api\/roles(\?|$)/, 'get', (options: any) => {
  const query = getQuery(options.url)
  const page = parseInt(query.page || '1')
  const pageSize = parseInt(query.pageSize || '10')
  const keyword = query.keyword || ''
  let filtered = [...roles]
  if (keyword) filtered = filtered.filter((r) => r.name.includes(keyword) || r.code.includes(keyword))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)
  return { code: 0, message: 'ok', data: { list, total, page, pageSize } }
})

Mock.mock(/\/api\/roles$/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}')
  const newRole = { id: roles.length + 1, ...body, permissions: body.permissions || [], createTime: new Date().toISOString() }
  roles.push(newRole)
  return { code: 0, message: '创建成功', data: newRole }
})

Mock.mock(/\/api\/roles\/\d+$/, 'put', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/roles\/(\d+)/)
  const body = JSON.parse(options.body || '{}')
  const idx = roles.findIndex((r) => r.id === id)
  if (idx !== -1) {
    roles[idx] = { ...roles[idx], ...body }
    return { code: 0, message: '更新成功', data: roles[idx] }
  }
  return { code: 404, message: '角色不存在', data: null }
})

Mock.mock(/\/api\/roles\/\d+$/, 'delete', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/roles\/(\d+)/)
  roles = roles.filter((r) => r.id !== id)
  return { code: 0, message: '删除成功', data: null }
})

Mock.mock(/\/api\/roles\/\d+\/permissions(\?|$)/, 'put', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/roles\/(\d+)\/permissions/)
  const body = JSON.parse(options.body || '{}')
  const idx = roles.findIndex((r) => r.id === id)
  if (idx !== -1) {
    roles[idx].permissions = body.permissions || []
    return { code: 0, message: '权限更新成功', data: roles[idx] }
  }
  return { code: 404, message: '角色不存在', data: null }
})

// ── Menus ──────────────────────────────────────────────────

Mock.mock(/\/api\/menus(\?|$)/, 'get', () => {
  const tree = buildTree(menus)
  return { code: 0, message: 'ok', data: { list: tree, total: menus.length } }
})

Mock.mock(/\/api\/menus$/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}')
  const newMenu = {
    id: menus.length + 1,
    parentId: body.parentId || null,
    name: body.name,
    path: body.path || '',
    component: body.component || '',
    icon: body.icon || '',
    type: body.type || 'menu',
    permission: body.permission || '',
    sort: body.sort || 0,
    visible: body.visible !== false,
    createTime: new Date().toISOString(),
  }
  menus.push(newMenu)
  return { code: 0, message: '创建成功', data: newMenu }
})

Mock.mock(/\/api\/menus\/\d+$/, 'put', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/menus\/(\d+)/)
  const body = JSON.parse(options.body || '{}')
  const idx = menus.findIndex((m: any) => m.id === id)
  if (idx !== -1) {
    menus[idx] = { ...menus[idx], ...body }
    return { code: 0, message: '更新成功', data: menus[idx] }
  }
  return { code: 404, message: '菜单不存在', data: null }
})

Mock.mock(/\/api\/menus\/\d+$/, 'delete', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/menus\/(\d+)/)
  if (id === null) return { code: 404, message: '菜单不存在', data: null }
  const idsToDelete = new Set<number>()
  function collectChildren(parentId: number) {
    idsToDelete.add(parentId)
    menus.filter((m: any) => m.parentId === parentId).forEach((m: any) => collectChildren(m.id))
  }
  collectChildren(id)
  menus = menus.filter((m: any) => !idsToDelete.has(m.id))
  return { code: 0, message: '删除成功', data: null }
})

// ── Logs ───────────────────────────────────────────────────

Mock.mock(/\/api\/logs\/export(\?|$)/, 'get', (options: any) => {
  const query = getQuery(options.url)
  const type = query.type || ''
  let filtered = getLogs()
  if (type) filtered = filtered.filter((l) => l.type === type)
  const csvHeader = 'ID,类型,用户名,操作,目标,IP,状态,时间\n'
  const csvRows = filtered
    .map((l) => `${l.id},${l.type},${l.username},${l.action},${l.target || ''},${l.ip},${l.status},${l.createTime}`)
    .join('\n')
  return { code: 0, message: 'ok', data: { csv: csvHeader + csvRows } }
})

Mock.mock(/\/api\/logs(\?|$)/, 'get', (options: any) => {
  const query = getQuery(options.url)
  const page = parseInt(query.page || '1')
  const pageSize = parseInt(query.pageSize || '10')
  const type = query.type || ''
  const keyword = query.keyword || ''
  const startTime = query.startTime || ''
  const endTime = query.endTime || ''

  let filtered = getLogs()
  if (type) filtered = filtered.filter((l) => l.type === type)
  if (keyword) filtered = filtered.filter((l) => l.username.includes(keyword) || l.action.includes(keyword))
  if (startTime) filtered = filtered.filter((l) => new Date(l.createTime) >= new Date(startTime))
  if (endTime) filtered = filtered.filter((l) => new Date(l.createTime) <= new Date(endTime))

  const total = filtered.length
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)
  return { code: 0, message: 'ok', data: { list, total, page, pageSize } }
})

Mock.mock(/\/api\/logs\/\d+\/detail(\?|$)/, 'get', (options: any) => {
  const id = getIdFromUrl(options.url, /\/api\/logs\/(\d+)\/detail/)
  const logs = getLogs()
  const log = logs.find((l) => l.id === id)
  if (log) return { code: 0, message: 'ok', data: log }
  return { code: 404, message: '日志不存在', data: null }
})
