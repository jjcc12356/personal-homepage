# 个人主页

第一阶段：Vue + Vite 工程初始化。Three.js 已作为依赖安装，地球将在后续阶段实现。

## 本地开发

在项目目录打开终端：

```sh
npm install
npm run dev
```

打开终端显示的本地地址。页面计数按钮用于验证 Vue 响应式交互。

## 构建与预览

```sh
npm run build
npm run preview
```

`dist/` 是构建产物，不提交到 Git。`package-lock.json` 应提交，保证依赖版本可重复安装。

## 文件入口

- index.html：网页入口和挂载节点。
- src/main.js：创建 Vue 应用。
- src/App.vue：首页组件与计数交互。
- src/style.css：页面样式。
- vite.config.js：开发构建配置。

尚未实现三维地球，也尚未部署。
