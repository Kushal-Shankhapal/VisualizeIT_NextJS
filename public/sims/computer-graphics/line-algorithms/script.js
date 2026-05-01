/* ═══════════════════════════════════════════════════
   Line Algorithm Comparator — script.js
   DDA vs Bresenham side-by-side pixel grid visualizer
═══════════════════════════════════════════════════ */

// ── Grid constants ────────────────────────────────
const GRID = 25;        // cells in each axis
const BASE_CELL = 16;   // px per cell at zoom 1
let cellSize = BASE_CELL * 2; // default zoom = 2

// ── State ─────────────────────────────────────────
let p0 = { x: 3, y: 20 };
let p1 = { x: 22, y: 5 };

let ddaPixels  = [];   // [{x,y}]
let bresPixels = [];   // [{x,y}]
let bresTable  = [];   // [{step,pk,decision,pixel:[x,y]}]

let currentStep = -1;  // -1 = not started
let totalSteps  = 0;

let playing = false;
let playTimer = null;

let dragTarget = null; // null | 'p0' | 'p1'
let canvasBounds = { dda: null, bres: null };

// ── DOM refs ──────────────────────────────────────
const ddaCanvas  = document.getElementById('dda-canvas');
const bresCanvas = document.getElementById('bres-canvas');
const ddaCtx     = ddaCanvas.getContext('2d');
const bresCtx    = bresCanvas.getContext('2d');

const elStepCur  = document.getElementById('step-cur');
const elStepMax  = document.getElementById('step-max');
const elBtnPrev  = document.getElementById('btn-prev');
const elBtnNext  = document.getElementById('btn-next');
const elBtnPlay  = document.getElementById('btn-play');
const elDdaCount = document.getElementById('dda-count');
const elBresCount= document.getElementById('bres-count');
const elDdaMeta  = document.getElementById('dda-meta');
const elBresMeta = document.getElementById('bres-meta');
const elStatus   = document.getElementById('status-text');
const elTbody    = document.getElementById('bres-tbody');
const elTableSec = document.getElementById('table-section');
const elMetricsSec = document.getElementById('metrics-section');
const elTableInfo  = document.getElementById('table-algo-info');
const elSpeedVal   = document.getElementById('speed-val');
const elSpeedSlider= document.getElementById('speed-slider');
const elZoomVal    = document.getElementById('zoom-val');

// ── Algorithms ────────────────────────────────────

function runDDA(x0, y0, x1, y1) {
  const pixels = [];
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) return [{ x: x0, y: y0 }];
  const xi = dx / steps;
  const yi = dy / steps;
  let x = x0, y = y0;
  for (let i = 0; i <= steps; i++) {
    pixels.push({ x: Math.round(x), y: Math.round(y) });
    x += xi;
    y += yi;
  }
  return pixels;
}

function runBresenham(x0, y0, x1, y1) {
  const pixels = [];
  const table  = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  const steep = dy > dx;

  let x = x0, y = y0;

  if (!steep) {
    // Drive along X
    let pk = 2 * dy - dx;
    pixels.push({ x, y });
    table.push({ step: 0, pk, decision: 'init', pixel: [x, y] });
    for (let i = 1; i <= dx; i++) {
      x += sx;
      const decided = pk >= 0;
      if (decided) { y += sy; pk = pk + 2 * dy - 2 * dx; }
      else         {           pk = pk + 2 * dy; }
      pixels.push({ x, y });
      table.push({ step: i, pk, decision: decided ? 'yes' : 'no', pixel: [x, y] });
    }
  } else {
    // Drive along Y
    let pk = 2 * dx - dy;
    pixels.push({ x, y });
    table.push({ step: 0, pk, decision: 'init', pixel: [x, y] });
    for (let i = 1; i <= dy; i++) {
      y += sy;
      const decided = pk >= 0;
      if (decided) { x += sx; pk = pk + 2 * dx - 2 * dy; }
      else         {           pk = pk + 2 * dx; }
      pixels.push({ x, y });
      table.push({ step: i, pk, decision: decided ? 'yes' : 'no', pixel: [x, y] });
    }
  }

  return { pixels, table };
}

// ── Canvas sizing ─────────────────────────────────

function resizeCanvases() {
  const sz = GRID * cellSize;
  ddaCanvas.width  = sz;
  ddaCanvas.height = sz;
  bresCanvas.width  = sz;
  bresCanvas.height = sz;
}

// ── Drawing helpers ───────────────────────────────

const COL_GRID     = '#1a1a26';
const COL_AXIS     = '#2a2a42';
const COL_CELL_DDA = '#6affb8';
const COL_CELL_BRES= '#7c6aff';
const COL_CURRENT  = '#ffb86a';
const COL_P0       = '#ff6a6a';
const COL_P1       = '#ffd06a';
const COL_LABEL    = '#7878a0';

function drawGrid(ctx) {
  const sz = GRID * cellSize;
  ctx.clearRect(0, 0, sz, sz);

  // Background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, sz, sz);

  // Grid lines
  ctx.strokeStyle = COL_GRID;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID; i++) {
    const pos = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(pos, 0); ctx.lineTo(pos, sz);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos); ctx.lineTo(sz, pos);
    ctx.stroke();
  }

  // Axis lines (y=GRID-1 row is "bottom" visually)
  ctx.strokeStyle = COL_AXIS;
  ctx.lineWidth = 1;
  // no actual coordinate axis since origin is top-left — just a subtle border
  ctx.strokeRect(0.5, 0.5, sz - 1, sz - 1);

  // Coordinate labels every 5 cells
  ctx.fillStyle = COL_LABEL;
  ctx.font = `${Math.max(8, cellSize * 0.4)}px JetBrains Mono, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (cellSize >= 14) {
    for (let i = 0; i < GRID; i += 5) {
      const cx = i * cellSize + cellSize / 2;
      const cy = i * cellSize + cellSize / 2;
      // x labels along top row
      ctx.fillText(String(i), cx, cellSize / 2);
      // y labels along left column
      if (i > 0) ctx.fillText(String(i), cellSize / 2, cy);
    }
  }
}

function fillCell(ctx, gx, gy, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const pad = 2;
  ctx.fillStyle = color;
  ctx.fillRect(
    gx * cellSize + pad,
    gy * cellSize + pad,
    cellSize - pad * 2,
    cellSize - pad * 2
  );
  ctx.restore();
}

function fillCellRounded(ctx, gx, gy, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const pad = 2;
  const x = gx * cellSize + pad;
  const y = gy * cellSize + pad;
  const w = cellSize - pad * 2;
  const h = cellSize - pad * 2;
  const r = Math.max(1, cellSize * 0.2);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEndpoint(ctx, gx, gy, color, label) {
  const cx = gx * cellSize + cellSize / 2;
  const cy = gy * cellSize + cellSize / 2;
  const r  = Math.max(5, cellSize * 0.35);

  // outer glow
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur  = 10;
  ctx.fillStyle   = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // inner white dot
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // label above
  if (cellSize >= 12) {
    ctx.fillStyle = color;
    ctx.font = `bold ${Math.max(9, cellSize * 0.5)}px DM Sans, sans-serif`;
    ctx.textAlign  = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, cx, gy * cellSize - 2);
  }
}

// ── Full redraw ───────────────────────────────────

function redraw() {
  drawGrid(ddaCtx);
  drawGrid(bresCtx);

  // DDA: draw pixels up to currentStep
  const ddaEnd = currentStep < 0 ? -1 : Math.min(currentStep, ddaPixels.length - 1);
  for (let i = 0; i <= ddaEnd; i++) {
    const { x, y } = ddaPixels[i];
    if (i === ddaEnd && currentStep >= 0) {
      fillCellRounded(ddaCtx, x, y, COL_CURRENT, 1);
    } else {
      fillCellRounded(ddaCtx, x, y, COL_CELL_DDA, 0.85);
    }
  }

  // Bres: draw pixels up to currentStep
  const bresEnd = currentStep < 0 ? -1 : Math.min(currentStep, bresPixels.length - 1);
  for (let i = 0; i <= bresEnd; i++) {
    const { x, y } = bresPixels[i];
    if (i === bresEnd && currentStep >= 0) {
      fillCellRounded(bresCtx, x, y, COL_CURRENT, 1);
    } else {
      fillCellRounded(bresCtx, x, y, COL_CELL_BRES, 0.85);
    }
  }

  // Endpoints on both canvases
  drawEndpoint(ddaCtx,  p0.x, p0.y, COL_P0, 'P0');
  drawEndpoint(ddaCtx,  p1.x, p1.y, COL_P1, 'P1');
  drawEndpoint(bresCtx, p0.x, p0.y, COL_P0, 'P0');
  drawEndpoint(bresCtx, p1.x, p1.y, COL_P1, 'P1');

  // Update counts
  const dc = ddaEnd + 1;
  const bc = bresEnd + 1;
  elDdaCount.textContent  = dc > 0 ? dc : '0';
  elBresCount.textContent = bc > 0 ? bc : '0';

  // Update step counter
  elStepCur.textContent = currentStep < 0 ? 0 : currentStep;
  elStepMax.textContent = totalSteps;

  // Highlight table row
  highlightTableRow(currentStep);

  // Meta labels
  if (currentStep >= 0 && ddaPixels.length > 0) {
    const dp = ddaPixels[Math.min(currentStep, ddaPixels.length - 1)];
    elDdaMeta.textContent = `(${dp.x}, ${dp.y})`;
  }
  if (currentStep >= 0 && bresPixels.length > 0) {
    const bp = bresPixels[Math.min(currentStep, bresPixels.length - 1)];
    elBresMeta.textContent = `(${bp.x}, ${bp.y})`;
  }
}

// ── Table ─────────────────────────────────────────

function buildTable() {
  const steep = Math.abs(p1.y - p0.y) > Math.abs(p1.x - p0.x);
  const dx = Math.abs(p1.x - p0.x);
  const dy = Math.abs(p1.y - p0.y);
  const drive = steep ? 'Y' : 'X';
  elTableInfo.textContent =
    `Drive axis: ${drive}  |  Δx=${dx}  Δy=${dy}  |  Initial p₀ = 2·${steep?dy:dx} − ${steep?dx:dy} = ${steep ? 2*dy-dx : 2*dy-dx}`;

  elTbody.innerHTML = '';
  bresTable.forEach(row => {
    const tr = document.createElement('tr');
    tr.dataset.step = row.step;

    const pkClass = row.decision === 'init' ? '' : (row.pk >= 0 ? 'pk-pos' : 'pk-neg');
    const decText = row.decision === 'init'
      ? '<span class="decision-init">—  (initial)</span>'
      : row.decision === 'yes'
        ? `<span class="decision-yes">p<sub>k</sub> ≥ 0  → increment minor axis</span>`
        : `<span class="decision-no">p<sub>k</sub> &lt; 0  → stay on minor axis</span>`;

    tr.innerHTML = `
      <td>${row.step}</td>
      <td class="${pkClass}">${row.pk}</td>
      <td>${decText}</td>
      <td>(${row.pixel[0]}, ${row.pixel[1]})</td>
    `;
    elTbody.appendChild(tr);
  });
}

function highlightTableRow(step) {
  const rows = elTbody.querySelectorAll('tr');
  rows.forEach(r => r.classList.remove('row-active'));
  if (step < 0) return;
  const target = elTbody.querySelector(`tr[data-step="${step}"]`);
  if (target) {
    target.classList.add('row-active');
    target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// ── Main draw ─────────────────────────────────────

function startDraw() {
  stopPlay();

  // Clamp inputs to grid
  const x0 = clamp(parseInt(document.getElementById('x0').value) || 0, 0, GRID - 1);
  const y0 = clamp(parseInt(document.getElementById('y0').value) || 0, 0, GRID - 1);
  const x1 = clamp(parseInt(document.getElementById('x1').value) || 0, 0, GRID - 1);
  const y1 = clamp(parseInt(document.getElementById('y1').value) || 0, 0, GRID - 1);

  p0 = { x: x0, y: y0 };
  p1 = { x: x1, y: y1 };

  ddaPixels  = runDDA(x0, y0, x1, y1);
  const bres = runBresenham(x0, y0, x1, y1);
  bresPixels = bres.pixels;
  bresTable  = bres.table;

  totalSteps  = Math.max(ddaPixels.length, bresPixels.length) - 1;
  currentStep = 0;

  buildTable();
  elTableSec.style.display  = '';
  elMetricsSec.style.display = '';
  updateMetrics();
  updateStepButtons();
  redraw();
  setStatus(`Drawing from (${x0},${y0}) to (${x1},${y1}) — ${totalSteps + 1} steps`);
}

function resetAll() {
  stopPlay();
  currentStep = -1;
  totalSteps  = 0;
  ddaPixels   = [];
  bresPixels  = [];
  bresTable   = [];
  elDdaMeta.textContent  = '—';
  elBresMeta.textContent = '—';
  elTableSec.style.display   = 'none';
  elMetricsSec.style.display = 'none';
  elTbody.innerHTML = '';
  updateStepButtons();
  redraw();
  setStatus('Set endpoints and click Draw to begin.');
}

// ── Step controls ─────────────────────────────────

function stepNext() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStepButtons();
    redraw();
    updateStepStatus();
  }
}

function stepPrev() {
  if (currentStep > 0) {
    currentStep--;
    updateStepButtons();
    redraw();
    updateStepStatus();
  }
}

function updateStepButtons() {
  const active = totalSteps > 0;
  elBtnPrev.disabled = !active || currentStep <= 0;
  elBtnNext.disabled = !active || currentStep >= totalSteps;
  elBtnPlay.disabled = !active;
}

function updateStepStatus() {
  if (currentStep < 0) return;
  const bp = bresTable[Math.min(currentStep, bresTable.length - 1)];
  const dp = ddaPixels[Math.min(currentStep, ddaPixels.length - 1)];
  if (bp) {
    const dec = bp.decision === 'init' ? 'initial pixel'
              : bp.decision === 'yes'  ? `pₖ=${bp.pk} ≥ 0 → minor axis +1`
              : `pₖ=${bp.pk} < 0 → minor axis stays`;
    setStatus(`Step ${currentStep}  |  Bresenham: ${dec}  |  DDA pixel: (${dp.x}, ${dp.y})`);
  }
}

// ── Play mode ─────────────────────────────────────

function togglePlay() {
  if (playing) { stopPlay(); return; }

  if (currentStep >= totalSteps) currentStep = 0;
  playing = true;
  elBtnPlay.textContent = '⏸ Pause';
  elBtnPlay.classList.add('btn-primary');
  elBtnPlay.classList.remove('btn-ghost');
  scheduleNext();
}

function stopPlay() {
  playing = false;
  if (playTimer) { clearTimeout(playTimer); playTimer = null; }
  elBtnPlay.textContent = '▶ Play';
  elBtnPlay.classList.remove('btn-primary');
  elBtnPlay.classList.add('btn-ghost');
}

function scheduleNext() {
  if (!playing) return;
  const speed = parseInt(elSpeedSlider.value);       // 1–10
  const delay = Math.round(1200 / speed);            // 120ms–1200ms
  playTimer = setTimeout(() => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepButtons();
      redraw();
      updateStepStatus();
      scheduleNext();
    } else {
      stopPlay();
      setStatus(`Done — ${totalSteps + 1} pixels drawn.`);
      updateMetrics();
    }
  }, delay);
}

// ── Zoom ──────────────────────────────────────────

function setZoom(val) {
  val = parseInt(val);
  cellSize = BASE_CELL * val;
  elZoomVal.textContent = `${val}×`;
  resizeCanvases();
  redraw();
}

// ── Speed display ─────────────────────────────────

elSpeedSlider.addEventListener('input', () => {
  elSpeedVal.textContent = elSpeedSlider.value;
});

// ── Metrics ───────────────────────────────────────

function updateMetrics() {
  const total = Math.max(ddaPixels.length, bresPixels.length);
  document.getElementById('m-total-pixels').textContent = total || '—';
  document.getElementById('m-dda-pixels').textContent   = ddaPixels.length || '—';
  document.getElementById('m-bres-pixels').textContent  = bresPixels.length || '—';

  // Count matching pixels
  if (ddaPixels.length && bresPixels.length) {
    const bSet = new Set(bresPixels.map(p => `${p.x},${p.y}`));
    const matches = ddaPixels.filter(p => bSet.has(`${p.x},${p.y}`)).length;
    const pct = Math.round(100 * matches / Math.max(ddaPixels.length, bresPixels.length));
    document.getElementById('m-match').textContent = `${pct}%`;
  } else {
    document.getElementById('m-match').textContent = '—';
  }
}

// ── Drag endpoints ────────────────────────────────

function canvasToGrid(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = (clientX - rect.left) * scaleX;
  const cy = (clientY - rect.top)  * scaleY;
  return {
    x: clamp(Math.floor(cx / cellSize), 0, GRID - 1),
    y: clamp(Math.floor(cy / cellSize), 0, GRID - 1)
  };
}

function nearEndpoint(gx, gy, ep) {
  return Math.abs(gx - ep.x) <= 1 && Math.abs(gy - ep.y) <= 1;
}

function onMouseDown(e, canvas) {
  const g = canvasToGrid(canvas, e.clientX, e.clientY);
  if (nearEndpoint(g.x, g.y, p0)) dragTarget = 'p0';
  else if (nearEndpoint(g.x, g.y, p1)) dragTarget = 'p1';
  else dragTarget = null;
}

function onMouseMove(e, canvas) {
  if (!dragTarget) return;
  const g = canvasToGrid(canvas, e.clientX, e.clientY);
  if (dragTarget === 'p0') {
    p0 = g;
    document.getElementById('x0').value = g.x;
    document.getElementById('y0').value = g.y;
  } else {
    p1 = g;
    document.getElementById('x1').value = g.x;
    document.getElementById('y1').value = g.y;
  }
  // live redraw — recompute if already drawn
  if (totalSteps > 0) {
    const bres = runBresenham(p0.x, p0.y, p1.x, p1.y);
    ddaPixels  = runDDA(p0.x, p0.y, p1.x, p1.y);
    bresPixels = bres.pixels;
    bresTable  = bres.table;
    totalSteps = Math.max(ddaPixels.length, bresPixels.length) - 1;
    currentStep = Math.min(currentStep, totalSteps);
    buildTable();
    updateMetrics();
    updateStepButtons();
  } else {
    // Just update endpoint visuals
    drawGrid(ddaCtx); drawGrid(bresCtx);
    drawEndpoint(ddaCtx,  p0.x, p0.y, COL_P0, 'P0');
    drawEndpoint(ddaCtx,  p1.x, p1.y, COL_P1, 'P1');
    drawEndpoint(bresCtx, p0.x, p0.y, COL_P0, 'P0');
    drawEndpoint(bresCtx, p1.x, p1.y, COL_P1, 'P1');
    return;
  }
  redraw();
}

function onMouseUp() { dragTarget = null; }

// Attach events to both canvases
[ddaCanvas, bresCanvas].forEach(c => {
  c.addEventListener('mousedown',  e => onMouseDown(e, c));
  c.addEventListener('mousemove',  e => onMouseMove(e, c));
  c.addEventListener('mouseup',    onMouseUp);
  c.addEventListener('mouseleave', onMouseUp);

  // Touch support
  c.addEventListener('touchstart', e => {
    e.preventDefault();
    onMouseDown(e.touches[0], c);
  }, { passive: false });
  c.addEventListener('touchmove', e => {
    e.preventDefault();
    onMouseMove(e.touches[0], c);
  }, { passive: false });
  c.addEventListener('touchend', onMouseUp);
});

// ── Input change → sync endpoint dots ────────────

['x0','y0','x1','y1'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    p0 = {
      x: clamp(parseInt(document.getElementById('x0').value) || 0, 0, GRID - 1),
      y: clamp(parseInt(document.getElementById('y0').value) || 0, 0, GRID - 1)
    };
    p1 = {
      x: clamp(parseInt(document.getElementById('x1').value) || 0, 0, GRID - 1),
      y: clamp(parseInt(document.getElementById('y1').value) || 0, 0, GRID - 1)
    };
    if (totalSteps > 0) startDraw();
    else {
      drawGrid(ddaCtx); drawGrid(bresCtx);
      drawEndpoint(ddaCtx,  p0.x, p0.y, COL_P0, 'P0');
      drawEndpoint(ddaCtx,  p1.x, p1.y, COL_P1, 'P1');
      drawEndpoint(bresCtx, p0.x, p0.y, COL_P0, 'P0');
      drawEndpoint(bresCtx, p1.x, p1.y, COL_P1, 'P1');
    }
  });
});

// ── Status helper ─────────────────────────────────

function setStatus(msg) { elStatus.textContent = msg; }

// ── Utility ───────────────────────────────────────

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ── Init ──────────────────────────────────────────

function init() {
  resizeCanvases();
  drawGrid(ddaCtx);
  drawGrid(bresCtx);
  drawEndpoint(ddaCtx,  p0.x, p0.y, COL_P0, 'P0');
  drawEndpoint(ddaCtx,  p1.x, p1.y, COL_P1, 'P1');
  drawEndpoint(bresCtx, p0.x, p0.y, COL_P0, 'P0');
  drawEndpoint(bresCtx, p1.x, p1.y, COL_P1, 'P1');
  updateStepButtons();
}

init();
