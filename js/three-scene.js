import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

(function initThreeScene() {
  const canvas = document.getElementById('hcanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  /* ─── RENDERER ─── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  /* ─── SCENE / CAMERA ─── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0.5, 3.5);

  /* ─── GALAXY GEOMETRY ─── */
  const isMob = innerWidth < 768;
  const COUNT = isMob ? 5000 : 15000;
  const pos   = new Float32Array(COUNT * 3);
  const col   = new Float32Array(COUNT * 3);
  const sc    = new Float32Array(COUNT);

  const cInner = new THREE.Color('#7c3aed');
  const cOuter = new THREE.Color('#22d3ee');
  const cAccent= new THREE.Color('#ec4899');

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const radius     = Math.random() * 4.5 + 0.2;
    const spinAngle  = radius * 1.8;
    const branchAngle= ((i % 3) / 3) * Math.PI * 2;
    const scatter    = Math.pow(Math.random(), 2.5);
    const sign       = () => (Math.random() < 0.5 ? 1 : -1);

    pos[i3]     = Math.cos(branchAngle + spinAngle) * radius + scatter * sign() * 0.5;
    pos[i3 + 1] = scatter * sign() * 0.35;
    pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatter * sign() * 0.5;

    const mc = cInner.clone().lerp(cOuter, radius / 4.7);
    if (Math.random() < 0.04) mc.lerp(cAccent, 0.8);
    col[i3] = mc.r; col[i3+1] = mc.g; col[i3+2] = mc.b;
    sc[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aScale',   new THREE.BufferAttribute(sc,  1));

  /* ─── SHADER MATERIAL ─── */
  const mat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 30.0 * renderer.getPixelRatio() },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      attribute float aScale;
      varying vec3 vColor;
      void main(){
        vColor = color;
        vec4 mp = modelMatrix * vec4(position,1.0);
        mp.y += sin(uTime * 0.5 + mp.x * 1.8) * 0.05;
        mp.x += cos(uTime * 0.35 + mp.z * 1.5) * 0.04;
        vec4 vp = viewMatrix * mp;
        gl_Position = projectionMatrix * vp;
        gl_PointSize = uSize * aScale * (1.0 / -vp.z);
        gl_PointSize *= 0.85 + 0.15 * sin(uTime * 2.5 + aScale * 12.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main(){
        float d = distance(gl_PointCoord, vec2(0.5));
        if(d > 0.5) discard;
        float s = pow(1.0 - d * 2.0, 3.0);
        gl_FragColor = vec4(vColor, s);
      }
    `
  });

  const galaxy = new THREE.Points(geo, mat);
  scene.add(galaxy);

  /* ─── MOUSE ─── */
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('mousemove', e => {
    tmx = (e.clientX / innerWidth - 0.5) * 2;
    tmy = -(e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ─── SCROLL ─── */
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: self => {
      const p = self.progress;
      gsap.set(galaxy.position, { y: -p * 1.8 });
      gsap.set(galaxy.rotation, { x: p * 0.6 });
      mat.uniforms.uSize.value = 30 * renderer.getPixelRatio() * (1 - p * 0.5);
    }
  });

  /* ─── RESIZE ─── */
  const ro = new ResizeObserver(() => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    mat.uniforms.uSize.value = 30 * renderer.getPixelRatio();
  });
  ro.observe(canvas);

  /* ─── ENTRY ─── */
  gsap.from(galaxy.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 3.5, ease: 'power3.out', delay: 1.0 });
  gsap.from(galaxy.rotation, { y: -Math.PI * 0.8, duration: 4, ease: 'power3.out', delay: 1.0 });

  /* ─── VISIBILITY PAUSE ─── */
  let visible = true;
  new IntersectionObserver(e => visible = e[0].isIntersecting, { threshold: 0 }).observe(canvas);

  /* ─── LOOP ─── */
  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    mx += (tmx - mx) * 0.03;
    my += (tmy - my) * 0.03;
    galaxy.rotation.y = t * 0.045 + mx * 0.35;
    camera.position.x += (mx * 0.25 - camera.position.x) * 0.025;
    camera.position.y += (my * 0.15 + 0.5 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
})();
