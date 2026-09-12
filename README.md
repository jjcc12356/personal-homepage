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

## 第二阶段：电脑端布局

- App.vue 组合页头、地球区域、个人资料和页脚。
- src/components/EarthScene.vue 预留 Three.js 容器，目前没有地球或拖拽功能。
- src/components/ProfilePanel.vue 包含个人信息和可切换的关于我、我的作品面板。修改 profile 对象可替换姓名和介绍。
- src/style.css 使用 CSS Grid 构建左右两栏，仅考虑电脑端，最小布局宽度为 1000px。
- 已通过生产构建，并在浏览器 1440 × 900 视口检查布局和页签切换。

开发服务器已运行时直接访问 http://127.0.0.1:5173/，不需要再次运行 npm run dev。
