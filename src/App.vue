<script setup>
import { ref } from 'vue';

// 点击按钮修改响应式数据，用于验证 Vue 页面交互。
const count = ref(0);
</script>

<template>
  <main>
    <p class="eyebrow">GIS · 学习与探索</p>
    <h1>我的个人主页</h1>
    <p class="intro">从地图出发，记录学习，探索世界。</p>
    <section aria-labelledby="practice-title">
      <h2 id="practice-title">第一个交互</h2>
      <p>点击按钮，体验数据变化如何更新页面。</p>
      <button @click="count++">点击计数：{{ count }}</button>
      <p class="note" aria-live="polite">已点击 {{ count }} 次</p>
    </section>
  </main>
</template>
