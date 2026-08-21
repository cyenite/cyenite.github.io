# Design

Visual system for **The Survey**, the portfolio of Aaron Rono. Companion to PRODUCT.md, which owns strategy.

---

## Theme

**Light. A plan sheet in daylight.**

The scene that forced it: a surveyor's drawing sheet unrolled on a drafting table at midday, held flat with weights, annotated in graphite over printed ink, in a room lit from a window. Not a screen in a dark room.

This is a deliberate rejection of the dark-terminal reflex for technical portfolios. There is no dark mode. The concept is a physical paper artifact, and paper does not invert. The design commits to one lighting condition, per the brand register's permission to art-direct rather than accommodate.

**Colour strategy: Committed.** Commitment is carried by *linework density* rather than by a colour drench. The distinguishing texture is drawn cartographic apparatus, graticule ticks, contour sets, station glyphs, leader lines, titleblock rules, at a density no ordinary web page has. Vermilion is the single saturated voice and appears only where the map is live.

---

## Colour

OKLCH throughout. Every pair below is numerically verified; ratios are measured, not estimated.

### Tokens

| Token | OKLCH | Hex | Role |
|---|---|---|---|
| `--sheet` | `0.968 0.005 225` | `#f1f5f7` | The paper. Cool, chroma toward cyan. |
| `--sheet-deep` | `0.945 0.008 225` | `#e7eef1` | Recessed surfaces, station bodies. |
| `--panel` | `0.215 0.020 252` | `#131a23` | Titleblock, status bar, palette. Deep ink. |
| `--ink` | `0.240 0.018 250` | `#192028` | Primary text. Graphite. |
| `--ink-muted` | `0.455 0.016 250` | `#50585f` | Secondary text, descriptions. |
| `--ink-faint` | `0.600 0.014 245` | `#7a8188` | Hairline furniture only. Never carries text. |
| `--rule` | `0.800 0.012 235` | `#b7bfc4` | Hairline linework, contours, borders. |
| `--vermilion` | `0.585 0.205 32` | `#db361a` | Control points, active state, graphics. |
| `--vermilion-ink` | `0.505 0.190 32` | `#b82002` | Vermilion when it carries text on sheet. |
| `--vermilion-lit` | `0.700 0.185 32` | `#fb6b44` | Vermilion on `--panel`. |
| `--datum` | `0.500 0.115 245` | `#1868a0` | Hydrography, secondary annotation, links. |
| `--datum-lit` | `0.700 0.110 240` | `#58a7dc` | Datum on `--panel`. |
| `--on-panel` | `0.930 0.006 225` | `#e4e9eb` | Text on `--panel`. |
| `--on-panel-muted` | `0.720 0.012 232` | `#9ea6ab` | Secondary text on `--panel`. |

### Verified contrast

| Pair | Ratio | Requirement |
|---|---|---|
| `--ink` on `--sheet` | 15.00:1 | AA body (4.5) |
| `--ink-muted` on `--sheet` | 6.63:1 | AA body (4.5) |
| `--vermilion-ink` on `--sheet` | 5.90:1 | AA body (4.5) |
| `--vermilion` on `--sheet` | 4.23:1 | AA graphic (3.0) |
| `--datum` on `--sheet` | 5.43:1 | AA body (4.5) |
| `--on-panel` on `--panel` | 14.26:1 | AA body (4.5) |
| `--on-panel-muted` on `--panel` | 7.08:1 | AA body (4.5) |
| `--vermilion-lit` on `--panel` | 6.06:1 | AA body (4.5) |
| `--datum-lit` on `--panel` | 6.65:1 | AA body (4.5) |

Every text role on every sheet was swept in the browser against its rendered background: 67 distinct roles, zero below their threshold. `--ink-faint` carries no text at all, including the graticule figures painted into the canvas, which take `--ink-muted` (`#50585f`).

### Hypsometric ramp

Terrain tinting between contour intervals. Extremely low chroma so overlaid text stays readable; the ramp is a texture, not a subject.

`0.965 0.006 215` → `0.945 0.012 200` → `0.925 0.016 190` → `0.905 0.020 182` → `0.885 0.024 176`

Colour never encodes meaning alone. Station types carry distinct glyph geometry (triangle, square, circle, diamond) so the map reads in greyscale and under colour-vision deficiency.

---

## Typography

Two families, three roles. Chosen against the physical object, a plan sheet's stamped titleblock lettering and an instrument's digital readout, not against the "developer" category.

### Families

- **Archivo** (Omnibus-Type). Variable, with a genuine width axis (`wdth` 62–125). Grotesque with document-and-signage heritage rather than startup-UI heritage.
  - `Archivo` at `wdth 112–125`, weight 600–700: sheet titles and section headings. Reads as stamped plan lettering.
  - `Archivo` at `wdth 100`, weight 400–500: body copy and project descriptions.
- **Martian Mono** (variable). All numeric and instrument readouts: coordinates, scale, zoom factor, dates, station identifiers, grid references.

Mono is confined to figures and identifiers, where tabular alignment is functionally required to stop digits jittering as the viewport moves. It is never used for prose, which is the costume failure the brand register warns about.

Rejected as training-data reflexes: IBM Plex Mono, Space Grotesk, Space Mono, Inter, DM Sans, Instrument Sans, Instrument Serif.

### Scale

Fluid `clamp()`, ratio ≥ 1.25 between steps. Display ceiling stays at or below 6rem. Display tracking floor is `-0.03em`, never tighter.

| Step | Size | Use |
|---|---|---|
| `--t-display` | `clamp(2.75rem, 7vw, 5.25rem)` | Sheet 01 name plate |
| `--t-title` | `clamp(1.75rem, 3.6vw, 2.75rem)` | Sheet titles |
| `--t-heading` | `clamp(1.25rem, 2vw, 1.6rem)` | Station names at high zoom |
| `--t-body` | `clamp(0.9375rem, 1.05vw, 1.0625rem)` | Prose |
| `--t-label` | `0.8125rem` | Station labels |
| `--t-readout` | `0.78125rem` | Coordinates, scale, status bar |
| `--t-tick` | `0.6875rem` | Ticks, chips, keycaps, field names |

`--t-tick` is the floor. Nothing renders below it, because a reader whose root
font size is 15px rather than 16px was already seeing 8.4px keycaps.

Body measure capped at 68ch. `text-wrap: balance` on headings, `pretty` on prose.

Uppercase is reserved for titleblock field names and the status bar, where it mirrors real plan-sheet convention. It is a single named system applied to one surface, not an eyebrow above every section.

---

## Layout

**One continuous plane, not a stack of sections.** The viewport is a window onto a coordinate space roughly 4000 × 2600 survey units. There is no page scroll; `overflow` is hidden on `html, body`.

Four sheets occupy regions of the same space and are reached by panning or by flight from the sheet index:

| Sheet | Region | Content |
|---|---|---|
| `01 CONTROL` | centre | Name plate, role, current position, interests |
| `02 ACTIVITIES` | east | 35 stations, plotted by date and kind of work |
| `03 SECTION` | south | Training and post as a borehole log |
| `04 LEGEND` | west | Symbology key, tool index, contact, resume |

### Level of detail

Zoom drives density, replacing page hierarchy. Naming is not a single threshold but a priority, taken from each station's triangulation order, which is how a map decides what to name at a given scale.

| Element | Appears at | Notes |
|---|---|---|
| Station glyph | always | Shape encodes kind, independent of colour |
| First-order name | `≥ 0.19` | The eight published products, named from the overview outward |
| Second-order name | `≥ 0.62` | Notable work |
| Third-order name | `≥ 0.98` | Early and archive work |
| Date and kind | `≥ 0.72` | |
| Stack tags | `≥ 1.15` | Two tags plus an overflow count |
| Full callout | on selection | A disclosure, not a zoom threshold |

Gates are written as CSS custom properties on the plane and consumed as `opacity`, so crossing a threshold costs one property write rather than a React render. The full callout is deliberately not zoom-driven: thirty-seven expanded callouts at close range would be unreadable, and a disclosure gives screen readers a state to act on.

Label positions are relaxed apart by a declutter pass over the plotted data. Required clearance is derived per pair from the scale at which both labels first appear together, so primaries get wide separation in plane units and third-order labels, which only ever appear close in, get very little. Verified at zero collisions across every tier.

### Apparatus

Fixed to the viewport, drawn as sheet furniture rather than as UI chrome:

- **Titleblock**, bottom right: sheet number, title, projection, revision date.
- **Status bar**, bottom left: live coordinate readout, zoom factor, active sheet.
- **Scale bar**, bottom centre: recalculates against real zoom, in survey units.
- **North arrow**, top left, with the graticule declination tick.
- **Graticule**, on canvas: ticks at the margins with coordinate labels, interval stepping with zoom.

Cards are avoided as the default affordance. Station detail renders as an annotated callout with a leader line to its plotted point, which is how a real sheet labels a feature, and which also solves the identical-card-grid failure.

---

## Motion

Motion is navigation. Nothing fades in merely because it entered the viewport.

- **Viewport flights**: interpolated `{x, y, zoom}` with ease-out-quint, 640ms. Zoom interpolates logarithmically, so a flight that also changes scale arcs rather than sliding flat. A timer guarantees the landing: a throttled tab or a headless renderer that starves `requestAnimationFrame` would otherwise strand the viewport halfway.
- **Direct manipulation is synchronous.** Drag, wheel, pinch, and the keyboard pan and zoom commit in the same tick rather than waiting for a frame. Only flights and pan inertia are frame-driven.
- **Pan inertia**: velocity carried from pointer release, exponential decay.
- **LOD transitions**: opacity and 4px translate crossfades at threshold crossings, 180ms, so detail resolves rather than popping.
- **Station focus**: the glyph's survey ring scales once, 240ms, and the leader line draws via `stroke-dashoffset`.
- No bounce, no elastic, no spring overshoot. Instruments do not overshoot.

Content is visible by default; transitions only enhance. No reveal is gated on a class-triggered transition, so headless renderers and background tabs still ship a complete page.

`prefers-reduced-motion: reduce`: flights become instant, inertia is disabled, LOD crossfades become instant, the survey ring does not pulse. Nothing becomes unreachable.

---

## Components

| Component | Notes |
|---|---|
| `SurveyPlane` | Owns viewport state, input handling, flight animation, hash sync. |
| `TerrainCanvas` | Marching-squares contours over a scalar field seeded by project data. `aria-hidden`. |
| `Station` | One project. Semantic `article` with a glyph, label, and LOD-dependent callout. |
| `Sheet` | A titled region of the plane, semantic `section` with a heading. |
| `TitleBlock` | Sheet metadata, plan-sheet ruled box. |
| `StatusBar` | Live readouts on `--panel`. |
| `ScaleBar` | Recalculating scale against zoom. |
| `NorthArrow` | Rotates with the (fixed) plane orientation. |
| `SheetIndex` | Navigation and the screen-reader document outline. |
| `SearchPalette` | `/` to open. Native `<dialog>`, so it escapes every stacking context. Matches name, stack, kind, date, and description, ranked by match quality. |
| `ReadingPanel` | Plain-language key to the activities plot. A `<details>`, open on desktop, collapsed on a phone. |
| `ToolIndex` | Tools grouped by what they are and weighted by how often they were used. Selecting one filters the plot. |
| `FilterChip` | The active tool filter and its match count, with a clear control. |

### Geometry and depth

- Radii: `0` for sheet furniture and rules, `2px` for interactive controls only. Paper does not have rounded corners.
- Borders: `1px` hairlines in `--rule`. Emphasis via a `2px` full border, never a side stripe.
- Shadows: essentially absent. Depth comes from linework weight and hypsometric tint. The one exception is the search palette, which is a physical overlay on the sheet and takes a single soft shadow.
- Z-index scale is semantic: `--z-terrain: 0`, `--z-stations: 10`, `--z-apparatus: 20`, `--z-palette: 30`, `--z-focus: 40`.
