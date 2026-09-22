<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const container = ref(null);
const status = ref('loading');
const message = ref('');
let dispose;
let generation = 0;
async function initialize() {
  const current = ++generation;
  dispose?.();
  dispose = undefined;
  status.value = 'loading';
  try {
    // 按需加载三维模块，个人资料不必等待 Three.js 下载。
    const { createEarth } = await import('../earth/createEarth.js');
    if (current !== generation) return;
    dispose = createEarth(container.value, (state, detail = '') => {
      if (current !== generation) return;
      status.value = state;
      message.value = detail;
    });
  } catch (error) {
    if (current !== generation) return;
    status.value = 'error';
    message.value = '无法启动三维地球，请确认浏览器支持 WebGL 2 后重试。';
    console.error('Earth initialization failed:', error);
  }
}
function resetView() { dispose?.resetView(); }
onMounted(initialize);
onBeforeUnmount(() => { generation++; dispose?.(); });
</script>

<template>
  <section class="earth-stage" aria-label="三维地球展示区">
    <div class="stage-heading"><span class="eyebrow">EARTH / 01</span><span>固定光照 · 昼夜地球</span></div>
    <div class="earth-container" :aria-busy="status === 'loading'">
      <div ref="container" class="earth-canvas"></div>
      <div v-if="status !== 'ready'" class="earth-message" role="status">
        <template v-if="status === 'loading'"><h2>正在加载地球</h2><p>准备地表、夜景与云层…</p></template>
        <template v-else><h2>地球暂时无法显示</h2><p>{{ message }}</p><button @click="initialize">重新加载</button></template>
      </div>
    </div>
    <button v-if="status === 'ready'" class="earth-reset" @click="resetView">恢复视角</button>
    <div class="stage-footer"><a href="https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/" target="_blank" rel="noopener noreferrer">影像：NASA ↗</a><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener noreferrer" title="云层与材质：Solar System Scope，CC BY 4.0，经 Three.js 合并处理">云层：Solar System Scope ↗</a><span class="earth-hint"><span class="desktop-hint">左键拖拽旋转 · 滚轮缩放</span><span class="touch-hint">单指旋转 · 双指缩放 · 在地球外滑动页面</span></span></div>
  </section>
</template>





