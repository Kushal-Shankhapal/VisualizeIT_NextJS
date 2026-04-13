/* ═══════════════════════════════════════════════
   setpiece.js  —  Nav dots · Set piece · Scoreboard
═══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   SECTION NAV DOTS
══════════════════════════════════════════════ */
const SECTIONS = [
  { id: 's0', label: 'Start'       },
  { id: 's1', label: 'The Disk'    },
  { id: 's2', label: 'Problem'     },
  { id: 's3', label: 'Scheduling'  },
  { id: 's4', label: 'Key Terms'   },
  { id: 's5', label: 'Algorithms'  },
  { id: 's6', label: 'Watch It'    },
  { id: 's7', label: 'Scoreboard'  },
  { id: 's8', label: 'Try It'      },
];

function buildNav() {
  const nav = document.getElementById('section-nav');
  if (!nav) return;
  SECTIONS.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.id = 'nav-item-' + i;
    item.onclick = () => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
    item.innerHTML = `
      <div class="nav-dot-wrap">
        <div class="nav-dot" id="ndot-${i}"></div>
        ${i < SECTIONS.length - 1 ? `<div class="nav-connector" id="ncon-${i}"></div>` : ''}
      </div>
      <span class="nav-label">${s.label}</span>
    `;
    nav.appendChild(item);
  });
}

function updateNav() {
  const scrollY = window.scrollY + window.innerHeight * 0.4;
  let active = 0;
  SECTIONS.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (el && el.offsetTop <= scrollY) active = i;
  });
  SECTIONS.forEach((_, i) => {
    const dot  = document.getElementById('ndot-' + i);
    const con  = document.getElementById('ncon-' + i);
    const item = document.getElementById('nav-item-' + i);
    if (!dot) return;
    dot.className  = 'nav-dot' + (i === active ? ' active' : i < active ? ' done' : '');
    if (item) item.className = 'nav-item' + (i === active ? ' active-item' : '');
    if (con)  con.className  = 'nav-connector' + (i < active ? ' filled' : '');
  });
}

/* ══════════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.r').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════
   SET PIECE
══════════════════════════════════════════════ */
const SP_ALGOS = {
  FCFS:  { seq: [53,98,183,37,122,14,124,65,67],       color: '#ff6b6b', label: 'First Come First Served'  },
  SSTF:  { seq: [53,65,67,98,122,124,183,37,14],       color: '#ffd43b', label: 'Shortest Seek Time First' },
  SCAN:  { seq: [53,65,67,98,122,124,183,199,37,14],   color: '#8db4f5', label: 'SCAN — Elevator'          },
  LOOK:  { seq: [53,65,67,98,122,124,183,37,14],       color: '#38d9a9', label: 'LOOK'                     },
  CSCAN: { seq: [53,65,67,98,122,124,183,199,0,14,37], color: '#f07b3f', label: 'Circular SCAN'            },
  CLOOK: { seq: [53,65,67,98,122,124,183,14,37],       color: '#38d9a9', label: 'Circular LOOK'            },
};
const ALL_REQS = [98, 183, 37, 122, 14, 124, 65, 67];
const DISK_MAX = 199;

let spAlgo  = 'FCFS';
let spStep  = 0;
let spTotal = 0;
let spAuto  = null;

/* track → percent along axis (6%–94%) */
function spPct(track) { return 6 + (track / DISK_MAX) * 88; }

/* track → arm radius on disk SVG (track 0 = r 170, track 199 = r 30) */
function trackToR(track) { return 170 - (track / DISK_MAX) * 140; }
const ARM_ANGLE = -1.1; // fixed sweep angle (radians)

function spUpdateDiskArm(track) {
  const r  = trackToR(track);
  const tx = (200 + Math.cos(ARM_ANGLE) * r).toFixed(1);
  const ty = (200 + Math.sin(ARM_ANGLE) * r).toFixed(1);
  const line = document.querySelector('#sp-arm line');
  const tip  = document.getElementById('sp-arm-tip');
  const ring = document.getElementById('sp-track-ring');
  if (line) { line.setAttribute('x2', tx); line.setAttribute('y2', ty); }
  if (tip)  { tip.setAttribute('cx', tx);  tip.setAttribute('cy', ty);  }
  if (ring) ring.setAttribute('r', r.toFixed(1));
}

window.spSetAlgo = function(name) {
  spAlgo = name;
  spReset();
  Object.keys(SP_ALGOS).forEach(k => {
    const btn = document.getElementById('sp-btn-' + k);
    if (btn) btn.className = 'btn' + (k === name ? ' primary' : '');
  });
  const lbl = document.getElementById('sp-algo-label');
  if (lbl) lbl.textContent = SP_ALGOS[name].label;
};

window.spReset = function() {
  spStep = 0; spTotal = 0;
  if (spAuto) { clearInterval(spAuto); spAuto = null; _setAutoLabel('▶ Auto-play'); }

  document.getElementById('sp-axis-head').style.left = spPct(53) + '%';
  document.getElementById('sp-axis-lbl').textContent = '53';
  document.getElementById('sp-total').textContent = '0';
  document.getElementById('sp-total').style.color = 'var(--orange)';
  document.getElementById('sp-step-counter').textContent = '0 / ' + (SP_ALGOS[spAlgo].seq.length - 1);
  document.getElementById('sp-log').innerHTML = '<span style="color:var(--muted)">Select an algorithm then press Next Step.</span>';

  const nextBtn = document.getElementById('sp-next-btn');
  if (nextBtn) nextBtn.disabled = false;

  // rebuild req dots
  const reqWrap = document.getElementById('sp-axis-reqs');
  reqWrap.innerHTML = '';
  ALL_REQS.forEach(t => {
    const d = document.createElement('div');
    d.className = 'axis-req';
    d.id = 'req-dot-' + t;
    d.style.left = spPct(t) + '%';
    reqWrap.appendChild(d);
  });

  spUpdateDiskArm(53);
};

window.spNext = function() {
  const algo = SP_ALGOS[spAlgo];
  if (spStep >= algo.seq.length - 1) { document.getElementById('sp-next-btn').disabled = true; return; }

  const from = algo.seq[spStep];
  const to   = algo.seq[spStep + 1];
  const dist = Math.abs(to - from);
  spTotal += dist;
  spStep++;

  /* axis head */
  document.getElementById('sp-axis-head').style.left = spPct(to) + '%';
  document.getElementById('sp-axis-lbl').textContent = to;

  /* disk arm */
  spUpdateDiskArm(to);

  /* mark visited dot */
  const dot = document.getElementById('req-dot-' + to);
  if (dot) dot.classList.add('visited');

  /* log */
  const log = document.getElementById('sp-log');
  const isEdge = (to === 0 || to === 199) && !ALL_REQS.includes(to);
  const entry = document.createElement('div');
  entry.className = 'fadeup';
  entry.innerHTML =
    `<span style="color:var(--muted)">Step ${spStep}:</span> ` +
    `<span style="color:var(--text)">${from} → ${to}</span>` +
    (isEdge ? ` <span style="color:var(--muted);font-size:10px;">(disk edge)</span>` : '') +
    `  <span style="color:${algo.color}">+${dist}</span>`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  /* counters */
  document.getElementById('sp-total').textContent = spTotal;
  document.getElementById('sp-total').style.color = algo.color;
  document.getElementById('sp-step-counter').textContent = `${spStep} / ${algo.seq.length - 1}`;

  if (spStep >= algo.seq.length - 1) {
    document.getElementById('sp-next-btn').disabled = true;
    if (spAuto) { clearInterval(spAuto); spAuto = null; _setAutoLabel('▶ Auto-play'); }
    const done = document.createElement('div');
    done.innerHTML = `<span style="color:${algo.color};font-weight:500;">Complete — ${spTotal} tracks total</span>`;
    log.appendChild(done);
    log.scrollTop = log.scrollHeight;
  }
};

window.spAutoPlay = function() {
  if (spAuto) { clearInterval(spAuto); spAuto = null; _setAutoLabel('▶ Auto-play'); return; }
  _setAutoLabel('⏸ Pause');
  spAuto = setInterval(() => {
    const algo = SP_ALGOS[spAlgo];
    if (spStep >= algo.seq.length - 1) {
      clearInterval(spAuto); spAuto = null; _setAutoLabel('▶ Auto-play');
    } else { spNext(); }
  }, 700);
};

function _setAutoLabel(t) {
  const btn = document.getElementById('sp-auto-btn');
  if (btn) btn.textContent = t;
}

/* ══════════════════════════════════════════════
   SCOREBOARD
══════════════════════════════════════════════ */
const SCORES = [
  { name: 'FCFS',   val: 640, color: '#ff6b6b' },
  { name: 'SSTF',   val: 236, color: '#ffd43b' },
  { name: 'SCAN',   val: 187, color: '#8db4f5' },
  { name: 'LOOK ★', val: 153, color: '#38d9a9' },
  { name: 'C-SCAN', val: 382, color: '#f07b3f' },
  { name: 'C-LOOK', val: 157, color: '#38d9a9' },
];
const SCORE_MAX = 640;

function buildScoreboard() {
  const el = document.getElementById('scoreboard');
  if (!el) return;
  SCORES.forEach(s => {
    const row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:70px 1fr 55px;gap:12px;align-items:center;';
    row.innerHTML = `
      <span class="mono" style="font-size:12px;font-weight:500;color:${s.color}">${s.name}</span>
      <div class="score-bar-bg"><div class="score-bar-fill" id="sbar-${s.name.replace(/[★ ]/g,'')}" style="background:${s.color};"></div></div>
      <span class="mono" style="font-size:12px;color:${s.color};text-align:right">${s.val}</span>
    `;
    el.appendChild(row);
  });

  /* animate bars on scroll */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      SCORES.forEach((s, i) => {
        const id = 'sbar-' + s.name.replace(/[★ ]/g, '');
        const bar = document.getElementById(id);
        if (bar) setTimeout(() => { bar.style.width = (s.val / SCORE_MAX * 100).toFixed(1) + '%'; }, i * 80);
      });
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  obs.observe(el);
}

/* ══════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initReveal();
  buildScoreboard();
  window.spSetAlgo('FCFS');

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
});
