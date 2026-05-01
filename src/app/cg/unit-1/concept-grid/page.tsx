'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Text as KText, Group, Circle } from 'react-konva';
import { Syne } from 'next/font/google';
import Link from 'next/link';
import { animate } from 'animejs';

const syne = Syne({ subsets: ['latin'], weight: ['600', '700'] });

// ─── Constants ───────────────────────────────────────────────────────────────

const SMILEY = [
  [0,0,1,1,1,1,0,0],
  [0,1,0,0,0,0,1,0],
  [1,0,1,0,0,1,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,0,0,1,0,1],
  [1,0,0,1,1,0,0,1],
  [0,1,0,0,0,0,1,0],
  [0,0,1,1,1,1,0,0],
];

const FB_COLORS = [
  '#FF3B3B','#22D3EE','#7C6AF7','#F97316','#00C896','#FF3B3B',
  '#7C6AF7','#F0ECE4','#F97316','#22D3EE','#FF3B3B','#7C6AF7',
  '#F97316','#22D3EE','#7C6AF7','#FF3B3B','#F0ECE4','#22D3EE',
  '#22D3EE','#7C6AF7','#FF3B3B','#F97316','#22D3EE','#7C6AF7',
];

const HOUSE_LINES: [number,number,number,number][] = [
  [30,150,170,150],
  [30,100,30,150],
  [170,100,170,150],
  [30,100,100,50],
  [100,50,170,100],
];

const DF_COMMANDS = [
  { type:'MOVE', x:0,  y:0,  label:'MOVE(0, 0)' },
  { type:'LINE', x:5,  y:5,  label:'LINE(5, 5)' },
  { type:'MOVE', x:5,  y:5,  label:'MOVE(5, 5)' },
  { type:'LINE', x:10, y:2,  label:'LINE(10, 2)' },
  { type:'MOVE', x:10, y:2,  label:'MOVE(10, 2)' },
  { type:'LINE', x:15, y:8,  label:'LINE(15, 8)' },
];

const BRESENHAM_PIXELS = new Set([
  '0,0','1,1','2,1','3,2','4,3','5,3',
  '6,4','7,5','8,6','9,6','10,7','11,8','12,8','13,9',
]);

const RESOLUTIONS = {
  '360p':  { w:640,  h:360,  spacing:26, dotR:2.5 },
  '720p':  { w:1280, h:720,  spacing:13, dotR:1.5 },
  '1080p': { w:1920, h:1080, spacing:9,  dotR:1   },
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const SEC: React.CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
  padding: '80px 24px',
};

const H2: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 700,
  color: '#f0ece4',
  margin: '0 0 20px',
  lineHeight: 1.2,
};

const BODY: React.CSSProperties = {
  color: '#8a8a8a',
  fontSize: 16,
  lineHeight: 1.8,
  marginBottom: 32,
  maxWidth: 680,
};

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
};

const PILL: React.CSSProperties = {
  ...MONO,
  display: 'inline-block',
  border: '1px solid #2a2a2a',
  background: '#161616',
  padding: '8px 16px',
  borderRadius: 999,
  color: '#22d3ee',
  fontSize: 12,
};

const BTN_OUTLINE: React.CSSProperties = {
  ...MONO,
  border: '1px solid #22d3ee',
  color: '#22d3ee',
  background: 'transparent',
  padding: '8px 20px',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 13,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate(el, { opacity:[0,1], translateY:['40px','0px'], duration:600, ease:'outQuad' });
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

// ─── HR ──────────────────────────────────────────────────────────────────────

function HR() {
  return <div style={{ borderTop: '1px solid #2a2a2a', maxWidth: 900, margin: '0 auto' }} />;
}

// ─── Section 1 — What is a Pixel? ────────────────────────────────────────────

function Section1({ mounted }: { mounted: boolean }) {
  const ref = useReveal();
  const [zoom, setZoom] = useState(1);

  const CANVAS = 320;
  const cellSize = Math.floor(CANVAS / 8) * zoom;
  const visibleCells = Math.ceil(CANVAS / cellSize);

  const centerCol = 4;
  const centerRow = 4;
  const startCol = Math.max(0, centerCol - Math.floor(visibleCells / 2));
  const startRow = Math.max(0, centerRow - Math.floor(visibleCells / 2));

  return (
    <div ref={ref} style={SEC}>
      <h2 className={syne.className} style={H2}>The Smallest Thing on Your Screen</h2>
      <p style={BODY}>
        A pixel is the smallest controllable element of a display.
        Every image, line, and curve you see is built from a grid of these tiny squares — each storing a single color value.
      </p>

      <p style={{ ...MONO, fontSize:12, color:'#8a8a8a', marginBottom:8 }}>
        ↑ Drag the slider to zoom in
      </p>

      <div style={{ display:'inline-block', border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden', marginBottom:16 }}>
        {mounted && (
          <Stage width={CANVAS} height={CANVAS}>
            <Layer>
              <Rect x={0} y={0} width={CANVAS} height={CANVAS} fill="#161616" />
              {Array.from({ length: visibleCells }, (_, row) =>
                Array.from({ length: visibleCells }, (_, col) => {
                  const gr = startRow + row;
                  const gc = startCol + col;
                  if (gr >= 8 || gc >= 8) return null;
                  const isOn = SMILEY[gr]?.[gc] === 1;
                  const fill = isOn ? '#22d3ee' : '#161616';
                  const x = col * cellSize;
                  const y = row * cellSize;
                  const hexLabel = isOn ? '#22D3EE' : '#161616';
                  return (
                    <Group key={`${gr}-${gc}`}>
                      <Rect x={x} y={y} width={cellSize} height={cellSize} fill={fill} stroke="#0f0f0f" strokeWidth={1} />
                      {zoom >= 6 && (
                        <KText
                          x={x + 2} y={y + cellSize/2 - 5}
                          width={cellSize - 4}
                          text={hexLabel}
                          fontSize={9}
                          fontFamily="monospace"
                          fill="#f0ece4"
                          align="center"
                        />
                      )}
                    </Group>
                  );
                })
              )}
            </Layer>
          </Stage>
        )}
      </div>

      <div style={{ marginBottom:32 }}>
        <label style={{ ...MONO, fontSize:12, color:'#8a8a8a', display:'flex', alignItems:'center', gap:12 }}>
          <span>Zoom Level: {zoom}x</span>
          <input
            type="range" min={1} max={8} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ accentColor:'#7c6af7', width:180 }}
          />
        </label>
      </div>

      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <span style={PILL}>1 pixel = 1 color value</span>
        <span style={PILL}>Your screen has millions of them</span>
      </div>
    </div>
  );
}

// ─── Section 2 — Resolution & Aspect Ratio ───────────────────────────────────

type ResKey = '360p' | '720p' | '1080p';

function Section2({ mounted }: { mounted: boolean }) {
  const ref = useReveal();
  const [res, setRes] = useState<ResKey>('720p');
  const W = 400, H = 225;

  const r = RESOLUTIONS[res];
  const dots: { x:number; y:number }[] = [];
  for (let y = r.spacing/2; y < H; y += r.spacing)
    for (let x = r.spacing/2; x < W; x += r.spacing)
      dots.push({ x, y });

  const pixelCount = (r.w * r.h).toLocaleString();
  const label = `${r.w} × ${r.h} = ${pixelCount} pixels`;

  return (
    <div ref={ref} style={SEC}>
      <h2 className={syne.className} style={H2}>How Many Pixels?</h2>
      <p style={BODY}>
        Resolution defines how many pixels fit across and down your screen.
        More pixels means finer detail — but also more memory and computation.
      </p>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {(['360p','720p','1080p'] as ResKey[]).map(k => (
          <button key={k} onClick={() => setRes(k)} style={{
            ...MONO, fontSize:13, padding:'6px 18px', borderRadius:4, cursor:'pointer', border:'1px solid #2a2a2a',
            background: res === k ? '#7c6af7' : '#161616',
            color: res === k ? '#f0ece4' : '#8a8a8a',
            transition: 'all 200ms',
          }}>{k}</button>
        ))}
      </div>

      <div style={{ border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden', display:'inline-block', marginBottom:12 }}>
        {mounted && (
          <Stage width={W} height={H}>
            <Layer>
              <Rect x={0} y={0} width={W} height={H} fill="#161616" />
              {dots.map((d,i) => (
                <Circle key={i} x={d.x} y={d.y} radius={r.dotR} fill="#7c6af7" opacity={0.8} />
              ))}
            </Layer>
          </Stage>
        )}
      </div>

      <p style={{ ...MONO, fontSize:13, color:'#22d3ee', marginBottom:28 }}>{label}</p>

      <div style={{ background:'#161616', borderLeft:'3px solid #7c6af7', padding:'16px 20px', borderRadius:4 }}>
        <p style={{ ...BODY, marginBottom:0, fontSize:15 }}>
          Aspect ratio is the width-to-height proportion. 16:9 means for every 16 pixels wide, there are 9 pixels tall.
          This ratio stays constant regardless of resolution.
        </p>
      </div>
    </div>
  );
}

// ─── Section 3 — Frame Buffer ─────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},0.30)`;
}

function Section3({ mounted }: { mounted: boolean }) {
  const ref = useReveal();
  const [litCells, setLitCells] = useState<Set<number>>(new Set());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const COLS = 6, ROWS = 4, CW = 60, CH = 40;
  const W = COLS * CW, H = ROWS * CH;

  function refreshAnim() {
    timeoutsRef.current.forEach(clearTimeout);
    setLitCells(new Set());
    const ts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      ts.push(setTimeout(() => setLitCells(prev => new Set([...prev, i])), i * 100));
    }
    timeoutsRef.current = ts;
  }

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  return (
    <div ref={ref} style={SEC}>
      <h2 className={syne.className} style={H2}>Where Pixels Live</h2>
      <p style={BODY}>
        The frame buffer is a region of memory that stores the color value of every pixel on screen.
        The display hardware reads this memory 60–80 times per second and paints it onto the screen.
      </p>

      <div style={{ border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden', display:'inline-block', marginBottom:16 }}>
        {mounted && (
          <Stage width={W} height={H}>
            <Layer>
              {FB_COLORS.map((color, i) => {
                const col = i % COLS, row = Math.floor(i / COLS);
                const x = col * CW, y = row * CH;
                const lit = litCells.has(i);
                return (
                  <Group key={i}>
                    <Rect x={x} y={y} width={CW} height={CH}
                      fill={lit ? color : hexToRgb(color)}
                      stroke="#0f0f0f" strokeWidth={1}
                    />
                    <KText
                      x={x+2} y={y + CH/2 - 6}
                      width={CW-4}
                      text={color}
                      fontSize={9}
                      fontFamily="monospace"
                      fill={lit ? '#f0ece4' : '#8a8a8a'}
                      align="center"
                    />
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        )}
      </div>

      <div style={{ marginBottom:16 }}>
        <button
          onClick={refreshAnim}
          style={BTN_OUTLINE}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Refresh
        </button>
      </div>

      <p style={{ ...MONO, fontSize:12, color:'#8a8a8a' }}>
        6 × 4 grid = 24 pixels × 24-bit color = 576 bits
      </p>
    </div>
  );
}

// ─── Section 4 — Raster vs Random-Scan ───────────────────────────────────────

function ScanPanel({ mounted, isMobile }: { mounted: boolean; isMobile: boolean }) {
  const [rasterY, setRasterY] = useState(-1);
  const [randomProg, setRandomProg] = useState(0);
  const rafRef = useRef<number>(0);
  const SIZE = 200;

  function playBoth() {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const RASTER_DUR = 2000;
    const RANDOM_DUR = HOUSE_LINES.length * 300;
    const totalDur = Math.max(RASTER_DUR, RANDOM_DUR);

    function step(now: number) {
      const t = now - start;
      const rProg = Math.min(t / RASTER_DUR, 1);
      const randProg = Math.min((t / RANDOM_DUR) * HOUSE_LINES.length, HOUSE_LINES.length);
      setRasterY(rProg * SIZE);
      setRandomProg(randProg);
      if (t < totalDur) rafRef.current = requestAnimationFrame(step);
      else { setRasterY(-1); setRandomProg(0); }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const TABLE_ROWS = [
    ['Output Type',   'Pixel grid',              'Vector commands'],
    ['Memory',        'Frame buffer required',    'Display list only'],
    ['Best For',      'Photos, complex scenes',   'Technical diagrams, CAD'],
    ['Example',       'LCD monitors, phones',     'Old oscilloscopes, plotters'],
  ];

  return (
    <div>
      <div style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:24, marginBottom:24 }}>
        {/* Raster */}
        <div style={{ flex:1 }}>
          <p style={{ ...MONO, fontSize:12, color:'#22d3ee', marginBottom:8 }}>RASTER SCAN</p>
          <div style={{ border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden', display:'inline-block' }}>
            {mounted && (
              <Stage width={SIZE} height={SIZE}>
                <Layer>
                  <Rect x={0} y={0} width={SIZE} height={SIZE} fill="#161616" />
                  {/* House revealed below scan line */}
                  <Group clip={{ x:0, y:0, width:SIZE, height: rasterY >= 0 ? rasterY : SIZE }}>
                    {HOUSE_LINES.map(([x1,y1,x2,y2],i) => (
                      <Line key={i} points={[x1,y1,x2,y2]} stroke="#f0ece4" strokeWidth={1.5} />
                    ))}
                  </Group>
                  {/* Scan line */}
                  {rasterY >= 0 && (
                    <Rect x={0} y={rasterY} width={SIZE} height={2} fill="rgba(34,211,238,0.6)" />
                  )}
                </Layer>
              </Stage>
            )}
          </div>
        </div>

        {/* Random */}
        <div style={{ flex:1 }}>
          <p style={{ ...MONO, fontSize:12, color:'#7c6af7', marginBottom:8 }}>RANDOM SCAN</p>
          <div style={{ border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden', display:'inline-block' }}>
            {mounted && (
              <Stage width={SIZE} height={SIZE}>
                <Layer>
                  <Rect x={0} y={0} width={SIZE} height={SIZE} fill="#161616" />
                  {HOUSE_LINES.map(([x1,y1,x2,y2], i) => {
                    const frac = Math.min(1, Math.max(0, randomProg - i));
                    if (frac <= 0) return null;
                    return (
                      <Line key={i}
                        points={[x1, y1, x1 + (x2-x1)*frac, y1 + (y2-y1)*frac]}
                        stroke="#7c6af7" strokeWidth={1.5}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign:'center', marginBottom:28 }}>
        <button
          onClick={playBoth}
          className={syne.className}
          style={{
            background:'#7c6af7', color:'#f0ece4', border:'none',
            padding:'10px 28px', borderRadius:4, cursor:'pointer',
            fontWeight:600, fontSize:15,
          }}
        >
          Play Both
        </button>
      </div>

      {/* Comparison table */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14, color:'#f0ece4' }}>
          <thead>
            <tr style={{ background:'#161616', borderBottom:'1px solid #2a2a2a' }}>
              <th style={{ padding:'12px 16px', textAlign:'left', color:'#8a8a8a', fontWeight:400 }}></th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontFamily:'var(--font-jetbrains),monospace', fontSize:12, color:'#22d3ee', fontWeight:600 }}>Raster Scan</th>
              <th style={{ padding:'12px 16px', textAlign:'left', fontFamily:'var(--font-jetbrains),monospace', fontSize:12, color:'#7c6af7', fontWeight:600 }}>Random Scan</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(([label, raster, random], i) => (
              <tr key={label} style={{ background: i%2===0 ? '#0f0f0f' : '#161616', borderBottom:'1px solid #2a2a2a' }}>
                <td style={{ padding:'10px 16px', color:'#8a8a8a', fontFamily:'var(--font-jetbrains),monospace', fontSize:12 }}>{label}</td>
                <td style={{ padding:'10px 16px' }}>{raster}</td>
                <td style={{ padding:'10px 16px' }}>{random}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Section4({ mounted, isMobile }: { mounted:boolean; isMobile:boolean }) {
  const ref = useReveal();
  return (
    <div ref={ref} style={SEC}>
      <h2 className={syne.className} style={H2}>Two Ways to Draw</h2>
      <p style={BODY}>
        Raster-scan displays draw every pixel row by row, top to bottom, refreshing the entire screen each cycle.
        Random-scan displays draw only the lines that make up the image, skipping empty areas entirely.
      </p>
      <ScanPanel mounted={mounted} isMobile={isMobile} />
    </div>
  );
}

// ─── Section 5 — Display File ────────────────────────────────────────────────

function Section5({ mounted }: { mounted: boolean }) {
  const ref = useReveal();
  const [step, setStep] = useState(-1);
  const [lines, setLines] = useState<{ x1:number;y1:number;x2:number;y2:number }[]>([]);
  const [cursor, setCursor] = useState({ x:0, y:0 });

  const SCALE = 10;
  const SIZE = 200;

  function dfStep() {
    const next = step + 1;
    if (next >= DF_COMMANDS.length) return;
    const cmd = DF_COMMANDS[next];
    if (cmd.type === 'LINE') {
      setLines(prev => [...prev, { x1:cursor.x, y1:cursor.y, x2:cmd.x, y2:cmd.y }]);
    }
    setCursor({ x:cmd.x, y:cmd.y });
    setStep(next);
  }

  function dfReset() {
    setStep(-1);
    setLines([]);
    setCursor({ x:0, y:0 });
  }

  const gridLines: number[] = [];
  for (let v = 0; v <= SIZE; v += SCALE) gridLines.push(v);

  return (
    <div ref={ref} style={SEC}>
      <h2 className={syne.className} style={H2}>The Drawing Command List</h2>
      <p style={BODY}>
        A display file stores a sequence of drawing commands rather than pixel values.
        The display file interpreter reads these commands and executes them to produce output.
      </p>

      <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:16 }}>
        {/* Command list */}
        <div style={{ background:'#161616', border:'1px solid #2a2a2a', borderRadius:4, minWidth:180 }}>
          {DF_COMMANDS.map((cmd, i) => (
            <div key={i} style={{
              ...MONO, fontSize:13, padding:'10px 16px',
              borderBottom:'1px solid #2a2a2a',
              background: i === step ? 'rgba(34,211,238,0.12)' : 'transparent',
              color: i === step ? '#22d3ee' : i < step ? '#8a8a8a' : '#f0ece4',
              transition:'background 200ms',
            }}>{cmd.label}</div>
          ))}
        </div>

        {/* Canvas */}
        <div style={{ border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden' }}>
          {mounted && (
            <Stage width={SIZE} height={SIZE}>
              <Layer>
                <Rect x={0} y={0} width={SIZE} height={SIZE} fill="#161616" />
                {/* Grid lines */}
                {gridLines.map(v => (
                  <Line key={`gx${v}`} points={[v,0,v,SIZE]} stroke="#2a2a2a" strokeWidth={0.5} />
                ))}
                {gridLines.map(v => (
                  <Line key={`gy${v}`} points={[0,v,SIZE,v]} stroke="#2a2a2a" strokeWidth={0.5} />
                ))}
                {/* Drawn lines */}
                {lines.map((l,i) => (
                  <Line key={i}
                    points={[l.x1*SCALE, l.y1*SCALE, l.x2*SCALE, l.y2*SCALE]}
                    stroke="#7c6af7" strokeWidth={2}
                  />
                ))}
                {/* Cursor dot */}
                {step >= 0 && (
                  <Rect x={cursor.x*SCALE - 3} y={cursor.y*SCALE - 3} width={6} height={6} fill="#22d3ee" />
                )}
              </Layer>
            </Stage>
          )}
        </div>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button
          onClick={dfStep}
          disabled={step >= DF_COMMANDS.length - 1}
          style={{ ...BTN_OUTLINE, opacity: step >= DF_COMMANDS.length-1 ? 0.4 : 1 }}
          onMouseEnter={e => { if (step < DF_COMMANDS.length-1) e.currentTarget.style.background = 'rgba(34,211,238,0.1)'; }}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Step
        </button>
        <button
          onClick={dfReset}
          style={{ ...BTN_OUTLINE, borderColor:'#2a2a2a', color:'#8a8a8a' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// ─── Section 6 — Scan Conversion ─────────────────────────────────────────────

const GRID_N = 15;
const CELL = 20;
const CANVAS6 = GRID_N * CELL;

function Section6({ mounted }: { mounted: boolean }) {
  const ref = useReveal();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  function toggleCell(col: number, row: number) {
    if (revealed) return;
    const key = `${col},${row}`;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function reveal() { setRevealed(true); }

  function reset() {
    setSelected(new Set());
    setRevealed(false);
  }

  function cellColor(col: number, row: number): string | null {
    const key = `${col},${row}`;
    const isBresenham = BRESENHAM_PIXELS.has(key);
    const isSelected = selected.has(key);

    if (!revealed) return isSelected ? 'rgba(34,211,238,0.6)' : null;

    if (isBresenham && isSelected) return 'rgba(34,211,238,0.7)'; // correct
    if (isSelected && !isBresenham) return 'rgba(249,115,22,0.7)'; // wrong
    if (isBresenham && !isSelected) return 'rgba(34,211,238,0.35)'; // missed
    return null;
  }

  // Perfect line from cell(1,1) center to cell(14,10) center (1-indexed → 0-indexed * CELL + CELL/2)
  const lineX1 = 0.5 * CELL, lineY1 = 0.5 * CELL;
  const lineX2 = 13.5 * CELL, lineY2 = 9.5 * CELL;

  return (
    <div ref={ref} style={SEC}>
      <h2 className={syne.className} style={H2}>The Bridge Problem</h2>
      <p style={BODY}>
        Scan conversion is the process of determining which pixels to activate to best approximate a continuous shape on a discrete grid.
        This is the core problem that line and circle drawing algorithms solve.
      </p>

      <div style={{ border:'1px solid #2a2a2a', borderRadius:4, overflow:'hidden', display:'inline-block', marginBottom:20, cursor:'crosshair' }}>
        {mounted && (
          <Stage width={CANVAS6} height={CANVAS6}
            onClick={(e) => {
              const pos = e.target.getStage()?.getPointerPosition();
              if (!pos) return;
              const col = Math.floor(pos.x / CELL);
              const row = Math.floor(pos.y / CELL);
              if (col >= 0 && col < GRID_N && row >= 0 && row < GRID_N) toggleCell(col, row);
            }}
          >
            <Layer>
              <Rect x={0} y={0} width={CANVAS6} height={CANVAS6} fill="#161616" />
              {/* Grid */}
              {Array.from({ length: GRID_N+1 }, (_,i) => (
                <Line key={`gx${i}`} points={[i*CELL,0,i*CELL,CANVAS6]} stroke="#2a2a2a" strokeWidth={0.5} />
              ))}
              {Array.from({ length: GRID_N+1 }, (_,i) => (
                <Line key={`gy${i}`} points={[0,i*CELL,CANVAS6,i*CELL]} stroke="#2a2a2a" strokeWidth={0.5} />
              ))}
              {/* Cell fills */}
              {Array.from({ length: GRID_N }, (_,row) =>
                Array.from({ length: GRID_N }, (_,col) => {
                  const fill = cellColor(col, row);
                  if (!fill) return null;
                  return <Rect key={`${col},${row}`} x={col*CELL+1} y={row*CELL+1} width={CELL-2} height={CELL-2} fill={fill} />;
                })
              )}
              {/* Perfect diagonal line */}
              <Line points={[lineX1, lineY1, lineX2, lineY2]} stroke="#8a8a8a" strokeWidth={1} opacity={0.6} />
            </Layer>
          </Stage>
        )}
      </div>

      {/* Question card */}
      <div style={{ background:'#161616', border:'1px solid #7c6af7', borderRadius:8, padding:20, marginBottom:20, maxWidth:560 }}>
        <p className={syne.className} style={{ fontSize:18, fontWeight:600, color:'#f0ece4', margin:'0 0 8px' }}>
          Which pixels should we turn on to best represent this line?
        </p>
        <p style={{ color:'#8a8a8a', fontSize:14, margin:0 }}>
          Click the pixels you think should be activated.
        </p>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        {!revealed ? (
          <button
            onClick={reveal}
            style={{ ...MONO, background:'#7c6af7', color:'#f0ece4', border:'none', padding:'8px 20px', borderRadius:4, cursor:'pointer', fontSize:13 }}
          >
            Reveal Answer
          </button>
        ) : (
          <button
            onClick={reset}
            style={{ ...BTN_OUTLINE }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Try Again
          </button>
        )}
      </div>

      {revealed && (
        <p style={{ ...MONO, fontSize:13, color:'#8a8a8a', marginBottom:32, maxWidth:560 }}>
          This is exactly what Bresenham&apos;s algorithm computes — instantly, using only integer arithmetic.
        </p>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <Link
          href="/cg/unit-1/concept-algorithms"
          className={syne.className}
          style={{ color:'#22d3ee', textDecoration:'none', fontWeight:600, fontSize:15 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}
        >
          Next: The Algorithms →
        </Link>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ConceptGridPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ color:'#8a8a8a', fontFamily:'var(--font-inter), sans-serif', lineHeight:1.8 }}>
      <Section1 mounted={mounted} />
      <HR />
      <Section2 mounted={mounted} />
      <HR />
      <Section3 mounted={mounted} />
      <HR />
      <Section4 mounted={mounted} isMobile={isMobile} />
      <HR />
      <Section5 mounted={mounted} />
      <HR />
      <Section6 mounted={mounted} />
    </div>
  );
}
