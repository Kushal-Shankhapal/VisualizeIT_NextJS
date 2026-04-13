/* ═══════════════════════════════════════════════
   drill.js  —  Disk structure drill-down
   Two canvases: perspective (3D) + top-view
═══════════════════════════════════════════════ */

const DRILL_STEPS = [
  {
    label: 'The Casing',
    caption: 'A hard disk drive (HDD) — the sealed metal box you\'d find inside a desktop or laptop. Everything we\'re about to see lives inside this enclosure.',
  },
  {
    label: 'Platters',
    caption: 'Inside: multiple spinning platters stacked on a central spindle. Each platter is a rigid disc coated in magnetic material. They spin at 5,400–7,200 RPM constantly.',
  },
  {
    label: 'Tracks',
    caption: 'Each platter surface is divided into concentric rings called tracks. Every track has a number — Track 0 is the outermost, Track 199 the innermost. All data lives at a specific track.',
  },
  {
    label: 'Sectors',
    caption: 'Each track is further divided into arc-shaped wedges called sectors — typically 512 bytes or 4 KB each. A file address = platter + track + sector.',
  },
  {
    label: 'Read Head',
    caption: 'An arm assembly holds one read/write head per platter surface. The head floats nanometres above the surface and reads/writes magnetically. Moving to a new track = a physical seek.',
  },
  {
    label: 'Cylinder',
    caption: 'The same track number across all platters forms a cylinder. Heads on all platters move together — so accessing all tracks of cylinder C costs only one seek.',
  },
];

let drillStep = 0;
let activeView = 'perspective'; // 'perspective' | 'top'

/* ── Canvas refs ── */
const perspCanvas = document.getElementById('drill-perspective');
const topCanvas   = document.getElementById('drill-top');
const pCtx = perspCanvas.getContext('2d');
const tCtx = topCanvas.getContext('2d');

/* ── Resize handler ── */
function resizeDrill() {
  const wrap = document.getElementById('drill-stage');
  const W = wrap.clientWidth;
  const H = Math.min(W * 0.65, 420);
  perspCanvas.width  = W;  perspCanvas.height = H;
  topCanvas.width    = W;  topCanvas.height   = H;
  drawPerspective();
  drawTopView();
}

/* ══════════════════════════════════════════════
   PERSPECTIVE VIEW  (mimics the textbook diagram)
══════════════════════════════════════════════ */
function drawPerspective() {
  const W = perspCanvas.width, H = perspCanvas.height;
  pCtx.clearRect(0, 0, W, H);

  // background
  pCtx.fillStyle = '#11121a';
  roundRect(pCtx, 0, 0, W, H, 0);
  pCtx.fill();

  const cx   = W * 0.38;  // horizontal centre of platters
  const baseY = H * 0.82; // bottom of stack
  const platW = W * 0.46; // half-width of ellipse for platter
  const platH = platW * 0.22; // vertical squish for perspective
  const stackGap = H * 0.18;  // vertical gap between platters
  const nPlatters = 3;

  /* How many platters to draw based on step */
  const showPlatters = drillStep >= 1 ? nPlatters : 0;

  /* ── Arm assembly (right side) ── */
  if (drillStep >= 4) {
    const armX = cx + platW + W * 0.05;
    const armTopY = baseY - stackGap * (nPlatters - 1) - H * 0.22;
    const armBotY = baseY + platH + H * 0.04;
    // vertical bar
    pCtx.fillStyle = '#5b8dee';
    pCtx.fillRect(armX - 6, armTopY, 12, armBotY - armTopY);
    // label
    drawPLabel(pCtx, armX + 22, (armTopY + armBotY) / 2, 'arm assembly', '#8db4f5');
  }

  /* ── Platters ── */
  for (let p = showPlatters - 1; p >= 0; p--) {
    const py = baseY - p * stackGap;
    drawPlatter(pCtx, cx, py, platW, platH, p, drillStep);
  }

  /* ── Spindle ── */
  if (drillStep >= 1) {
    const spindleTop = baseY - stackGap * (nPlatters - 1) - H * 0.12;
    pCtx.fillStyle = '#5b8dee';
    pCtx.beginPath();
    pCtx.ellipse(cx, spindleTop, 7, 3, 0, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillRect(cx - 4, spindleTop, 8, baseY - spindleTop + platH / 2);
    pCtx.fillStyle = '#5b8dee';
    pCtx.beginPath();
    pCtx.ellipse(cx, baseY + platH / 2, 7, 3, 0, 0, Math.PI * 2);
    pCtx.fill();
    drawPLabel(pCtx, cx - platW * 0.65, baseY - stackGap * (nPlatters - 1) - H * 0.14, 'spindle', '#8db4f5');
  }

  /* ── Rotation arrow ── */
  if (drillStep >= 1) {
    const ry = baseY + platH + H * 0.05;
    drawRotArrow(pCtx, cx - 28, ry, 28);
    drawPLabel(pCtx, cx - 28, ry + 16, 'rotation', '#5a5d7a');
  }

  /* ── Cylinder highlight ── */
  if (drillStep >= 5) {
    for (let p = 0; p < nPlatters; p++) {
      const py = baseY - p * stackGap;
      const r = platW * 0.55;
      pCtx.strokeStyle = 'rgba(240,123,63,0.6)';
      pCtx.lineWidth = 2;
      pCtx.setLineDash([5, 3]);
      pCtx.beginPath();
      pCtx.ellipse(cx, py, r, r * 0.22, 0, 0, Math.PI * 2);
      pCtx.stroke();
      pCtx.setLineDash([]);
    }
    // vertical cylinder guide lines
    const r = platW * 0.55;
    pCtx.strokeStyle = 'rgba(240,123,63,0.35)';
    pCtx.lineWidth = 1;
    pCtx.setLineDash([4, 4]);
    pCtx.beginPath();
    pCtx.moveTo(cx - r, baseY);
    pCtx.lineTo(cx - r, baseY - stackGap * (nPlatters - 1));
    pCtx.moveTo(cx + r, baseY);
    pCtx.lineTo(cx + r, baseY - stackGap * (nPlatters - 1));
    pCtx.stroke();
    pCtx.setLineDash([]);
    drawPLabel(pCtx, cx + r + 14, baseY - stackGap * 1.2, 'cylinder c', '#f07b3f');
  }

  /* ── Step caption ── */
  updateCaption();
}

function drawPlatter(ctx, cx, cy, rw, rh, platIdx, step) {
  const W = perspCanvas.width;

  /* platter body */
  ctx.fillStyle = '#1e2030';
  ctx.strokeStyle = '#343660';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  /* sheen */
  ctx.fillStyle = 'rgba(141,180,245,0.04)';
  ctx.beginPath();
  ctx.ellipse(cx - rw * 0.15, cy - rh * 0.3, rw * 0.7, rh * 0.45, 0, 0, Math.PI);
  ctx.fill();

  /* tracks (concentric rings) */
  if (step >= 2) {
    const trackRadii = [0.88, 0.72, 0.56, 0.40, 0.26];
    trackRadii.forEach((f, i) => {
      ctx.strokeStyle = `rgba(91,141,238,${0.15 + i * 0.04})`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rw * f, rh * f, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    if (platIdx === 0) {
      drawPLabel(ctx, cx - rw * 0.5, cy - rh * 0.88 - 14, 'track t', '#8db4f5');
    }
  }

  /* sectors (wedge divisions on top platter) */
  if (step >= 3 && platIdx === 0) {
    const nSectors = 8;
    for (let s = 0; s < nSectors; s++) {
      const a1 = (s / nSectors) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((s + 1) / nSectors) * Math.PI * 2 - Math.PI / 2;
      // draw sector arc on outer track
      const outerR = rw * 0.88, innerR = rw * 0.72;
      if (s === 1 || s === 2) {
        ctx.fillStyle = s === 1 ? 'rgba(240,123,63,0.35)' : 'rgba(56,217,169,0.25)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, outerR, rh * 0.88, 0, a1, a2);
        ctx.lineTo(cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * rh * 0.72);
        ctx.ellipse(cx, cy, innerR, rh * 0.72, 0, a2, a1, true);
        ctx.closePath();
        ctx.fill();
      }
      // dividing lines
      ctx.strokeStyle = 'rgba(91,141,238,0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * rw * 0.26, cy + Math.sin(a1) * rh * 0.26);
      ctx.lineTo(cx + Math.cos(a1) * rw * 0.88, cy + Math.sin(a1) * rh * 0.88);
      ctx.stroke();
    }
    drawPLabel(ctx, cx + rw * 0.65, cy - rh * 0.55, 'sector s', '#f07b3f');
  }

  /* center hub */
  ctx.fillStyle = '#11121a';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rw * 0.12, rh * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  /* arm + read/write head */
  if (step >= 4) {
    const armX = cx + rw + W * 0.048;
    const headX = cx + rw * 0.62;
    const armLen = armX - headX;

    // arm bar
    ctx.fillStyle = '#8db4f5';
    ctx.fillRect(headX, cy - 3, armLen, 5);

    // head (small square)
    ctx.fillStyle = '#11121a';
    ctx.strokeStyle = '#f07b3f';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#f07b3f';
    ctx.shadowBlur = 6;
    ctx.fillRect(headX - 6, cy - 5, 12, 9);
    ctx.strokeRect(headX - 6, cy - 5, 12, 9);
    ctx.shadowBlur = 0;

    if (platIdx === 0) {
      drawPLabel(ctx, headX + 18, cy + 18, 'read-write head', '#f07b3f');
      drawPLabel(ctx, headX + 18, cy + 32, 'arm', '#8db4f5');
    }
  }

  /* platter label */
  if (step >= 1 && platIdx === 0) {
    drawPLabel(ctx, cx - rw - 10, cy + rh * 0.5 + 8, 'platter', '#5a5d7a');
  }
}

function drawPLabel(ctx, x, y, text, color) {
  ctx.save();
  ctx.font = '10px DM Mono, monospace';
  ctx.fillStyle = color || '#8db4f5';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawRotArrow(ctx, x, y, r) {
  ctx.strokeStyle = '#5a5d7a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI * 0.3, Math.PI * 1.7);
  ctx.stroke();
  // arrowhead
  const a = Math.PI * 1.7;
  const ax = x + Math.cos(a) * r, ay = y + Math.sin(a) * r;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(ax - 6, ay - 4);
  ctx.lineTo(ax + 2, ay - 6);
  ctx.closePath();
  ctx.fillStyle = '#5a5d7a';
  ctx.fill();
}

/* ══════════════════════════════════════════════
   TOP VIEW  (mimics the sector/track diagram)
══════════════════════════════════════════════ */
function drawTopView() {
  const W = topCanvas.width, H = topCanvas.height;
  tCtx.clearRect(0, 0, W, H);

  tCtx.fillStyle = '#11121a';
  tCtx.fillRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(W, H) * 0.42;
  const nTracks = 3;  // visible track rings for clarity
  const nSectors = 8;

  /* ── platter base ── */
  tCtx.fillStyle = '#1e2030';
  tCtx.beginPath();
  tCtx.arc(cx, cy, maxR, 0, Math.PI * 2);
  tCtx.fill();

  /* ── sector divisions (shown from step 3) ── */
  if (drillStep >= 3) {
    for (let s = 0; s < nSectors; s++) {
      const a = (s / nSectors) * Math.PI * 2 - Math.PI / 2;
      tCtx.strokeStyle = 'rgba(91,141,238,0.18)';
      tCtx.lineWidth = 0.75;
      tCtx.beginPath();
      tCtx.moveTo(cx + Math.cos(a) * maxR * 0.18, cy + Math.sin(a) * maxR * 0.18);
      tCtx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
      tCtx.stroke();
    }

    /* highlight specific sectors */
    const hSectors = [
      { s: 1, color: 'rgba(240,123,63,0.4)'  },   // orange
      { s: 2, color: 'rgba(56,217,169,0.25)' },   // teal
    ];
    hSectors.forEach(({ s, color }) => {
      const a1 = (s / nSectors) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((s + 1) / nSectors) * Math.PI * 2 - Math.PI / 2;
      const r1 = maxR * 0.55, r2 = maxR * 0.80;
      tCtx.fillStyle = color;
      tCtx.beginPath();
      tCtx.arc(cx, cy, r2, a1, a2);
      tCtx.arc(cx, cy, r1, a2, a1, true);
      tCtx.closePath();
      tCtx.fill();
    });

    /* inter-sector gap highlight */
    if (drillStep >= 3) {
      const gapA = (1.5 / nSectors) * Math.PI * 2 - Math.PI / 2;
      const gapWidth = (0.08 / nSectors) * Math.PI * 2;
      tCtx.fillStyle = 'rgba(240,180,200,0.35)';
      tCtx.beginPath();
      tCtx.arc(cx, cy, maxR * 0.82, gapA - gapWidth, gapA + gapWidth);
      tCtx.arc(cx, cy, maxR * 0.53, gapA + gapWidth, gapA - gapWidth, true);
      tCtx.closePath();
      tCtx.fill();
    }
  }

  /* ── track rings ── */
  if (drillStep >= 2) {
    const trackFracs = [0.95, 0.78, 0.61, 0.44, 0.27];
    trackFracs.forEach((f, i) => {
      const isHighlight = i === 0 || i === 1;
      tCtx.strokeStyle = isHighlight
        ? `rgba(91,141,238,${0.35 - i * 0.06})`
        : `rgba(91,141,238,${0.18 - i * 0.02})`;
      tCtx.lineWidth = isHighlight ? 1.2 : 0.75;
      tCtx.beginPath();
      tCtx.arc(cx, cy, maxR * f, 0, Math.PI * 2);
      tCtx.stroke();
    });

    /* inter-track gap label arrow */
    if (drillStep >= 3) {
      const t1 = maxR * 0.95, t2 = maxR * 0.78;
      const a = -0.5;
      drawDoubleArrow(tCtx,
        cx + Math.cos(a) * t1, cy + Math.sin(a) * t1,
        cx + Math.cos(a) * t2, cy + Math.sin(a) * t2,
        '#5a5d7a');
      drawTLabel(tCtx, cx + Math.cos(a) * (t1 + 28), cy + Math.sin(a) * t1 - 12, 'inter-track\ngap', '#5a5d7a');
    }
  }

  /* ── center hole ── */
  tCtx.fillStyle = '#0b0c10';
  tCtx.beginPath();
  tCtx.arc(cx, cy, maxR * 0.16, 0, Math.PI * 2);
  tCtx.fill();
  tCtx.strokeStyle = '#343660';
  tCtx.lineWidth = 1;
  tCtx.beginPath();
  tCtx.arc(cx, cy, maxR * 0.16, 0, Math.PI * 2);
  tCtx.stroke();
  /* spindle dot */
  tCtx.fillStyle = '#5b8dee';
  tCtx.beginPath();
  tCtx.arc(cx, cy, 5, 0, Math.PI * 2);
  tCtx.fill();

  /* ── read/write head ── */
  if (drillStep >= 4) {
    const headAngle = -0.9;
    const headTrack = maxR * 0.67;
    const hx = cx + Math.cos(headAngle) * headTrack;
    const hy = cy + Math.sin(headAngle) * headTrack;

    // arm line
    tCtx.strokeStyle = '#8db4f5';
    tCtx.lineWidth = 2;
    tCtx.lineCap = 'round';
    tCtx.beginPath();
    tCtx.moveTo(cx, cy);
    tCtx.lineTo(hx, hy);
    tCtx.stroke();

    // head dot with glow
    tCtx.shadowColor = '#f07b3f';
    tCtx.shadowBlur = 12;
    tCtx.fillStyle = '#f07b3f';
    tCtx.beginPath();
    tCtx.arc(hx, hy, 6, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.shadowBlur = 0;

    /* track ring the head is on */
    tCtx.strokeStyle = 'rgba(240,123,63,0.5)';
    tCtx.lineWidth = 1.5;
    tCtx.setLineDash([6, 3]);
    tCtx.beginPath();
    tCtx.arc(cx, cy, headTrack, 0, Math.PI * 2);
    tCtx.stroke();
    tCtx.setLineDash([]);
  }

  /* ── labels ── */
  if (drillStep >= 2) {
    const la = 0.35;
    const lr = maxR * 0.87;
    drawTLabel(tCtx, cx + Math.cos(la) * lr + 12, cy + Math.sin(la) * lr - 8, 'Tracks', '#8db4f5');
  }
  if (drillStep >= 3) {
    const la = 1.2;
    const lr = maxR * 0.70;
    drawTLabel(tCtx, cx + Math.cos(la) * lr - 50, cy + Math.sin(la) * lr - 10, 'Sectors', '#f07b3f');

    /* inter-sector gap label */
    drawTLabel(tCtx, cx - maxR * 0.88, cy - maxR * 0.52, 'Inter-sector\ngap', '#e898b0');
  }
  if (drillStep >= 5) {
    /* cylinder label pointing at a track ring */
    const la2 = 2.5;
    drawTLabel(tCtx, cx + Math.cos(la2) * maxR * 0.62 - 60, cy + Math.sin(la2) * maxR * 0.62 - 8, 'Cylinder', '#f07b3f');
  }

  updateCaption();
}

function drawTLabel(ctx, x, y, text, color) {
  ctx.save();
  ctx.font = '11px DM Mono, monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const lines = text.split('\n');
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * 14));
  ctx.restore();
}

function drawDoubleArrow(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  // arrowheads
  const a = Math.atan2(y2 - y1, x2 - x1);
  [[x1, y1, a + Math.PI], [x2, y2, a]].forEach(([x, y, ang]) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang + 0.4) * 6, y + Math.sin(ang + 0.4) * 6);
    ctx.lineTo(x + Math.cos(ang - 0.4) * 6, y + Math.sin(ang - 0.4) * 6);
    ctx.closePath(); ctx.fill();
  });
}

/* ── shared helpers ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function updateCaption() {
  const box = document.getElementById('drill-caption-box');
  if (box) box.textContent = DRILL_STEPS[drillStep].caption;

  // update step pills
  DRILL_STEPS.forEach((s, i) => {
    const pill = document.getElementById('spill-' + i);
    if (!pill) return;
    pill.className = 'step-pill' +
      (i === drillStep ? ' active' : i < drillStep ? ' done' : '');
  });

  // update nav buttons
  const prev = document.getElementById('drill-prev');
  const next = document.getElementById('drill-next');
  if (prev) prev.disabled = drillStep === 0;
  if (next) {
    next.disabled = drillStep === DRILL_STEPS.length - 1;
    next.textContent = drillStep === DRILL_STEPS.length - 1 ? 'Done ✓' : 'Next →';
  }
}

/* ── Public API ── */
window.drillStep = function(dir) {
  drillStep = Math.max(0, Math.min(DRILL_STEPS.length - 1, drillStep + dir));
  drawPerspective();
  drawTopView();
};

window.drillGoTo = function(idx) {
  drillStep = idx;
  drawPerspective();
  drawTopView();
};

window.drillSetView = function(view) {
  activeView = view;
  document.querySelectorAll('.view-tab').forEach(t => t.classList.toggle('active', t.dataset.view === view));
  document.querySelectorAll('.drill-canvas-layer').forEach(c => c.classList.toggle('active', c.dataset.view === view));
};

/* ── Init ── */
window.addEventListener('resize', resizeDrill);
window.addEventListener('load', () => {
  // build step pills
  const pillsEl = document.getElementById('drill-pills');
  DRILL_STEPS.forEach((s, i) => {
    const p = document.createElement('button');
    p.className = 'step-pill' + (i === 0 ? ' active' : '');
    p.id = 'spill-' + i;
    p.textContent = s.label;
    p.onclick = () => window.drillGoTo(i);
    pillsEl.appendChild(p);
  });
  setTimeout(resizeDrill, 80);
  updateCaption();
});
