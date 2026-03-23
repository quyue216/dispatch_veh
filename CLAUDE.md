# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供代码仓库的工作指南。

## 项目概览

这是一个基于 UmiJS Max (v4) 构建的 Ant Design Pro 项目，使用 React 19、Ant Design 5 和 TypeScript 的企业级应用框架。

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（使用 mock 数据）
pnpm start

# 启动开发服务器（不使用 mock 数据）
pnpm run start:no-mock

# 指定环境启动（dev/test/pre）
pnpm run start:dev    # 连接开发后端
pnpm run start:test   # 使用测试环境代理

# 生产构建
pnpm run build

# 预览生产构建
pnpm run preview

# 代码检查（Biome + TypeScript 检查）
pnpm run lint

# 修复代码检查错误
pnpm run biome:lint

# TypeScript 类型检查
pnpm run tsc

# 运行测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm run test:coverage

# 从 OpenAPI 生成 API 服务
pnpm run openapi
```

## 架构

### UmiJS Max 框架

项目使用 UmiJS Max，提供以下内置插件：
- **request**: 基于 axios 的 HTTP 客户端，统一错误处理
- **access**: 基于用户角色的权限控制
- **initialState**: 全局初始状态管理（用户信息、设置）
- **model**: 状态管理数据流插件
- **locale**: 国际化 (i18n)
- **layout**: ProLayout 管理后台 UI

### 关键文件

| 文件 | 用途 |
|------|------|
| `src/app.tsx` | 运行时配置：`getInitialState()` 用于用户认证，`layout` 用于 ProLayout 配置，`request` 用于 API 基础 URL |
| `src/access.ts` | 权限定义（如 `canAdmin`），基于 `initialState.currentUser` |
| `src/requestErrorConfig.ts` | 请求/响应拦截器和错误处理 |
| `config/config.ts` | UmiJS 配置（路由、插件、代理、主题） |
| `config/routes.ts` | 路由定义，包含用于权限控制的 `access` 属性 |
| `config/defaultSettings.ts` | ProLayout 主题和布局设置 |

### 目录结构

```
src/
├── components/      # 共享组件（Footer、HeaderDropdown 等）
├── locales/         # i18n 翻译（zh-CN、en-US 等）
├── pages/           # 路由页面（每个文件夹 = 一个路由）
├── services/        # API 服务函数（从 OpenAPI 自动生成）
│   ├── ant-design-pro/  # 主 API 服务
│   └── swagger/         # Swagger 生成的服务
├── access.ts        # 权限定义
├── app.tsx          # 运行时配置入口
└── requestErrorConfig.ts  # HTTP 错误处理
config/
├── config.ts        # UmiJS 主配置
├── routes.ts        # 路由定义
├── defaultSettings.ts  # 布局设置
├── proxy.ts         # 开发代理配置
└── oneapi.json      # OpenAPI 代码生成配置
mock/                # 开发用 mock 数据
```

### 路由权限

路由使用 `access` 属性进行权限控制。`access` 值与 `src/access.ts` 返回的键对应：

```typescript
// config/routes.ts
{ path: '/admin', access: 'canAdmin', ... }

// src/access.ts
return { canAdmin: currentUser?.access === 'admin' }
```

### API 层

服务定义在 `src/services/` 中。使用 OpenAPI 生成：

```bash
npm run openapi  # 从 config/openapi.json 生成服务
```

API 请求使用 `@umijs/max` 的请求功能，在 `src/app.tsx` 中配置基础 URL：

```typescript
export const request = {
  baseURL: 'https://proapi.azurewebsites.net',
  ...errorConfig,
};
```

### Mock 开发

Mock 文件位于 `mock/` 目录。运行 `npm start` 时（不使用 `MOCK=none`）会自动加载。

### 测试

测试使用 Jest 和 `@testing-library/react`。测试配置位于 `tests/setupTests.jsx`。

## 环境变量

| 变量 | 用途 |
|------|------|
| `REACT_APP_ENV` | 环境名称：`dev`、`test`、`pre`（决定代理配置） |
| `MOCK` | 设置为 `none` 禁用 mock 服务器 |
| `UMI_ENV` | Umi 环境（`dev`） |
| `ANALYZE` | 设置为 `1` 分析打包体积 |

## 代码风格

- 使用 Biome 进行代码检查（不使用 ESLint）
- JavaScript/TypeScript 使用单引号
- 使用空格缩进
- 代码检查排除：`.umi`、`src/services`、`mock` 目录

## 路径别名

- `@/*` 映射到 `./src/*`
- `@@/*` 映射到 `./src/.umi/*`

## 页面代码结构规范

### 目录组织原则

路由组件以**大驼峰命名**打平到 `pages` 下第一级，不在路由组件内部嵌套路由组件：

```
src/
├── components/          # 多页面共用组件
└── pages/
    ├── Welcome/         # 路由组件（对应路由配置中的组件）
    │   ├── components/  # 仅该页面使用的子组件（不超过三层）
    │   ├── Form.tsx
    │   ├── index.tsx    # 页面组件入口
    │   └── index.less   # 页面样式
    ├── Order/
    │   ├── index.tsx
    │   └── index.less
    └── User/            # group 层级（复杂项目可增加）
        ├── components/  # group 下公用组件
        ├── Login/       # group 下的页面
        ├── Register/    # group 下的页面
        └── util.ts      # group 下共用方法
```

### 规范要点

- **路由组件**：配置在 `config/routes.ts` 中的组件，放在 `pages/` 第一级，大驼峰命名
- **非路由组件**：页面内部拆分的子组件，放在对应页面目录的 `components/` 下
- **共用组件**：多个页面依赖的组件放到 `src/components/`，单页面依赖的就近维护
- **嵌套层级**：页面内部组织建议不超过三层
- **命名区分**：通过"是否在 `pages/` 第一级"来区分路由组件和非路由组件
