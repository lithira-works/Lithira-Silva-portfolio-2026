import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { createKoiGeometry, createKoiMaterials, VARIETIES } from "./koi";

/**
 * The pond scene, framework-free. KoiPond.tsx mounts it into a canvas.
 * Top-down camera over a caustic floor; koi steer with a small boid model and
 * race to food the visitor drops.
 */

export interface PondOptions {
  count: number;
  interactive: boolean;
  reducedMotion: boolean;
  /** Read every frame: 0 = surface view, 1 = dived in. */
  depth?: () => number;
}

interface Fish {
  mesh: THREE.Mesh;
  shadow: THREE.Mesh;
  uniforms: ReturnType<typeof createKoiMaterials>["uniforms"];
  pos: THREE.Vector2;
  heading: number;
  turnVel: number;
  speed: number;
  baseSpeed: number;
  wander: number;
  scale: number;
  y: number;
  swim: number;
  curiosity: number;
  wake: number;
}

interface Pellet {
  mesh: THREE.Mesh;
  pos: THREE.Vector2;
  age: number;
}

interface Ripple {
  mesh: THREE.Mesh;
  age: number;
  life: number;
  size: number;
}

interface Drifter {
  obj: THREE.Object3D;
  vel: THREE.Vector2;
  spin: number;
  bob: number;
}

const CAM_HEIGHT = 6;
const FOV = 40;
const FLOOR_Y = -1.6;

const floorVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const floorFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  vec2 hash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }

  // Pebbles: distance to the nearest cell point.
  float pebbles(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float d = 1.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash2(i + g);
      d = min(d, length(g + o - f));
    }
    return d;
  }

  // Tileable water caustics.
  float caustic(vec2 uv, float t) {
    vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
    vec2 i = p;
    float c = 1.0;
    float inten = 0.005;
    for (int n = 0; n < 4; n++) {
      float tt = t * (1.0 - (3.5 / float(n + 1)));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
    }
    c /= 4.0;
    c = 1.17 - pow(c, 1.4);
    return pow(abs(c), 8.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float peb = pebbles(p * 2.2);
    vec3 col = mix(uShallow, uDeep, smoothstep(0.0, 0.55, peb) * 0.6 + 0.2);
    col *= 0.85 + 0.15 * hash(floor(p * 2.2));
    float c = caustic(p * 0.18 + vec2(uTime * 0.01, 0.0), uTime * 0.35);
    col += vec3(0.22, 0.7, 0.66) * c * 0.38;
    float far = smoothstep(4.0, 11.0, length(p));
    col = mix(col, uDeep * 0.7, far);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createPond(canvas: HTMLCanvasElement, opts: PondOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  const small = window.innerWidth < 760;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.5));
  renderer.setClearColor(0x03090c);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x03090c, 6, 16);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, CAM_HEIGHT, 0);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0x9fc4d0, 0.55));
  const sun = new THREE.DirectionalLight(0xcfe3ff, 1.1);
  sun.position.set(3, 8, 2);
  scene.add(sun);

  // Floor.
  const floorUniforms = {
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color(0x041015) },
    uShallow: { value: new THREE.Color(0x12303a) },
  };
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShaderMaterial({ uniforms: floorUniforms, vertexShader: floorVertex, fragmentShader: floorFragment }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  scene.add(floor);

  // Bounds of the visible pond at the surface; recomputed on resize.
  const bounds = new THREE.Vector2(4, 2.2);

  // Koi.
  const geo = createKoiGeometry();
  const fish: Fish[] = [];
  const order = [...VARIETIES].sort(() => Math.random() - 0.5);
  for (let i = 0; i < opts.count; i++) {
    const seed = Math.random();
    const { uniforms, body, shadow } = createKoiMaterials(VARIETIES.indexOf(order[i % order.length]), seed);
    const mesh = new THREE.Mesh(geo, body);
    const shadowMesh = new THREE.Mesh(geo, shadow);
    const scale = 0.95 + Math.random() * 0.6;
    const y = -0.25 - Math.random() * 0.6;
    mesh.scale.setScalar(scale);
    shadowMesh.scale.set(scale, 0.01, scale);
    mesh.renderOrder = 2;
    shadowMesh.renderOrder = 1;
    scene.add(mesh, shadowMesh);
    uniforms.uDim.value = 0.05 + (-y - 0.25) * 0.35;
    fish.push({
      mesh,
      shadow: shadowMesh,
      uniforms,
      pos: new THREE.Vector2((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3),
      heading: Math.random() * Math.PI * 2,
      turnVel: 0,
      speed: 0.3,
      baseSpeed: 0.22 + Math.random() * 0.16,
      wander: Math.random() * Math.PI * 2,
      scale,
      y,
      swim: Math.random() * 10,
      curiosity: 0.3 + Math.random() * 0.7,
      wake: 0,
    });
  }

  // Lily pads with a few lotus flowers.
  const drifters: Drifter[] = [];
  const padMat = new THREE.MeshStandardMaterial({ color: 0x2f5e40, roughness: 0.45, side: THREE.DoubleSide });
  const padMat2 = new THREE.MeshStandardMaterial({ color: 0x3f6f45, roughness: 0.45, side: THREE.DoubleSide });
  const padShadowMat = new THREE.MeshBasicMaterial({ color: 0x041013, transparent: true, opacity: 0.32, depthWrite: false });
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xf6dde2, roughness: 0.4, emissive: 0xffc2cf, emissiveIntensity: 0.35 });
  const petalTipMat = new THREE.MeshStandardMaterial({ color: 0xe98aa0, roughness: 0.4 });
  const seedMat = new THREE.MeshStandardMaterial({ color: 0xf2c94c, roughness: 0.6 });

  const makeLotus = () => {
    const g = new THREE.Group();
    const petalGeo = new THREE.SphereGeometry(0.5, 12, 8);
    for (let layer = 0; layer < 2; layer++) {
      const n = layer === 0 ? 8 : 6;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + layer * 0.3;
        const petal = new THREE.Mesh(petalGeo, layer === 0 ? petalTipMat : petalMat);
        petal.scale.set(0.16 - layer * 0.03, 0.035, 0.065);
        petal.position.set(Math.cos(a) * (0.1 - layer * 0.04), 0.03 + layer * 0.04, Math.sin(a) * (0.1 - layer * 0.04));
        petal.rotation.y = -a;
        petal.rotation.z = 0.5 + layer * 0.4;
        g.add(petal);
      }
    }
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), seedMat);
    seed.position.y = 0.07;
    g.add(seed);
    return g;
  };

  const padCount = Math.max(4, Math.round(opts.count * 0.8));
  for (let i = 0; i < padCount; i++) {
    const r = 0.22 + Math.random() * 0.26;
    const notch = Math.random() * Math.PI * 2;
    const geom = new THREE.CircleGeometry(r, 40, notch, Math.PI * 2 - 0.5);
    const pad = new THREE.Mesh(geom, Math.random() > 0.5 ? padMat : padMat2);
    pad.rotation.x = -Math.PI / 2;
    const group = new THREE.Group();
    group.add(pad);
    const sh = new THREE.Mesh(geom, padShadowMat);
    sh.rotation.x = -Math.PI / 2;
    sh.position.set(0.35, FLOOR_Y + 0.02, 0.22);
    group.add(sh);
    if (Math.random() < 0.35) {
      const lotus = makeLotus();
      lotus.position.set(r * 0.2, 0.01, -r * 0.1);
      group.add(lotus);
    }
    group.position.set((Math.random() - 0.5) * 9, 0.02, (Math.random() - 0.5) * 5);
    group.rotation.y = Math.random() * Math.PI * 2;
    scene.add(group);
    drifters.push({
      obj: group,
      vel: new THREE.Vector2(0.03 + Math.random() * 0.03, (Math.random() - 0.5) * 0.02),
      spin: (Math.random() - 0.5) * 0.06,
      bob: Math.random() * 10,
    });
  }

  // Drifting cherry petals, instanced.
  const PETALS = 46;
  const petalGeo = new THREE.CircleGeometry(0.05, 6);
  petalGeo.scale(1, 0.62, 1);
  const petals = new THREE.InstancedMesh(
    petalGeo,
    new THREE.MeshStandardMaterial({ color: 0xf7c9d2, roughness: 0.5, side: THREE.DoubleSide }),
    PETALS,
  );
  const petalState = Array.from({ length: PETALS }, () => ({
    x: (Math.random() - 0.5) * 10,
    z: (Math.random() - 0.5) * 6,
    y: 0.03 + Math.random() * 2.5,
    fall: 0.08 + Math.random() * 0.12,
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 1.5,
    tilt: Math.random() * Math.PI,
  }));
  scene.add(petals);
  const dummy = new THREE.Object3D();

  // Floating paper lanterns (toro nagashi): warm light on the night water.
  const lanterns: { paper: THREE.MeshStandardMaterial; light: THREE.PointLight; seed: number }[] = [];
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.8 });
  const glowGeo = new THREE.CircleGeometry(1, 48);
  const glowMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(0xff9a3c) } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 uColor; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(max(1.0 - d, 0.0), 2.2) * 0.55; gl_FragColor = vec4(uColor * a, a); }",
  });
  const lanternCount = opts.count >= 8 ? 3 : 2;
  for (let i = 0; i < lanternCount; i++) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.26), woodMat);
    base.position.y = 0.02;
    const paper = new THREE.MeshStandardMaterial({ color: 0xffe2b8, emissive: 0xff9a3c, emissiveIntensity: 2.6, roughness: 0.9 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.2), paper);
    body.position.y = 0.17;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.24), woodMat);
    cap.position.y = 0.315;
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.012;
    glow.scale.setScalar(1.1);
    const light = new THREE.PointLight(0xffa04a, 1.6, 3.2, 1.6);
    light.position.y = 0.35;
    g.add(base, body, cap, glow, light);
    g.position.set((Math.random() - 0.5) * 7, 0, (Math.random() - 0.5) * 3.4);
    g.rotation.y = Math.random() * Math.PI;
    scene.add(g);
    lanterns.push({ paper, light, seed: Math.random() * 100 });
    drifters.push({ obj: g, vel: new THREE.Vector2(0.05 + Math.random() * 0.03, (Math.random() - 0.5) * 0.02), spin: (Math.random() - 0.5) * 0.04, bob: Math.random() * 10 });
  }

  // Fireflies: soft additive points drifting above the water.
  const FLIES = opts.count >= 8 ? 90 : 50;
  const flyPos = new Float32Array(FLIES * 3);
  const flySeed = new Float32Array(FLIES);
  for (let i = 0; i < FLIES; i++) {
    flyPos.set([(Math.random() - 0.5) * 11, 0.2 + Math.random() * 2.2, (Math.random() - 0.5) * 6], i * 3);
    flySeed[i] = Math.random() * 100;
  }
  const flyGeo = new THREE.BufferGeometry();
  flyGeo.setAttribute("position", new THREE.BufferAttribute(flyPos, 3));
  flyGeo.setAttribute("aSeed", new THREE.BufferAttribute(flySeed, 1));
  const flyUniforms = { uTime: { value: 0 }, uPixel: { value: renderer.getPixelRatio() } };
  const flies = new THREE.Points(
    flyGeo,
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: flyUniforms,
      vertexShader: `
        uniform float uTime; uniform float uPixel; attribute float aSeed; varying float vA;
        void main(){
          vec3 p = position;
          p.x += sin(uTime * 0.3 + aSeed) * 0.5;
          p.z += cos(uTime * 0.25 + aSeed * 1.3) * 0.4;
          p.y += sin(uTime * 0.6 + aSeed * 2.0) * 0.15;
          vA = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 1.7 + aSeed * 5.0), 3.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (9.0 + 6.0 * vA) * uPixel * (4.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = pow(max(1.0 - d, 0.0), 2.0) * vA;
          gl_FragColor = vec4(vec3(1.0, 0.86, 0.45) * a * 1.6, a);
        }`,
    }),
  );
  scene.add(flies);

  // Moonlit glints on the surface.
  const glintUniforms = { uTime: { value: 0 } };
  const glints = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: glintUniforms,
      vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: `
        uniform float uTime; varying vec3 vW;
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
        void main(){
          vec2 p = vW.xz * 3.0;
          float w = n(p + vec2(uTime * 0.4, uTime * 0.2)) * n(p * 1.7 - vec2(uTime * 0.3, -uTime * 0.25));
          float g = smoothstep(0.42, 0.62, w) * 0.22;
          gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * g, g);
        }`,
    }),
  );
  glints.rotation.x = -Math.PI / 2;
  glints.position.y = 0.05;
  scene.add(glints);

  // Food and ripples.
  const pellets: Pellet[] = [];
  const pelletGeo = new THREE.SphereGeometry(0.035, 8, 6);
  const pelletMat = new THREE.MeshStandardMaterial({ color: 0x9a6a3a, roughness: 0.8 });
  const ripples: Ripple[] = [];
  const ringGeo = new THREE.RingGeometry(0.92, 1, 64);

  const ripple = (x: number, z: number, size = 1, life = 1.8) => {
    const mat = new THREE.MeshBasicMaterial({ color: 0xe8f4f5, transparent: true, opacity: 0.55, depthWrite: false });
    const m = new THREE.Mesh(ringGeo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.04, z);
    m.scale.setScalar(0.01);
    scene.add(m);
    ripples.push({ mesh: m, age: 0, life, size });
  };

  const dropFood = (x: number, z: number) => {
    for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(pelletGeo, pelletMat);
      const px = x + (Math.random() - 0.5) * 0.25;
      const pz = z + (Math.random() - 0.5) * 0.25;
      m.position.set(px, 0.02, pz);
      scene.add(m);
      pellets.push({ mesh: m, pos: new THREE.Vector2(px, pz), age: 0 });
    }
    ripple(x, z, 1.1);
    setTimeout(() => ripple(x, z, 0.7, 1.4), 180);
  };

  // Pointer → surface point.
  const raycaster = new THREE.Raycaster();
  const surface = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const toSurface = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(surface, hit) ? hit : null;
  };
  let lastTrail = 0;
  const pointer = new THREE.Vector2();
  let pointerAt = -10000;
  const onDown = (e: PointerEvent) => {
    const p = toSurface(e.clientX, e.clientY);
    if (p) dropFood(p.x, p.z);
  };
  const onMove = (e: PointerEvent) => {
    const now = performance.now();
    if (now - lastTrail < 160) return;
    lastTrail = now;
    const p = toSurface(e.clientX, e.clientY);
    if (p) {
      pointer.set(p.x, p.z);
      pointerAt = performance.now();
      ripple(p.x, p.z, 0.35, 1.1);
    }
  };
  if (opts.interactive) {
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
  }

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.75, 0.55, 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    // The glow is soft anyway; half resolution costs a quarter of the fill.
    bloom.setSize(Math.round(w * renderer.getPixelRatio() * 0.5), Math.round(h * renderer.getPixelRatio() * 0.5));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const halfH = CAM_HEIGHT * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    bounds.set(halfH * camera.aspect, halfH);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Simulation.
  const tmp = new THREE.Vector2();
  const steer = new THREE.Vector2();
  const angleDiff = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
  const speedScale = opts.reducedMotion ? 0.35 : 1;

  const update = (dt: number, time: number) => {
    floorUniforms.uTime.value = time;

    for (const f of fish) {
      steer.set(0, 0);
      // Wander.
      f.wander += (Math.random() - 0.5) * 2.4 * dt;
      steer.x += Math.cos(f.wander) * 0.6;
      steer.y += Math.sin(f.wander) * 0.6;

      // Food: nearest pellet within reach.
      let target: Pellet | null = null;
      let best = 4.5;
      for (const p of pellets) {
        const d = p.pos.distanceTo(f.pos);
        if (d < best) { best = d; target = p; }
      }
      let hungry = false;
      if (target) {
        hungry = true;
        tmp.copy(target.pos).sub(f.pos).normalize().multiplyScalar(3);
        steer.add(tmp);
        const nose = tmp.set(Math.cos(f.heading), Math.sin(f.heading)).multiplyScalar(0.45 * f.scale).add(f.pos);
        if (nose.distanceTo(target.pos) < 0.14) {
          scene.remove(target.mesh);
          pellets.splice(pellets.indexOf(target), 1);
          ripple(target.pos.x, target.pos.y, 0.3, 0.9);
        }
      }

      // Curious koi drift toward the pointer.
      if (!hungry && performance.now() - pointerAt < 2500) {
        const d = pointer.distanceTo(f.pos);
        if (d < 3 && d > 0.5) {
          tmp.copy(pointer).sub(f.pos).normalize().multiplyScalar(1.4 * f.curiosity);
          steer.add(tmp);
        }
      }

      // Separation.
      for (const o of fish) {
        if (o === f) continue;
        const d = f.pos.distanceTo(o.pos);
        if (d < 0.7 && d > 0.0001) {
          tmp.copy(f.pos).sub(o.pos).multiplyScalar((0.7 - d) * 2.2 / d);
          steer.add(tmp);
        }
      }

      // Soft walls.
      const wx = bounds.x * 0.92;
      const wz = bounds.y * 0.88;
      if (f.pos.x > wx) steer.x -= (f.pos.x - wx) * 4;
      if (f.pos.x < -wx) steer.x -= (f.pos.x + wx) * 4;
      if (f.pos.y > wz) steer.y -= (f.pos.y - wz) * 4;
      if (f.pos.y < -wz) steer.y -= (f.pos.y + wz) * 4;

      const desired = Math.atan2(steer.y, steer.x);
      const maxTurn = hungry ? 2.6 : 1.1;
      const want = THREE.MathUtils.clamp(angleDiff(f.heading, desired) * 2, -maxTurn, maxTurn);
      f.turnVel = THREE.MathUtils.lerp(f.turnVel, want, 1 - Math.exp(-dt * 3));
      f.heading += f.turnVel * dt;

      const targetSpeed = (hungry ? 0.95 : f.baseSpeed) * speedScale;
      f.speed = THREE.MathUtils.lerp(f.speed, targetSpeed, 1 - Math.exp(-dt * (hungry ? 2.5 : 0.8)));
      f.pos.x += Math.cos(f.heading) * f.speed * dt;
      f.pos.y += Math.sin(f.heading) * f.speed * dt;

      f.swim += dt * (2.2 + f.speed * 9);

      // A wake of small rings when a fish darts.
      f.wake -= dt;
      if (f.speed > 0.55 && f.wake <= 0) {
        f.wake = 0.3;
        ripple(f.pos.x - Math.cos(f.heading) * 0.5 * f.scale, f.pos.y - Math.sin(f.heading) * 0.5 * f.scale, 0.28, 0.8);
      }
      f.uniforms.uTime.value = time;
      f.uniforms.uSwim.value = f.swim;
      f.uniforms.uTurn.value = THREE.MathUtils.clamp(-f.turnVel * 0.35, -0.5, 0.5);
      f.uniforms.uAmp.value = 0.05 + f.speed * 0.08;

      f.mesh.position.set(f.pos.x, f.y, f.pos.y);
      f.mesh.rotation.y = -f.heading;
      f.shadow.position.set(f.pos.x + 0.35, FLOOR_Y + 0.01, f.pos.y + 0.22);
      f.shadow.rotation.y = -f.heading;
    }

    // Pellets sink slowly and dissolve.
    for (let i = pellets.length - 1; i >= 0; i--) {
      const p = pellets[i];
      p.age += dt;
      p.mesh.position.y = 0.02 - Math.min(p.age * 0.03, 0.2);
      if (p.age > 14) {
        scene.remove(p.mesh);
        pellets.splice(i, 1);
      }
    }

    // Ripples.
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.age += dt;
      const k = r.age / r.life;
      r.mesh.scale.setScalar(0.02 + k * 1.1 * r.size);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - k) * (1 - k);
      if (k >= 1) {
        scene.remove(r.mesh);
        (r.mesh.material as THREE.Material).dispose();
        ripples.splice(i, 1);
      }
    }

    // Lily pads drift on a slow current and wrap.
    for (const d of drifters) {
      d.obj.position.x += d.vel.x * dt * speedScale;
      d.obj.position.z += d.vel.y * dt * speedScale;
      d.obj.rotation.y += d.spin * dt;
      d.obj.position.y = 0.02 + Math.sin(time * 0.8 + d.bob) * 0.01;
      const lx = bounds.x + 1.2;
      if (d.obj.position.x > lx) d.obj.position.x = -lx;
      if (d.obj.position.z > bounds.y + 1) d.obj.position.z = -bounds.y - 1;
      if (d.obj.position.z < -bounds.y - 1) d.obj.position.z = bounds.y + 1;
    }

    // Petals fall, land, float.
    petalState.forEach((s, i) => {
      if (s.y > 0.03) {
        s.y -= s.fall * dt * speedScale;
        s.x += Math.sin(time * 0.7 + i) * 0.1 * dt;
        s.rot += s.spin * dt;
        s.tilt += dt * 0.8;
      } else {
        s.y = 0.03;
        s.x += 0.04 * dt * speedScale;
        s.rot += s.spin * 0.1 * dt;
      }
      if (s.x > bounds.x + 1) {
        s.x = -bounds.x - 1;
        s.y = 0.5 + Math.random() * 2.5;
      }
      dummy.position.set(s.x, s.y, s.z);
      dummy.rotation.set(-Math.PI / 2 + (s.y > 0.03 ? Math.sin(s.tilt) * 0.8 : 0), 0, s.rot);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);
    });
    petals.instanceMatrix.needsUpdate = true;

    // Lanterns flicker.
    for (const l of lanterns) {
      const flick = 2.4 + Math.sin(time * 7 + l.seed) * 0.15 + Math.sin(time * 13.3 + l.seed * 2) * 0.1;
      l.paper.emissiveIntensity = flick;
      l.light.intensity = flick * 0.65;
    }
    flyUniforms.uTime.value = time;
    glintUniforms.uTime.value = time;

    // Camera dive.
    const d = opts.depth ? opts.depth() : 0;
    camera.position.set(0, CAM_HEIGHT - 3.4 * d, 2.6 * d);
    camera.lookAt(0, -0.6 * d, -1.2 * d);
    (scene.fog as THREE.Fog).near = 6 - 4 * d;
    (scene.fog as THREE.Fog).far = 16 - 8 * d;
  };

  // Loop, paused offscreen.
  let raf = 0;
  let running = false;
  let last = performance.now();
  let time = 0;
  const frame = () => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    time += dt;
    update(dt, time);
    composer.render();
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
  io.observe(canvas);

  // Ambient life: a koi surfaces now and then.
  const ambient = window.setInterval(() => {
    if (!running || !fish.length) return;
    const f = fish[Math.floor(Math.random() * fish.length)];
    ripple(f.pos.x + Math.cos(f.heading) * 0.4, f.pos.y + Math.sin(f.heading) * 0.4, 0.5, 1.4);
  }, 2600);

  // Warm up so the first frame is not a still.
  update(0.016, 0);
  composer.render();

  return {
    dropFood,
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      clearInterval(ambient);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
