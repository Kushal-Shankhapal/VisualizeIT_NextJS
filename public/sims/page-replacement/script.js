/* ═══════════════════════════════════════════════
   PAGE//FAULT v4 — script.js
   anime.js powered
═══════════════════════════════════════════════ */
'use strict';

const $ = id => document.getElementById(id);
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

/* ─── Scroll ─── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ─── Speed slider ─── */
const speedEl = $('sim-speed');
if (speedEl) speedEl.addEventListener('input', () => {
  $('sim-speed-label').textContent = `${speedEl.value}ms`;
});

/* ─── Intersection observers ─── */
const SECTION_PHASE = {
  'key-terms':'foundations', 'page-fault-cycle':'concepts', 'key-metrics':'concepts',
  'fifo':'algorithms', 'lru':'algorithms', 'opt':'algorithms',
  'simulator':'simulator'
};
const PHASE_ORDER = ['foundations','concepts','algorithms','simulator'];

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;

    // side nav dots
    document.querySelectorAll('.snav-dot').forEach(d => {
      d.classList.toggle('active', d.dataset.section === id);
    });

    // phase bar
    const phase = SECTION_PHASE[id];
    if (phase) {
      const phaseIdx = PHASE_ORDER.indexOf(phase);
      document.querySelectorAll('.phase-item').forEach((p,i) => {
        const ph = p.dataset.phase;
        p.classList.remove('active','done');
        if (ph === phase) p.classList.add('active');
        else if (PHASE_ORDER.indexOf(ph) < phaseIdx) p.classList.add('done');
      });
      // fill connectors
      for (let i = 1; i <= 3; i++) {
        const fill = $(`pc-fill-${i}`);
        if (fill) fill.style.width = i <= phaseIdx ? '100%' : '0%';
      }
    }

    // section-specific triggers
    if (id === 'fifo') animateBeladyBars();
  });
}, { threshold: 0.25 });

['key-terms','page-load-anim','page-fault-cycle','key-metrics','fifo','lru','opt','simulator']
  .forEach(id => { const el = document.getElementById(id); if (el) sectionObs.observe(el); });

// Reveal observer
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Belady bars ─── */
let beladyAnimated = false;
function animateBeladyBars() {
  if (beladyAnimated) return;
  beladyAnimated = true;
  setTimeout(() => {
    document.querySelectorAll('.bb-fill').forEach(el => {
      const w = el.dataset.w;
      if (w) anime({ targets:el, width:`${w}%`, duration:900, easing:'easeOutCubic' });
    });
  }, 300);
}

/* ══════════════════════════════════════════════
   PAGE LOAD ANIMATION (PLA)
══════════════════════════════════════════════ */
const PLA_STEPS = [
  {
    n:'①',
    t:'CPU generates a logical address for page 3, offset 045. It sends page number p=3 to the page table to find which physical frame holds that page.',
    actor:'pla-cpu', arrows:[],
    ptResult:'✗ NOT IN RAM', ptCls:'text-fault',
    freeVal:'FREE', diskFetch:false, step:1
  },
  {
    n:'②',
    t:'Page table lookup: p=3 has valid bit = ✗. This page is not currently in a RAM frame. A page fault is triggered and the CPU traps to the OS.',
    actor:'pla-pt', arrows:[1],
    ptResult:'✗ NOT IN RAM', ptCls:'text-fault',
    freeVal:'FREE', diskFetch:false, step:2
  },
  {
    n:'③',
    t:'PAGE FAULT TRAP: The OS intercepts. It identifies a free frame (F2) and locates page 3 on disk. It initiates a disk read, which is the slowest step in this process.',
    actor:'pla-disk', arrows:[1,2,3],
    ptResult:'✗ NOT IN RAM', ptCls:'text-fault',
    freeVal:'FREE', diskFetch:true, step:3
  },
  {
    n:'④',
    t:'Disk read in progress. Page 3 is being copied from disk into Frame 2 of physical RAM. This takes thousands of times longer than a normal RAM access.',
    actor:'pla-ram', arrows:[2,3],
    ptResult:'✗ loading...', ptCls:'text-amber',
    freeVal:'loading...', diskFetch:true, step:4
  },
  {
    n:'⑤',
    t:'Page 3 is now in Frame 2. The OS updates the page table: p=3 maps to f=2, valid bit set to ✓. The frame is no longer free.',
    actor:'pla-pt', arrows:[1],
    ptResult:'→ f=2 ✓', ptCls:'text-cyan',
    freeVal:'p=3 ✓', diskFetch:false, step:5
  },
  {
    n:'⑥',
    t:'RESUME: The OS restarts the faulted instruction. The page table lookup now succeeds. p=3 maps to f=2 and the CPU combines f=2 with offset 045 to get the physical address.',
    actor:'pla-cpu', arrows:[],
    ptResult:'→ f=2 ✓', ptCls:'text-cyan',
    freeVal:'p=3 ✓', diskFetch:false, step:6
  },
];

function makeSixStepDemo(steps, ids) {
  let cur = 0;
  let autoTimer = null;
  let isPlaying = false;

  function render() {
    const counter = $(ids.counter);
    if (counter) counter.textContent = `Step ${cur} / ${steps.length}`;

    if (cur === 0) {
      resetVisuals();
      return;
    }

    const s = steps[cur - 1];
    $(ids.descNum).textContent = s.n;
    $(ids.descText).textContent = s.t;
    if (s.ptResult !== undefined && $(ids.ptResult)) {
      $(ids.ptResult).textContent = s.ptResult;
      $(ids.ptResult).className = s.ptCls;
    }
    if (s.freeVal !== undefined && $(ids.freeVal)) {
      $(ids.freeVal).textContent = s.freeVal;
      if (s.freeVal !== 'FREE' && s.freeVal !== 'loading...') {
        $(ids.freeFrame) && $(ids.freeFrame).classList.add('frame-loaded');
      }
    }

    // disk icon
    if ($(ids.diskIcon)) {
      $(ids.diskIcon).classList.toggle('disk-spin', s.diskFetch);
      if (s.diskFetch) {
        anime({ targets:`#${ids.diskIcon}`, scale:[1,1.18,1], duration:600, easing:'easeOutQuad', loop:false });
      }
    }
    if ($(ids.diskPage)) {
      $(ids.diskPage).classList.toggle('disk-fetching', s.diskFetch);
    }

    // actor highlights
    if (ids.actors) {
      ids.actors.forEach(aid => {
        const el = $(aid);
        if (!el) return;
        el.classList.toggle('pla-active', aid === s.actor);
        el.classList.toggle('pla-done', aid !== s.actor);
      });
    }
    if (ids.pfcActors) {
      ids.pfcActors.forEach(aid => {
        const el = $(aid);
        if (!el) return;
        el.classList.toggle('node-active', aid === s.actor);
        el.classList.toggle('node-done',   aid !== s.actor && cur > 0);
      });
    }

    // arrows / connectors
    if (ids.arrows) {
      ids.arrows.forEach((aid, idx) => {
        const el = $(aid);
        if (el) el.classList.toggle('arrow-lit', s.arrows && s.arrows.includes(idx + 1));
      });
    }
    if (ids.connectors) {
      ids.connectors.forEach((cid, idx) => {
        const el = $(cid);
        if (el) el.classList.toggle('conn-lit', s.arrows && s.arrows.includes(idx + 1));
      });
    }

    // breadcrumb
    if (ids.bcPrefix) {
      for (let i = 1; i <= steps.length; i++) {
        const el = $(`${ids.bcPrefix}${i}`);
        if (!el) continue;
        el.classList.remove('bc-done','bc-active');
        if (i < cur) el.classList.add('bc-done');
        if (i === cur) el.classList.add('bc-active');
      }
    }
    // pills
    if (ids.pills) {
      document.querySelectorAll(`${ids.pills} .pfc-pill`).forEach(p => {
        const st = parseInt(p.dataset.step);
        p.classList.remove('pill-done','pill-active');
        if (st < cur) p.classList.add('pill-done');
        if (st === cur) p.classList.add('pill-active');
      });
    }

    anime({ targets:`#${ids.descBar}`, opacity:[0.5,1], duration:280 });
  }

  function resetVisuals() {
    if ($(ids.descNum))  $(ids.descNum).textContent = '—';
    if ($(ids.descText)) $(ids.descText).textContent = 'Press PLAY or STEP to begin.';
    if (ids.actors) ids.actors.forEach(aid => { const e=$(aid); if(e){e.classList.remove('pla-active','pla-done');} });
    if (ids.pfcActors) ids.pfcActors.forEach(aid => { const e=$(aid); if(e){e.classList.remove('node-active','node-done');} });
    if (ids.arrows) ids.arrows.forEach(aid => { const e=$(aid); if(e) e.classList.remove('arrow-lit'); });
    if (ids.connectors) ids.connectors.forEach(cid => { const e=$(cid); if(e) e.classList.remove('conn-lit'); });
    if (ids.bcPrefix) for (let i=1;i<=steps.length;i++) { const e=$(`${ids.bcPrefix}${i}`); if(e){e.classList.remove('bc-done','bc-active');} }
    if (ids.pills) document.querySelectorAll(`${ids.pills} .pfc-pill`).forEach(p=>p.classList.remove('pill-done','pill-active'));
    // reset specific state
    if ($(ids.ptResult)) { $(ids.ptResult).textContent = '✗ NOT IN RAM'; $(ids.ptResult).className = 'text-fault'; }
    if ($(ids.freeVal)) $(ids.freeVal).textContent = 'FREE';
    if ($(ids.freeFrame)) $(ids.freeFrame).classList.remove('frame-loaded');
    if ($(ids.diskIcon)) $(ids.diskIcon).classList.remove('disk-spin');
    if ($(ids.diskPage)) $(ids.diskPage).classList.remove('disk-fetching');
  }

  function stopAuto() {
    clearTimeout(autoTimer); autoTimer = null; isPlaying = false;
    const btn = $(ids.playBtn);
    if (btn) { btn.textContent = '▶ PLAY'; btn.classList.remove('playing'); }
  }

  return {
    step() {
      if (cur >= steps.length) return;
      cur++;
      render();
    },
    prev() {
      if (cur <= 0) return;
      cur--;
      render();
    },
    reset() {
      stopAuto();
      cur = 0;
      render();
    },
    playAuto() {
      if (isPlaying) { stopAuto(); return; }
      if (cur >= steps.length) { cur = 0; render(); }
      isPlaying = true;
      const btn = $(ids.playBtn);
      if (btn) { btn.textContent = '⏸ PAUSE'; btn.classList.add('playing'); }
      const tick = () => {
        if (cur >= steps.length) { stopAuto(); return; }
        cur++;
        render();
        autoTimer = setTimeout(tick, 1400);
      };
      autoTimer = setTimeout(tick, 400);
    }
  };
}

/* Instantiate PLA demo */
const plaDemo = makeSixStepDemo(PLA_STEPS, {
  counter: 'pla-counter',
  descNum: 'pla-desc-num', descText: 'pla-desc-text',
  descBar: 'pla-desc',
  ptResult: 'pla-pt-result',
  freeVal: 'pla-frame-val', freeFrame: 'pla-free-frame',
  diskIcon: 'pla-disk-icon', diskPage: 'pla-disk-p3',
  actors: ['pla-cpu','pla-pt','pla-ram','pla-disk'],
  arrows: ['pla-arrow-1','pla-arrow-2','pla-arrow-3'],
  bcPrefix: 'pla-bc-',
  playBtn: 'pla-play-btn',
});

/* PFC Steps */
const PFC_STEPS = [
  { n:'①', t:'REFERENCE: Process runs "load M". The CPU looks up page M in the page table. Valid bit is ✗, so the page is not in RAM.',
    actor:'pfn-process', connectors:[], ptVal:'✗ invalid', ptCls:'text-fault', freeVal:'FREE', diskHighlight:true, step:1 },
  { n:'②', t:'TRAP: The CPU raises a page fault interrupt. Control transfers to the OS. The process is paused until the fault is resolved.',
    actor:'pfn-os', connectors:[1], ptVal:'✗ invalid', ptCls:'text-fault', freeVal:'FREE', diskHighlight:true, step:2 },
  { n:'③', t:'FIND ON DISK: The OS checks the backing store and locates page M. It identifies Frame 2 as a free frame and initiates a disk read.',
    actor:'pfn-disk', connectors:[1,2,3], ptVal:'✗ invalid', ptCls:'text-fault', freeVal:'FREE', diskHighlight:true, step:3 },
  { n:'④', t:'LOAD PAGE: The OS copies page M from disk into Frame 2 of physical RAM. This disk I/O is the most time-consuming step.',
    actor:'pfn-ram', connectors:[2,3], ptVal:'loading...', ptCls:'text-amber', freeVal:'loading...', diskHighlight:false, step:4 },
  { n:'⑤', t:'UPDATE TABLE: The OS updates the page table. p=M now maps to f=2 with valid bit set to ✓. The frame is no longer free.',
    actor:'pfn-os', connectors:[1], ptVal:'→ f=2 ✓', ptCls:'text-cyan', freeVal:'page M ✓', diskHighlight:false, step:5 },
  { n:'⑥', t:'RESTART: The OS resumes the process and re-executes the faulted instruction. The lookup now succeeds and execution continues normally.',
    actor:'pfn-process', connectors:[], ptVal:'→ f=2 ✓', ptCls:'text-cyan', freeVal:'page M ✓', diskHighlight:false, step:6 },
];

const PFC_STEPS_ADAPTED = PFC_STEPS.map(s => ({
  ...s,
  ptResult: s.ptVal, ptCls: s.ptCls,
  freeVal: s.freeVal,
  diskFetch: s.diskHighlight,
  arrows: s.connectors,
}));

const pfcDemo = makeSixStepDemo(PFC_STEPS_ADAPTED, {
  counter: 'pfc-counter',
  descNum: 'pfc-desc-num', descText: 'pfc-desc-text',
  descBar: 'pfc-desc-bar',
  ptResult: 'pfn-pt-val',
  freeVal: 'pfn-free-val', freeFrame: null,
  diskIcon: 'pfn-disk-icon', diskPage: 'pfn-disk-m',
  pfcActors: ['pfn-process','pfn-os','pfn-ram','pfn-disk'],
  connectors: ['pfc-conn-1','pfc-conn-2','pfc-conn-3'],
  pills: '#pfc-box',
  playBtn: 'pfc-play-btn',
});

/* ══════════════════════════════════════════════
   ALGORITHM ENGINE
══════════════════════════════════════════════ */
function runAlgo(algo, ref, fc) {
  let frames = new Array(fc).fill(null);
  let queue = [];
  let faults = 0, hits = 0;
  const steps = [];

  ref.forEach((page, i) => {
    const inF = frames.includes(page);
    let evicted = null;
    if (inF) {
      hits++;
      if (algo === 'lru') { queue = queue.filter(p=>p!==page); queue.push(page); }
    } else {
      faults++;
      const slot = frames.indexOf(null);
      if (slot !== -1) {
        frames = [...frames]; frames[slot] = page; queue.push(page);
      } else {
        if (algo === 'fifo') {
          evicted = queue[0]; queue.shift(); queue.push(page);
          frames = [...frames]; frames[frames.indexOf(evicted)] = page;
        } else if (algo === 'lru') {
          evicted = queue[0]; queue.shift(); queue.push(page);
          frames = [...frames]; frames[frames.indexOf(evicted)] = page;
        } else {
          const fut = frames.map(p => ({ p, d:(() => { const n=ref.slice(i+1).indexOf(p); return n===-1?Infinity:n; })() }));
          fut.sort((a,b) => b.d - a.d);
          evicted = fut[0].p;
          frames = [...frames]; frames[frames.indexOf(evicted)] = page;
          queue = frames.filter(p=>p!==null);
        }
      }
    }
    steps.push({ step:i, page, hit:inF, fault:!inF, frames:[...frames], evicted, faults, hits });
  });
  return { steps, totalFaults:faults, totalHits:hits };
}

/* ══════════════════════════════════════════════
   TABLE STEPPER
══════════════════════════════════════════════ */
class TableStepper {
  constructor({ ref, fc, algo, ids }) {
    this.ref=ref; this.fc=fc; this.algo=algo; this.ids=ids;
    this.result=runAlgo(algo,ref,fc);
    this.cur=0; this.autoTimer=null;
    this._build();
  }

  _build() {
    const { ref, fc, ids, result } = this;
    const n = ref.length;

    // ref row
    const rEl=$(ids.ref); rEl.innerHTML='';
    ref.forEach((p,i) => {
      const c=document.createElement('div');
      c.className='tc tc-ref tc-done'; c.textContent=p; c.id=`${ids.ref}-r${i}`;
      rEl.appendChild(c);
    });

    // frame rows
    const frEl=$(ids.frameRows); frEl.innerHTML='';
    for (let f=0;f<fc;f++) {
      const row=document.createElement('div'); row.className='tb-frame-row';
      const lbl=document.createElement('div'); lbl.className='tb-frame-row-label'; lbl.textContent=`F${f}`;
      const cells=document.createElement('div'); cells.className='tb-frame-cells';
      for (let i=0;i<n;i++) {
        const c=document.createElement('div'); c.className='tc tc-empty'; c.id=`${ids.ref}-f${f}-c${i}`;
        cells.appendChild(c);
      }
      row.appendChild(lbl); row.appendChild(cells); frEl.appendChild(row);
    }

    // status row
    const stEl=$(ids.status); stEl.innerHTML='';
    for (let i=0;i<n;i++) {
      const c=document.createElement('div'); c.className='tc tc-st-n'; c.id=`${ids.ref}-st${i}`;
      stEl.appendChild(c);
    }
    this._tick(); this._updateStats(0,0);
  }

  _reveal(i) {
    const s=this.result.steps[i]; const {ids,fc}=this;
    if (i>0) { const p=$(`${ids.ref}-r${i-1}`); if(p){p.classList.remove('tc-active');p.classList.add('tc-done');} }
    const rc=$(`${ids.ref}-r${i}`);
    if (rc) { rc.classList.remove('tc-done'); rc.classList.add('tc-active'); }
    for (let f=0;f<fc;f++) {
      const c=$(`${ids.ref}-f${f}-c${i}`); if(!c) continue;
      const val=s.frames[f]; c.textContent=val??''; c.className='tc';
      if (val===null) { c.classList.add('tc-empty'); }
      else if (s.fault&&val===s.page) { c.classList.add('tc-fault'); anime({targets:c,scale:[1,1.12,1],duration:280,easing:'easeOutQuad'}); }
      else if (s.hit&&val===s.page)   { c.classList.add('tc-hit'); anime({targets:c,scale:[1,1.07,1],duration:230,easing:'easeOutQuad'}); }
    }
    const st=$(`${ids.ref}-st${i}`);
    if (st) {
      st.className='tc';
      if (s.fault) { st.classList.add('tc-st-f'); st.textContent='F'; }
      else          { st.classList.add('tc-st-h'); st.textContent='H'; }
    }
  }

  _hide(i) {
    const {ids,fc}=this;
    for (let f=0;f<fc;f++) { const c=$(`${ids.ref}-f${f}-c${i}`); if(c){c.className='tc tc-empty';c.textContent='';} }
    const rc=$(`${ids.ref}-r${i}`); if(rc){rc.className='tc tc-ref tc-done';}
    const st=$(`${ids.ref}-st${i}`); if(st){st.className='tc tc-st-n';st.textContent='';}
  }

  _tick() {
    const el=$(this.ids.counter); if(el) el.textContent=`Step ${this.cur} / ${this.ref.length}`;
  }

  _updateStats(faults,hits) {
    const total=faults+hits;
    const fc=$(this.ids.faultCount); if(fc) fc.textContent=faults;
    const hc=$(this.ids.hitCount);   if(hc) hc.textContent=hits;
    const hr=$(this.ids.hitRatio);   if(hr) hr.textContent=total?`${((hits/total)*100).toFixed(1)}%`:'—';
  }

  next() {
    if (this.cur>=this.ref.length) return;
    this._reveal(this.cur); this.cur++;
    const s=this.result.steps[this.cur-1];
    this._updateStats(s.faults,s.hits); this._tick();
  }

  prev() {
    if (this.cur<=0) return;
    this.cur--; this._hide(this.cur);
    if (this.cur>0) { const p=$(`${this.ids.ref}-r${this.cur-1}`); if(p){p.classList.remove('tc-done');p.classList.add('tc-active');} }
    const s=this.cur>0?this.result.steps[this.cur-1]:null;
    this._updateStats(s?s.faults:0,s?s.hits:0); this._tick();
  }

  reset() {
    this.stopAuto(); this.cur=0; this._build();
    const btn=$(this.ids.autoBtn); if(btn) btn.classList.remove('active');
  }

  stopAuto() {
    clearTimeout(this.autoTimer); this.autoTimer=null;
    const btn=$(this.ids.autoBtn); if(btn) btn.classList.remove('active');
  }

  toggleAuto() {
    if (this.autoTimer) { this.stopAuto(); return; }
    const btn=$(this.ids.autoBtn); if(btn) btn.classList.add('active');
    const tick=()=>{
      if(this.cur>=this.ref.length){this.stopAuto();return;}
      this.next(); this.autoTimer=setTimeout(tick,680);
    };
    this.autoTimer=setTimeout(tick,300);
  }
}

const DEMO_REF=[7,0,1,2,0,3,0,4,2,3,0,3,2], DEMO_FC=3;
let fifoDemo, lruDemo, optDemo;

function buildDemos() {
  fifoDemo=new TableStepper({ref:DEMO_REF,fc:DEMO_FC,algo:'fifo',ids:{ref:'fifo-tb-ref',frameRows:'fifo-tb-frames',status:'fifo-tb-status',counter:'fifo-step-counter',faultCount:'fifo-fault-count',hitCount:'fifo-hit-count',hitRatio:'fifo-hit-ratio',autoBtn:'fifo-auto-btn'}});
  lruDemo =new TableStepper({ref:DEMO_REF,fc:DEMO_FC,algo:'lru', ids:{ref:'lru-tb-ref', frameRows:'lru-tb-frames', status:'lru-tb-status', counter:'lru-step-counter', faultCount:'lru-fault-count', hitCount:'lru-hit-count', hitRatio:'lru-hit-ratio', autoBtn:'lru-auto-btn'}});
  optDemo =new TableStepper({ref:DEMO_REF,fc:DEMO_FC,algo:'opt', ids:{ref:'opt-tb-ref', frameRows:'opt-tb-frames', status:'opt-tb-status', counter:'opt-step-counter', faultCount:'opt-fault-count', hitCount:'opt-hit-count', hitRatio:'opt-hit-ratio', autoBtn:'opt-auto-btn'}});
}

/* ══════════════════════════════════════════════
   SIMULATOR
══════════════════════════════════════════════ */
let simFC=3, simRunning=false, simStepState=null, simStepCursor=0;

function changeFrames(d) { simFC=clamp(simFC+d,1,10); $('sim-frames-display').textContent=simFC; }

function parseRef(s) {
  return s.trim().split(/\s+/).map(t=>{const n=parseInt(t);if(isNaN(n)||n<0)throw new Error(`Invalid: "${t}"`);return n;});
}

function buildSimTable(a,ref,fc) {
  const n=ref.length;
  const rEl=$(`sim-${a}-ref`); rEl.innerHTML='';
  ref.forEach((p,i)=>{const c=document.createElement('div');c.className='tc stc';c.textContent=p;c.id=`s${a}-r${i}`;rEl.appendChild(c);});
  const frEl=$(`sim-${a}-frames-rows`); frEl.innerHTML='';
  for(let f=0;f<fc;f++){
    const row=document.createElement('div');row.className='sim-tb-frame-row';
    const lbl=document.createElement('div');lbl.className='sim-tb-frame-label';lbl.textContent=`F${f}`;
    const cells=document.createElement('div');cells.className='sim-tb-frame-cells';
    for(let i=0;i<n;i++){const c=document.createElement('div');c.className='tc stc';c.id=`s${a}-f${f}-c${i}`;cells.appendChild(c);}
    row.appendChild(lbl);row.appendChild(cells);frEl.appendChild(row);
  }
  const stEl=$(`sim-${a}-status`);stEl.innerHTML='';
  for(let i=0;i<n;i++){const c=document.createElement('div');c.className='tc stc';c.id=`s${a}-st${i}`;stEl.appendChild(c);}
}

function revealSimCell(a,i,steps,fc) {
  const s=steps[i];
  const rc=$(`s${a}-r${i}`);if(rc){rc.classList.add('sv');rc.style.color='rgba(77,255,124,0.58)';}
  for(let f=0;f<fc;f++){
    const c=$(`s${a}-f${f}-c${i}`);if(!c)continue;
    const val=s.frames[f];c.textContent=val??'';c.classList.add('sv');
    if(val===null)c.classList.add('tc-empty');
    else if(s.fault&&val===s.page)c.classList.add('tc-fault');
    else if(s.hit&&val===s.page)c.classList.add('tc-hit');
  }
  const st=$(`s${a}-st${i}`);if(st){
    st.classList.add('sv');
    if(s.fault){st.classList.add('tc-st-f');st.textContent='F';}
    else{st.classList.add('tc-st-h');st.textContent='H';}
  }
}

function buildSimStats(a,result,ref) {
  const el=$(`sim-${a}-stats`);if(!el)return;
  const total=ref.length,hr=((result.totalHits/total)*100).toFixed(1);
  el.innerHTML=`<span>FAULTS <strong class="text-fault">${result.totalFaults}</strong></span><span>HITS <strong class="text-cyan">${result.totalHits}</strong></span><span>HIT RATIO <strong class="text-amber">${hr}%</strong></span>`;
}

function finalizeSimResults(results,algos) {
  const names={fifo:'FIFO',lru:'LRU',opt:'OPTIMAL'};
  const cls={fifo:'text-amber',lru:'text-cyan',opt:'text-opt'};
  const minF=Math.min(...algos.map(a=>results[a].totalFaults));
  algos.forEach(a=>{
    const b=$(`sim-${a}-badge`);if(!b)return;
    if(results[a].totalFaults===minF){b.textContent='★ FEWEST FAULTS';b.className='sim-algo-badge badge-win';}
    else{b.textContent=`+${results[a].totalFaults-minF} fault(s)`;b.className='sim-algo-badge badge-lose';}
  });
  const w=$('sim-winner'),wi=$('sim-winner-inner');
  const winners=algos.filter(a=>results[a].totalFaults===minF);
  wi.innerHTML=winners.length>1
    ?`TIE — ${winners.map(a=>`<span class="${cls[a]}">${names[a]}</span>`).join(' & ')} — ${minF} faults each`
    :`★ WINNER: <span class="${cls[winners[0]]}">${names[winners[0]]}</span> with <strong>${minF}</strong> fault${minF!==1?'s':''}`;
  w.classList.remove('hidden');
  const area=$('sim-chart-area'),bars=$('sim-chart-bars');
  area.classList.remove('hidden');bars.innerHTML='';
  const maxF=Math.max(...algos.map(a=>results[a].totalFaults),1);
  const col={fifo:{b:'rgba(255,193,7,0.28)',v:'var(--amber)'},lru:{b:'rgba(24,240,255,0.22)',v:'var(--cyan)'},opt:{b:'rgba(192,132,252,0.25)',v:'var(--opt)'}};
  algos.forEach(a=>{
    const pct=results[a].totalFaults/maxF,h=Math.max(5,Math.round(pct*100));
    const g=document.createElement('div');g.className='chart-bar-group';
    g.innerHTML=`<div class="chart-bar-fill" style="height:${h}px;background:${col[a].b};border:1px solid ${col[a].v};border-bottom:none;"><span class="chart-bar-val" style="color:${col[a].v}">${results[a].totalFaults}</span></div><span class="chart-bar-label" style="color:${col[a].v}">${names[a]}</span>`;
    bars.appendChild(g);
  });
}

async function simRun() {
  if(simRunning)return;
  const err=$('sim-error');err.classList.add('hidden');
  let ref;try{ref=parseRef($('sim-ref').value);}catch(e){err.textContent=`⚠ ${e.message}`;err.classList.remove('hidden');return;}
  if(!ref.length){err.textContent='⚠ Empty string.';err.classList.remove('hidden');return;}
  const doF=$('cb-fifo').checked,doL=$('cb-lru').checked,doO=$('cb-opt').checked;
  if(!doF&&!doL&&!doO){err.textContent='⚠ Select at least one algorithm.';err.classList.remove('hidden');return;}
  simRunning=true;$('sim-run-btn').textContent='⏳...';$('sim-run-btn').disabled=true;
  $('sim-empty').classList.add('hidden');
  $('sim-winner').classList.add('hidden');$('sim-chart-area').classList.add('hidden');
  const results={},algos=[];
  if(doF){results.fifo=runAlgo('fifo',ref,simFC);algos.push('fifo');}
  if(doL){results.lru =runAlgo('lru', ref,simFC);algos.push('lru');}
  if(doO){results.opt =runAlgo('opt', ref,simFC);algos.push('opt');}
  $('sim-fifo-section').style.display=doF?'':'none';
  $('sim-lru-section').style.display =doL?'':'none';
  $('sim-opt-section').style.display =doO?'':'none';
  algos.forEach(a=>{buildSimTable(a,ref,simFC);buildSimStats(a,results[a],ref);});
  $('sim-results').classList.remove('hidden');
  const speed=parseInt($('sim-speed').value);
  for(let i=0;i<ref.length;i++){
    await new Promise(r=>setTimeout(r,speed*0.38));
    algos.forEach(a=>revealSimCell(a,i,results[a].steps,simFC));
  }
  finalizeSimResults(results,algos);
  simRunning=false;$('sim-run-btn').textContent='▶ RUN';$('sim-run-btn').disabled=false;
}

function simStep() {
  const err=$('sim-error');err.classList.add('hidden');
  if(!simStepState){
    let ref;try{ref=parseRef($('sim-ref').value);}catch(e){err.textContent=`⚠ ${e.message}`;err.classList.remove('hidden');return;}
    const doF=$('cb-fifo').checked,doL=$('cb-lru').checked,doO=$('cb-opt').checked;
    const results={},algos=[];
    if(doF){results.fifo=runAlgo('fifo',ref,simFC);algos.push('fifo');}
    if(doL){results.lru =runAlgo('lru', ref,simFC);algos.push('lru');}
    if(doO){results.opt =runAlgo('opt', ref,simFC);algos.push('opt');}
    $('sim-fifo-section').style.display=doF?'':'none';
    $('sim-lru-section').style.display =doL?'':'none';
    $('sim-opt-section').style.display =doO?'':'none';
    algos.forEach(a=>{buildSimTable(a,ref,simFC);buildSimStats(a,results[a],ref);});
    $('sim-empty').classList.add('hidden');$('sim-results').classList.remove('hidden');
    simStepState={results,ref,algos,fc:simFC};simStepCursor=0;
  }
  const{results,ref,algos,fc}=simStepState;
  if(simStepCursor>=ref.length)return;
  algos.forEach(a=>revealSimCell(a,simStepCursor,results[a].steps,fc));
  simStepCursor++;
  if(simStepCursor>=ref.length)finalizeSimResults(results,algos);
}

function simReset() {
  simRunning=false;simStepState=null;simStepCursor=0;
  $('sim-results').classList.add('hidden');$('sim-empty').classList.remove('hidden');
  $('sim-winner').classList.add('hidden');$('sim-chart-area').classList.add('hidden');
  $('sim-error').classList.add('hidden');
  $('sim-run-btn').textContent='▶ RUN';$('sim-run-btn').disabled=false;
  ['fifo','lru','opt'].forEach(a=>{
    [$(`sim-${a}-ref`),$(`sim-${a}-frames-rows`),$(`sim-${a}-status`),$(`sim-${a}-stats`)].forEach(el=>{if(el)el.innerHTML='';});
    const b=$(`sim-${a}-badge`);if(b){b.textContent='';b.className='sim-algo-badge';}
  });
}

/* ─── Keyboard shortcuts ─── */
function visibleSection() {
  for (const id of ['fifo','lru','opt','page-fault-cycle','key-terms','simulator']) {
    const el=document.getElementById(id);if(!el)continue;
    const r=el.getBoundingClientRect();
    if(r.top<window.innerHeight*0.62&&r.bottom>0.18*window.innerHeight)return id;
  }
  return null;
}

document.addEventListener('keydown', e => {
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(document.activeElement&&document.activeElement.tagName==='INPUT')return;
  const sec=visibleSection();
  if(sec==='fifo')             {if(e.key==='ArrowRight')fifoDemo.next();if(e.key==='ArrowLeft')fifoDemo.prev();}
  if(sec==='lru')              {if(e.key==='ArrowRight')lruDemo.next(); if(e.key==='ArrowLeft')lruDemo.prev();}
  if(sec==='opt')              {if(e.key==='ArrowRight')optDemo.next(); if(e.key==='ArrowLeft')optDemo.prev();}
  if(sec==='page-fault-cycle') {if(e.key==='ArrowRight')pfcDemo.step();if(e.key==='ArrowLeft')pfcDemo.prev();}

  if(sec==='simulator'&&e.key==='Enter')simRun();
});

/* ─── Init ─── */
window.addEventListener('DOMContentLoaded', () => {
  buildDemos();
  pfcDemo.reset();

  // Hero stagger
  anime({
    targets:'.hero-content > *',
    opacity:[0,1], translateY:[18,0],
    delay:anime.stagger(100,{start:300}),
    duration:650, easing:'easeOutCubic'
  });
});
