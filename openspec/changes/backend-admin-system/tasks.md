## 1. 项目初始化

- [x] 1.1 使用 Vite 创建 Vue3 + TypeScript 项目，配置 vite.config.ts
- [x] 1.2 安装核心依赖：vue-router, pinia, axios, element-plus, @element-plus/icons-vue, @vueuse/core
- [x] 1.3 安装开发依赖：msw, sass, unplugin-auto-import, unplugin-vue-components
- [x] 1.4 配置 TypeScript（tsconfig.json）路径别名和类型声明
- [x] 1.5 配置 Element Plus 按需引入与主题变量
- [x] 1.6 创建目录结构（src/api, src/stores, src/router, src/components, src/views, src/types 等）
- [x] 1.7 创建全局样式文件（variables.scss, reset.scss, dark.scss）

## 2. 通用基础设施

- [x] 2.1 实现 HTTP 请求层（api/request.ts）：axios 实例、拦截器、错误处理、Token 注入
- [x] 2.2 实现 localStorage 封装工具（utils/storage.ts）
- [x] 2.3 实现树形数据处理工具（utils/tree.ts）
- [x] 2.4 实现国际化占位函数（utils/i18n.ts）：t() identity 实现
- [x] 2.5 定义核心 TypeScript 类型（types/）：用户、角色、菜单、日志、API 响应结构
- [x] 2.6 实现 v-permission 自定义指令（directives/permission.ts）

## 3. 认证系统（user-auth）

- [x] 3.1 实现 authStore（stores/authStore.ts）：token、用户信息、权限数据、hasPermission getter
- [x] 3.2 实现登录页面（views/login/LoginView.vue）：表单验证、登录流程、错误提示
- [x] 3.3 实现注册页面（views/register/RegisterView.vue）：表单验证、注册后自动登录
- [x] 3.4 实现路由守卫（router/guard.ts）：权限加载、动态路由注入、未授权拦截
- [x] 3.5 配置基础路由（router/routes.ts）：/login, /register, /403, /404

## 4. 布局系统（layout-shell）

- [x] 4.1 实现 MainLayout 主布局组件（layouts/MainLayout.vue）：整体骨架
- [x] 4.2 实现 Sidebar 组件（components/AppSidebar.vue）：多级递归菜单、折叠/展开、活跃高亮
- [x] 4.3 实现 Header 组件（components/AppHeader.vue）：面包屑、通知占位、用户下拉、全屏、主题切换
- [x] 4.4 实现 Tab 标签页组件（components/AppTabs.vue）：打开/关闭/刷新/右键菜单
- [x] 4.5 实现面包屑组件：根据当前路由和菜单树生成面包屑路径
- [x] 4.6 实现 tabsStore（stores/tabsStore.ts）：标签页状态管理
- [x] 4.7 实现 appStore（stores/appStore.ts）：侧边栏折叠状态

## 5. 主题系统（theme-system）

- [x] 5.1 实现 ThemePicker 组件（components/ThemePicker.vue）：色块选择器
- [x] 5.2 实现 useTheme composable（composables/useTheme.ts）：CSS 变量切换、暗夜模式
- [x] 5.3 定义预设主题色配置：蓝、绿、橙、紫、红
- [x] 5.4 集成暗夜模式（Element Plus useDark 方案）
- [x] 5.5 实现 useFullscreen composable（composables/useFullscreen.ts）

## 6. MSW Mock 数据层

- [x] 6.1 初始化 MSW 浏览器端（mock/browser.ts, mock/index.ts）
- [x] 6.2 编写 Mock 数据：users.ts（20-30 条）、roles.ts（5-8 个）、menus.ts（15-25 项）、logs.ts（50+ 条）
- [x] 6.3 实现 auth handler：POST /api/auth/login、POST /api/auth/register、GET /api/auth/userinfo
- [x] 6.4 实现 user handler：GET/POST /api/users、PUT/DELETE /api/users/:id、PATCH /api/users/:id/status
- [x] 6.5 实现 role handler：GET/POST /api/roles、PUT/DELETE /api/roles/:id、PUT /api/roles/:id/permissions
- [x] 6.6 实现 menu handler：GET/POST /api/menus、PUT/DELETE /api/menus/:id
- [x] 6.7 实现 log handler：GET /api/logs、GET /api/logs/:id/detail、GET /api/logs/export
- [x] 6.8 实现 dashboard handler：GET /api/dashboard/stats、GET /api/dashboard/charts
- [x] 6.9 在 main.ts 中条件注册 MSW（仅开发环境）

## 7. 仪表盘页面（dashboard）

- [x] 7.1 实现 DashboardView.vue：统计卡片区域（用户数、角色数、菜单数、活跃用户）
- [x] 7.2 集成图表（使用 ECharts）：折线图（注册趋势）、饼图（角色分布）
- [x] 7.3 实现最近活动列表
- [x] 7.4 添加 loading 骨架屏和空状态处理

## 8. 用户管理页面（user-management）

- [x] 8.1 实现 UserList.vue：数据表格、搜索、角色筛选、状态筛选、分页
- [x] 8.2 实现 UserForm.vue（对话框）：新增/编辑用户表单、角色多选
- [x] 8.3 实现删除确认和状态切换
- [x] 8.4 实现按钮级权限控制（v-permission 控制新增/编辑/删除按钮显隐）

## 9. 角色管理页面（role-management）

- [x] 9.1 实现 RoleList.vue：数据表格、搜索、分页
- [x] 9.2 实现 RoleForm.vue（对话框）：新增/编辑角色表单
- [x] 9.3 实现权限分配对话框：Element Plus Tree 树形选择、级联选择逻辑
- [x] 9.4 实现删除确认和关联用户检测

## 10. 菜单/权限管理页面（menu-permission）

- [x] 10.1 实现 MenuView.vue：树形表格展示菜单树（el-table 树形模式）
- [x] 10.2 实现菜单表单对话框：动态表单（菜单/按钮类型切换时字段变化）
- [x] 10.3 实现删除（含级联删除确认）和可见性切换
- [x] 10.4 实现排序编辑功能

## 11. 系统日志页面（system-log）

- [x] 11.1 实现 LogView.vue：操作日志/登录日志筛选
- [x] 11.2 实现日志筛选区域：时间范围、操作类型、关键词搜索
- [x] 11.3 实现日志详情抽屉（el-drawer）
- [x] 11.4 实现日志导出功能（CSV 下载）

## 12. 收尾与打磨

- [x] 12.1 添加页面过渡动画和加载状态
- [x] 12.2 实现 403/404 错误页面
- [ ] 12.3 添加全局错误边界和 Toast 提示统一风格
- [ ] 12.4 检查并处理所有边界情况：空数据、网络错误、超时
- [x] 12.5 最终 Lint 检查和构建验证
