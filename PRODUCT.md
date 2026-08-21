# Product

## Register

brand

## Users

Three people arrive here, in descending order of patience:

1. **Engineering hiring managers and tech leads** evaluating whether Aaron can build non-trivial systems. They arrive from a LinkedIn or GitHub link, usually on desktop, usually with four other tabs open. They need evidence of range and depth within about twenty seconds, and a way to reach a specific artifact (a repo, a package, a published extension) without hunting.
2. **Recruiters** screening on a phone, mid-scroll. They need name, role, stack, and contact without learning anything new.
3. **Other engineers** who followed a link from a `pub.dev` package, a TradingView script, or a VS Code extension listing. They arrived because of one specific thing and will stay if the rest is interesting.

The job to be done: answer "is this person unusually good, and at what?" faster and more convincingly than a resume does.

## Product Purpose

A portfolio for Aaron Rono (`cyenite`): mobile software engineer at Solutech, trained in Geomatics and Geospatial Information Systems, with roughly 35 shipped projects spanning Flutter mobile apps, Laravel/Vue web platforms, quantitative-finance instruments, GIS and remote-sensing tools, IDE extensions, and embedded IoT.

The site replaces a forked Ubuntu-desktop-clone template. That template's problem was not aesthetics; it was authorship. Its most memorable quality belonged to someone else, and it is shared with hundreds of other forks. Success here means the interface itself is evidence: something a visitor could not mistake for anyone else's site, and could not have gotten from a template.

The organising insight: Aaron is a trained surveyor who builds instruments for reading markets. Cartography and technical analysis are the same discipline pointed at different subjects, imposing a coordinate system on terrain that does not come with one. The portfolio is therefore built as a survey: a single continuous, pannable, zoomable plane where the work is plotted as control stations, and detail resolves with zoom the way it does on a real map series.

## Brand Personality

**Precise, weathered, instrument-grade.**

The voice of a well-made field instrument: a theodolite, a depth sounder, a plan sheet annotated in pencil over ink. Confident because it is calibrated, not because it is loud. It states measurements and lets the reader draw conclusions.

Copy is declarative and specific. Coordinates, dates, counts, and stack names do the persuading. No adjectives where a number would work. Never enthusiastic about itself.

Emotional target: the visitor should feel they have been handed a real instrument, and should want to touch it before they finish reading. Curiosity first, then respect.

## Anti-references

- **The Ubuntu / macOS / Windows desktop-clone portfolio.** The thing being replaced. Novelty borrowed from an operating system someone else designed.
- **Dark terminal developer portfolios.** Monospace everything, green-on-black, a fake CLI prompt, a typewriter-effect tagline. This is the reflex answer for "technical person" and it is now the most crowded lane on the internet. The site is deliberately light: a paper sheet in daylight, not a console at night.
- **Editorial-typographic brand pages.** Large display serif in italic, tiny tracked uppercase labels, three rule-separated columns, monochrome restraint. A saturated aesthetic family and the wrong register for an instrument.
- **The scroll-triggered SaaS landing page.** Hero with a gradient headline, three feature cards with rounded icons, a stat row, fade-up on every section, an "AVAILABLE FOR WORK" pill.
- **Awwwards-style WebGL showreels** where a fluid simulation or distorted 3D blob carries the page and the work is a footnote. Motion here must be navigation, not decoration.
- **Cream, sand, parchment, and beige palettes.** Including for a paper-and-drafting concept, where it is the obvious pull. The sheet reads cool, not warm.

## Design Principles

1. **The interface is the argument.** Nothing on the page should claim Aaron is precise or spatially minded. The apparatus, working coordinate readout, recalculating scale bar, contours derived from real project data, should demonstrate it instead. If a claim can be replaced by a working mechanism, replace it.
2. **Every cartographic element must actually function.** No decorative map furniture. The scale bar reflects real zoom, the coordinate display reflects real position, the contours are computed from the project data rather than drawn for looks, the grid reference in the URL genuinely restores a viewport. A fake instrument is worse than no instrument.
3. **Strangeness in the navigation, never in the content.** The way you move through the site is unfamiliar by design. What you find when you arrive, a project's name, date, description, stack, and link, is immediately legible and conventionally structured. Nobody should have to decode a project.
4. **Zoom is the information architecture.** Level of detail replaces page hierarchy. Far out gives shape and scale of a career; close in gives a single artifact in full. This means the reader controls density instead of scrolling past it.
5. **Unconventional does not mean inaccessible.** The plane is driven by real semantic HTML, complete keyboard control, and a sheet index that functions as a document outline for screen readers. The concept has no "simplified version" link because it does not need one.

## Accessibility & Inclusion

Target: **WCAG 2.2 AA.**

- Body text meets 4.5:1; large text and graphical elements meet 3:1. Every token pair is verified numerically, not by eye.
- The plane is fully keyboard operable: arrow keys pan, `+`/`-` zoom, `Tab` moves between stations in a meaningful order, `Enter` opens, `Escape` closes, `/` opens search. Focus is always visible with a 2px offset ring.
- Content lives in the DOM as `article` and `ul` elements positioned by transform, not painted into canvas. Canvas carries only terrain and graticule, and is `aria-hidden`. A screen reader receives an ordered document, not an application it cannot enter.
- `prefers-reduced-motion: reduce` converts viewport flights to instant jumps and disables all ambient motion. No animation is required to reveal content; every section renders visible by default.
- Colour never encodes meaning alone. Station types differ by glyph shape as well as colour, so the map survives colour-vision deficiency and greyscale printing.
- Touch targets are at least 44px. Pointer-driven panning and pinch-zoom work on touch without a mouse.
