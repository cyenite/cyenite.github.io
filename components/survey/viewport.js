/**
 * Viewport maths, shared by the plane, the canvas, and the readouts.
 *
 * The plane is never re-rendered per frame. Position lives in a ref, is written
 * straight to one transform and a handful of CSS custom properties, and only
 * reaches React when a discrete level of detail threshold is crossed.
 */

export const ZOOM_MIN = 0.14;
export const ZOOM_MAX = 3.4;

/** False origin placing the sheet in UTM zone 37S, which is where Nairobi sits. */
export const FALSE_EASTING = 251000;
export const FALSE_NORTHING = 9799600;

export const TIERS = ['overview', 'index', 'detail', 'full'];

export function tierFor(zoom) {
    if (zoom < 0.55) return 'overview';
    if (zoom < 1.15) return 'index';
    if (zoom < 1.9) return 'detail';
    return 'full';
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const clampZoom = (z) => clamp(z, ZOOM_MIN, ZOOM_MAX);

/** Ease-out-quint. Fast departure, long settle, no overshoot. */
export const easeOutQuint = (t) => 1 - (1 - t) ** 5;

export const lerp = (a, b, t) => a + (b - a) * t;
export const lerpLog = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));

export function screenToWorld(viewport, size, sx, sy) {
    return {
        x: viewport.x + (sx - size.w / 2) / viewport.zoom,
        y: viewport.y + (sy - size.h / 2) / viewport.zoom,
    };
}

/** Zoom anchored on a screen point, so the world under the cursor stays put. */
export function zoomAbout(viewport, size, sx, sy, nextZoom) {
    const zoom = clampZoom(nextZoom);
    const dx = sx - size.w / 2;
    const dy = sy - size.h / 2;
    return {
        x: viewport.x + dx / viewport.zoom - dx / zoom,
        y: viewport.y + dy / viewport.zoom - dy / zoom,
        zoom,
    };
}

export function formatEasting(worldX) {
    const v = FALSE_EASTING + worldX;
    return `${Math.floor(v / 1000)} ${String(Math.abs(Math.floor(v % 1000))).padStart(3, '0')}`;
}

export function formatNorthing(worldY) {
    const v = FALSE_NORTHING - worldY;
    const millions = Math.floor(v / 1000000);
    const rest = Math.floor(v % 1000000);
    const mid = String(Math.floor(rest / 1000)).padStart(3, '0');
    const low = String(rest % 1000).padStart(3, '0');
    return `${millions} ${mid} ${low}`;
}

/** Round a span to 1, 2, or 5 times a power of ten, the way a scale bar does. */
export function niceSpan(raw) {
    const exponent = Math.floor(Math.log10(raw));
    const base = 10 ** exponent;
    const mantissa = raw / base;
    const stepped = mantissa >= 5 ? 5 : mantissa >= 2 ? 2 : 1;
    return stepped * base;
}

export function scaleBar(zoom, targetPx = 132) {
    const span = niceSpan(targetPx / zoom);
    const label = span >= 1000 ? `${(span / 1000).toLocaleString('en')} km` : `${span} m`;
    return { span, label, width: span * zoom };
}

/** Which sheet contains a world point, for the status readout. */
export function sheetAt(sheets, x, y) {
    let best = null;
    let bestDistance = Infinity;

    for (const sheet of sheets) {
        const { bounds } = sheet;
        const cx = bounds.x + bounds.w / 2;
        const cy = bounds.y + bounds.h / 2;
        const inside =
            x >= bounds.x && x <= bounds.x + bounds.w && y >= bounds.y && y <= bounds.y + bounds.h;
        const distance = Math.hypot(x - cx, y - cy);
        if (inside) return sheet;
        if (distance < bestDistance) {
            bestDistance = distance;
            best = sheet;
        }
    }

    return best;
}

/** Label priority. Order-one stations are named at scales where the rest are not. */
export function labelGates(zoom) {
    return {
        order1: zoom >= 0.19 ? 1 : 0,
        order2: zoom >= 0.62 ? 1 : 0,
        order3: zoom >= 0.98 ? 1 : 0,
        meta: zoom >= 0.72 ? 1 : 0,
        tags: zoom >= 1.15 ? 1 : 0,
        full: zoom >= 1.9 ? 1 : 0,
        // A filter names its matches early, but not so early that the names stack.
        match: zoom >= 0.5 ? 1 : 0,
    };
}
