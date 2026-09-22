<script setup>
import { computed, ref } from 'vue';
import { articles, blogHome } from '../data/blog.js';
import { milestones, visualWorks, contactEmail } from '../data/portfolio.js';
// 复制后排序，保留数据文件原本的顺序。
const sortedArticles = computed(() => [...articles].sort((a, b) => (b.views ?? -1) - (a.views ?? -1)));

// 修改这里的内容即可替换个人资料，不需要改动页面布局。
const profile = {
  name: '崔佳昊',
  description: '我正在学习 WebGIS，希望把空间分析知识与编程结合，让地图成为可以交互的作品。',
  interests: ['GIS 空间分析', 'WebGIS 学习', '交互地图']
};
const activeTab = ref('about');
const tabs = [
  { id: 'about', label: '关于我' },
  { id: 'work', label: '我的作品' },
  { id: 'blog', label: '我的博客' },
  { id: 'journey', label: '学习足迹' },
  { id: 'gallery', label: '地图与图表' },
  { id: 'contact', label: '联系我' }
];
function moveTab(event, index) {
  let next;
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return;
  event.preventDefault();
  activeTab.value = tabs[next].id;
  document.getElementById(`tab-${tabs[next].id}`).focus();
}
</script>

<template>
  <section class="profile-panel" aria-labelledby="profile-title">
    <div class="profile-intro">
      <p class="eyebrow intro-label">A GEOGRAPHIC PERSPECTIVE</p>
      <p class="greeting">你好，我是</p>
      <h1 id="profile-title">{{ profile.name }}</h1>
      <p class="profile-description">{{ profile.description }}</p>
      <ul class="interest-list" aria-label="学习方向">
        <li v-for="interest in profile.interests" :key="interest">{{ interest }}</li>
      </ul>
    </div>
    <div class="profile-details">
      <div class="tab-list" role="tablist" aria-label="个人资料">
        <button v-for="(tab, index) in tabs" :id="`tab-${tab.id}`" :key="tab.id"
          role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`panel-${tab.id}`"
          :tabindex="activeTab === tab.id ? 0 : -1" @click="activeTab = tab.id"
          @keydown="moveTab($event, index)">{{ tab.label }}</button>
      </div>
      <div v-show="activeTab === 'about'" id="panel-about" class="tab-panel" role="tabpanel" aria-labelledby="tab-about" tabindex="0">
        <div class="detail-row"><span class="detail-number">01</span><div><h2>已有基础</h2><p>GIS 空间分析，将地理问题转化为分析思路。</p></div></div>
        <div class="detail-row"><span class="detail-number">02</span><div><h2>正在学习</h2><p>JavaScript、Vue，以及浏览器中的三维地图。</p></div></div>
      </div>
      <div v-show="activeTab === 'work'" id="panel-work" class="tab-panel" role="tabpanel" aria-labelledby="tab-work" tabindex="0">
        <article class="project-entry"><div class="project-topline"><span class="detail-number">01 / WEB</span><span class="project-status">制作中</span></div><h2>交互地球个人主页</h2><p>从页面布局开始，逐步实现地球旋转、缩放与昼夜效果。</p></article>
      </div>
      <!-- 博客选项卡：主页入口固定在文章列表前面。 -->
      <div v-show="activeTab === 'blog'" id="panel-blog" class="tab-panel blog-panel"
        role="tabpanel" aria-labelledby="tab-blog" tabindex="0">
        <a class="blog-home-link" :href="blogHome" target="_blank" rel="noopener noreferrer">
          进入 CSDN 主页 <span aria-hidden="true">↗</span>
        </a>
        <template v-if="sortedArticles.length">
          <p class="blog-note">按已记录阅读量排序 · 非实时数据，未获取的置后</p>
          <ol class="blog-list">
            <li v-for="article in sortedArticles" :key="article.id" class="blog-item">
              <a class="blog-title" :href="article.url" target="_blank" rel="noopener noreferrer">{{ article.title }}</a>
              <span class="blog-views">阅读量 {{ article.views === null ? '待更新' : article.views.toLocaleString('zh-CN') }}</span>
            </li>
          </ol>
        </template>
        <p v-else class="blog-empty">文章列表整理中，欢迎先前往 CSDN 主页阅读。</p>
      </div>
      <div v-show="activeTab === 'journey'" id="panel-journey" class="tab-panel feature-panel"
        role="tabpanel" aria-labelledby="tab-journey" tabindex="0">
        <p class="section-caption">从空间分析出发，记录每一次实践。</p>
        <ol class="learning-timeline">
          <li v-for="(step, index) in milestones" :key="step.title">
            <span class="milestone-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div><span class="milestone-tag">{{ step.tag }}</span><h2>{{ step.title }}</h2><p>{{ step.detail }}</p></div>
          </li>
        </ol>
      </div>
      <div v-show="activeTab === 'gallery'" id="panel-gallery" class="tab-panel feature-panel"
        role="tabpanel" aria-labelledby="tab-gallery" tabindex="0">
        <p class="section-caption">用地图表达空间，用图表理解研究。</p>
        <div v-if="visualWorks.length" class="visual-gallery">
          <article v-for="work in visualWorks" :key="work.id" class="visual-card">
            <img v-if="work.image" :src="work.image" :alt="work.title" loading="lazy">
            <span class="milestone-tag">{{ work.kind }}</span>
            <h2>{{ work.title }}</h2><p>{{ work.description }}</p>
            <a v-if="work.url" class="work-link" :href="work.url" target="_blank" rel="noopener noreferrer">查看作品 ↗</a>
          </article>
        </div>
        <div v-else class="gallery-placeholders">
          <article class="visual-card"><span class="milestone-tag">MAP / 01 · 待添加</span><h2>我的地图</h2><p>这里将收录专题地图、空间分析成果与交互地图。</p></article>
          <article class="visual-card"><span class="milestone-tag">FIGURE / 02 · 待添加</span><h2>Python 图表实践</h2><p>这里将记录论文图表复刻、数据可视化与绘图心得。</p></article>
        </div>
      </div>
      <div v-show="activeTab === 'contact'" id="panel-contact" class="tab-panel feature-panel"
        role="tabpanel" aria-labelledby="tab-contact" tabindex="0">
        <span class="milestone-tag">LET’S CONNECT</span>
        <h2 class="contact-heading">交流想法，一起学习</h2>
        <p>欢迎交流 WebGIS、地图制作和 Python 可视化，也欢迎对我的作品提出建议。</p>
        <a class="contact-email" :href="'mailto:' + contactEmail">{{ contactEmail }} <span aria-hidden="true">↗</span></a>
        <p class="contact-note">点击邮箱可通过邮件应用联系我，也可以复制地址发送邮件。</p>
      </div>
    </div>
  </section>
</template>
