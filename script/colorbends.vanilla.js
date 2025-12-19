/* =========================================================
   ColorBends Vanilla (React Bits → HTML/CSS/JS 이식 버전)
   requires: three.js
========================================================= */

(() => {
  if (!window.THREE) {
    console.error("THREE.js is required for ColorBendsVanilla");
    return;
  }

  const MAX_COLORS = 8;

  /* ------------------------------
     shaders
  ------------------------------ */

  const FRAG = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;

  vec2 rp = vec2(
    p.x * uRot.x - p.y * uRot.y,
    p.x * uRot.y + p.y * uRot.x
  );

  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;

  vec3 col = vec3(0.0);
  float a = 1.0;

  vec2 s = q;
  float cover = 0.0;

  for (int i = 0; i < MAX_COLORS; i++) {
    if (i >= uColorCount) break;

    s -= 0.01;
    vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));

    float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);

    float kBelow = clamp(uWarpStrength, 0.0, 1.0);
    float kMix = pow(kBelow, 0.3);
    float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);

    vec2 disp = (r - s) * kBelow;
    vec2 warped = s + disp * gain;

    float m1 = length(
      warped +
      sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0
    );

    float m = mix(m0, m1, kMix);
    float w = 1.0 - exp(-6.0 / exp(6.0 * m));

    col += uColors[i] * w;
    cover = max(cover, w);
  }

  col = clamp(col, 0.0, 1.0);
  a = (uTransparent > 0) ? cover : 1.0;

  if (uNoise > 0.0001) {
    float n = fract(
      sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898,78.233)))
      * 43758.5453123
    );
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  gl_FragColor = vec4(col * a, a);
}
`;

  const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

  /* ------------------------------
     class
  ------------------------------ */

  class ColorBendsVanilla {
    constructor(el, options = {}) {
      this.el = el;

      this.opt = Object.assign(
        {
          colors: ["#ff5c7a", "#8a5cff", "#00ffd1"],
          rotation: 30,
          speed: 0.3,
          scale: 1.2,
          frequency: 1.4,
          warpStrength: 1.2,
          mouseInfluence: 0.8,
          parallax: 0.6,
          noise: 0.08,
          transparent: true,
        },
        options
      );

      this.pointer = new THREE.Vector2(0, 0);
      this.clock = new THREE.Clock();

      this.init();
    }

    init() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const geometry = new THREE.PlaneGeometry(2, 2);
      const colors = Array.from(
        { length: MAX_COLORS },
        () => new THREE.Vector3()
      );

      this.material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uCanvas: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uSpeed: { value: this.opt.speed },
          uRot: { value: new THREE.Vector2(1, 0) },
          uColorCount: { value: 0 },
          uColors: { value: colors },
          uTransparent: { value: this.opt.transparent ? 1 : 0 },
          uScale: { value: this.opt.scale },
          uFrequency: { value: this.opt.frequency },
          uWarpStrength: { value: this.opt.warpStrength },
          uPointer: { value: this.pointer },
          uMouseInfluence: { value: this.opt.mouseInfluence },
          uParallax: { value: this.opt.parallax },
          uNoise: { value: this.opt.noise },
        },
        transparent: true,
        premultipliedAlpha: true,
      });

      this.mesh = new THREE.Mesh(geometry, this.material);
      this.scene.add(this.mesh);

      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.el.appendChild(this.renderer.domElement);

      this.setColors();
      this.resize();

      window.addEventListener("resize", () => this.resize());
      this.el.addEventListener("pointermove", (e) => this.onPointerMove(e));

      this.animate();
    }

    setColors() {
      const toVec = (hex) => {
        const h = hex.replace("#", "");
        const n = parseInt(h, 16);
        return new THREE.Vector3(
          ((n >> 16) & 255) / 255,
          ((n >> 8) & 255) / 255,
          (n & 255) / 255
        );
      };

      const arr = this.opt.colors.map(toVec).slice(0, MAX_COLORS);
      arr.forEach((v, i) => this.material.uniforms.uColors.value[i].copy(v));
      this.material.uniforms.uColorCount.value = arr.length;
    }

    resize() {
      const w = this.el.clientWidth || 1;
      const h = this.el.clientHeight || 1;
      this.renderer.setSize(w, h);
      this.material.uniforms.uCanvas.value.set(w, h);
    }

    onPointerMove(e) {
      const r = this.el.getBoundingClientRect();
      this.pointer.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -(((e.clientY - r.top) / r.height) * 2 - 1)
      );
    }

    animate() {
      this.material.uniforms.uTime.value = this.clock.getElapsedTime();

      const rad = (this.opt.rotation * Math.PI) / 180;
      this.material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => this.animate());
    }
  }

  window.ColorBendsVanilla = ColorBendsVanilla;
})();
