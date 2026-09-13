import { ShaderMaterial, Mesh, BackSide, AdditiveBlending } from 'three';
const vertex = `
 varying vec2 vUv;
 varying vec3 vNormalWorld;
 varying vec3 vPositionWorld;
 void main() {
   vUv = uv;
   vNormalWorld = normalize(mat3(modelMatrix) * normal);
   vPositionWorld = (modelMatrix * vec4(position, 1.0)).xyz;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;
export function createEarthLayers(geometry, sunDirection) {
 const cloudMaterial = new ShaderMaterial({
   transparent: true, depthWrite: false,
   uniforms: { detailsMap: {value: null}, sunDirection, cloudOffset: {value: 0} },
   vertexShader: vertex,
   fragmentShader: `
     uniform sampler2D detailsMap;
     uniform vec3 sunDirection;
     uniform float cloudOffset;
     varying vec2 vUv;
     varying vec3 vNormalWorld;
     varying vec3 vPositionWorld;
     void main() {
       float density = smoothstep(0.2, 0.95, texture2D(detailsMap, vec2(fract(vUv.x + cloudOffset), vUv.y)).b);
       float light = dot(normalize(vNormalWorld), normalize(sunDirection));
       vec3 color = mix(vec3(0.025,0.04,0.075), vec3(0.95,0.98,1.0), smoothstep(-0.12,0.55,light));
       gl_FragColor = vec4(color, density * 0.88);
       #include <colorspace_fragment>
     }
   `
 });
 const atmosphereMaterial = new ShaderMaterial({
   transparent: true, depthWrite: false, side: BackSide, blending: AdditiveBlending,
   uniforms: {sunDirection}, vertexShader: vertex,
   fragmentShader: `
     uniform vec3 sunDirection;
     varying vec3 vNormalWorld;
     varying vec3 vPositionWorld;
     void main() {
       vec3 n = normalize(vNormalWorld);
       vec3 view = normalize(cameraPosition - vPositionWorld);
              // 外球壳射线距球心的最近距离：外缘透明，贴近地表处最亮。
       float mu = abs(dot(n, view));
       float impact = 1.045 * sqrt(max(0.0,1.0-mu*mu));
       float altitude = clamp((impact-1.0)/0.045,0.0,1.0);
       float rim = pow(1.0-altitude,3.0);
       float sun = dot(n, normalize(sunDirection));
       float lit = smoothstep(-0.4,0.65,sun);
       vec3 color = mix(vec3(0.08,0.025,0.06),vec3(0.10,0.46,1.0),lit);
       gl_FragColor = vec4(color, rim * (0.025 + lit * 0.9));
       #include <colorspace_fragment>
     }
   `
 });
 const clouds = new Mesh(geometry, cloudMaterial);
 clouds.scale.setScalar(1.008);
 clouds.renderOrder = 1;
 const atmosphere = new Mesh(geometry, atmosphereMaterial);
 atmosphere.scale.setScalar(1.045);
 atmosphere.renderOrder = 2;
 return {clouds, atmosphere, cloudMaterial, atmosphereMaterial};
}

