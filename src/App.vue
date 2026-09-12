<script setup>
import EarthScene from './components/EarthScene.vue';
import ProfilePanel from './components/ProfilePanel.vue';
</script>

<template>
  <div class="homepage">
    <header class="site-header">
      <a class="brand" href="#main"><span class="brand-symbol" aria-hidden="true">◎</span> 我的个人主页</a>
      <span class="header-caption">地理信息 · 学习与探索</span>
    </header>
    <main id="main" class="main-layout">
      <EarthScene />
      <ProfilePanel />
    </main>
    <footer class="site-footer">
      <span>个人学习与作品记录</span>
      <span>以地理视角，理解世界</span>
    </footer>
  </div>
</template>
