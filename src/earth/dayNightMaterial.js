import { ShaderMaterial, Vector3 } from 'three';

export function createDayNightMaterial() {
  return new ShaderMaterial({
    uniforms: {
      dayMap: { value: null },
      detailsMap: { value: null },
      cloudOffset: { value: 0 },
      nightMap: { value: null },
      // 世界坐标中的固定太阳方向，不随相机移动，也不随时间变化。
      sunDirection: { value: new Vector3(-1, 0.25, 0.25).normalize() }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayMap;
      uniform sampler2D detailsMap;
      uniform float cloudOffset;
      uniform sampler2D nightMap;
      uniform vec3 sunDirection;
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      void main() {
        float sunlight = dot(normalize(vWorldNormal), normalize(sunDirection));
        float dayWeight = smoothstep(-0.10, 0.18, sunlight);
        float nightWeight = 1.0 - smoothstep(-0.18, 0.02, sunlight);
        vec3 day = texture2D(dayMap, vUv).rgb;
        float water = 1.0 - smoothstep(0.12, 0.65, texture2D(detailsMap, vUv).g);
        float luminance = dot(day, vec3(0.2126,0.7152,0.0722));
        day = mix(vec3(luminance), day, 0.78);
        day = mix(day, max(day, vec3(0.012,0.046,0.10)), water * 0.85);
        // 利用高度纹理的屏幕导数扰动法线，增强山地受光细节。
        vec3 baseNormal = normalize(vWorldNormal);
        vec3 dx = dFdx(vWorldPosition);
        vec3 dy = dFdy(vWorldPosition);
        vec3 r1 = cross(dy, baseNormal);
        vec3 r2 = cross(baseNormal, dx);
        float determinant = dot(dx, r1);
        float height = texture2D(detailsMap, vUv).r * 0.026 * (1.0-water);
        vec3 gradient = sign(determinant) * (dFdx(height)*r1 + dFdy(height)*r2);
        vec3 terrainNormal = normalize(abs(determinant)*baseNormal - gradient);
        float terrainLight = max(dot(terrainNormal, normalize(sunDirection)), 0.0);
        vec3 night = texture2D(nightMap, vUv).rgb;
        // 夜光图也带有较暗的地表背景，压低背景，保留明亮灯光。
        float brightness = max(night.r, max(night.g, night.b));
        vec3 lights = vec3(1.0,0.66,0.24) * brightness * smoothstep(0.006, 0.07, brightness);
        vec3 daylight = day * (0.28 + 1.10 * terrainLight);
        vec3 darkSurface = day * 0.012 + vec3(0.001, 0.002, 0.005);
        vec3 color = mix(darkSurface, daylight, dayWeight);
        color += lights * nightWeight * 2.4;
        vec3 n = normalize(vWorldNormal);
        vec3 view = normalize(cameraPosition - vWorldPosition);
        vec3 halfVector = normalize(normalize(sunDirection) + view);
        float ocean = 1.0 - smoothstep(0.12, 0.65, texture2D(detailsMap, vUv).g);
        float cloud = smoothstep(0.2, 0.95, texture2D(detailsMap, vec2(fract(vUv.x + cloudOffset), vUv.y)).b);
        float specular = pow(max(dot(n, halfVector), 0.0), 65.0);
        color += vec3(0.75,0.88,1.0) * specular * ocean * dayWeight * (1.0 - cloud) * 1.25;
        // 在球体内部边缘加入轻微大气散射近似，与外层光晕衔接。
        float rim = pow(1.0 - max(dot(n, view), 0.0), 4.0);
        color += vec3(0.035,0.24,0.58) * rim * smoothstep(-0.3,0.6,sunlight);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  });
}


