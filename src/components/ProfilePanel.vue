<script setup>
import { ref } from 'vue';

// 修改这里的内容即可替换个人资料，不需要改动页面布局。
const profile = {
  name: '你的姓名',
  description: '我正在学习 WebGIS，希望把空间分析知识与编程结合，让地图成为可以交互的作品。',
  interests: ['GIS 空间分析', 'WebGIS 学习', '交互地图']
};
const activeTab = ref('about');
const tabs = [
  { id: 'about', label: '关于我' },
  { id: 'work', label: '我的作品' }
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
    </div>
  </section>
</template>
