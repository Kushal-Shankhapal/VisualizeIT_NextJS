# VisualizeIT — CLAUDE.md

## Project Overview

VisualizeIT is a Next.js 16 educational platform for engineering students. It provides interactive simulations and concept pages for subjects like Data Structures, OS, DBMS, and Computer Graphics. The stack is React 19, TypeScript, Tailwind CSS v4, NextAuth v5, and Supabase.

---

## Computer Graphics (CG) Module — Build Log

Everything below describes what was built for the CG module from scratch. All CG work lives under `src/app/cg/` and `src/components/cg/`.

---

### 1. Package Installations

The following packages were added to the project specifically for the CG module. None of them were present before.

| Package | Version | Role |
|---|---|---|
| `lenis` | ^1.3.23 | Smooth scroll — initialized in `PageWrapper` |
| `animejs` | ^4.4.1 | Scroll-triggered animations on the concept pages |
| `react-konva` | ^19.2.3 | React wrapper for Konva canvas elements |
| `konva` | ^10.3.0 | Peer dependency of react-konva |
| `shiki` | ^4.0.2 | Syntax highlighting (reserved for future code blocks) |
| `@types/animejs` | ^3.1.13 | TypeScript types for animejs (dev dependency) |

**Important:** animejs v4 uses named exports, not a default export. Always import as:
```ts
import { animate } from 'animejs';
```
The `ease` key is used (not `easing` as in v3). Valid ease values confirmed: `'outQuad'`, `'inOutQuad'`, etc., found under `easings.eases`.

**Important:** react-konva accesses `window` at module initialization time. It cannot server-render. Every `<Stage>` must be gated behind a `mounted` boolean that is set in a `useEffect`. See the `PageWrapper` + page pattern.

---

### 2. Folder Structure

All CG routes live under `src/app/cg/`. All CG-specific components live under `src/components/cg/`.

```
src/
├── app/
│   └── cg/
│       ├── layout.tsx                          ← shared CG layout (server component)
│       └── unit-1/
│           ├── concept-grid/page.tsx           ← BUILT (full interactive page)
│           ├── concept-algorithms/page.tsx     ← placeholder
│           ├── sim-dda/page.tsx                ← placeholder
│           ├── sim-bresenham-line/page.tsx     ← placeholder
│           ├── sim-line-comparator/page.tsx    ← placeholder
│           ├── sim-bresenham-circle/page.tsx   ← placeholder
│           ├── sim-midpoint-circle/page.tsx    ← placeholder
│           └── sim-circle-comparator/page.tsx  ← placeholder
└── components/
    └── cg/
        ├── CGNavbar.tsx                        ← BUILT (full navigation)
        ├── PageWrapper.tsx                     ← BUILT (Lenis + layout shell)
        └── SectionDivider.tsx                  ← placeholder
```

---

### 3. CSS Variables — `src/app/globals.css`

Nine CG-specific variables were appended to `globals.css` under a `.cg-scope` class so they do not conflict with the existing VisualizeIT design system (which uses `--bg`, `--accent`, `--text`, etc.).

```css
.cg-scope {
  --cg-bg:           #0f0f0f;
  --cg-surface:      #161616;
  --cg-surface-2:    #1e1e1e;
  --cg-text:         #f0ece4;
  --cg-text-muted:   #8a8a8a;
  --cg-violet:       #7c6af7;
  --cg-cyan:         #22d3ee;
  --cg-orange:       #f97316;
  --cg-border:       #2a2a2a;
}
```

The `.cg-scope` class is applied by `PageWrapper` on its root `<div>`, so all CG pages inherit these variables automatically. Pages outside `/cg/` are completely unaffected.

---

### 4. `src/app/cg/layout.tsx` — CG Shared Layout

This is a **server component** (no `'use client'`). It wraps every `/cg/**` route. The global root layout (`src/app/layout.tsx`) renders the VisualizeIT `<Navbar>` and `<Footer>` for all routes including `/cg/` — the CGNavbar sits on top of the global Navbar visually because it is `position: fixed` and appears later in DOM order (both are `z-index: 50`).

```tsx
import CGNavbar from '@/components/cg/CGNavbar';
import PageWrapper from '@/components/cg/PageWrapper';

export default function CGLayout({ children }) {
  return (
    <>
      <CGNavbar />
      <PageWrapper>{children}</PageWrapper>
    </>
  );
}
```

Render order on every CG page: `CGNavbar` (fixed, always on top) → `PageWrapper` (content shell with Lenis).

---

### 5. `src/components/cg/CGNavbar.tsx` — CG Navigation Bar

**Directive:** `'use client'`

A fully styled, responsive navigation bar fixed to the top of all `/cg/**` routes.

#### Design Specs
- Position: `fixed`, `top: 0`, `z-index: 50`, full width
- Background: `rgba(15,15,15,0.97)` with `backdropFilter: blur(12px)`
- Bottom border: `1px solid #2a2a2a`
- Height: auto with `padding: 14px 0` (grows to fit two-row group content)

#### Layout (left → center → right)
- **Left:** "VisualizeIT / CG" branding. Font: `Syne 700` loaded via `next/font/google` at module level. `VisualizeIT` in `#8a8a8a`, `/` in `#3a3a3a`, `CG` in `#7c6af7`.
- **Center:** Two `NavGroup` columns side by side — `CONCEPTS` and `SIMULATORS`. Each group has a label (JetBrains Mono, 10px, `#8a8a8a`, `letter-spacing: 0.12em`) above its links.
- **Right:** `Unit I` pill badge (JetBrains Mono, `#22d3ee`, border `rgba(34,211,238,0.4)`, `border-radius: 999px`). Hamburger icon on mobile.

#### Nav Links (CONCEPTS)
| Label | Route |
|---|---|
| The Grid | `/cg/unit-1/concept-grid` |
| The Algorithms | `/cg/unit-1/concept-algorithms` |

#### Nav Links (SIMULATORS)
| Label | Route |
|---|---|
| DDA | `/cg/unit-1/sim-dda` |
| Bresenham Line | `/cg/unit-1/sim-bresenham-line` |
| Line Comparator | `/cg/unit-1/sim-line-comparator` |
| Bresenham Circle | `/cg/unit-1/sim-bresenham-circle` |
| Midpoint Circle | `/cg/unit-1/sim-midpoint-circle` |
| Circle Comparator | `/cg/unit-1/sim-circle-comparator` |

#### Active / Hover States
- Active route: `#22d3ee` with a `2px` cyan underline bar (`position: absolute, bottom: 0`)
- Hover: `#7c6af7`, `transition: color 200ms` — implemented via `useState` on `DesktopNavLink` (not CSS `:hover`) because inline styles cannot react to pseudo-classes
- Inactive: `#f0ece4`

#### Responsive Behavior
**Critical:** Tailwind responsive classes (`hidden md:flex`, `md:hidden`) were NOT used because Tailwind v4 did not generate them for newly created files in `src/components/cg/` during the session. The fix was a `<style>` tag injected directly inside the `<nav>` element:

```css
.cg-nav-desktop { display: none; }
.cg-hamburger   { display: flex;  }

@media (min-width: 768px) {
  .cg-nav-desktop { display: flex; }
  .cg-hamburger   { display: none; }
}
```

These class names (`cg-nav-desktop`, `cg-hamburger`) are applied via `className` on the relevant elements.

#### Mobile Menu
- Hamburger: three `<span>` bars in `#f0ece4`, `20px × 2px`
- Open state: dropdown `<div>` with `background: #161616`, `border-top: 1px solid #2a2a2a`, stacked `MobileNavLink` rows
- Close triggers: outside click (via `mousedown` listener on `navRef`), and route change (`useEffect` watching `pathname`)
- Active route detection: `usePathname()` from `next/navigation`
- Route changes auto-close the mobile menu

---

### 6. `src/components/cg/PageWrapper.tsx` — Page Shell

**Directive:** `'use client'`

Wraps every CG page's content. Responsibilities:

1. **Lenis smooth scroll** — initialized in `useEffect`, RAF loop uses a closure-scoped `rafId` variable so `cancelAnimationFrame` actually stops the recursive chain (a single cancel only stops the first frame, not the recursive calls):
   ```ts
   let rafId: number;
   function raf(time: number) {
     lenis.raf(time);
     rafId = requestAnimationFrame(raf);  // re-assigned each frame
   }
   rafId = requestAnimationFrame(raf);
   return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
   ```

2. **`.cg-scope` class** — applied to the root `<div>`, activating all `--cg-*` CSS variables.

3. **Layout shell:**
   - `min-height: 100vh`
   - `background: #0f0f0f`
   - `padding-top: 90px` — accounts for the CGNavbar height (navbar uses `padding: 14px 0` which, with two-row group content, renders at ~80–88px; 90px gives clearance)
   - Inner `<div>`: `max-width: 1200px`, centered with `margin: 0 auto`, `padding: 0 24px`

---

### 7. `src/app/cg/unit-1/concept-grid/page.tsx` — Full Concept Page

**Directive:** `'use client'`

A long vertical-scroll page with 6 interactive sections. Every section fades up on scroll entry via IntersectionObserver + animejs.

#### Shared Infrastructure

**`useReveal()` hook** — used by every section. Sets `opacity: 0; transform: translateY(40px)` imperatively on mount, then fires animejs when the element enters the viewport:
```ts
animate(el, { opacity:[0,1], translateY:['40px','0px'], duration:600, ease:'outQuad' });
```
Observer disconnects after first trigger (one-shot reveal, not repeat).

**`useIsMobile()` hook** — listens to `window.resize`, returns `true` below 768px. Used by Section 4 to stack the two scan panels vertically on mobile.

**`mounted` state** — set `true` in `useEffect`. Every `<Stage>` is gated `{mounted && <Stage>...}` to prevent Konva's `window` access from crashing during SSR.

**Shared style constants:** `SEC` (section padding/maxWidth), `H2` (Syne 700, 36px, `#f0ece4`), `BODY` (Inter, `#8a8a8a`, `line-height 1.8`), `MONO` (JetBrains Mono), `PILL` (stat pill style), `BTN_OUTLINE` (cyan outline button style).

#### Section 1 — "The Smallest Thing on Your Screen"

**Concept:** What a pixel is.

**Interactive — Pixel Zoom Demo:**
- Konva `Stage` 320×320px
- 8×8 smiley face pattern pre-baked as a constant (`SMILEY` array, `1` = `#22d3ee`, `0` = `#161616`)
- Cell size = `40 * zoom`. Visible cell count = `ceil(320 / cellSize)`. Viewport is centered on the smiley's center pixel (row 4, col 4) so zooming in always centers on a face feature.
- At zoom ≥ 6, each visible cell renders a `KText` node showing its hex color value (`#22D3EE` or `#161616`) in 9px monospace.
- Slider: range 1–8, `accentColor: #7c6af7`
- Two stat pills: "1 pixel = 1 color value", "Your screen has millions of them"

#### Section 2 — "How Many Pixels?"

**Concept:** Resolution and aspect ratio.

**Interactive — Resolution Comparator:**
- Three buttons: `360p`, `720p`, `1080p`. Active = `background: #7c6af7`. Inactive = `background: #161616, border: #2a2a2a`.
- Konva `Stage` 400×225px (16:9 ratio).
- Each resolution maps to a dot-grid config: `{ w, h, spacing, dotR }`. Dots are Konva `Circle` nodes placed at `spacing/2` offsets in a nested loop.
  - 360p: spacing 26px, radius 2.5
  - 720p: spacing 13px, radius 1.5
  - 1080p: spacing 9px, radius 1.0
- Pixel count label: `"640 × 360 = 230,400 pixels"` computed from resolution object, formatted with `.toLocaleString()`.
- Aspect ratio callout: `background: #161616`, `border-left: 3px solid #7c6af7`.

#### Section 3 — "Where Pixels Live"

**Concept:** The frame buffer.

**Interactive — Frame Buffer Visualizer:**
- Konva `Stage` 360×160px (6 columns × 4 rows of 60×40 cells).
- 24 pre-defined hex colors in `FB_COLORS` constant.
- Base state: cell background = color at 30% opacity (computed by `hexToRgb()` helper which parses hex to `rgba(...,0.30)`), text label = hex string in 9px monospace.
- "Lit" state (during/after Refresh): cell background = full color, text = `#f0ece4`.
- **Refresh animation:** `setTimeout` loop — cell `i` lights up at `i * 100ms` delay. All timeouts stored in a `ref` array (`timeoutsRef`) so they can be cancelled on re-click or unmount. Uses functional state update (`prev => new Set([...prev, i])`) to avoid stale closure bugs.
- Memory label: `"6 × 4 grid = 24 pixels × 24-bit color = 576 bits"`.

#### Section 4 — "Two Ways to Draw"

**Concept:** Raster scan vs random scan.

**Interactive — Dual Animation (`ScanPanel` sub-component):**

Both animations share a single `requestAnimationFrame` loop triggered by "Play Both". Loop runs for `max(2000ms, numSegments * 300ms)`. At the end, both states reset to idle.

*Raster scan (left, 200×200 Konva canvas):*
- Konva `Group` with `clip={{ x:0, y:0, width:200, height:scanY }}` — clips the house outline to only show the region the scan line has already passed over.
- Cyan `Rect` (height 2px, `rgba(34,211,238,0.6)`) positioned at current `scanY`.
- House: 5 pre-defined line segments (`HOUSE_LINES`) drawn in `#f0ece4`.
- Full sweep: 2 seconds.

*Random scan (right, 200×200 Konva canvas):*
- `randomProg` ranges from `0` to `HOUSE_LINES.length` (5.0).
- Each line segment `i` draws from `frac = clamp(randomProg - i, 0, 1)` of its length:
  ```ts
  x2 = x1 + (fullX2 - x1) * frac
  y2 = y1 + (fullY2 - y1) * frac
  ```
- Segments draw in `#7c6af7`, each taking 300ms.

*"Play Both" button:* Syne 600, `background: #7c6af7`, `color: #f0ece4`.

**Comparison table** below the panels: 4 rows (Output Type, Memory, Best For, Example), alternating `#0f0f0f` / `#161616` row backgrounds, `border: #2a2a2a`.

**Mobile:** `isMobile` prop controls `flexDirection: 'column'` on the two-panel wrapper so they stack vertically below 768px.

#### Section 5 — "The Drawing Command List"

**Concept:** Display file interpreter.

**State:** `step` (−1 to 5), `lines` (array of drawn segments), `cursor` (current pen position `{x, y}`).

**Commands (6 total):**
```
MOVE(0, 0) → LINE(5, 5) → MOVE(5, 5) → LINE(10, 2) → MOVE(10, 2) → LINE(15, 8)
```

**Command list panel** (left, `background: #161616`, `border: #2a2a2a`): Each row highlights in `rgba(34,211,238,0.12)` when it is the current step. Past steps dim to `#8a8a8a`.

**Konva canvas** (right, 200×200):
- Grid lines at every `SCALE = 10px` interval (20×20 grid drawn in `#2a2a2a, 0.5px`).
- User-space coordinates map to canvas via `coord * SCALE` (so `x:15` → pixel `150`).
- Drawn lines rendered in `#7c6af7`, 2px width.
- Cyan 6×6px square marks the current cursor position.

**Step button:** disabled and `opacity: 0.4` when all commands have been executed.
**Reset button:** clears all state back to initial.

#### Section 6 — "The Bridge Problem"

**Concept:** Scan conversion — the motivation for Bresenham's algorithm.

**Bresenham pre-computation** (for line from grid cell (1,1) to (14,10), 1-indexed = (0,0)→(13,9) in 0-indexed):
```
Pixels: (0,0)(1,1)(2,1)(3,2)(4,3)(5,3)(6,4)(7,5)(8,6)(9,6)(10,7)(11,8)(12,8)(13,9)
```
Stored as a `Set<string>` with keys like `'col,row'` for O(1) lookup.

**Konva canvas:** 300×300px, 15×15 grid (20px cells).
- Grid lines: `#2a2a2a, 0.5px`
- Perfect mathematical line: thin `#8a8a8a` Konva `Line` from cell (0,0) center to cell (13,9) center — `(10,10)` to `(270,190)` in pixel coords.
- Click handler on `<Stage>` computes `col = floor(pointerX / 20)`, `row = floor(pointerY / 20)` and toggles selected state.

**Cell coloring logic (post-reveal):**
| Condition | Color |
|---|---|
| Bresenham ✓, Selected ✓ | `rgba(34,211,238,0.7)` — correct |
| Bresenham ✗, Selected ✓ | `rgba(249,115,22,0.7)` — wrong |
| Bresenham ✓, Selected ✗ | `rgba(34,211,238,0.35)` — missed |
| Neither | no fill |

Before reveal: selected cells show `rgba(34,211,238,0.6)`.

**"Reveal Answer" button** → switches to **"Try Again"** which resets all state.

**"Next: The Algorithms →"** link at bottom-right in `#22d3ee`, Syne 600, links to `/cg/unit-1/concept-algorithms`. Underline on hover via `onMouseEnter`/`onMouseLeave`.

---

### 8. Known Decisions & Gotchas

| Issue | Decision |
|---|---|
| Tailwind responsive classes not generated for new `src/components/cg/` files | Use a `<style>` tag with plain `@media` queries and custom class names (`cg-nav-desktop`, `cg-hamburger`) instead of `hidden md:flex` / `md:hidden` |
| react-konva accesses `window` at module init | Gate every `<Stage>` behind `{mounted && ...}` where `mounted` is set in `useEffect` |
| animejs v4 breaks v3 import patterns | Use `import { animate } from 'animejs'`; use `ease:` not `easing:`; use `'outQuad'` etc. |
| Lenis RAF loop single-cancel bug | Store `rafId` in a closure variable, re-assign each frame. `cancelAnimationFrame` on cleanup stops the latest scheduled frame |
| CGNavbar fixed position vs global sticky Navbar | Both are `z-index: 50`. CGNavbar appears later in the DOM (inside `<main>`), so it stacks on top of the global Navbar visually on all `/cg/` routes |
| NavLink hover with inline styles | CSS `:hover` pseudo-class does not work with React inline styles. Hover state handled via `useState` + `onMouseEnter`/`onMouseLeave` on `DesktopNavLink` |
| Frame buffer animation stale closures | Use functional state updates `prev => new Set([...prev, i])` inside `setTimeout` callbacks |

---

### 9. What Remains (Placeholders)

Every file below exports a default component returning a `<div>` with the route path as text. They are ready to be built out:

- `src/app/cg/unit-1/concept-algorithms/page.tsx`
- `src/app/cg/unit-1/sim-dda/page.tsx`
- `src/app/cg/unit-1/sim-bresenham-line/page.tsx`
- `src/app/cg/unit-1/sim-line-comparator/page.tsx`
- `src/app/cg/unit-1/sim-bresenham-circle/page.tsx`
- `src/app/cg/unit-1/sim-midpoint-circle/page.tsx`
- `src/app/cg/unit-1/sim-circle-comparator/page.tsx`
- `src/components/cg/SectionDivider.tsx`

---

### 10. Design Token Reference (CG Module)

| Token | Value | Usage |
|---|---|---|
| Background | `#0f0f0f` | Page background, navbar background |
| Surface | `#161616` | Cards, panels, dropdowns |
| Surface-2 | `#1e1e1e` | Nested panels |
| Text | `#f0ece4` | Headings, active links |
| Text muted | `#8a8a8a` | Body copy, labels, inactive links |
| Violet | `#7c6af7` | CG branding, random-scan color, active button fill |
| Cyan | `#22d3ee` | Active nav link, interactive highlights, Refresh button border |
| Orange | `#f97316` | Error state (wrong pixel picks in Section 6) |
| Border | `#2a2a2a` | All borders, dividers, table lines |
| Fonts | Syne (headings), Inter (body), JetBrains Mono (code/labels) |

Syne is loaded via `next/font/google` at the module level inside each component file that uses it. Inter and JetBrains Mono are loaded in the root `src/app/layout.tsx` and exposed as CSS variables `--font-inter` and `--font-jetbrains`.
