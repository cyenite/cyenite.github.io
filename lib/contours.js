/**
 * Scalar field and contour extraction.
 *
 * The terrain under the plane is not decoration: it is a density surface
 * summed from Gaussian kernels at every station, weighted by triangulation
 * order. Contours come out of marching squares over that surface, so the
 * relief genuinely tracks where and when the work happened.
 */

export const FIELD_BOUNDS = { x0: -3100, y0: -1560, x1: 4900, y1: 3060 };
export const CELL = 40;

/** Gaussian, in world units. */
function kernel(dx, dy, sigma) {
    return Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
}

export function buildField(seeds, bounds = FIELD_BOUNDS, cell = CELL) {
    const cols = Math.ceil((bounds.x1 - bounds.x0) / cell) + 1;
    const rows = Math.ceil((bounds.y1 - bounds.y0) / cell) + 1;
    const values = new Float32Array(cols * rows);

    let min = Infinity;
    let max = -Infinity;

    for (let r = 0; r < rows; r += 1) {
        const wy = bounds.y0 + r * cell;
        for (let c = 0; c < cols; c += 1) {
            const wx = bounds.x0 + c * cell;
            let sum = 0;
            for (let i = 0; i < seeds.length; i += 1) {
                const s = seeds[i];
                sum += s.weight * kernel(wx - s.x, wy - s.y, s.sigma);
            }
            values[r * cols + c] = sum;
            if (sum < min) min = sum;
            if (sum > max) max = sum;
        }
    }

    return { values, cols, rows, cell, bounds, min, max };
}

export function sampleField(field, wx, wy) {
    const { values, cols, rows, cell, bounds } = field;
    const fx = (wx - bounds.x0) / cell;
    const fy = (wy - bounds.y0) / cell;
    const c0 = Math.max(0, Math.min(cols - 2, Math.floor(fx)));
    const r0 = Math.max(0, Math.min(rows - 2, Math.floor(fy)));
    const tx = Math.max(0, Math.min(1, fx - c0));
    const ty = Math.max(0, Math.min(1, fy - r0));

    const v00 = values[r0 * cols + c0];
    const v10 = values[r0 * cols + c0 + 1];
    const v01 = values[(r0 + 1) * cols + c0];
    const v11 = values[(r0 + 1) * cols + c0 + 1];

    return (
        v00 * (1 - tx) * (1 - ty) + v10 * tx * (1 - ty) + v01 * (1 - tx) * ty + v11 * tx * ty
    );
}

const KEY_SCALE = 100;
const keyOf = (x, y) => `${Math.round(x * KEY_SCALE)}:${Math.round(y * KEY_SCALE)}`;

/**
 * Marching squares at one level, with segments stitched into polylines so the
 * renderer can taper strokes and break lines for elevation labels.
 */
export function traceLevel(field, level) {
    const { values, cols, rows, cell, bounds } = field;
    const at = (c, r) => values[r * cols + c];
    const px = (c) => bounds.x0 + c * cell;
    const py = (r) => bounds.y0 + r * cell;

    const segments = [];

    for (let r = 0; r < rows - 1; r += 1) {
        for (let c = 0; c < cols - 1; c += 1) {
            const tl = at(c, r);
            const tr = at(c + 1, r);
            const br = at(c + 1, r + 1);
            const bl = at(c, r + 1);

            let code = 0;
            if (tl > level) code |= 8;
            if (tr > level) code |= 4;
            if (br > level) code |= 2;
            if (bl > level) code |= 1;
            if (code === 0 || code === 15) continue;

            const x0 = px(c);
            const y0 = py(r);
            const x1 = px(c + 1);
            const y1 = py(r + 1);

            const lerp = (a, b) => (level - a) / (b - a);
            const top = () => ({ x: x0 + (x1 - x0) * lerp(tl, tr), y: y0 });
            const bottom = () => ({ x: x0 + (x1 - x0) * lerp(bl, br), y: y1 });
            const left = () => ({ x: x0, y: y0 + (y1 - y0) * lerp(tl, bl) });
            const right = () => ({ x: x1, y: y0 + (y1 - y0) * lerp(tr, br) });

            // Saddle resolution uses the cell average, the standard disambiguation.
            const centre = (tl + tr + br + bl) / 4;

            switch (code) {
                case 1: case 14: segments.push([left(), bottom()]); break;
                case 2: case 13: segments.push([bottom(), right()]); break;
                case 3: case 12: segments.push([left(), right()]); break;
                case 4: case 11: segments.push([top(), right()]); break;
                case 6: case 9: segments.push([top(), bottom()]); break;
                case 7: case 8: segments.push([left(), top()]); break;
                case 5:
                    if (centre > level) {
                        segments.push([left(), top()], [bottom(), right()]);
                    } else {
                        segments.push([left(), bottom()], [top(), right()]);
                    }
                    break;
                case 10:
                    if (centre > level) {
                        segments.push([top(), right()], [left(), bottom()]);
                    } else {
                        segments.push([left(), top()], [bottom(), right()]);
                    }
                    break;
                default: break;
            }
        }
    }

    return stitch(segments);
}

function stitch(segments) {
    const heads = new Map();
    const pushAt = (key, entry) => {
        const bucket = heads.get(key);
        if (bucket) bucket.push(entry);
        else heads.set(key, [entry]);
    };

    segments.forEach((seg, i) => {
        pushAt(keyOf(seg[0].x, seg[0].y), { i, end: 0 });
        pushAt(keyOf(seg[1].x, seg[1].y), { i, end: 1 });
    });

    const used = new Uint8Array(segments.length);
    const polylines = [];

    const walk = (startIndex, fromEnd) => {
        const points = [];
        let index = startIndex;
        let end = fromEnd;

        while (index !== -1 && !used[index]) {
            used[index] = 1;
            const seg = segments[index];
            const a = end === 0 ? seg[0] : seg[1];
            const b = end === 0 ? seg[1] : seg[0];
            if (points.length === 0) points.push(a);
            points.push(b);

            const bucket = heads.get(keyOf(b.x, b.y)) || [];
            const next = bucket.find((e) => e.i !== index && !used[e.i]);
            if (!next) break;
            index = next.i;
            end = next.end;
        }

        return points;
    };

    for (let i = 0; i < segments.length; i += 1) {
        if (used[i]) continue;
        const forward = walk(i, 0);
        if (forward.length > 1) polylines.push(forward);
    }

    return polylines.filter((line) => line.length > 2);
}

/**
 * A contour set at even intervals. Every `indexEvery`-th line is an index
 * contour, drawn heavier and carrying an elevation label, per topographic
 * convention.
 */
export function contourSet(field, { count = 8, indexEvery = 3, floor = 0.1 } = {}) {
    const span = field.max - field.min;
    const set = [];

    for (let i = 1; i <= count; i += 1) {
        const t = floor + (i / (count + 1)) * (1 - floor);
        const level = field.min + span * t;
        set.push({
            level,
            elevation: Math.round(t * 1000),
            isIndex: i % indexEvery === 0,
            polylines: traceLevel(field, level),
        });
    }

    return set;
}

/** Station density seeds, plus broader massifs so the sheets sit on real ground. */
export function seedsFrom(stations, sheets) {
    const weightByOrder = { 1: 1.0, 2: 0.66, 3: 0.42 };

    const stationSeeds = stations.map((s) => ({
        x: s.x,
        y: s.y,
        sigma: 150 + (4 - s.order) * 58,
        weight: weightByOrder[s.order] ?? 0.5,
    }));

    const sheetSeeds = sheets.map((sheet) => ({
        x: sheet.bounds.x + sheet.bounds.w / 2,
        y: sheet.bounds.y + sheet.bounds.h / 2,
        sigma: Math.max(sheet.bounds.w, sheet.bounds.h) * 0.42,
        weight: sheet.id === 'control' ? 1.35 : 0.85,
    }));

    return [...stationSeeds, ...sheetSeeds];
}
