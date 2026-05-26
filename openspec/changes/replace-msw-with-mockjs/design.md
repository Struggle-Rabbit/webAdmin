## Context

当前 Mock 数据层使用 MSW (Mock Service Worker) v2，共 14 个文件。需要迁移到 Mock.js 单文件方案。

约束条件：
- API 响应格式不变：`{ code: number; message: string; data: T }`
- Axios 拦截器逻辑不变（request.ts 不改）
- 所有现有 API 端点的 path 和 method 不变
- 开发环境（`import.meta.env.DEV`）才启用 Mock
- 生产构建时 Mock 代码 tree-shake 掉

## Goals / Non-Goals

**Goals:**
- 完全移除 MSW 及其所有文件
- 单文件 `src/mock/index.ts` 承载所有 Mock 逻辑
- 所有 CRUD 逻辑（分页、筛选、排序）保持不变
- Mock.js 内置生成器替代手写种子数据
- 登录认证的 token 验证逻辑保留

**Non-Goals:**
- 不改动 API 层（src/api/）代码
- 不改动任何视图层或 Store 代码
- 不新增或删除任何 API 端点
- 不改动构建配置

## Decisions

### 1. 架构分层

Mock.js 取代 MSW 后，请求拦截链路变为：

```
浏览器 → Axios (XHR) → Mock.js 拦截 → 函数/模板处理 → Axios response → 业务代码
```

Mock.js 在 XHR 层拦截，对 Axios 完全透明，response.data 结构不变。

### 2. 入口集成

```
当前:                            替换后:
main.ts                           main.ts
  if (DEV)                          if (DEV)
    import('./mock/browser')          await import('./mock')
    await worker.start()
```

去掉 async 是因为 Mock.js 同步注册即可生效，不需要 await。

### 3. 单文件组织方案

`src/mock/index.ts` 按以下顺序组织：

```
┌────────────────────────────────────┐
│  1. Mock.setup({ timeout })        │ 网络延迟模拟
│  2. 声明式模板响应                  │ 简单接口：auth, dashboard
│  3. 可变数据池                      │ CRUD 操作的 in-memory 数据
│  4. 函数回调响应                    │ 复杂接口：users, roles, menus, logs
└────────────────────────────────────┘
```

### 4. 各模块 Mock 策略

| 模块 | 策略 | 说明 |
|------|------|------|
| auth login/register | 声明式模板 | 固定响应，无状态逻辑 |
| auth userinfo | 声明式模板 | 固定返回 admin 用户 |
| users list | 函数回调 + 分页筛选 | 从可变数组查询，支持 keyword/status/role 筛选 |
| users CRUD | 函数回调 | create/update/delete/status toggle |
| roles list/CRUD | 函数回调 | 同 users，角色较少直接用常量 |
| menus tree/CRUD | 函数回调 | 树形结构生成与递归操作 |
| logs list | 函数回调 + Mock.js 生成器 | 每次刷新随机生成 60 条 |
| logs export | 函数回调 | 返回 CSV 文本 |
| dashboard stats | 声明式模板 | 固定统计数值 |
| dashboard charts | 函数回调 | 随机生成图表数据 |

### 5. 数据生成方案

Mock.js 内置生成器覆盖大部分场景：

| 字段 | 模板 |
|------|------|
| 用户名 | `@name` |
| 中文名 | `@cname` |
| 邮箱 | `@email` |
| 手机号 | `/1[3-9]\d{9}/` |
| 头像 | `@image('100x100')` |
| 日期 | `@datetime` |
| ID 自增 | `'id\|+1': 1` |
| 状态枚举 | `'status\|1': [0, 1]` |
| 权限码 | `'permissions\|1': [['user:list'], ['user:create', 'user:edit']]` |

业务固定结构（菜单树层级、角色编码）保留硬编码数组，不用随机。

### 6. 路由参数处理

Mock.js 不支持 MSW 的 `:id` 路由参数语法，改用正则匹配：

| MSW 写法 | Mock.js 写法 |
|----------|-------------|
| `http.put('/api/users/:id', handler)` | `Mock.mock(/\/api\/users\/(\d+)/, 'put', handler)` |

在函数回调中通过 `options.url` 匹配提取 ID。

### 7. 文件变更清单

```
删除:
  public/mockServiceWorker.js          (349 行, service worker 脚本)
  src/mock/browser.ts                  (worker 注册)
  src/mock/data/users.ts               (种子数据)
  src/mock/data/roles.ts               (种子数据)
  src/mock/data/menus.ts               (种子数据)
  src/mock/data/logs.ts                (种子数据)
  src/mock/handlers/auth.ts            (MSW handler)
  src/mock/handlers/users.ts           (MSW handler)
  src/mock/handlers/roles.ts           (MSW handler)
  src/mock/handlers/menus.ts           (MSW handler)
  src/mock/handlers/logs.ts            (MSW handler)
  src/mock/handlers/dashboard.ts       (MSW handler)
  src/mock/index.ts                    (handler 聚合)

新增:
  src/mock/index.ts                    (Mock.js 单文件入口)

修改:
  package.json                         (msw → mockjs + @types/mockjs)
  src/main.ts                          (worker.start → import)
```

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| Mock.js 仅拦截 XHR，不拦截 fetch | Axios 在浏览器端默认使用 XHR，当前无 fetch 调用 |
| Mock.js 正则匹配路由参数不如 MSW 直观 | 正则集中在文件顶部统一管理，加注释说明 |
| Mock.js 类型定义不完善 | 函数回调中手动类型断言 |
| Mock.js 对 `XMLHttpRequest` 的拦截与真实请求差异 | 仅开发环境启用，生产环境无影响 |
