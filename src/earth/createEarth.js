import * as THREE from 'three';
import { createEarthLayers } from './earthLayers.js';
import { createDayNightMaterial } from './dayNightMaterial.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 场景负责三维绘制；Vue 组件负责容器、提示文字与生命周期。
export function createEarth(container, onState) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 3.6);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'NASA 地表影像三维地球，初始视角为亚洲与印度洋');
  container.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 128, 64);
  const material = createDayNightMaterial();
  const earth = new THREE.Mesh(geometry, material);
  // 球体纹理的经度原点位于 +X；将东经约 105 度转向相机。
  earth.rotation.y = THREE.MathUtils.degToRad(195);
  earth.rotation.x = THREE.MathUtils.degToRad(18);
  earth.visible = false;
  scene.add(earth);
  const layers = createEarthLayers(geometry, material.uniforms.sunDirection);
  layers.clouds.rotation.copy(earth.rotation);
  layers.clouds.visible = false;
  layers.atmosphere.visible = false;
  scene.add(layers.clouds, layers.atmosphere);


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.65;
  controls.minPolarAngle = 0.08;
  controls.maxPolarAngle = Math.PI - 0.08;
  controls.enabled = false;
  renderer.domElement.setAttribute('aria-label', '交互地球：鼠标左键拖拽旋转，滚轮缩放');
  let fitDistance = 0;
  let disposed = false;
  const textures = [];
  let failed = false;
  let timeout;
  const render = () => {
    if (!disposed && !renderer.getContext().isContextLost()) renderer.render(scene, camera);
  };
  const resize = () => {
    if (disposed) return;
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    // 依据较短的视场角控制距离，避免窄容器裁切地球。
    const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
    const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
    const nextFit = 1.08 / Math.sin(Math.min(vertical, horizontal));
    // 调整窗口时保持观察方向和相对缩放比例。
    const ratio = fitDistance ? camera.position.length() / fitDistance : 1;
    fitDistance = nextFit;
    controls.minDistance = Math.max(1.35, fitDistance * 0.48);
    controls.maxDistance = fitDistance * 1.8;
    camera.position.setLength(THREE.MathUtils.clamp(fitDistance * ratio, controls.minDistance, controls.maxDistance));
    controls.update();
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const contextLost = event => {
    event.preventDefault();
    clearTimeout(timeout);
    controls.enabled = false;
    renderer.setAnimationLoop(null);
    onState('error', '图形渲染已中断，请重新加载地球。');
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  onState('loading');
  timeout = setTimeout(() => {
    if (!disposed) { failed = true; onState('error', '昼夜纹理加载超时，请重试。'); }
  }, 20000);
  const loader = new THREE.TextureLoader();
  let remaining = 3;
  for (const [file, uniform] of [['earth-day.jpg', 'dayMap'], ['earth-night.jpg', 'nightMap'], ['earth-details.jpg', 'detailsMap']]) {
    const texture = loader.load(`${import.meta.env.BASE_URL}textures/${file}`, loaded => {
      if (disposed || failed) { loaded.dispose(); return; }
      loaded.colorSpace = uniform === 'detailsMap' ? THREE.NoColorSpace : THREE.SRGBColorSpace;
      if (uniform === 'detailsMap') layers.cloudMaterial.uniforms.detailsMap.value = loaded;
      loaded.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      material.uniforms[uniform].value = loaded;
      remaining--;
      if (remaining === 0) {
        clearTimeout(timeout);
        earth.visible = true;
        layers.clouds.visible = true;
        layers.atmosphere.visible = true;
        resize();
        controls.enabled = true;
        onState('ready');
      }
    }, undefined, () => {
      if (disposed || failed) return;
      failed = true;
      clearTimeout(timeout);
      onState('error', '昼夜纹理未能加载，请重试。');
    });
    textures.push(texture);
  }
  resize();

  // 阻尼需要逐帧更新；仅在控制器变化时绘制，隐藏标签页暂停循环。
  controls.addEventListener('change', render);
  let lastFrame = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animate = time => {
    if (disposed) return;
    const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 0;
    lastFrame = time;
    controls.update();
    if (earth.visible && !reducedMotion.matches) {
      const offset = (layers.cloudMaterial.uniforms.cloudOffset.value + delta * 0.0007) % 1;
      layers.cloudMaterial.uniforms.cloudOffset.value = offset;
      material.uniforms.cloudOffset.value = offset;
      render();
    }
  };
  const visibility = () => { lastFrame = 0; renderer.setAnimationLoop(document.hidden ? null : animate); };
  document.addEventListener('visibilitychange', visibility);
  visibility();
  const resetView = () => {
    controls.enableDamping = false;
    controls.target.set(0, 0, 0);
    camera.position.set(0, 0, fitDistance);
    controls.update();
    controls.enableDamping = true;
    render();
  };
  const dispose = () => {
    disposed = true;
    clearTimeout(timeout);
    observer.disconnect();
    renderer.setAnimationLoop(null);
    document.removeEventListener('visibilitychange', visibility);
    controls.removeEventListener('change', render);
    controls.dispose();
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    geometry.dispose();
    material.dispose();
    layers.cloudMaterial.dispose();
    layers.atmosphereMaterial.dispose();
    textures.forEach(texture => texture.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
  dispose.resetView = resetView;
  return dispose;
}






