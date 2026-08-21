import { useEffect, useMemo, useRef } from 'react';

import { buildField, contourSet, seedsFrom } from '../../lib/contours';
import { niceSpan } from './viewport';

const HYPSOMETRIC = [
    [242, 246, 248],
    [231, 238, 241],
    [220, 231, 234],
    [209, 224, 227],
    [198, 216, 219],
    [186, 208, 211],
];

// Graticule figures are text, so they take the muted ink, not the hairline grey.
const LABEL_INK = '#50585f';
const RULE = '#b7bfc4';
const RULE_SOFT = 'rgba(183, 191, 196, 0.55)';
const SHEET = '#f1f5f7';

function rampColour(t) {
    const scaled = Math.max(0, Math.min(1, t)) * (HYPSOMETRIC.length - 1);
    const i = Math.min(HYPSOMETRIC.length - 2, Math.floor(scaled));
    const f = scaled - i;
    const a = HYPSOMETRIC[i];
    const b = HYPSOMETRIC[i + 1];
    return [
        Math.round(a[0] + (b[0] - a[0]) * f),
        Math.round(a[1] + (b[1] - a[1]) * f),
        Math.round(a[2] + (b[2] - a[2]) * f),
    ];
}

function boundsOf(points) {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const p of points) {
        if (p.x < x0) x0 = p.x;
        if (p.y < y0) y0 = p.y;
        if (p.x > x1) x1 = p.x;
        if (p.y > y1) y1 = p.y;
    }
    return { x0, y0, x1, y1 };
}

export default function TerrainCanvas({ stations, sheets, plane, cell = 40 }) {
    const canvasRef = useRef(null);
    const reliefRef = useRef(null);

    const terrain = useMemo(() => {
        const field = buildField(seedsFrom(stations, sheets), undefined, cell);
        const contours = contourSet(field).map((level) => ({
            ...level,
            polylines: level.polylines.map((points) => ({ points, box: boundsOf(points) })),
        }));
        return { field, contours };
    }, [stations, sheets, cell]);

    // Hypsometric tint is rasterised once at field resolution, then drawn scaled.
    useEffect(() => {
        const { field } = terrain;
        const relief = document.createElement('canvas');
        relief.width = field.cols;
        relief.height = field.rows;
        const ctx = relief.getContext('2d');
        const image = ctx.createImageData(field.cols, field.rows);
        const span = field.max - field.min || 1;

        for (let i = 0; i < field.values.length; i += 1) {
            const [r, g, b] = rampColour((field.values[i] - field.min) / span);
            const o = i * 4;
            image.data[o] = r;
            image.data[o + 1] = g;
            image.data[o + 2] = b;
            image.data[o + 3] = 255;
        }

        ctx.putImageData(image, 0, 0);
        reliefRef.current = relief;
    }, [terrain]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');

        const draw = (view, size) => {
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            const w = Math.max(1, Math.round(size.w));
            const h = Math.max(1, Math.round(size.h));

            if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            const { zoom } = view;
            const toScreenX = (wx) => (wx - view.x) * zoom + w / 2;
            const toScreenY = (wy) => (wy - view.y) * zoom + h / 2;

            ctx.fillStyle = SHEET;
            ctx.fillRect(0, 0, w, h);

            const { field, contours } = terrain;
            const relief = reliefRef.current;

            if (relief) {
                const rx = toScreenX(field.bounds.x0);
                const ry = toScreenY(field.bounds.y0);
                const rw = (field.bounds.x1 - field.bounds.x0) * zoom;
                const rh = (field.bounds.y1 - field.bounds.y0) * zoom;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.globalAlpha = 0.9;
                ctx.drawImage(relief, rx, ry, rw, rh);
                ctx.globalAlpha = 1;
            }

            drawGraticule(ctx, view, { w, h }, toScreenX, toScreenY);

            const margin = 80;
            const visible = {
                x0: view.x - w / 2 / zoom - margin,
                y0: view.y - h / 2 / zoom - margin,
                x1: view.x + w / 2 / zoom + margin,
                y1: view.y + h / 2 / zoom + margin,
            };

            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            for (const level of contours) {
                ctx.strokeStyle = level.isIndex ? RULE : RULE_SOFT;
                ctx.lineWidth = level.isIndex ? Math.max(0.9, 1.35 * Math.min(1.6, zoom)) : Math.max(0.5, 0.75 * Math.min(1.6, zoom));

                for (const line of level.polylines) {
                    const { box, points } = line;
                    if (box.x1 < visible.x0 || box.x0 > visible.x1) continue;
                    if (box.y1 < visible.y0 || box.y0 > visible.y1) continue;

                    ctx.beginPath();
                    ctx.moveTo(toScreenX(points[0].x), toScreenY(points[0].y));
                    for (let i = 1; i < points.length; i += 1) {
                        ctx.lineTo(toScreenX(points[i].x), toScreenY(points[i].y));
                    }
                    ctx.stroke();
                }
            }

            if (zoom > 0.34) drawElevationLabels(ctx, contours, visible, toScreenX, toScreenY);
        };

        return plane.subscribe(draw);
    }, [plane, terrain]);

    return (
        <canvas
            ref={canvasRef}
            className="terrain"
            aria-hidden="true"
            role="presentation"
        />
    );
}

function drawGraticule(ctx, view, size, toScreenX, toScreenY) {
    const { zoom } = view;
    const interval = niceSpan(150 / zoom);
    const { w, h } = size;
    // A phone has no margin to spare for coordinate furniture; the sheet needs it.
    const labelled = w >= 900;

    const startX = Math.floor((view.x - w / 2 / zoom) / interval) * interval;
    const endX = view.x + w / 2 / zoom;
    const startY = Math.floor((view.y - h / 2 / zoom) / interval) * interval;
    const endY = view.y + h / 2 / zoom;

    ctx.strokeStyle = 'rgba(183, 191, 196, 0.38)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let wx = startX; wx <= endX; wx += interval) {
        const sx = Math.round(toScreenX(wx)) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
    }
    for (let wy = startY; wy <= endY; wy += interval) {
        const sy = Math.round(toScreenY(wy)) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
    }
    ctx.stroke();

    // Heavier ticks where the graticule meets the sheet edge, with coordinates.
    ctx.strokeStyle = RULE;
    ctx.fillStyle = LABEL_INK;
    ctx.font = '600 10px "Martian Mono", ui-monospace, monospace';
    ctx.textBaseline = 'top';
    ctx.lineWidth = 1;

    for (let wx = startX; wx <= endX; wx += interval) {
        const sx = Math.round(toScreenX(wx)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, 9);
        ctx.moveTo(sx, h);
        ctx.lineTo(sx, h - 9);
        ctx.stroke();
        if (labelled && sx > 44 && sx < w - 44) {
            ctx.textAlign = 'center';
            ctx.fillText(String(251000 + Math.round(wx)), sx, 13);
        }
    }

    ctx.textAlign = 'left';
    for (let wy = startY; wy <= endY; wy += interval) {
        const sy = Math.round(toScreenY(wy)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(9, sy);
        ctx.moveTo(w, sy);
        ctx.lineTo(w - 9, sy);
        ctx.stroke();
        if (labelled && sy > 34 && sy < h - 34) {
            ctx.save();
            ctx.translate(13, sy);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(String(9799600 - Math.round(wy)), 0, 0);
            ctx.restore();
        }
    }
}

/**
 * Elevation figures sit in the contour with a sheet-coloured halo, which is how
 * a printed map breaks the line for its own labels.
 */
function drawElevationLabels(ctx, contours, visible, toScreenX, toScreenY) {
    ctx.font = '600 9px "Martian Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = SHEET;
    ctx.fillStyle = LABEL_INK;

    for (const level of contours) {
        if (!level.isIndex) continue;

        for (const line of level.polylines) {
            const { box, points } = line;
            if (points.length < 24) continue;
            if (box.x1 < visible.x0 || box.x0 > visible.x1) continue;
            if (box.y1 < visible.y0 || box.y0 > visible.y1) continue;

            const at = Math.floor(points.length * 0.42);
            const a = points[at];
            const b = points[Math.min(points.length - 1, at + 3)];
            const sx = toScreenX(a.x);
            const sy = toScreenY(a.y);

            let angle = Math.atan2(toScreenY(b.y) - sy, toScreenX(b.x) - sx);
            if (angle > Math.PI / 2) angle -= Math.PI;
            if (angle < -Math.PI / 2) angle += Math.PI;

            const text = String(level.elevation);
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(angle);
            ctx.strokeText(text, 0, 0);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    }
}
