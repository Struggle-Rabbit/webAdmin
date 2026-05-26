## 1. 安装 Mock.js 依赖

- [x] 1.1 `npm uninstall msw`
- [x] 1.2 `npm install -D mockjs @types/mockjs`
- [x] 1.3 删除 `public/mockServiceWorker.js`
- [x] 1.4 从 `package.json` 中移除 `msw.workerDirectory` 配置

## 2. 创建新的 src/mock/index.ts

### 2.1 基础设置与声明式接口

- [x] 2.1.1 引入 `Mock` from `mockjs`，调用 `Mock.setup({ timeout: '200-400' })`
- [x] 2.1.2 实现 auth 接口（login + register + userinfo）：三条 `Mock.mock()` 声明式模板
- [x] 2.1.3 实现 dashboard/stats 接口：声明式模板返回固定统计值

### 2.2 用户管理 CRUD

- [x] 2.2.1 用 `Array.from({ length: 25 })` 生成 25 条用户种子数据
- [x] 2.2.2 实现 `GET /api/users` 函数回调：keyword/status/role 筛选 + 分页（从可变数组查询）
- [x] 2.2.3 实现 `POST /api/users` 函数回调：创建用户，push 到可变数组
- [x] 2.2.4 实现 `PUT /api/users/数字ID` 正则匹配 + 更新逻辑
- [x] 2.2.5 实现 `DELETE /api/users/数字ID` 正则匹配 + 删除逻辑
- [x] 2.2.6 实现 `PATCH /api/users/数字ID/status` 状态切换

### 2.3 角色管理 CRUD

- [x] 2.3.1 硬编码 6 个角色（超级管理员、管理员、普通用户、编辑者、观察者、开发者），保持与现有数据结构一致
- [x] 2.3.2 实现 `GET /api/roles` 返回角色列表
- [x] 2.3.3 实现 `POST /api/roles` + `PUT /api/roles/数字ID` + `DELETE /api/roles/数字ID`
- [x] 2.3.4 实现 `PUT /api/roles/数字ID/permissions` 权限更新

### 2.4 菜单管理 CRUD

- [x] 2.4.1 硬编码 16 个菜单项（6 父级 + 10 子按钮），保留树形层级结构
- [x] 2.4.2 实现 `buildTree()` 递归函数从扁平数组构建树形
- [x] 2.4.3 实现 `GET /api/menus` 返回树形菜单
- [x] 2.4.4 实现 `POST /api/menus` + `PUT /api/menus/数字ID`
- [x] 2.4.5 实现 `DELETE /api/menus/数字ID` 含子菜单级联删除

### 2.5 日志查询与导出

- [x] 2.5.1 实现 60 条日志的运行时生成（Array.from 生成器，每次刷新重新生成）
- [x] 2.5.2 实现 `GET /api/logs`：type/keyword/startTime/endTime 筛选 + 分页
- [x] 2.5.3 实现 `GET /api/logs/数字ID/detail` 详情查询
- [x] 2.5.4 实现 `GET /api/logs/export` CSV 导出（返回 JSON 含 csv 字符串）

### 2.6 仪表盘图表

- [x] 2.6.1 实现 `GET /api/dashboard/charts` 函数回调：随机生成 7 天注册趋势 + 角色分布

## 3. 更新入口文件

- [x] 3.1 修改 `src/main.ts`：将 `const { worker } = await import('./mock/browser'); await worker.start(...)` 替换为 `await import('./mock')`

## 4. 清理旧文件

- [x] 4.1 删除 `src/mock/browser.ts`
- [x] 4.2 删除 `src/mock/data/` 整个目录（4 个文件）
- [x] 4.3 删除 `src/mock/handlers/` 整个目录（6 个文件）
- [x] 4.4 旧 `src/mock/index.ts` 已被新文件覆盖

## 5. 验证

- [ ] 5.1 `npm run dev` 启动，确认无控制台报错
- [ ] 5.2 测试登录/注册流程正常
- [ ] 5.3 测试用户管理页面：列表、搜索、分页、新增、编辑、删除、状态切换
- [ ] 5.4 测试角色管理页面：列表、新增、编辑、删除、权限分配
- [ ] 5.5 测试菜单管理页面：树形展示、新增、编辑、删除（含级联）
- [ ] 5.6 测试日志页面：列表、筛选、分页、详情、CSV 导出
- [ ] 5.7 测试仪表盘：统计卡片和图表正常渲染
- [x] 5.8 `npm run build` 构建通过
- [ ] 5.9 `npm run lint` 无错误（ESLint 未在项目中安装）
