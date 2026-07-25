/* THREE.JS SCENE — uses THREE global from CDN */
(function() {
  'use strict';
  if (!window.THREE) return;
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  const canvas = document.getElementById('hcanvas');
  if (!canvas) return;

  const isMob = window.innerWidth < 768;

  /* ─── RENDERER ─── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  /* ─── SCENE / CAMERA ─── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0.5, 3.5);

  /* ─── GALAXY ─── */
  const COUNT = isMob ? 5000 : 14000;
  const pos  = new Float32Array(COUNT * 3);
  const col  = new Float32Array(COUNT * 3);
  const sc   = new Float32Array(COUNT);

  const cInner = new THREE.Color('#7c3aed');
  const cOuter = new THREE.Color('#22d3ee');
  const cAccent = new THREE.Color('#ec4899');

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const radius     = Math.random() * 4.5 + 0.2;
    const spinAngle  = radius * 1.8;
    const branchAngle = ((i % 3) / 3) * Math.PI * 2;
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
  geo.setAttribute('aScale',   new THREE.BufferAttribute(sc, 1));

  /* ─── SHADER MATERIAL ─── */
  const mat = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 30.0 * renderer.getPixelRatio() }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSize;
      attribute float aScale;
      varying vec3 vColor;
      void main(){
        vColor = color;
        vec4 mp = modelMatrix * vec4(position, 1.0);
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
  window.addEventListener('mousemove', function(e) {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ─── SCROLL PARALLAX (vanilla, no GSAP dep here) ─── */
  window.addEventListener('scroll', function() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const heroH = hero.offsetHeight;
    const p = Math.min(window.scrollY / heroH, 1);
    galaxy.position.y = -p * 1.8;
    galaxy.rotation.x = p * 0.6;
    mat.uniforms.uSize.value = 30 * renderer.getPixelRatio() * (1 - p * 0.5);
  }, { passive: true });

  /* ─── RESIZE ─── */
  window.addEventListener('resize', function() {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mat.uniforms.uSize.value = 30 * renderer.getPixelRatio();
  }, { passive: true });

  /* ─── ENTRY ANIM ─── */
  var entryStart = Date.now();
  var entryDur = 3500;

  /* ─── LOOP ─── */
  var clock = { start: Date.now() };
  var visible = true;
  var io = new IntersectionObserver(function(e) { visible = e[0].isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  (function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;

    var elapsed = (Date.now() - clock.start) / 1000;
    mat.uniforms.uTime.value = elapsed;

    // Entry scale-in
    var ep = Math.min((Date.now() - entryStart) / entryDur, 1);
    var eased = 1 - Math.pow(1 - ep, 3);
    if (ep < 1) {
      var s = 0.2 + eased * 0.8;
      galaxy.scale.set(s, s, s);
      galaxy.rotation.y = -(1 - eased) * Math.PI * 0.8;
    }

    // Mouse smoothing
    mx += (tmx - mx) * 0.03;
    my += (tmy - my) * 0.03;

    if (ep >= 1) galaxy.rotation.y = elapsed * 0.045 + mx * 0.35;
    camera.position.x += (mx * 0.25 - camera.position.x) * 0.025;
    camera.position.y += (my * 0.15 + 0.5 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();

  window.__threeReady = true;
})();
