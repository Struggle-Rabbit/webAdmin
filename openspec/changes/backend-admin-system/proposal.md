## Why

构建一个通用的中后台管理系统前端基座，一次开发后可用于多个后台项目复用。项目当前为空白状态，需要完成完整的前端工程搭建和核心业务页面开发。

## What Changes

- 初始化 Vue3 + Vite + TypeScript + Pinia + Element Plus 工程
- 搭建通用项目骨架：路由守卫、布局系统、权限指令、HTTP 请求层
- 实现 MSW Mock 数据层，覆盖所有核心接口
- 使用 CSS 变量体系实现主题切换（预设多套主题 + 暗夜模式）
- 预留国际化扩展点（文本走 t() 函数，暂时为 identity 实现）
- 预留通知系统扩展点（Header 通知图标占位）
- 实现 6 个核心页面：登录/注册、仪表盘、用户管理、角色管理、菜单/权限管理、系统日志

## Capabilities

### New Capabilities
- `user-auth`: 登录、注册、Token 管理、路由守卫
- `dashboard`: 仪表盘页面，展示系统概览统计数据
- `user-management`: 用户 CRUD，支持角色分配、状态管理
- `role-management`: 角色 CRUD，支持权限分配、菜单授权
- `menu-permission`: 菜单树管理（无限层级），按钮级权限码管理
- `system-log`: 操作日志与登录日志查询、筛选、详情查看
- `theme-system`: 主题色切换、暗夜模式、布局偏好持久化
- `layout-shell`: 通用布局框架（侧边栏、Header、多标签页 Tab、面包屑）

### Modified Capabilities

无，项目为新工程。

## Impact

- 新增完整的 Vue3 前端项目，所有代码在 `src/` 目录下
- 新增 `mock/` 目录存放 MSW handler 和 mock 数据
- 新增 `public/` 静态资源
- 依赖变更：Element Plus、MSW、Pinia、vue-router、axios、@vueuse/core 等
