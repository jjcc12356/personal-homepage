# 崔佳昊的个人主页：WebGIS 学习与可视化实践

## 1. 项目概述

本项目以交互地球为视觉主体，展示个人介绍、项目、CSDN 博客、学习足迹、地图与图表作品及联系方式。面向电脑端，使用 Vue、Vite 和 Three.js 实现纯前端网站；无需数据库或后端服务。

本报告说明当前实现。学习足迹记录项目实践阶段，不代表已经熟练掌握全部技术，也未推测各阶段的完成日期。

## 2. 功能与范围

| 区域 | 当前实现 |
| --- | --- |
| 地球 | 地表、夜景、云层、大气、海面反光；拖拽、缩放、恢复视角 |
| 关于我 | 姓名、学习方向与简介 |
| 我的作品 | 个人主页项目介绍 |
| 我的博客 | 7 篇 CSDN 文章、主页入口、按已记录阅读量降序排列 |
| 学习足迹 | 按阶段排列的学习时间线 |
| 地图与图表 | 支持图片、分类、说明和作品链接；目前没有录入作品 |
| 联系我 | 3135217308@qq.com，使用 mailto 链接调用邮件应用 |

博客阅读量为公开页面快照，非实时数据。未知阅读量使用 null，排序时放在末尾，显示“待更新”。作品占位卡不代表已完成成果。当前没有在线留言提交、消息存储或邮件发送服务；邮件由访问者自己的邮件应用发送。

## 3. 技术栈与工程结构

- HTML：语义结构、链接、有序列表、按钮。
- CSS：Grid 双栏布局、Flex 选项卡、时间线、作品卡片、悬停与焦点样式。
- JavaScript：数组、对象、模块、排序、事件和异步资源加载。
- Vue 3：组件、ref、computed、列表渲染和生命周期。
- Three.js：WebGL 渲染、球体几何、纹理、OrbitControls、自定义 GLSL 材质。
- Vite：开发服务器、模块构建、静态资源路径处理。
- GitHub Actions / Pages：构建与静态网页发布。

依赖范围以 package.json 为准；package-lock.json 固定安装版本。

~~~text
src/
  App.vue                       页头、地球、个人面板、页脚
  main.js                       Vue 挂载入口
  style.css                     页面与各面板样式
  components/
    EarthScene.vue              地球容器、加载状态、重试与清理
    ProfilePanel.vue            六个选项卡与内容
  data/
    blog.js                     博客链接与阅读量
    portfolio.js                学习足迹、地图图表、联系方式
  earth/
    createEarth.js              场景、交互、资源与动画管理
    dayNightMaterial.js         昼夜、地表细节与反光
    earthLayers.js              云层与大气
public/textures/                本地纹理与 SOURCES.md
.github/workflows/deploy.yml    自动部署配置
~~~

## 4. 三维地球实现

### 4.1 场景与交互

PerspectiveCamera 观察球体，WebGLRenderer 输出透明画布。页面背景与画布相融合，避免地球被独立面板框住。OrbitControls 通过移动相机实现观察方向变化，支持阻尼、缩放限制并禁用平移。恢复视角重置相机位置和观察目标。

ResizeObserver 监听容器，更新画布尺寸和相机比例，同时保留相对缩放。当前默认布局最小宽度 1000px，手机端未适配。

### 4.2 昼夜与表面

ShaderMaterial 使用世界空间法线与固定太阳方向的点积判断朝向，以 smoothstep 平滑混合昼夜。夜侧叠加城市灯光。太阳方向不随真实时间计算。

细节纹理的红通道用于地表凹凸光照，绿通道区分海陆粗糙度，蓝通道提供云密度。凹凸是着色效果，并未生成真实山脉几何；海面反光也属于视觉近似。

### 4.3 云层与大气

独立透明球壳表示云层，缓慢偏移纹理 UV；大气球壳根据视角和光照形成边缘渐隐。当前不是物理大气散射模型，没有实时天气或云影。

### 4.4 资源管理

三维模块动态导入，地表、夜景与细节纹理本地加载。资源加载有失败、超时与重试提示。隐藏页面时暂停动画；减少动态效果偏好下停止云层移动。组件卸载释放纹理、材质、几何体、控制器、事件和渲染器。

## 5. 内容面板与可访问性

activeTab 保存当前选项。v-show 控制面板显示，computed 计算文章顺序，v-for 根据数据生成列表。修改内容数据无需重复编写列表 HTML。

选项卡关联 role、aria-selected、aria-controls 与 aria-labelledby，支持方向键、Home、End 切换，以及键盘焦点提示。六个按钮空间不足时换行。较长列表在面板内部滚动，避免持续拉长地球区域。

学习足迹使用有序列表和 CSS 时间线。地图图表组件仅在存在图片或链接时显示对应元素。外部链接在新标签页打开，保留 noopener noreferrer。邮箱使用 mailto，不依赖后端。

## 6. 如何添加内容

### 学习足迹

编辑 src/data/portfolio.js 的 milestones：

~~~js
{ title: '新阶段标题', tag: '相关技术', detail: '自己实际完成的内容和心得。' }
~~~

### 地图与论文图表复刻

把图片存放在 src/assets 中，在 portfolio.js 顶部导入图片，然后添加到 visualWorks：

~~~js
import figureImage from '../assets/my-figure.png';

export const visualWorks = [
  {
    id: 'figure-01',
    kind: 'Python 图表',
    title: '填写作品标题',
    description: '说明数据、绘图方法；论文复刻请注明原论文和改动。',
    image: figureImage,
    url: '' // 可填实际作品或代码仓库网址
  }
];
~~~

替换现有的空 visualWorks 声明，不要重复声明。地图作品的 kind 可写“地图”。image 或 url 暂无时可用空字符串。图片导入可让 Vite 正确处理 GitHub Pages 子路径。

### 博客

编辑 src/data/blog.js。id 使用文章 ID；views 为数字或 null。链接根据 ID 生成，页面自动排序。修改数据不会回写 CSDN，也不会定时更新。

### 联系方式

修改 portfolio.js 的 contactEmail 即可。网站部署后邮箱会显示在公开页面。

## 7. 启动、构建与部署

建议使用与当前 CI 一致的 Node.js 24，在项目根目录执行：

~~~sh
npm ci
npm run dev
~~~

使用终端显示的地址；当前 base 是 /personal-homepage/。开发端口固定为 5173，已有服务器时无需重复启动。

~~~sh
npm run build
npm run preview
~~~

构建输出位于 dist，不能直接通过双击源 index.html 运行项目。node_modules 和 dist 不提交，package-lock.json 应提交。

仓库已配置 deploy.yml：main 分支推送后执行 npm ci、npm run build，再上传 dist 并部署到 Pages。GitHub 仓库 Pages 的 Source 应设为 GitHub Actions。修改仓库名称或部署路径时，需要同步调整 vite.config.js 的 base。

本次新增页面仅修改本地文件；提交、推送和在线部署结果应另行确认，不因本地构建通过就视为上线成功。

## 8. 验证与限制

本次执行生产构建，并检查六个选项与面板对应、内容数据及邮箱配置。构建成功不等同于所有浏览器视觉测试通过。

建议人工验收：
1. 在电脑端依次点击六个选项，检查内容与选中状态。
2. 使用方向键、Home、End 切换，确认焦点与面板一致。
3. 查看博客排序、未知阅读量以及外部链接。
4. 查看学习足迹与地图图表空状态；录入真实作品后检查图片和链接。
5. 点击邮箱，确认邮件应用打开；没有邮件应用时可复制邮箱。
6. 检查地球拖拽、缩放、恢复视角及窗口大小变化。

构建仍有 Three.js 分块超过 500 kB 的提示。地球已经动态加载，但纹理与 GPU 渲染仍有资源开销。本项目没有移动端适配、后台管理、在线留言、自动博客同步或自动论文图表生成。

## 9. 数据来源与学习总结

地表使用 NASA Blue Marble，夜景使用 NASA Black Marble；细节纹理来自 Three.js 示例，原作者 Solar System Scope，CC BY 4.0。完整来源和许可见 [纹理说明](public/textures/SOURCES.md)。不同年份影像仅作视觉展示，不用于时序研究。

本项目将 HTML 结构、CSS 外观、JavaScript 数据处理、Vue 组件和 Three.js 场景结合起来。后续学习可以从 portfolio.js 修改内容开始，再阅读 ProfilePanel.vue 的列表模板与 style.css 的样式，逐步理解“数据如何变成页面”。地图和论文图复刻应基于自己的实际作品补充，并注明数据和参考来源。
