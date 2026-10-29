import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { clamp, formatFull, formatMonth, formatShort, formatValue, niceTicks } from '../../lib/record';

const GAP = 14;
const ROW = 24;
const VOLUME = 64;
const ENTRANCE = 2600;
const PAD = { top: 60, left: 12, right: 64, bottom: 28 };
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";

let canvas = null;

/** Labels are set in a proportional face, so chips and tags are sized from the rendered text. */
function textWidth(text, size, weight = 400) {
    canvas ??= document.createElement('canvas').getContext('2d');
    canvas.font = `${weight} ${size}px ${SANS}`;
    return canvas.measureText(text).width;
}

function useWidth(ref) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;
        // ResizeObserver first reports on a rendered frame, which a background tab may not produce for a while.
        setWidth(Math.floor(node.getBoundingClientRect().width));
        const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
        observer.observe(node);
        return () => observer.disconnect();
    }, [ref]);

    return width;
}

function measure(days, view, width, height, top) {
    const visible = days.slice(view.start, view.end + 1);
    const span = view.end - view.start + 1;
    const left = PAD.left;
    const right = width - PAD.right;
    const volumeBottom = height - PAD.bottom;
    const volumeTop = volumeBottom - VOLUME;
    const bottom = volumeTop - GAP;
    const step = (right - left) / span;
    const peak = Math.max(1, ...visible.map((day) => day.count));
    let floor = Math.min(...visible.map((day) => Math.min(day.low, day.ma20)));
    let ceiling = Math.max(...visible.map((day) => Math.max(day.high, day.ma20)));
    const pad = (ceiling - floor) * 0.08 || 1;
    floor = Math.max(0, floor - pad);
    ceiling += pad;

    return {
        top,
        left,
        right,
        bottom,
        volumeTop,
        volumeBottom,
        span,
        step,
        visible,
        body: clamp(step * 0.62, 1.5, 14),
        ticks: niceTicks(floor, ceiling).filter((tick) => tick >= floor && tick <= ceiling),
        x: (index) => left + (index - view.start + 0.5) * step,
        y: (value) => top + ((ceiling - value) / (ceiling - floor)) * (bottom - top),
        bar: (count) => (count / peak) * VOLUME,
        delay: (index) => `${((index - view.start) * Math.min(0.012, 1.4 / span)).toFixed(3)}s`,
        indexAt: (px) => clamp(Math.floor((px - left) / step) + view.start, view.start, view.end),
    };
}

function Graticule({ scale, close }) {
    const isMonthly = scale.span > 60;
    const labels = scale.visible.filter((day) =>
        isMonthly ? day.date.endsWith('-01') : new Date(`${day.date}T00:00:00Z`).getUTCDay() === 1
    );

    return (
        <g className="chart__graticule">
            {scale.ticks.map((tick) => (
                <g key={tick}>
                    <line x1={scale.left} x2={scale.right} y1={scale.y(tick)} y2={scale.y(tick)} />
                    {(close === null || Math.abs(scale.y(tick) - close) > 14) && (
                        <text x={scale.right + 10} y={scale.y(tick) + 4}>
                            {formatValue(tick)}
                        </text>
                    )}
                </g>
            ))}
            <text className="chart__unit" x={scale.right + 10} y={scale.top - 14}>
                per day
            </text>
            {labels
                .filter((day) => scale.x(day.index) > scale.left + 14)
                .map((day) => (
                    <text key={day.date} x={scale.x(day.index)} y={scale.volumeBottom + 18} textAnchor="middle">
                        {isMonthly
                            ? `${formatMonth(day.date)}${day.date.endsWith('-01-01') ? ` ${day.date.slice(0, 4)}` : ''}`
                            : formatShort(day.date)}
                    </text>
                ))}
        </g>
    );
}

const Candles = memo(function Candles({ scale, liveIndex }) {
    return (
        <g className="chart__candles">
            {scale.visible.map((day) => {
                const x = scale.x(day.index);
                const upper = scale.y(Math.max(day.open, day.close));
                const lower = scale.y(Math.min(day.open, day.close));
                return (
                    <g key={day.date} className="candle" data-up={day.isUp} style={{ animationDelay: scale.delay(day.index) }}>
                        <line className="candle__wick" x1={x} x2={x} y1={scale.y(day.high)} y2={scale.y(day.low)} />
                        <rect
                            className={day.index === liveIndex ? 'candle__body candle__body--live' : 'candle__body'}
                            x={x - scale.body / 2}
                            y={upper}
                            width={scale.body}
                            height={Math.max(lower - upper, 1.2)}
                        />
                    </g>
                );
            })}
        </g>
    );
});

function Volume({ scale, cursor }) {
    return (
        <g className="chart__volume">
            {scale.visible.map((day) => (
                <rect
                    key={day.date}
                    data-up={day.isUp}
                    data-active={day.index === cursor}
                    style={{ animationDelay: scale.delay(day.index) }}
                    x={scale.x(day.index) - scale.body / 2}
                    y={scale.volumeBottom - scale.bar(day.count)}
                    width={scale.body}
                    height={scale.bar(day.count)}
                />
            ))}
        </g>
    );
}

function Trend({ scale }) {
    const path = scale.visible.map((day, i) => `${i ? 'L' : 'M'}${scale.x(day.index).toFixed(1)} ${scale.y(day.ma20).toFixed(1)}`).join(' ');

    return (
        <g>
            <path className="chart__trend" d={path} pathLength="1" />
            <circle className="chart__glint" r="3" opacity="0">
                <animateMotion dur="8s" begin="2.8s" repeatCount="indefinite" path={path} />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.92;1" dur="8s" begin="2.8s" repeatCount="indefinite" />
            </circle>
        </g>
    );
}

function Sweep({ scale }) {
    return (
        <g clipPath="url(#record-plot)">
            <rect className="chart__sweep" x={scale.left} y={scale.top} width="80" height={scale.volumeBottom - scale.top} fill="url(#record-sweep)" />
        </g>
    );
}

function AxisTag({ x, y, text, tone }) {
    const width = textWidth(text, 11, 600) + 14;
    return (
        <g className="chart__tag" data-tone={tone}>
            <rect x={x} y={y - 10} width={width} height={20} rx="4" />
            <text x={x + width / 2} y={y + 4} textAnchor="middle">
                {text}
            </text>
        </g>
    );
}

function LastClose({ scale, day, tone }) {
    const x = scale.x(day.index);
    const y = scale.y(day.close);

    return (
        <g className="chart__last" data-tone={tone}>
            <line className="chart__close" x1={scale.left} x2={scale.right} y1={y} y2={y} />
            <circle className="chart__pulse" cx={x} cy={y} r="3" />
            <circle className="chart__point" cx={x} cy={y} r="3" />
            <AxisTag x={scale.right + 4} y={y} text={formatValue(day.close)} tone={tone} />
        </g>
    );
}

function Crosshair({ scale, day }) {
    const x = scale.x(day.index);
    const y = scale.y(day.close);
    const label = formatShort(day.date);
    const width = textWidth(label, 11, 600) + 14;

    return (
        <g className="chart__crosshair" aria-hidden="true">
            <line x1={x} x2={x} y1={scale.top - 8} y2={scale.volumeBottom} />
            <line x1={scale.left} x2={scale.right} y1={y} y2={y} />
            <AxisTag x={scale.right + 4} y={y} text={formatValue(day.close)} />
            <AxisTag x={clamp(x - width / 2, scale.left, scale.right - width)} y={scale.volumeBottom + 14} text={label} />
        </g>
    );
}

/** Every new repo in view gets a labelled pin; same-day and crowded ones stack into extra rows. */
function placePins(repos, view, width) {
    const left = PAD.left;
    const right = width - PAD.right;
    const step = (right - left) / (view.end - view.start + 1);
    const ends = [];

    return repos
        .filter((repo) => repo.index >= view.start && repo.index <= view.end)
        .sort((a, b) => a.index - b.index || a.name.localeCompare(b.name))
        .map((repo) => {
            const label = `+ ${repo.name}`;
            const size = textWidth(label, 12, 500) + 20;
            const start = clamp(left + (repo.index - view.start + 0.5) * step - size / 2, left, right - size);
            const free = ends.findIndex((end) => start > end + 8);
            const row = free === -1 ? ends.length : free;
            ends[row] = start + size;
            return { repo, row, start, label, size };
        });
}

function Pin({ scale, pin }) {
    const { repo, row, start, label, size } = pin;
    const x = scale.x(repo.index);
    const anchor = scale.y(scale.visible[repo.index - scale.visible[0].index].high) - 10;
    const chip = 8 + row * ROW;

    return (
        <a
            className="pin"
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${repo.name}, created ${formatFull(repo.created)}. Opens on GitHub.`}
        >
            <line className="pin__leader" x1={x} x2={x} y1={chip + 18} y2={anchor - 6} />
            <path className="pin__glyph" d={`M${x} ${anchor - 5} L${x + 5} ${anchor} L${x} ${anchor + 5} L${x - 5} ${anchor} Z`} />
            <rect className="pin__chip" x={start} y={chip} width={size} height="18" rx="9" />
            <text className="pin__label" x={start + size / 2} y={chip + 13} textAnchor="middle">
                {label}
            </text>
        </a>
    );
}

export default function CandleChart({ days, view, cursor, repos, tone, replay, onCursor, onPan, onZoom, describedBy }) {
    const frameRef = useRef(null);
    const dragRef = useRef(null);
    const width = useWidth(frameRef);
    const [isDragging, setDragging] = useState(false);
    const [hasEntered, setEntered] = useState(false);
    const pins = useMemo(() => (width ? placePins(repos, view, width) : []), [repos, view, width]);
    const top = Math.max(PAD.top, (Math.max(0, ...pins.map((pin) => pin.row)) + 1) * ROW + 12);
    const height = (width && width < 640 ? 340 : 440) + top - PAD.top;
    const scale = useMemo(() => (width ? measure(days, view, width, height, top) : null), [days, view, width, height, top]);
    const last = days[days.length - 1];
    const active = cursor === null ? null : days[cursor];
    const isLastVisible = last.index >= view.start && last.index <= view.end;

    useEffect(() => {
        setEntered(false);
        const timer = setTimeout(() => setEntered(true), ENTRANCE);
        return () => clearTimeout(timer);
    }, [replay]);

    useEffect(() => {
        const node = frameRef.current;
        if (!node || !scale) return undefined;
        const handleWheel = (event) => {
            event.preventDefault();
            const left = node.getBoundingClientRect().left;
            onZoom(event.deltaY > 0 ? 1.15 : 1 / 1.15, scale.indexAt(event.clientX - left));
        };
        node.addEventListener('wheel', handleWheel, { passive: false });
        return () => node.removeEventListener('wheel', handleWheel);
    }, [scale, onZoom]);

    const pointX = (event) => event.clientX - frameRef.current.getBoundingClientRect().left;

    const handlePointerDown = (event) => {
        if (event.button !== 0 || event.target.closest('a')) return;
        dragRef.current = { x: pointX(event), end: view.end, hasMoved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        if (!scale) return;
        const drag = dragRef.current;
        if (drag) {
            const dx = pointX(event) - drag.x;
            if (!drag.hasMoved && Math.abs(dx) > 4) {
                drag.hasMoved = true;
                setDragging(true);
            }
            if (drag.hasMoved) {
                onPan(drag.end - dx / scale.step);
                return;
            }
        }
        if (event.pointerType === 'mouse') onCursor(scale.indexAt(pointX(event)));
    };

    const handlePointerUp = (event) => {
        const drag = dragRef.current;
        dragRef.current = null;
        setDragging(false);
        if (scale && drag && !drag.hasMoved) onCursor(scale.indexAt(pointX(event)));
    };

    const handleKeyDown = (event) => {
        const current = cursor ?? view.end;
        const actions = {
            ArrowLeft: () => (event.shiftKey ? onPan(view.end - 7) : onCursor(current - 1, true)),
            ArrowRight: () => (event.shiftKey ? onPan(view.end + 7) : onCursor(current + 1, true)),
            Home: () => onCursor(0, true),
            End: () => onCursor(days.length - 1, true),
            '+': () => onZoom(1 / 1.25, current),
            '=': () => onZoom(1 / 1.25, current),
            '-': () => onZoom(1.25, current),
            Escape: () => onCursor(null),
        };
        if (!actions[event.key]) return;
        event.preventDefault();
        actions[event.key]();
    };

    return (
        <div
            id="record-chart"
            className="chart"
            ref={frameRef}
            tabIndex={0}
            role="group"
            aria-roledescription="candlestick chart"
            aria-label="Daily contributions. Left and right arrows read one day at a time, Shift with an arrow pans a week, plus and minus zoom."
            aria-describedby={describedBy}
            data-dragging={isDragging}
            data-entered={hasEntered}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
                dragRef.current = null;
                setDragging(false);
            }}
            onPointerLeave={() => !dragRef.current && onCursor(null)}
            style={{ height }}
        >
            {scale && (
                <svg key={replay} width={width} height={height}>
                    <defs>
                        <linearGradient id="record-sweep" x1="0" x2="1">
                            <stop offset="0" className="chart__sweep-stop" stopOpacity="0" />
                            <stop offset=".5" className="chart__sweep-stop" stopOpacity=".09" />
                            <stop offset="1" className="chart__sweep-stop" stopOpacity="0" />
                        </linearGradient>
                        <clipPath id="record-plot">
                            <rect x={scale.left} y={scale.top - 10} width={scale.right - scale.left} height={scale.volumeBottom - scale.top + 10} />
                        </clipPath>
                    </defs>
                    <Graticule scale={scale} close={isLastVisible ? scale.y(last.close) : null} />
                    <Sweep scale={scale} />
                    <Volume scale={scale} cursor={cursor} />
                    <Candles scale={scale} liveIndex={last.index} />
                    <Trend scale={scale} />
                    {isLastVisible && <LastClose scale={scale} day={last} tone={tone} />}
                    {active && active.index >= view.start && active.index <= view.end && <Crosshair scale={scale} day={active} />}
                    <g className="chart__pins">
                        {pins.map((pin) => (
                            <Pin key={pin.repo.name} scale={scale} pin={pin} />
                        ))}
                    </g>
                </svg>
            )}
        </div>
    );
}
