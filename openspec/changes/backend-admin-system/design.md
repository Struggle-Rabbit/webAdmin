## Context

当前项目为空工程，需从零搭建 Vue3 + Vite + TypeScript + Pinia + Element Plus 前端项目，目标为通用中后台管理系统基座，一次开发后可用于多个后台项目复用。

约束条件：
- 权限模型为 RBAC，控制到按钮级，权限数据由后端动态返回
- 菜单支持无限层级嵌套（暂定四级），由后端返回菜单树
- 导航守卫在 router 中实现，权限判断集中在 Pinia store 中
- 所有 API 先使用 MSW (Mock Service Worker) 模拟
- 不引入国际化依赖，但文本调用层走 t() 函数预留扩展点
- 通知系统暂不实现，但 Header 预留通知图标位置

## Goals / Non-Goals

**Goals:**
- 完整的工程初始化与目录结构搭建
- 通用布局系统（侧边栏 + Header + 多标签页 + 面包屑）
- RBAC 权限体系（动态路由、菜单渲染、按钮级指令）
- 6 个核心页面（登录/注册、仪表盘、用户管理、角色管理、菜单/权限管理、系统日志）
- MSW Mock 数据覆盖所有核心接口
- 主题色切换 + 暗夜模式
- CSS 变量体系，可扩展的预设主题

**Non-Goals:**
- 不实现国际化具体翻译（仅预留调用层）
- 不实现通知/站内信系统（仅预留 UI 占位）
- 不实现 WebSocket 实时推送
- 不实现真实后端 API（全部走 MSW Mock）
- 不涉及部署 CI/CD 配置

## Decisions

### 1. 权限数据结构 — 扁平权限码 + 树形菜单

**决策**：后端返回两样东西：
1. `permissions: string[]` — 扁平权限码数组，如 `["user:create", "user:edit"]`
2. `menus: MenuNode[]` — 树形菜单结构，用于渲染导航

**理由**：
- 扁平数组在前端做 `includes` 判断效率最高，无需递归查找
- 树形菜单维护了父子层级关系，用于菜单渲染和动态路由
- 两者分离：菜单节点本身也有权限码，菜单显隐由其自身权限控制

**权限码命名规范**：`模块:操作`，如 `user:create`, `role:assign`, `system:log:view`

### 2. 动态路由实现方案 — 路由守卫中动态注入

**决策**：在 `router.beforeEach` 中，当检测到用户已登录但尚未加载权限时，调用后端接口获取菜单树 → 遍历树形结构 → 使用 `router.addRoute()` 动态注册路由 → `next({...to, replace: true})` 重试导航。

**流程**：
```
请求 → beforeEach 触发
  → 无 token → 重定向到 /login
  → 有 token，无权限 → 请求 /api/auth/permissions
    → 写入 authStore
    → 遍历菜单树动态生成路由
    → next({...to, replace: true}) 重试
  → 有 token，有权限，但路由不存在 → 重定向 404
  → 有 token，有权限，路由存在 → next()
```

### 3. 权限消费层 — 三种方式

| 方式 | 使用场景 | 实现 |
|------|----------|------|
| 自定义指令 `v-permission` | 按钮级显示/隐藏 | `app.directive('permission', ...)` |
| 组件 `<Auth>` | 包裹复杂区块 | 封装 `v-permission`，支持插槽 |
| 函数 `hasPermission()` | 逻辑判断 | Pinia getter，`authStore.hasPermission(code)` |

### 4. 布局系统 — 侧边+多标签页

```
┌──────────┬──────────────────────────────────┐
│          │  Header                          │
│          │  折叠 │ 面包屑 │ 通知(占位)       │
│          │        用户信息 │ 全屏 │ 主题     │
│  侧边栏  ├──────────────────────────────────┤
│  (多级)  │  Tab 标签页 (可关闭)              │
│          ├──────────────────────────────────┤
│          │                                  │
│          │  Content (Router View)           │
│          │                                  │
│          │                                  │
│          └──────────────────────────────────┘
```

**Tab 导航**：使用 `<keep-alive>` 缓存已打开页面，Tab 栏显示已打开的页面标签，支持关闭、刷新、右键菜单。

### 5. 主题机制 — CSS 变量体系

基于 Element Plus CSS Variables 方案：

```css
:root {
  --el-color-primary: #409eff;
  --el-color-primary-dark-2: ...;
  --el-color-primary-light-3: ...;
  /* 自定义变量 */
  --app-sidebar-bg: #304156;
  --app-header-bg: #fff;
}
```

- 预设 5 套主题色配置（蓝、绿、橙、紫、暗夜）
- 暗夜模式单独处理，叠加 `html.dark` 选择器
- 主题持久化到 `localStorage`

### 6. 目录结构

```
src/
├── api/                    # API 接口层
│   ├── request.ts          # Axios 封装（拦截器、错误处理）
│   ├── auth.ts             # 登录注册接口
│   ├── user.ts             # 用户管理接口
│   ├── role.ts             # 角色管理接口
│   ├── menu.ts             # 菜单权限接口
│   ├── log.ts              # 日志接口
│   └── dashboard.ts        # 仪表盘接口
├── assets/                 # 静态资源
│   ├── styles/
│   │   ├── variables.scss  # 全局变量
│   │   ├── reset.scss      # 重置样式
│   │   └── dark.scss       # 暗夜模式覆盖
│   └── images/
├── components/             # 公共组件
│   ├── AppLogo.vue
│   ├── AppSidebar.vue
│   ├── AppHeader.vue
│   ├── AppTabs.vue
│   ├── Auth.vue            # 权限包裹组件
│   ├── SvgIcon.vue
│   └── ThemePicker.vue
├── composables/            # 组合式函数
│   ├── usePermission.ts    # 权限判断逻辑
│   ├── useTheme.ts         # 主题切换
│   └── useFullscreen.ts    # 全屏
├── directives/             # 自定义指令
│   └── permission.ts       # v-permission
├── layouts/                # 布局组件
│   └── MainLayout.vue      # 主布局
├── mock/                   # MSW Mock
│   ├── data/
│   │   ├── users.ts
│   │   ├── roles.ts
│   │   ├── menus.ts
│   │   └── logs.ts
│   ├── handlers/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── role.ts
│   │   ├── menu.ts
│   │   ├── log.ts
│   │   └── dashboard.ts
│   ├── browser.ts
│   └── index.ts
├── router/                 # 路由
│   ├── index.ts            # 路由实例
│   ├── guard.ts            # 导航守卫
│   └── routes.ts           # 基础路由（登录、404 等）
├── stores/                 # Pinia 状态
│   ├── authStore.ts        # 认证 & 权限
│   ├── appStore.ts         # 应用状态（侧边栏、主题等）
│   ├── tabsStore.ts        # 多标签页状态
│   └── settingsStore.ts    # 用户设置
├── types/                  # TypeScript 类型
│   ├── api.d.ts            # API 请求/响应类型
│   ├── user.d.ts
│   ├── role.d.ts
│   ├── menu.d.ts
│   └── log.d.ts
├── utils/                  # 工具函数
│   ├── storage.ts          # localStorage 封装
│   ├── tree.ts             # 树形数据处理
│   └── index.ts
├── views/                  # 页面
│   ├── login/
│   │   └── LoginView.vue
│   ├── register/
│   │   └── RegisterView.vue
│   ├── dashboard/
│   │   └── DashboardView.vue
│   ├── user/
│   │   ├── UserList.vue
│   │   └── UserForm.vue
│   ├── role/
│   │   ├── RoleList.vue
│   │   └── RoleForm.vue
│   ├── menu/
│   │   └── MenuView.vue
│   └── log/
│       └── LogView.vue
├── App.vue
├── main.ts
└── env.d.ts

mock/                       # MSW 入口（非 src 内）
├── handlers.ts
├── browser.ts
└── ...
```

### 7. MSW Mock 策略

- 使用 `msw` 浏览器端拦截，完全在网络层模拟
- 每个模块独立 handler 文件，按功能组织
- Mock 数据中内置延迟 200-500ms 模拟真实网络
- 数据结构严格对齐 TypeScript 类型定义

### 8. 国际化扩展接口

```typescript
// src/utils/i18n.ts — 国际化的 identity 实现
// 当前: t(key) => key
// 未来接入 vue-i18n 后: t(key) => i18n.global.t(key)
// 业务代码全部使用: t('user.management.title')
// 切换时只需替换这个文件的核心实现
```

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 动态路由 + 权限加载导致首次进入白屏 | 登录跳转后显示全屏 Loading，权限加载完成后隐藏 |
| 无限级菜单递归性能问题 | 默认限制渲染深度为 4 级，组件内用递归组件加 maxDepth prop |
| MSW 在构建时被错误打包 | MSW 代码仅在 `import.meta.env.DEV` 下注册 |
| Element Plus 主题切换涉及大量 CSS 变量覆盖 | 使用 Element Plus 官方提供的 `useDark` 和 CSS Variables 方案，提取预设主题为 JSON 配置文件 |
| Tab 标签页 + Keep-alive 导致内存增长 | 设置最大 Tab 数量（默认 10 个），超过时关闭最久未使用的 Tab |
