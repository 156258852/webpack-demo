# QWEN.md

本项目是一个基于 React 18 + Webpack 5 的前端开发模板，采用模块化的 Webpack 配置架构。

## 项目概述

- **框架**: React 18
- **构建工具**: Webpack 5
- **包管理器**: pnpm
- **语言**: JavaScript/TypeScript（混用）
- **样式**: CSS/SCSS/LESS
- **代码规范**: ESLint + Stylelint + Husky + lint-staged

## 常用命令

### 开发
```bash
pnpm dev          # 启动开发服务器（热更新）
pnpm serve        # 在 3000 端口服务生产构建产物
```

### 构建
```bash
pnpm build        # 生产环境构建，输出到 dist/
pnpm build:analyze # 构建并启动 Bundle Analyzer 分析
```

### 代码检查
```bash
pnpm lint:js      # ESLint 检查 JS/TS 文件
pnpm lint:css     # Stylelint 检查样式文件（自动修复）
pnpm lint:all     # 同时运行 JS 和 CSS 检查
pnpm lint:staged  # 检查暂存文件（husky 使用）
```

## 目录结构

```
├── config/                 # Webpack 配置（模块化）
│   ├── core/               # 入口、输出、resolve 配置
│   ├── rules/              # 模块加载规则
│   ├── plugins/            # Webpack 插件
│   ├── optimization/       # 代码分割与压缩
│   ├── utils/              # 工具函数
│   ├── webpack.common.js   # 基础配置
│   ├── webpack.dev.js      # 开发环境配置
│   ├── webpack.prod.js     # 生产环境配置
│   └── webpack.analyze.js  # Bundle 分析配置
├── src/
│   ├── Component/          # 可复用组件
│   │   ├── Guide/          # 引导组件
│   │   ├── Highlight/      # 高亮文本组件
│   │   └── PolicyList/     # 策略列表组件
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useMountedState.js
│   │   └── useWorker.tsx   # Web Worker Hook
│   ├── utils/              # 工具函数
│   ├── worker/             # Web Worker 文件
│   ├── images/             # 图片资源
│   ├── doc/                # 文档
│   ├── App.jsx             # 根组件
│   ├── main.js             # 入口文件
│   └── style.scss          # 全局样式
├── babelPlugins/           # 自定义 Babel 插件
│   └── index.js            # 移除 console.log 插件
├── .babelrc.js             # Babel 配置
├── .eslintrc.js             # ESLint 配置
├── .stylelintrc.json       # Stylelint 配置
├── tsconfig.json           # TypeScript 配置
└── jsconfig.json           # JS 项目配置
```

## Webpack 配置架构

采用模块化配置模式，`webpack.common.js` 组合各模块：

1. **`config/core/`** - 入口、输出、模块解析配置
2. **`config/rules/`** - 各类文件加载规则（JS/TS、样式、资源）
3. **`config/plugins/`** - 插件配置（HTML、CSS、开发/生产环境）
4. **`config/optimization/`** - 代码分割与压缩优化
5. **`config/utils/`** - 环境判断、路径工具、端口查找

开发/生产配置通过 `webpack-merge` 合并基础配置。

## 模块解析

- **路径别名**: `src/*` 映射到 `./src/*`
- **支持扩展**: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.wasm`
- **样式预处理**: CSS, SCSS, LESS

## 代码规范

### ESLint
- 继承 `eslint:recommended` + `plugin:react/recommended`
- 解析器: `@babel/eslint-parser`
- 支持 JS/JSX/TS/TSX 文件
- Import 顺序: builtin → external → internal → parent → sibling → index
- 关键规则:
  - `eqeqeq: 2` - 禁止使用 `==`
  - `no-console: 1` - console 警告
  - `indent: [1, 2]` - 2 空格缩进
  - `react-hooks/rules-of-hooks: 2` - 强制 Hook 规则

### Stylelint
- 继承 `stylelint-config-standard`
- 属性顺序: position → box model → typography → background → other
- 类名格式: 小写连字符 (`my-class-name`)

### Git Hooks
- Husky + lint-staged
- 提交前自动执行 ESLint 和 Stylelint

## 生产环境外置

React 和 ReactDOM 在生产构建中**不打包**，需在 HTML 中通过 CDN 加载：

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

## 自定义 Babel 插件

`babelPlugins/index.js` 提供移除 `console.log` 的插件，可在 `.babelrc.js` 中启用：

```js
plugins: [
  "./babelPlugins/index.js",  // 取消注释启用
]
```

## 注意事项

1. **无测试配置**: `npm test` 会报错退出
2. **全局变量**: `React`, `ReactDOM`, `process` 等已全局声明
3. **环境变量**: 通过 `.env` 文件配置，使用 `dotenv` 加载