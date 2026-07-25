
'use strict';
const RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB=/Mobi|Android/i.test(navigator.userAgent)||innerWidth<960;

/* BOOT */
(function(){
  const boot=document.getElementById('boot'),fill=document.getElementById('bbf'),pct=document.getElementById('bpct'),st=document.getElementById('bst');
  const lines=document.querySelectorAll('.bl');
  let p=0;
  lines.forEach((l,i)=>setTimeout(()=>l.classList.add('s'),i*200+200));
  const steps=['Booting...','Loading modules...','Verifying certs...','Mounting projects...','Rendering 3D...','Ready!'];
  let si=0;
  const iv=setInterval(()=>{
    p=Math.min(p+Math.random()*6+2,100);
    fill.style.width=p+'%';pct.textContent=Math.floor(p)+'%';
    if(p>si*17&&si<steps.length)st.textContent=steps[si++];
    if(p>=100){clearInterval(iv);setTimeout(()=>{boot.classList.add('done');setTimeout(()=>{boot.style.display='none';initAll();},900);},400);}
  },75);
})();

async function initAll(){
  initNav();initScrollProgress();initScrollTop();
  if(!MOB)initCursor();
  await initCanvas();initCounters();initReveal();initSkillBars();
  initTilt();initMagnetic();initChatbot();initCmdk();
  initGitHub();initLightbox();initDemoModal();initArchModal();
  initContactForm();initClock();initKonami();
}

/* NAV */
function initNav(){
  const nav=document.getElementById('nav');
  window.addEventListener('scroll',()=>nav.classList.toggle('sc',scrollY>20),{passive:true});
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const h=a.getAttribute('href');
      if(h&&h.length>1){e.preventDefault();document.querySelector(h)?.scrollIntoView({behavior:'smooth'});}
    });
  });
}

/* SCROLL PROGRESS */
function initScrollProgress(){
  const bar=document.getElementById('spf');
  window.addEventListener('scroll',()=>{const t=scrollY,h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?(t/h)*100:0)+'%';},{passive:true});
}

/* SCROLL TOP */
function initScrollTop(){
  const btn=document.getElementById('stb');
  window.addEventListener('scroll',()=>btn.classList.toggle('v',scrollY>600),{passive:true});
  btn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
}

/* CURSOR */
function initCursor(){
  const dot=document.getElementById('cd'),ring=document.getElementById('cr');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
  (function anim(){dot.style.left=mx+'px';dot.style.top=my+'px';rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim);})();
  document.addEventListener('mousedown',()=>ring.classList.add('c'));
  document.addEventListener('mouseup',()=>ring.classList.remove('c'));
  document.querySelectorAll('a,button,.ccrd,.pcard,.rc,.sc2,.skcat,.ecard2,.clnk,.chip2,.citem,input,textarea,.alink').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('h'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('h'));
  });
}

/* THREE.JS 3D NEURAL NETWORK SCENE */
async function initCanvas(){
  if(RM)return;
  const canvas=document.getElementById('hcanvas');if(!canvas)return;
  
  const {Scene,PerspectiveCamera,WebGLRenderer,BufferGeometry,BufferAttribute,Points,PointsMaterial,Color,Vector3,MathUtils,Clock,ShaderMaterial,AdditiveBlending,TextureLoader,RepeatWrapping,Group,Line,LineBasicMaterial,LineSegments,InstancedMesh,Matrix4,Raycaster,DoubleSide,Mesh,MeshBasicMaterial,SphereGeometry,Float32BufferAttribute} = await import('three');
  const {EffectComposer,RenderPass} = await import('three/addons/postprocessing/EffectComposer.js');
  const {UnrealBloomPass} = await import('three/addons/postprocessing/UnrealBloomPass.js');
  const {OutputPass} = await import('three/addons/postprocessing/OutputPass.js');
  const gsap = (await import('gsap')).default;
  const {ScrollTrigger} = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const scene=new Scene();
  const camera=new PerspectiveCamera(50,innerWidth/innerHeight,0.1,100);
  camera.position.z=3;
  const renderer=new WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.toneMapping=3;
  renderer.toneMappingExposure=1.2;

  const composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  const bloom=new UnrealBloomPass(new Vector3(innerWidth,innerHeight),1.5,0.4,0.85);
  bloom.threshold=0.1;
  bloom.strength=1.2;
  bloom.radius=0.5;
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const N=MOB?1500:4000;
  const positions=new Float32Array(N*3);
  const colors=new Float32Array(N*3);
  const sizes=new Float32Array(N);
  const velocities=new Float32Array(N*3);
  const phases=new Float32Array(N);
  const speeds=new Float32Array(N);
  const connections=[];
  const maxDist=1.8;

  const violet=new Color(0x7c3aed);
  const cyan=new Color(0x22d3ee);
  const pink=new Color(0xec4899);
  const white=new Color(0xc4b5fd);

  for(let i=0;i<N;i++){
    const theta=Math.random()*Math.PI*2;
    const phi=Math.acos(2*Math.random()-1);
    const r=1.2+Math.random()*1.5;
    const x=r*Math.sin(phi)*Math.cos(theta);
    const y=r*Math.cos(phi);
    const z=r*Math.sin(phi)*Math.sin(theta);
    positions[i*3]=x;positions[i*3+1]=y;positions[i*3+2]=z;
    const colorChoice=Math.random();
    let c;
    if(colorChoice<0.35)c=violet;
    else if(colorChoice<0.65)c=cyan;
    else c=pink;
    colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
    sizes[i]=Math.random()*3+1.5;
    velocities[i*3]=(Math.random()-0.5)*0.0015;
    velocities[i*3+1]=(Math.random()-0.5)*0.0015;
    velocities[i*3+2]=(Math.random()-0.5)*0.0015;
    phases[i]=Math.random()*Math.PI*2;
    speeds[i]=Math.random()*0.02+0.005;
  }

  const geo=new BufferGeometry();
  geo.setAttribute('position',new BufferAttribute(positions,3));
  geo.setAttribute('color',new BufferAttribute(colors,3));
  geo.setAttribute('size',new BufferAttribute(sizes,1));
  geo.setAttribute('aPhase',new BufferAttribute(phases,1));
  geo.setAttribute('aSpeed',new BufferAttribute(speeds,1));

  const vertexShader=`
    attribute float size;
    attribute float aPhase;
    attribute float aSpeed;
    varying float vAlpha;
    varying vec3 vColor;
    uniform float uTime;
    uniform float uScrollProgress;
    void main(){
      vec3 pos=position;
      float pulse=sin(uTime*aSpeed*20.0+aPhase)*0.5+0.5;
      pos+=normalize(position)*pulse*0.08;
      pos.y+=sin(uTime*0.5+aPhase)*0.03;
      vec4 mv=modelViewMatrix*vec4(pos,1.0);
      gl_PointSize=size*(300.0/-mv.z);
      gl_Position=projectionMatrix*mv;
      vAlpha=pulse*0.7+0.3;
      vColor=color;
    }
  `;

  const fragmentShader=`
    varying float vAlpha;
    varying vec3 vColor;
    void main(){
      float d=length(gl_PointCoord-vec2(0.5));
      if(d>0.5)discard;
      float alpha=smoothstep(0.5,0.0,d)*vAlpha;
      gl_FragColor=vec4(vColor,alpha);
    }
  `;

  const material=new PointsMaterial({
    size:1,vertexColors:true,transparent:true,opacity:0.8,
    blending:AdditiveBlending,depthWrite:false,sizeAttenuation:true
  });

  const points=new Points(geo,material);
  scene.add(points);

  const connectionGeo=new BufferGeometry();
  const connectionPositions=[];
  const connectionColors=[];
  const connectionAlphas=[];
  const KD=1.8;

  for(let i=0;i<N;i+=3){
    for(let j=i+3;j<Math.min(i+30,N);j+=3){
      const dx=positions[i*3]-positions[j*3];
      const dy=positions[i*3+1]-positions[j*3+1];
      const dz=positions[i*3+2]-positions[j*3+2];
      const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
      if(dist<KD){
        connectionPositions.push(positions[i*3],positions[i*3+1],positions[i*3+2]);
        connectionPositions.push(positions[j*3],positions[j*3+1],positions[j*3+2]);
        const c1=new Color(colors[i*3],colors[i*3+1],colors[i*3+2]);
        const c2=new Color(colors[j*3],colors[j*3+1],colors[j*3+2]);
        const c=c1.clone().lerp(c2,0.5);
        connectionColors.push(c.r,c.g,c.b);
        connectionColors.push(c.r,c.g,c.b);
        connectionAlphas.push(1-dist/KD,1-dist/KD);
      }
    }
    if(connectionPositions.length>30000)break;
  }

  connectionGeo.setAttribute('position',new Float32BufferAttribute(connectionPositions,3));
  connectionGeo.setAttribute('color',new Float32BufferAttribute(connectionColors,3));
  connectionGeo.setAttribute('alpha',new Float32BufferAttribute(connectionAlphas,1));

  const connVertexShader=`
    attribute float alpha;
    varying float vAlpha;
    varying vec3 vColor;
    uniform float uTime;
    void main(){
      vAlpha=alpha*(sin(uTime*2.0+position.x*10.0)*0.3+0.7);
      vColor=color;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
  `;

  const connFragmentShader=`
    varying float vAlpha;
    varying vec3 vColor;
    void main(){
      gl_FragColor=vec4(vColor,vAlpha*0.4);
    }
  `;

  const connMaterial=new ShaderMaterial({
    vertexShader:connVertexShader,fragmentShader:connFragmentShader,
    transparent:true,blending:AdditiveBlending,depthWrite:false,
    vertexColors:true,uniforms:{uTime:{value:0}}
  });

  const connectionsMesh=new LineSegments(connectionGeo,connMaterial);
  scene.add(connectionsMesh);

  const ambientParticles=500;
  const ambPos=new Float32Array(ambientParticles*3);
  const ambCol=new Float32Array(ambientParticles*3);
  const ambSize=new Float32Array(ambientParticles);
  for(let i=0;i<ambientParticles;i++){
    ambPos[i*3]=(Math.random()-0.5)*8;
    ambPos[i*3+1]=(Math.random()-0.5)*8;
    ambPos[i*3+2]=(Math.random()-0.5)*8;
    const c=Math.random()<0.5?violet:cyan;
    ambCol[i*3]=c.r;ambCol[i*3+1]=c.g;ambCol[i*3+2]=c.b;
    ambSize[i]=Math.random()*0.5+0.2;
  }
  const ambGeo=new BufferGeometry();
  ambGeo.setAttribute('position',new BufferAttribute(ambPos,3));
  ambGeo.setAttribute('color',new BufferAttribute(ambCol,3));
  ambGeo.setAttribute('size',new BufferAttribute(ambSize,1));
  const ambMat=new PointsMaterial({size:1,vertexColors:true,transparent:true,opacity:0.3,blending:AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  const ambPoints=new Points(ambGeo,ambMat);
  scene.add(ambPoints);

  const clock=new Clock();
  let mouseX=0,mouseY=0,targetRotX=0,targetRotY=0;
  let scrollProgress=0;
  let rafId;

  function onResize(){
    const w=innerWidth,h=innerHeight;
    camera.aspect=w/h;camera.updateProjectionMatrix();
    renderer.setSize(w,h);composer.setSize(w,h);
    bloom.resolution.set(w,h);
  }
  window.addEventListener('resize',onResize,{passive:true});

  window.addEventListener('mousemove',e=>{
    mouseX=(e.clientX/innerWidth-0.5)*0.8;
    mouseY=(e.clientY/innerHeight-0.5)*0.8;
  },{passive:true});

  ScrollTrigger.create({
    trigger:'body',start:'top top',end:'bottom bottom',
    onUpdate:self=>{scrollProgress=self.progress;}
  });

  function animate(){
    rafId=requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    const dt=clock.getDelta();

    targetRotY=mouseX*0.3;
    targetRotX=mouseY*0.3;
    points.rotation.y+= (targetRotY-points.rotation.y)*0.02;
    points.rotation.x+= (targetRotX-points.rotation.x)*0.02;
    connectionsMesh.rotation.y=points.rotation.y;
    connectionsMesh.rotation.x=points.rotation.x;
    ambPoints.rotation.y=t*0.01;
    ambPoints.rotation.x=Math.sin(t*0.1)*0.1;

    const posAttr=geo.getAttribute('position');
    const velAttr=velocities;
    for(let i=0;i<N;i++){
      posAttr.setXYZ(i,
        posAttr.getX(i)+velAttr[i*3],
        posAttr.getY(i)+velAttr[i*3+1],
        posAttr.getZ(i)+velAttr[i*3+2]
      );
      const r=Math.sqrt(posAttr.getX(i)**2+posAttr.getY(i)**2+posAttr.getZ(i)**2);
      if(r>3){
        velAttr[i*3]*=-1;velAttr[i*3+1]*=-1;velAttr[i*3+2]*=-1;
      }
    }
    posAttr.needsUpdate=true;

    material.uniforms={uTime:{value:t},uScrollProgress:{value:scrollProgress}};
    connMaterial.uniforms.uTime.value=t;

    camera.position.z=3+scrollProgress*0.5;
    points.scale.setScalar(1+scrollProgress*0.1);

    composer.render();
  }
  animate();

  return ()=>{
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize',onResize);
    window.removeEventListener('mousemove',()=>{});
    geo.dispose();material.dispose();connectionGeo.dispose();connMaterial.dispose();
    ambGeo.dispose();ambMat.dispose();renderer.dispose();
  };
}

/* COUNTERS */
function initCounters(){
  setTimeout(()=>{
    document.querySelectorAll('.ticker').forEach(el=>{
      const tgt=parseFloat(el.dataset.t),suf=el.dataset.s||'';
      if(RM){el.textContent=tgt+suf;return;}
      let cur=0;const step=20,steps=1400/step;
      const iv=setInterval(()=>{
        cur=Math.min(cur+tgt/steps,tgt);
        el.textContent=(Number.isInteger(tgt)?Math.floor(cur):cur.toFixed(1))+suf;
        if(cur>=tgt)clearInterval(iv);
      },step);
    });
  },900);
}

/* SCROLL REVEAL */
function initReveal(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');obs.unobserve(e.target);}});},{threshold:.07,rootMargin:'0px 0px -25px 0px'});
  document.querySelectorAll('.rv,.rl,.rr').forEach(el=>{if(RM)el.classList.add('v');else obs.observe(el);});
}

/* SKILL BARS */
function initSkillBars(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.sbf').forEach(b=>setTimeout(()=>{b.style.width=b.dataset.p+'%';},120));obs.unobserve(e.target);}});
  },{threshold:.18});
  document.querySelectorAll('.skcat').forEach(c=>obs.observe(c));
}

/* 3D TILT */
function initTilt(){
  if(RM||MOB)return;
  document.querySelectorAll('.pcard,.sc2,.rc').forEach(card=>{
    let raf;
    card.addEventListener('mousemove',e=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect();
        const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
        const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
        card.style.transform=`perspective(1000px) rotateX(${-dy*8}deg) rotateY(${dx*8}deg) scale(1.02)`;
        card.style.transition='transform .05s linear';
        if(card.classList.contains('pcard')){
          card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
          card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
        }
      });
    });
    card.addEventListener('mouseleave',()=>{cancelAnimationFrame(raf);card.style.transition='transform .6s var(--ease)';card.style.transform='';});
  });
}

/* MAGNETIC */
function initMagnetic(){
  if(RM||MOB)return;
  document.querySelectorAll('.btnp,.btns').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();const dx=(e.clientX-r.left-r.width/2)*.28,dy=(e.clientY-r.top-r.height/2)*.28;btn.style.transform=`translate(${dx}px,${dy}px) translateY(-2px)`;btn.style.transition='transform .1s ease';});
    btn.addEventListener('mouseleave',()=>{btn.style.transition='transform .5s var(--ease)';btn.style.transform='';});
  });
}

/* COMMAND PALETTE */
function initCmdk(){
  const CMDS=[
    {ic:'🏠',l:'Hero',d:'Back to top',h:'#hero',s:'NAVIGATE'},{ic:'👤',l:'About Me',d:'Background & education',h:'#about',s:'NAVIGATE'},
    {ic:'⚡',l:'Skills',d:'AI/ML, backend, DevOps',h:'#skills',s:'NAVIGATE'},{ic:'💼',l:'Experience',d:'2 internships',h:'#experience',s:'NAVIGATE'},
    {ic:'🚀',l:'Projects',d:'4 live deployments',h:'#projects',s:'NAVIGATE'},{ic:'🏅',l:'Certifications',d:'CAD, CSA, NPTEL',h:'#certs',s:'NAVIGATE'},
    {ic:'✉',l:'Contact',d:'Get in touch',h:'#contact',s:'NAVIGATE'},
    {ic:'⚡',l:'Enterprise AI ServiceNow',d:'Live on Vercel',h:'https://enterprise-ai-servicenow-platform.vercel.app',ext:true,s:'LIVE PROJECTS'},
    {ic:'🤖',l:'AI Support Platform',d:'34/34 tests · Render',h:'https://ai-support-platform-2xnp.onrender.com',ext:true,s:'LIVE PROJECTS'},
    {ic:'📊',l:'Sales Analytics',d:'$10M data · Render',h:'https://sales-analytics-pipeline.onrender.com',ext:true,s:'LIVE PROJECTS'},
    {ic:'⚡',l:'GitHub',d:'github.com/kamalpraneeth',h:'https://github.com/kamalpraneeth',ext:true,s:'LINKS'},
    {ic:'🔗',l:'LinkedIn',d:'Professional profile',h:'https://linkedin.com/in/kamal-praneeth-batchu-352b68258',ext:true,s:'LINKS'},
    {ic:'✉',l:'Email',d:'kamalpraneethbatchu@gmail.com',h:'mailto:kamalpraneethbatchu@gmail.com',s:'LINKS'},
    {ic:'🖐️',l:'Hand Gesture Control',d:'Minority Report style control',action:'gesture',s:'ACTIONS'},
    {ic:'🤖',l:'Chat with KAI',d:'AI portfolio assistant',action:'chat',s:'ACTIONS'},
    {ic:'☀',l:'Toggle Theme',d:'Dark / Enterprise light',action:'theme',s:'ACTIONS'},
  ];
  const ov=document.getElementById('cmdk'),inp=document.getElementById('cinput'),list=document.getElementById('clist');
  let active=0,filtered=[];
  function render(q){
    filtered=q?CMDS.filter(c=>(c.l+c.d+(c.s||'')).toLowerCase().includes(q.toLowerCase())):CMDS;
    list.innerHTML='';active=0;let lastS='';
    filtered.forEach((cmd,i)=>{
      if(cmd.s&&cmd.s!==lastS){const s=document.createElement('div');s.className='csec';s.textContent=cmd.s;list.appendChild(s);lastS=cmd.s;}
      const el=document.createElement('div');el.className='citem'+(i===0?' a':'');el.setAttribute('role','option');
      el.innerHTML=`<span class="cic">${cmd.ic}</span><div class="ctx"><div class="clbl">${cmd.l}</div><div class="cdesc">${cmd.d}</div></div>${cmd.ext?'<span class="ckbd">↗</span>':''}`;
      el.addEventListener('mouseenter',()=>{list.querySelectorAll('.citem').forEach((x,j)=>x.classList.toggle('a',j===i));active=i;});
      el.addEventListener('click',()=>{exec(cmd);close();});
      list.appendChild(el);
    });
  }
  function exec(cmd){
    if(cmd.action==='gesture'){initGestures();close();return;}
    if(cmd.action==='chat'){document.getElementById('cwin').classList.add('open');return;}
    if(cmd.action==='theme'){toggleTheme();return;}
    if(cmd.ext){window.open(cmd.h,'_blank','noopener');return;}
    if(cmd.h)document.querySelector(cmd.h)?.scrollIntoView({behavior:'smooth'});
  }
  function open(){ov.classList.add('open');inp.value='';render('');setTimeout(()=>inp.focus(),50);document.body.style.overflow='hidden';}
  function close(){ov.classList.remove('open');document.body.style.overflow='';}
  inp.addEventListener('input',()=>render(inp.value));
  inp.addEventListener('keydown',e=>{
    const items=list.querySelectorAll('.citem');if(!items.length)return;
    if(e.key==='ArrowDown'){e.preventDefault();active=(active+1)%items.length;items.forEach((x,i)=>x.classList.toggle('a',i===active));items[active]?.scrollIntoView({block:'nearest'});}
    else if(e.key==='ArrowUp'){e.preventDefault();active=(active-1+items.length)%items.length;items.forEach((x,i)=>x.classList.toggle('a',i===active));items[active]?.scrollIntoView({block:'nearest'});}
    else if(e.key==='Enter'){const cmd=filtered[active];if(cmd){exec(cmd);close();}}
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();open();}
    else if(e.key==='Escape'&&ov.classList.contains('open'))close();
  });
  ov.addEventListener('click',e=>{if(e.target===ov)close();});
  document.getElementById('cmdktrigger').addEventListener('click',open);
}

/* THEME */
function toggleTheme(){const h=document.documentElement,e=h.getAttribute('data-theme')==='ent';h.setAttribute('data-theme',e?'':'ent');document.getElementById('thbtn').textContent=e?'☀':'🌙';}
document.getElementById('thbtn').addEventListener('click',toggleTheme);

/* CLOCK */
function initClock(){
  function tick(){const n=new Date(),t=[n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');['nclock','fclock'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=t;});}
  tick();setInterval(tick,1000);
}

/* CHATBOT */
function initChatbot(){
  const win=document.getElementById('cwin'),msgs=document.getElementById('cmsgs'),inp=document.getElementById('cin'),send=document.getElementById('csend'),close=document.getElementById('cclose'),toggle=document.getElementById('ctoggle'),chips=document.getElementById('chips2');
  const KB=[
    {k:['who','about','yourself','introduce','name','tell'],a:`Hi! I'm KAI — Kamal's AI Portfolio Assistant.\n\nBatchu Kamal Praneeth is an AI/ML engineer from Eluru, India. B.Tech CSE (AI/ML) · CGPA 8.1/10 · Graduated April 2026.\n\nWhat would you like to know?`},
    {k:['skill','tech','stack','language','tool'],a:`Kamal's tech stack:\n\n🐍 Python · Java · C++ · JavaScript\n🤖 AI/ML: Scikit-learn, Pandas, NumPy, VADER NLP, LLMs\n⚙️ Backend: FastAPI, Flask, Node.js, REST APIs\n🗄️ Data: SQL, SQLite, MySQL, Power BI\n🏢 ServiceNow: PDI REST, Studio, Scripting\n🐳 Infra: Docker, GitHub Actions CI/CD, Linux`},
    {k:['project','build','deploy','app','platform','pipeline'],a:`4 production-deployed projects:\n\n1️⃣ Enterprise AI ServiceNow Platform — AIOps + ServiceNow PDI live sync\n2️⃣ AI Support Platform — FastAPI + Groq LLaMA-3.1 · 34/34 CI tests\n3️⃣ Sales Analytics Pipeline — $10M ETL + Power BI\n4️⃣ CA House Price Predictor — Random Forest · R² 0.7734`},
    {k:['education','degree','college','gpa','cgpa','btech'],a:`🎓 B.Tech CSE (AI & ML)\nJNTUK — Ramachandra College of Engineering, Eluru, AP\nCGPA: 8.1/10 · Graduated April 2026\n\nIntermediate: 88.3% · SSC: 597/600`},
    {k:['experience','internship','work','job','intern'],a:`2 verified internships:\n\n1️⃣ AI/ML Intern @ EXCELR (APSCHE) · Jun–Aug 2024\nNumPy pipelines, ML benchmarking, unit testing\n\n2️⃣ Web Dev Intern @ CSEDGE · May–Jun 2024\nNode.js REST APIs, JWT auth, Git`},
    {k:['contact','reach','email','phone','hire','available'],a:`📧 kamalpraneethbatchu@gmail.com\n📱 +91 6301179267\n🔗 linkedin.com/in/kamal-praneeth-batchu-352b68258\n⚡ github.com/kamalpraneeth\n📍 Eluru, Andhra Pradesh, India\n\n✅ Actively available for opportunities!`},
    {k:['cert','certification','servicenow','nptel'],a:`3 verified certifications:\n\n✅ ServiceNow CAD — Certified Application Developer\n✅ ServiceNow CSA — Certified System Administrator\n✅ NPTEL — Introduction to Machine Learning`},
    {k:['why','hire','reason','unique','different'],a:`Why hire Kamal?\n\n✅ 4 live, verifiable deployments\n✅ ServiceNow CAD + CSA certified\n✅ 42+ passing tests — he writes tests\n✅ Hybrid ML+LLM architecture\n✅ ZERO fabricated metrics\n✅ Available immediately`},
    {k:['ai','machine learning','ml','llm','genai'],a:`AI/ML specialization:\n\n🔬 Classical ML: Random Forest, LR, TF-IDF\n📝 NLP: VADER sentiment, text classification\n🤖 Gen AI: Groq API (llama-3.1-8b-instant)\n🚀 Production: FastAPI + Docker + GitHub Actions`},
    {k:['servicenow','snow','enterprise','aiops'],a:`ServiceNow expertise:\n\n🏢 CAD + CSA Certified ✓\n⚡ AIOps gateway with live PDI REST API sync\n🎯 3-tier confidence routing engine\n👥 Manager Review Console (HITL governance)\n📋 Immutable AI Audit Trail`},
  ];
  const CHIPS=['Who is Kamal?','Skills & Stack','Live Projects','Contact Info','Why hire him?'];
  function addMsg(text,role){const el=document.createElement('div');el.className='msg '+role;el.textContent=text;msgs.appendChild(el);msgs.scrollTop=msgs.scrollHeight;}
  function showTyping(){const el=document.createElement('div');el.className='tind';el.id='ktyping';el.innerHTML='<span></span><span></span><span></span>';msgs.appendChild(el);msgs.scrollTop=msgs.scrollHeight;return el;}
  function botReply(q){const t=showTyping();setTimeout(()=>{t.remove();const ql=q.toLowerCase();const m=KB.find(e=>e.k.some(k=>ql.includes(k)));addMsg(m?m.a:"I'm not sure about that. Try asking about Kamal's skills, projects, education, experience, or how to contact him!",'bot');},800+Math.random()*500);}
  function doSend(){const q=inp.value.trim();if(!q)return;addMsg(q,'user');inp.value='';botReply(q);chips.style.display='none';}
  CHIPS.forEach(s=>{const el=document.createElement('button');el.className='chip2';el.textContent=s;el.addEventListener('click',()=>{addMsg(s,'user');botReply(s);chips.style.display='none';});chips.appendChild(el);});
  send.addEventListener('click',doSend);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')doSend();});
  toggle.addEventListener('click',()=>{const o=win.classList.toggle('open');if(o&&msgs.children.length===0)setTimeout(()=>addMsg("👋 Hi! I'm KAI — Kamal's AI Portfolio Assistant.\n\nAsk me anything about his skills, projects, experience, or how to contact him!",'bot'),300);});
  close.addEventListener('click',()=>win.classList.remove('open'));
}

/* GITHUB */
function initGitHub(){
  const fb=()=>{document.getElementById('ghrepos').textContent='6';document.getElementById('ghfol').textContent='—';document.getElementById('ghstars').textContent='—';};
  (async()=>{try{const[u,r]=await Promise.all([fetch('https://api.github.com/users/kamalpraneeth'),fetch('https://api.github.com/users/kamalpraneeth/repos?per_page=100')]);if(u.ok&&r.ok){const ud=await u.json(),rd=await r.json();document.getElementById('ghrepos').textContent=ud.public_repos||'6';document.getElementById('ghfol').textContent=ud.followers??'0';document.getElementById('ghstars').textContent=rd.reduce((s,x)=>s+x.stargazers_count,0)||'0';}else fb();}catch{fb();}})();
}

/* LIGHTBOX */
function initLightbox(){
  const lb=document.getElementById('lb'),lbimg=document.getElementById('lbimg'),lbcap=document.getElementById('lbcap'),lbclose=document.getElementById('lbclose');
  function open(src,cap){lbimg.src=src;lbcap.textContent=cap;lb.classList.add('open');document.body.style.overflow='hidden';lbclose.focus();}
  function close(){lb.classList.remove('open');document.body.style.overflow='';setTimeout(()=>{lbimg.src='';},300);}
  document.querySelectorAll('.ccrd').forEach(c=>{c.addEventListener('click',()=>{if(c.dataset.img)open(c.dataset.img,c.dataset.cap);});c.addEventListener('keydown',e=>{if(e.key==='Enter'&&c.dataset.img)open(c.dataset.img,c.dataset.cap);});});
  lbclose.addEventListener('click',close);lb.addEventListener('click',e=>{if(e.target===lb)close();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lb.classList.contains('open'))close();});
}

/* DEMO MODAL */
function initDemoModal(){
  const modal=document.getElementById('dmod'),iframe=document.getElementById('diframe'),loader=document.getElementById('dloader'),title=document.getElementById('dtitle'),ext=document.getElementById('dext'),close=document.getElementById('dclose');
  function open(url,name){title.textContent=name;ext.href=url;iframe.classList.remove('loaded');loader.classList.remove('hide');modal.classList.add('open');document.body.style.overflow='hidden';setTimeout(()=>{iframe.src=url;},50);}
  function closeModal(){modal.classList.remove('open');document.body.style.overflow='';setTimeout(()=>{iframe.src='';},400);}
  iframe.addEventListener('load',()=>{iframe.classList.add('loaded');loader.classList.add('hide');});
  document.querySelectorAll('.pbtn[data-url]').forEach(btn=>btn.addEventListener('click',()=>open(btn.dataset.url,btn.dataset.title||'Live Demo')));
  close.addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
}

/* ARCH MODAL */
function initArchModal(){
  const modal=document.getElementById('amod'),close=document.getElementById('aclose'),code=document.getElementById('acode'),title=document.getElementById('atitle');
  const S={
    sn:{t:'ServiceNow REST API · 3-Tier Confidence Routing Engine',c:`// Enterprise AI ServiceNow Operations Portal
// 3-Tier Confidence Routing Engine — live PDI REST API sync

async function routeTicketToServiceNow(ticketData) {
  const { confidenceScore, summary, urgency, category } = ticketData;

  if (confidenceScore >= 0.90) {
    // AUTO-CREATE: High confidence → ServiceNow Incident
    const res = await fetch(
      'https://dev390619.service-now.com/api/now/table/incident',
      { method: 'POST', headers: { 'Authorization': 'Basic ...', 'Content-Type': 'application/json' },
        body: JSON.stringify({ short_description: summary, urgency, category }) }
    );
    const { result } = await res.json();
    await logAuditTrail({ action: 'AUTO_CREATED', incNumber: result.number, confidence: confidenceScore });
    return { status: 'AUTO_CREATED', incNumber: result.number };

  } else if (confidenceScore >= 0.70) {
    // REVIEW: Medium confidence → Manager Review Console
    await queueForHumanReview(ticketData);
    return { status: 'PENDING_REVIEW', queueId: ticketData.id };

  } else {
    return { status: 'MANUAL_REQUIRED' };
  }
}`},
    ai:{t:'AI Support Platform · Hybrid ML + LLM FastAPI Pipeline',c:`# FastAPI + scikit-learn + Groq LLaMA-3.1
# 34/34 tests passing · <100ms inference latency

@app.post("/api/tickets")
async def classify_ticket(ticket: TicketSchema):
    # 1. Classical ML inference (<10ms)
    category = ml_pipeline.predict([ticket.text])[0]
    confidence = ml_pipeline.predict_proba([ticket.text]).max()

    # 2. VADER Sentiment Analysis
    sentiment = analyzer.polarity_scores(ticket.text)

    # 3. LLM Response Generation via Groq (<90ms)
    completion = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": f"Support agent. Category: {category}"},
            {"role": "user", "content": ticket.text}
        ], max_tokens=256
    )
    return TicketResponse(
        category=category, confidence=round(float(confidence), 4),
        sentiment_compound=sentiment['compound'],
        generated_reply=completion.choices[0].message.content
    )`},
    house:{t:'CA House Price Predictor · Random Forest FastAPI',c:`# California House Price Predictor
# RandomForest · R² = 0.7734 · RMSE = 0.5449

@app.post("/predict")
async def predict_price(features: HouseFeatures):
    X = np.array([[
        features.MedInc, features.HouseAge,
        features.AveRooms, features.AveBedrms,
        features.Population, features.AveOccup,
        features.Latitude, features.Longitude
    ]])
    prediction = float(model.predict(X)[0])
    return {
        "predicted_price_100k": round(prediction, 4),
        "predicted_price_usd": f"\${round(prediction * 100000):,}",
        "model": "RandomForestRegressor",
        "r2_score": 0.7734, "rmse": 0.5449
    }`}
  };
  document.querySelectorAll('.abtn').forEach(btn=>{btn.addEventListener('click',()=>{const s=S[btn.dataset.arch];if(!s)return;title.textContent=s.t;code.textContent=s.c;modal.classList.add('open');document.body.style.overflow='hidden';});});
  function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
  close.addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});
}

/* CONTACT FORM */
function initContactForm(){
  const form=document.getElementById('cform'),btn=document.getElementById('fsubmit'),succ=document.getElementById('fsucc');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('cname').value,email=document.getElementById('cemail').value,subj=document.getElementById('csubj').value||'Portfolio Contact',msg=document.getElementById('cmsg').value;
    window.location.href=`mailto:kamalpraneethbatchu@gmail.com?subject=${encodeURIComponent(subj+' — from '+name)}&body=${encodeURIComponent('From: '+name+' <'+email+'>\n\n'+msg)}`;
    btn.textContent='Opening Email Client...';btn.disabled=true;
    setTimeout(()=>{btn.textContent='Send Message →';btn.disabled=false;succ.style.display='block';setTimeout(()=>{succ.style.display='none';},5000);},2000);
  });
}

/* KONAMI */
function initKonami(){
  const CODE=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx=0;const toast=document.getElementById('toast');
  document.addEventListener('keydown',e=>{if(e.key===CODE[idx]){idx++;if(idx===CODE.length){idx=0;toast.textContent='🎮 Achievement: Power User! You found it. Kamal writes 42+ tests. ✅';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000);}}else idx=0;});
}

/* ADVANCED GESTURES (PRO) */
let gActive=false,gLoaded=false;
function initGestures(){
  if(gActive)return;gActive=true;
  const pip=document.getElementById('gpip'),c=document.getElementById('gcursor'),gt=document.getElementById('gtoast');
  pip.style.display='block';c.style.display='block';gt.style.display='block';setTimeout(()=>gt.style.display='none',8000);
  if(gLoaded)return;gLoaded=true;
  
  const loadScript=(src)=>new Promise(r=>{const s=document.createElement('script');s.src=src;s.crossOrigin='anonymous';s.onload=r;document.head.append(s);});
  Promise.all([loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')]).then(()=>{
    const video=document.getElementById('gvideo'),canvas=document.getElementById('gcanvas'),ctx=canvas.getContext('2d');
    const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
    hands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:0.7,minTrackingConfidence:0.7});
    
    let cx=innerWidth/2,cy=innerHeight/2; // Smoothed cursor positions
    let px=0,py=0,pching=false,scrollMode=false,sy=0,hideTimeout;
    
    function shockwave(x,y){
      const d=document.createElement('div');d.className='shockwave';d.style.left=x+'px';d.style.top=y+'px';
      document.body.appendChild(d);setTimeout(()=>d.remove(),600);
    }
    
    hands.onResults(res=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if(!gActive)return;
      
      if(res.multiHandLandmarks&&res.multiHandLandmarks.length>0){
        clearTimeout(hideTimeout);pip.classList.remove('hidden');
        
        const lm=res.multiHandLandmarks[0];
        
        // Cybernetic Skeleton
        ctx.lineWidth=2;
        const drawL=(pts,col)=>{ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(lm[pts[0]].x*canvas.width,lm[pts[0]].y*canvas.height);for(let i=1;i<pts.length;i++)ctx.lineTo(lm[pts[i]].x*canvas.width,lm[pts[i]].y*canvas.height);ctx.stroke();};
        const c1='#0284c7',c2='#10b981',c3='#ec4899';
        drawL([0,1,2,3,4],c3);drawL([0,5,6,7,8],c1);drawL([5,9,10,11,12],c1);drawL([9,13,14,15,16],c2);drawL([13,17,18,19,20],c2);drawL([0,17],c1);
        
        // Nodes
        lm.forEach((pt,i)=>{
          ctx.beginPath();ctx.arc(pt.x*canvas.width,pt.y*canvas.height,i===8||i===4?5:3,0,Math.PI*2);
          ctx.fillStyle=(i===8||i===4)?'#fff':c1;ctx.fill();
        });
        
        // Finger states (Math)
        const dist=(a,b)=>Math.hypot(lm[a].x-lm[b].x,lm[a].y-lm[b].y);
        const thumbUp = lm[4].y < lm[3].y && lm[3].y < lm[2].y && lm[8].y > lm[5].y && lm[12].y > lm[9].y && lm[16].y > lm[13].y;
        const idxUp = lm[8].y < lm[6].y;
        const midUp = lm[12].y < lm[10].y;
        const rngUp = lm[16].y < lm[14].y;
        const pnkUp = lm[20].y < lm[18].y;
        
        const peace = idxUp && midUp && !rngUp && !pnkUp && !thumbUp;
        const pinch = dist(8,4) < 0.05;
        
        // Thumbs Up -> Scroll to top
        if(thumbUp && !idxUp && !midUp && !rngUp && !pnkUp){
          window.scrollTo({top:0,behavior:'smooth'});
          c.style.background='var(--amber)';
          return;
        }
        
        // Target coordinates (Index tip)
        let tx = (1-lm[8].x)*innerWidth;
        let ty = lm[8].y*innerHeight;
        
        // Magnetic Snapping
        const magDist = 60;
        let snapped = false;
        const els = document.querySelectorAll('a, button, .ccrd, .pcard, input, textarea, .citem');
        for(let el of els){
          const r = el.getBoundingClientRect();
          if(r.width===0||r.height===0)continue;
          const ecx = r.left+r.width/2, ecy = r.top+r.height/2;
          if(Math.hypot(tx-ecx, ty-ecy) < magDist){
            tx = ecx; ty = ecy; snapped = true; break;
          }
        }
        
        // EMA Smoothing (Exponential Moving Average)
        cx += (tx - cx) * (snapped ? 0.3 : 0.2);
        cy += (ty - cy) * (snapped ? 0.3 : 0.2);
        
        c.style.left = cx+'px'; c.style.top = cy+'px';
        
        // State Machine
        c.className = snapped ? 'mag' : '';
        
        if(peace){
          c.classList.add('scroll');
          if(!scrollMode){scrollMode=true; sy=cy;}
          else{
            if(Math.abs(cy-sy)>5){window.scrollBy(0, (sy-cy)*1.5); sy=cy;}
          }
        }else{
          scrollMode = false;
          if(pinch){
            c.classList.add('pinch');
            if(!pching){
              pching=true; px=cx; py=cy;
            }
          }else{
            if(pching){
              pching=false;
              if(Math.hypot(cx-px,cy-py)<30){
                shockwave(cx,cy);
                const tgt=document.elementFromPoint(cx,cy);
                if(tgt && typeof tgt.click==='function') tgt.click();
              }
            }
          }
        }
      } else {
        // Auto-hide PIP if no hand for 2 seconds
        hideTimeout = setTimeout(()=>pip.classList.add('hidden'), 2000);
      }
    });
    
    const cam=new Camera(video,{onFrame:async()=>{if(gActive){canvas.width=video.offsetWidth;canvas.height=video.offsetHeight;await hands.send({image:video});}},width:480,height:360});
    cam.start();
  });
}
