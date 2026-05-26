## Why

当前 Mock 数据层使用 MSW (Mock Service Worker) v2，需要 14 个文件和 1 个 349 行的 service worker 脚本。MSW 虽然是业界主流方案，但对于这个项目而言过于重型——项目不需要 service worker 级别的网络拦截能力，也不需要跨 fetch/XHR 兼容性。

替换为 Mock.js 后：
- 文件数从 14 个降至 1-2 个，维护成本大幅降低
- Mock.js 内置随机数据生成器（@cname, @email, @datetime 等），无需手写种子数据
- 没有 service worker 注册流程，入口更简洁
- XHR 层拦截对 Axios 应用完全透明

## What Changes

- 移除 MSW 依赖（msw 包、mockServiceWorker.js、所有 handler/data 文件）
- 新增 Mock.js 依赖
- 单文件 `src/mock/index.ts` 替代当前整个 mock 目录
- MacOS/Linux 用户也可正常运行（MSW 在非 Windows 环境无额外问题，替换后无关）
- 入口 main.ts 的 mock 启动代码从 `worker.start()` 简化为 `import('./mock')`

## Capabilities

### New Capabilities

无新能力，Mock 层功能保持不变，所有现有接口继续正常工作。

### Modified Capabilities

- `user-auth`：Mock 登录/注册/userinfo 接口从 MSW handler 改为 Mock.js 声明式模板
- `user-management`：Mock 用户 CRUD 从 MSW handler 改为 Mock.js 函数回调
- `role-management`：Mock 角色 CRUD 从 MSW handler 改为 Mock.js 函数回调
- `menu-permission`：Mock 菜单树从 MSW handler 改为 Mock.js 函数回调
- `system-log`：Mock 日志查询从 MSW handler 改为 Mock.js 函数回调
- `dashboard`：Mock 仪表盘从 MSW handler 改为 Mock.js 声明式模板
- `layout-shell`：无变化，布局不依赖 mock 实现
- `theme-system`：无变化，主题不依赖 mock 实现

### Removed Capabilities

- MSW service worker 注册流程

## Impact

- `package.json`：移除 `msw`，新增 `mockjs` + `@types/mockjs`
- `src/mock/`：目录从 14 个文件缩减为 1 个 `index.ts`
- `public/mockServiceWorker.js`：删除（349 行）
- `src/main.ts`：mock 启动代码简化
- API 层（src/api/）、Store 层（src/stores/）、视图层（src/views/）**完全无影响**
- 构建产物体积减小：移除 MSW runtime 和 service worker 脚本
