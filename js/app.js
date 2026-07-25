'use strict';
/* Uses globals: gsap, ScrollTrigger, ScrollToPlugin, Lenis */

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = /Mobi|Android/i.test(navigator.userAgent) || innerWidth < 960;

/* ── GSAP REGISTER ── */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}
if (window.gsap && window.ScrollToPlugin) {
  gsap.registerPlugin(ScrollToPlugin);
}



/* ── BOOT ── */
(function () {
  const boot = document.getElementById('boot'),
    fill = document.getElementById('bbf'),
    pct  = document.getElementById('bpct'),
    st   = document.getElementById('bst');
  if (!boot) return;
  const lines = document.querySelectorAll('.bl');
  let p = 0;
  lines.forEach((l, i) => setTimeout(() => l.classList.add('s'), i * 200 + 200));
  const steps = ['Booting...', 'Loading modules...', 'Verifying certs...', 'Mounting projects...', 'Rendering 3D...', 'Ready!'];
  let si = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 6 + 2, 100);
    if (fill) fill.style.width = p + '%';
    if (pct)  pct.textContent  = Math.floor(p) + '%';
    if (p > si * 17 && si < steps.length && st) st.textContent = steps[si++];
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        boot.classList.add('done');
        setTimeout(() => { boot.style.display = 'none'; initAll(); }, 900);
      }, 400);
    }
  }, 75);
})();

/* ── INIT ALL ── */
function initAll() {
  initNav();
  initScrollProgress();
  initScrollTop();
  if (!MOB) initMagneticCursor();
  initGSAPHero();
  initGSAPScrollAnimations();
  if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 100);
  initCounters();
  initSkillBars();
  if (!RM && !MOB) initTilt();
  initMagnetic();
  initChatbot();
  initCmdk();
  initGitHub();
  initLightbox();
  initDemoModal();
  initArchModal();
  initContactForm();
  initClock();
  initKonami();
}

/* ── NAV ── */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('sc', scrollY > 20), { passive: true });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const h = a.getAttribute('href');
      if (h && h.length > 1) {
        e.preventDefault();
        const target = document.querySelector(h);
        if (!target) return;
        if (lenis) lenis.scrollTo(target, { offset: -64, duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── SCROLL PROGRESS ── */
function initScrollProgress() {
  const bar = document.getElementById('spf');
  window.addEventListener('scroll', () => {
    if (!bar) return;
    const t = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (t / h) * 100 : 0) + '%';
  }, { passive: true });
}

/* ── SCROLL TOP ── */
function initScrollTop() {
  const btn = document.getElementById('stb');
  window.addEventListener('scroll', () => btn && btn.classList.toggle('v', scrollY > 600), { passive: true });
  btn && btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── MAGNETIC CURSOR (GSAP quickTo) ── */
function initMagneticCursor() {
  const dot = document.getElementById('cd'), ring = document.getElementById('cr');
  if (!dot || !ring || !window.gsap) return;
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
  const dotX  = gsap.quickTo(dot,  'x', { duration: 0.04, ease: 'none' });
  const dotY  = gsap.quickTo(dot,  'y', { duration: 0.04, ease: 'none' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.2,  ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.2,  ease: 'power3' });
  window.addEventListener('mousemove', e => { dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY); }, { passive: true });
  document.addEventListener('mousedown', () => ring.classList.add('c'));
  document.addEventListener('mouseup',   () => ring.classList.remove('c'));
  document.querySelectorAll('a,button,.ccrd,.pcard,.rc,.sc2,.skcat,.ecard2,.clnk,.chip2,.citem,input,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('h'));
    el.addEventListener('mouseleave', () => ring.classList.remove('h'));
  });
}

/* ── GSAP HERO ENTRANCE ── */
function initGSAPHero() {
  if (RM || !window.gsap) return;
  const tl = gsap.timeline({ delay: 1.1 });
  tl.from('.heyebrow', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .from('.hname',    { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
    .from('.htitle',   { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .from('.hbadges .hb', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.4')
    .from('.hcta > *', { y: 16, opacity: 0, stagger: 0.1,  duration: 0.5, ease: 'power3.out' }, '-=0.4')
    .from('.hcard',    { x: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
    .from('.sgrid .sc2', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, '-=0.5')
    .from('.scrollhint', { opacity: 0, duration: 0.8 }, '-=0.2');
}

/* ── GSAP SCROLL ANIMATIONS ── */
function initGSAPScrollAnimations() {
  if (RM || !window.gsap || !window.ScrollTrigger) return;

  const animFade = (el, extra = {}) => gsap.from(el, {
    y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    ...extra
  });

  document.querySelectorAll('.rv').forEach(el => { el.style.opacity = ''; el.style.transform = ''; animFade(el); });
  document.querySelectorAll('.rl').forEach(el => { el.style.opacity = ''; el.style.transform = ''; gsap.from(el, { x: -40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }); });
  document.querySelectorAll('.rr').forEach(el => { el.style.opacity = ''; el.style.transform = ''; gsap.from(el, { x: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }); });

  const pcards = gsap.utils.toArray('.pcard');
  if (pcards.length) gsap.from(pcards, { y: 60, opacity: 0, rotateX: 8, stagger: { amount: 0.6 }, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.bento', start: 'top 85%' } });

  const skcats = gsap.utils.toArray('.skcat');
  if (skcats.length) gsap.from(skcats, { y: 40, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.skgrid', start: 'top 85%' } });
}

/* ── COUNTERS ── */
function initCounters() {
  setTimeout(() => {
    document.querySelectorAll('.ticker').forEach(el => {
      const tgt = parseFloat(el.dataset.t), suf = el.dataset.s || '';
      if (RM) { el.textContent = tgt + suf; return; }
      let cur = 0; const step = 20, steps = 1400 / step;
      const iv = setInterval(() => {
        cur = Math.min(cur + tgt / steps, tgt);
        el.textContent = (Number.isInteger(tgt) ? Math.floor(cur) : cur.toFixed(1)) + suf;
        if (cur >= tgt) clearInterval(iv);
      }, step);
    });
  }, 900);
}

/* ── SKILL BARS ── */
function initSkillBars() {
  if (window.ScrollTrigger) {
    document.querySelectorAll('.skcat').forEach(cat => {
      ScrollTrigger.create({
        trigger: cat, start: 'top 85%', once: true,
        onEnter: () => cat.querySelectorAll('.sbf').forEach((b, i) => {
          gsap.to(b, { width: b.dataset.p + '%', duration: 1.3, ease: 'power3.out', delay: 0.1 + i * 0.08 });
        })
      });
    });
  } else {
    // Fallback: IntersectionObserver
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.sbf').forEach(b => setTimeout(() => b.style.width = b.dataset.p + '%', 120)); obs.unobserve(e.target); } });
    }, { threshold: 0.18 });
    document.querySelectorAll('.skcat').forEach(c => obs.observe(c));
  }
}

/* ── 3D TILT ── */
function initTilt() {
  document.querySelectorAll('.pcard,.sc2,.rc,.ecard2,.ainfo-card').forEach(card => {
    let raf;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        if (window.gsap) {
          gsap.to(card, { rotateX: -dy * 7, rotateY: dx * 7, scale: 1.02, duration: 0.2, ease: 'power2.out', transformPerspective: 1000 });
        }
        if (card.classList.contains('pcard')) {
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      if (window.gsap) gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.7)' });
      else { card.style.transition = 'transform .6s'; card.style.transform = ''; }
    });
  });
}

/* ── MAGNETIC BUTTONS ── */
function initMagnetic() {
  if (RM || MOB || !window.gsap) return;
  document.querySelectorAll('.btnp,.btns,.nbtn,.pb2pr').forEach(btn => {
    const moveX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const moveY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      moveX((e.clientX - r.left - r.width  / 2) * 0.35);
      moveY((e.clientY - r.top  - r.height / 2) * 0.35);
    });
    btn.addEventListener('mouseleave', () => { moveX(0); moveY(0); });
  });
}

/* ── COMMAND PALETTE ── */
function initCmdk() {
  const CMDS = [
    { ic:'🏠', l:'Hero',         d:'Back to top',              h:'#hero',       s:'NAVIGATE' },
    { ic:'👤', l:'About Me',     d:'Background & education',    h:'#about',      s:'NAVIGATE' },
    { ic:'⚡', l:'Skills',       d:'AI/ML, backend, DevOps',   h:'#skills',     s:'NAVIGATE' },
    { ic:'💼', l:'Experience',   d:'2 internships',             h:'#experience', s:'NAVIGATE' },
    { ic:'🚀', l:'Projects',     d:'4 live deployments',        h:'#projects',   s:'NAVIGATE' },
    { ic:'🏅', l:'Certifications',d:'CAD, CSA, NPTEL',         h:'#certs',      s:'NAVIGATE' },
    { ic:'✉',  l:'Contact',      d:'Get in touch',              h:'#contact',    s:'NAVIGATE' },
    { ic:'⚡', l:'Enterprise AI ServiceNow', d:'Live on Vercel', h:'https://enterprise-ai-servicenow-platform.vercel.app', ext:true, s:'LIVE PROJECTS' },
    { ic:'🤖', l:'AI Support Platform',     d:'34/34 tests · Render', h:'https://ai-support-platform-2xnp.onrender.com', ext:true, s:'LIVE PROJECTS' },
    { ic:'📊', l:'Sales Analytics',         d:'$10M data · Render',   h:'https://sales-analytics-pipeline.onrender.com', ext:true, s:'LIVE PROJECTS' },
    { ic:'⚡', l:'GitHub',   d:'github.com/kamalpraneeth',         h:'https://github.com/kamalpraneeth', ext:true, s:'LINKS' },
    { ic:'🔗', l:'LinkedIn', d:'Professional profile',              h:'https://linkedin.com/in/kamal-praneeth-batchu-352b68258', ext:true, s:'LINKS' },
    { ic:'✉',  l:'Email',    d:'kamalpraneethbatchu@gmail.com',    h:'mailto:kamalpraneethbatchu@gmail.com', s:'LINKS' },
    { ic:'🤖', l:'Chat with KAI', d:'AI portfolio assistant', action:'chat',  s:'ACTIONS' },
    { ic:'☀',  l:'Toggle Theme', d:'Dark / Enterprise light', action:'theme', s:'ACTIONS' },
  ];
  const ov = document.getElementById('cmdk'), inp = document.getElementById('cinput'), list = document.getElementById('clist');
  if (!ov || !inp || !list) return;
  let active = 0, filtered = [];
  const render = q => {
    filtered = q ? CMDS.filter(c => (c.l+c.d+(c.s||'')).toLowerCase().includes(q.toLowerCase())) : CMDS;
    list.innerHTML = ''; active = 0; let lastS = '';
    filtered.forEach((cmd, i) => {
      if (cmd.s && cmd.s !== lastS) { const s = document.createElement('div'); s.className = 'csec'; s.textContent = cmd.s; list.appendChild(s); lastS = cmd.s; }
      const el = document.createElement('div'); el.className = 'citem' + (i === 0 ? ' a' : ''); el.setAttribute('role', 'option');
      el.innerHTML = `<span class="cico">${cmd.ic}</span><div class="ctx"><div class="clbl">${cmd.l}</div><div class="cdesc">${cmd.d}</div></div>${cmd.ext ? '<span class="ckbd">↗</span>' : ''}`;
      el.addEventListener('mouseenter', () => { list.querySelectorAll('.citem').forEach((x,j) => x.classList.toggle('a', j===i)); active = i; });
      el.addEventListener('click', () => { exec(cmd); close(); });
      list.appendChild(el);
    });
  };
  const exec = cmd => {
    if (cmd.action==='chat') { const w=document.getElementById('cwin'); if(w) w.classList.add('open'); return; }
    if (cmd.action==='theme') { toggleTheme(); return; }
    if (cmd.ext) { window.open(cmd.h,'_blank','noopener'); return; }
    if (cmd.h) {
      const t = document.querySelector(cmd.h);
      if (t) { if (lenis) lenis.scrollTo(t,{offset:-64,duration:1.4}); else t.scrollIntoView({behavior:'smooth'}); }
    }
  };
  const openPalette = () => { ov.classList.add('open'); inp.value=''; render(''); setTimeout(()=>inp.focus(),50); document.body.style.overflow='hidden'; };
  const close = () => { ov.classList.remove('open'); document.body.style.overflow=''; };
  inp.addEventListener('input', () => render(inp.value));
  inp.addEventListener('keydown', e => {
    const items = list.querySelectorAll('.citem'); if (!items.length) return;
    if (e.key==='ArrowDown') { e.preventDefault(); active=(active+1)%items.length; items.forEach((x,i)=>x.classList.toggle('a',i===active)); items[active]?.scrollIntoView({block:'nearest'}); }
    else if (e.key==='ArrowUp') { e.preventDefault(); active=(active-1+items.length)%items.length; items.forEach((x,i)=>x.classList.toggle('a',i===active)); items[active]?.scrollIntoView({block:'nearest'}); }
    else if (e.key==='Enter') { const cmd=filtered[active]; if(cmd){exec(cmd);close();} }
  });
  document.addEventListener('keydown', e => {
    if (e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); openPalette(); }
    else if (e.key==='Escape' && ov.classList.contains('open')) close();
  });
  ov.addEventListener('click', e => { if(e.target===ov) close(); });
  document.getElementById('cmdktrigger')?.addEventListener('click', openPalette);
}

/* ── THEME ── */
function toggleTheme() {
  const h = document.documentElement, e = h.getAttribute('data-theme')==='ent';
  h.setAttribute('data-theme', e?'':'ent');
  const btn = document.getElementById('thbtn'); if(btn) btn.textContent = e?'☀':'🌙';
}
document.getElementById('thbtn')?.addEventListener('click', toggleTheme);

/* ── CLOCK ── */
function initClock() {
  const tick = () => {
    const n = new Date(), t = [n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
    ['nclock','fclock'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=t; });
  };
  tick(); setInterval(tick, 1000);
}

/* ── CHATBOT ── */
function initChatbot() {
  const win=document.getElementById('cwin'), msgs=document.getElementById('cmsgs'), inp=document.getElementById('cin'),
    send=document.getElementById('csend'), close=document.getElementById('cclose'),
    toggle=document.getElementById('ctoggle'), chips=document.getElementById('chips2');
  if (!win) return;
  const KB = [
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
  const CHIPS = ['Who is Kamal?','Skills & Stack','Live Projects','Contact Info','Why hire him?'];
  const addMsg = (text,role) => { const el=document.createElement('div'); el.className='msg '+role; el.textContent=text; msgs.appendChild(el); msgs.scrollTop=msgs.scrollHeight; };
  const showTyping = () => { const el=document.createElement('div'); el.className='tind'; el.id='ktyping'; el.innerHTML='<span></span><span></span><span></span>'; msgs.appendChild(el); msgs.scrollTop=msgs.scrollHeight; return el; };
  const botReply = q => { const t=showTyping(); setTimeout(()=>{ t.remove(); const ql=q.toLowerCase(); const m=KB.find(e=>e.k.some(k=>ql.includes(k))); addMsg(m?m.a:"I'm not sure about that. Try asking about skills, projects, or contact info!",'bot'); },800+Math.random()*500); };
  const doSend = () => { const q=inp.value.trim(); if(!q) return; addMsg(q,'user'); inp.value=''; botReply(q); if(chips) chips.style.display='none'; };
  CHIPS.forEach(s => { const el=document.createElement('button'); el.className='chip2'; el.textContent=s; el.addEventListener('click',()=>{ addMsg(s,'user'); botReply(s); if(chips) chips.style.display='none'; }); if(chips) chips.appendChild(el); });
  send && send.addEventListener('click', doSend);
  inp  && inp.addEventListener('keydown', e => { if(e.key==='Enter') doSend(); });
  toggle && toggle.addEventListener('click', () => {
    const o = win.classList.toggle('open');
    if (o && msgs.children.length===0) setTimeout(()=>addMsg("👋 Hi! I'm KAI — Kamal's AI Portfolio Assistant.\n\nAsk me anything about his skills, projects, experience, or how to contact him!",'bot'),300);
  });
  close && close.addEventListener('click', () => win.classList.remove('open'));
}

/* ── GITHUB ── */
function initGitHub() {
  const fb = () => { ['ghrepos','ghfol','ghstars'].forEach(id => { const el=document.getElementById(id); if(el&&el.textContent==='—') el.textContent='6'; }); };
  (async () => {
    try {
      const [u,r] = await Promise.all([fetch('https://api.github.com/users/kamalpraneeth'),fetch('https://api.github.com/users/kamalpraneeth/repos?per_page=100')]);
      if (u.ok && r.ok) {
        const ud=await u.json(), rd=await r.json();
        const rEl=document.getElementById('ghrepos'), fEl=document.getElementById('ghfol'), sEl=document.getElementById('ghstars');
        if(rEl) rEl.textContent = ud.public_repos||'6';
        if(fEl) fEl.textContent = ud.followers??'0';
        if(sEl) sEl.textContent = rd.reduce((s,x)=>s+x.stargazers_count,0)||'0';
      } else fb();
    } catch { fb(); }
  })();
}

/* ── LIGHTBOX ── */
function initLightbox() {
  const lb=document.getElementById('lb'), lbimg=document.getElementById('lbimg'), lbcap=document.getElementById('lbcap'), lbclose=document.getElementById('lbclose');
  if (!lb) return;
  const open=(src,cap)=>{ lbimg.src=src; lbcap.textContent=cap; lb.classList.add('open'); document.body.style.overflow='hidden'; lbclose.focus(); };
  const close=()=>{ lb.classList.remove('open'); document.body.style.overflow=''; setTimeout(()=>{lbimg.src='';},300); };
  document.querySelectorAll('.ccrd').forEach(c=>{
    c.addEventListener('click',()=>{ if(c.dataset.img) open(c.dataset.img,c.dataset.cap); });
    c.addEventListener('keydown',e=>{ if(e.key==='Enter'&&c.dataset.img) open(c.dataset.img,c.dataset.cap); });
  });
  lbclose.addEventListener('click',close);
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&lb.classList.contains('open')) close(); });
}

/* ── DEMO MODAL ── */
function initDemoModal() {
  const modal=document.getElementById('dmod'), iframe=document.getElementById('diframe'), loader=document.getElementById('dloader'), title=document.getElementById('dtitle'), ext=document.getElementById('dext'), close=document.getElementById('dclose');
  if (!modal) return;
  const open=(url,name)=>{ title.textContent=name; ext.href=url; iframe.classList.remove('loaded'); loader.classList.remove('hide'); modal.classList.add('open'); document.body.style.overflow='hidden'; setTimeout(()=>{iframe.src=url;},50); };
  const closeModal=()=>{ modal.classList.remove('open'); document.body.style.overflow=''; setTimeout(()=>{iframe.src='';},400); };
  iframe.addEventListener('load',()=>{ iframe.classList.add('loaded'); loader.classList.add('hide'); });
  document.querySelectorAll('.pbtn[data-url]').forEach(btn=>btn.addEventListener('click',()=>open(btn.dataset.url,btn.dataset.title||'Live Demo')));
  close.addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&modal.classList.contains('open')) closeModal(); });
  modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
}

/* ── ARCH MODAL ── */
function initArchModal() {
  const modal=document.getElementById('amod'), close=document.getElementById('aclose'), code=document.getElementById('acode'), title=document.getElementById('atitle');
  if (!modal) return;
  const S = {
    sn: {t:'ServiceNow REST API · 3-Tier Confidence Routing Engine',c:`// Enterprise AI ServiceNow Operations Portal\n// 3-Tier Confidence Routing Engine — live PDI REST API sync\n\nasync function routeTicketToServiceNow(ticketData) {\n  const { confidenceScore, summary, urgency, category } = ticketData;\n\n  if (confidenceScore >= 0.90) {\n    // AUTO-CREATE: High confidence → ServiceNow Incident\n    const res = await fetch(\n      'https://dev390619.service-now.com/api/now/table/incident',\n      { method: 'POST', headers: { 'Authorization': 'Basic ...', 'Content-Type': 'application/json' },\n        body: JSON.stringify({ short_description: summary, urgency, category }) }\n    );\n    const { result } = await res.json();\n    await logAuditTrail({ action: 'AUTO_CREATED', incNumber: result.number, confidence: confidenceScore });\n    return { status: 'AUTO_CREATED', incNumber: result.number };\n\n  } else if (confidenceScore >= 0.70) {\n    await queueForHumanReview(ticketData);\n    return { status: 'PENDING_REVIEW', queueId: ticketData.id };\n\n  } else {\n    return { status: 'MANUAL_REQUIRED' };\n  }\n}`},
    ai: {t:'AI Support Platform · Hybrid ML + LLM FastAPI Pipeline',c:`# FastAPI + scikit-learn + Groq LLaMA-3.1\n# 34/34 tests passing · <100ms inference latency\n\n@app.post("/api/tickets")\nasync def classify_ticket(ticket: TicketSchema):\n    category   = ml_pipeline.predict([ticket.text])[0]\n    confidence = ml_pipeline.predict_proba([ticket.text]).max()\n    sentiment  = analyzer.polarity_scores(ticket.text)\n    completion = groq_client.chat.completions.create(\n        model="llama-3.1-8b-instant",\n        messages=[{"role":"system","content":f"Support agent. Category: {category}"},\n                  {"role":"user","content":ticket.text}],\n        max_tokens=256\n    )\n    return TicketResponse(\n        category=category, confidence=round(float(confidence), 4),\n        sentiment_compound=sentiment['compound'],\n        generated_reply=completion.choices[0].message.content\n    )`},
    house: {t:'CA House Price Predictor · Random Forest FastAPI',c:`# RandomForest · R² = 0.7734 · RMSE = 0.5449\n\n@app.post("/predict")\nasync def predict_price(features: HouseFeatures):\n    X = np.array([[features.MedInc, features.HouseAge,\n                   features.AveRooms, features.AveBedrms,\n                   features.Population, features.AveOccup,\n                   features.Latitude, features.Longitude]])\n    prediction = float(model.predict(X)[0])\n    return {\n        "predicted_price_100k": round(prediction, 4),\n        "predicted_price_usd": f"\\$\\{round(prediction * 100000):,}",\n        "model": "RandomForestRegressor",\n        "r2_score": 0.7734, "rmse": 0.5449\n    }`}
  };
  document.querySelectorAll('.abtn').forEach(btn=>{ btn.addEventListener('click',()=>{ const s=S[btn.dataset.arch]; if(!s) return; title.textContent=s.t; code.textContent=s.c; modal.classList.add('open'); document.body.style.overflow='hidden'; }); });
  const closeModal=()=>{ modal.classList.remove('open'); document.body.style.overflow=''; };
  close.addEventListener('click',closeModal); modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); }); document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&modal.classList.contains('open')) closeModal(); });
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const form=document.getElementById('cform'), btn=document.getElementById('fsubmit'), succ=document.getElementById('fsucc');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name=document.getElementById('cname').value, email=document.getElementById('cemail').value, subj=document.getElementById('csubj').value||'Portfolio Contact', msg=document.getElementById('cmsg').value;
    window.location.href=`mailto:kamalpraneethbatchu@gmail.com?subject=${encodeURIComponent(subj+' — from '+name)}&body=${encodeURIComponent('From: '+name+' <'+email+'>\n\n'+msg)}`;
    btn.textContent='Opening Email Client...'; btn.disabled=true;
    setTimeout(()=>{ btn.textContent='Send Message →'; btn.disabled=false; if(succ){succ.style.display='block';setTimeout(()=>{succ.style.display='none';},5000);} },2000);
  });
}

/* ── KONAMI ── */
function initKonami() {
  const CODE=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx=0; const toast=document.getElementById('toast');
  document.addEventListener('keydown',e=>{ if(e.key===CODE[idx]){idx++;if(idx===CODE.length){idx=0;if(toast){toast.textContent='🎮 Achievement: Power User! Kamal writes 42+ tests. ✅';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000);}}}else idx=0; });
}