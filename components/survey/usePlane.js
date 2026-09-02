import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
    ZOOM_MAX,
    ZOOM_MIN,
    clamp,
    clampZoom,
    easeOutQuint,
    labelGates,
    lerp,
    lerpLog,
    sheetAt,
    tierFor,
    zoomAbout,
} from './viewport';

/** useLayoutEffect warns during SSR, where there is no layout to measure. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const PAN_LIMITS = { x0: -2900, y0: -1300, x1: 4700, y1: 2900 };
const FLIGHT_MS = 540;
const FRICTION = 0.9;
const MIN_VELOCITY = 0.02;

export function usePlane({ initialView, sheets }) {
    const rootRef = useRef(null);
    const planeRef = useRef(null);

    const view = useRef({ ...initialView });
    const size = useRef({ w: 1440, h: 900 });
    const flight = useRef(null);
    const velocity = useRef({ x: 0, y: 0 });
    const flightGuard = useRef(null);
    const movingTimer = useRef(null);
    const pointers = useRef(new Map());
    const pinch = useRef(null);
    const subscribers = useRef(new Set());
    const running = useRef(false);
    const dirty = useRef(true);
    const dragged = useRef(false);
    const reduced = useRef(false);

    const [tier, setTier] = useState(() => tierFor(initialView.zoom));
    const [activeSheet, setActiveSheet] = useState(() => sheetAt(sheets, initialView.x, initialView.y)?.id);
    const [isDragging, setIsDragging] = useState(false);

    const clampView = useCallback(() => {
        const v = view.current;
        v.x = clamp(v.x, PAN_LIMITS.x0, PAN_LIMITS.x1);
        v.y = clamp(v.y, PAN_LIMITS.y0, PAN_LIMITS.y1);
        v.zoom = clampZoom(v.zoom);
    }, []);

    const commit = useCallback(() => {
        const plane = planeRef.current;
        const v = view.current;
        const s = size.current;

        if (plane) {
            let tx = s.w / 2 - v.x * v.zoom;
            let ty = s.h / 2 - v.y * v.zoom;

            // At 1:1 the sheets are printed type, so land them on whole pixels.
            if (Math.abs(v.zoom - 1) < 0.0005) {
                tx = Math.round(tx);
                ty = Math.round(ty);
            }

            plane.style.transform = `translate(${tx}px, ${ty}px) scale(${v.zoom})`;
            plane.style.setProperty('--inv-zoom', String(1 / v.zoom));

            const gates = labelGates(v.zoom);
            for (const [key, value] of Object.entries(gates)) {
                plane.style.setProperty(`--gate-${key}`, String(value));
            }
        }

        subscribers.current.forEach((fn) => fn(v, s));

        const nextTier = tierFor(v.zoom);
        setTier((prev) => (prev === nextTier ? prev : nextTier));
        const nextSheet = sheetAt(sheets, v.x, v.y)?.id;
        setActiveSheet((prev) => (prev === nextSheet ? prev : nextSheet));
    }, [sheets]);

    /**
     * Throttled tabs and headless renderers can starve requestAnimationFrame,
     * which would otherwise strand a flight halfway. The guard lands it.
     */
    const settleFlight = useCallback(() => {
        const pending = flight.current;
        if (!pending) return;
        flight.current = null;
        view.current = { ...pending.to };
        clampView();
        commit();
        dirty.current = false;
    }, [clampView, commit]);

    const markMoving = useCallback((hold = 190) => {
        const root = rootRef.current;
        if (!root) return;
        root.dataset.moving = 'true';
        clearTimeout(movingTimer.current);
        movingTimer.current = setTimeout(() => {
            delete root.dataset.moving;
            // Repaint once at rest so the terrain can resolve back in.
            subscribers.current.forEach((fn) => fn(view.current, size.current));
        }, hold);
    }, []);

    const commitNow = useCallback(() => {
        clampView();
        markMoving();
        commit();
        dirty.current = false;
    }, [clampView, commit, markMoving]);

    const schedule = useCallback(() => {
        dirty.current = true;
        if (running.current) return;
        running.current = true;

        const step = () => {
            const active = flight.current || Math.hypot(velocity.current.x, velocity.current.y) > MIN_VELOCITY;

            if (flight.current) {
                const f = flight.current;
                const raw = Math.min(1, (performance.now() - f.start) / f.duration);
                const t = easeOutQuint(raw);
                view.current.x = lerp(f.from.x, f.to.x, t);
                view.current.y = lerp(f.from.y, f.to.y, t);
                view.current.zoom = lerpLog(f.from.zoom, f.to.zoom, t);
                if (raw >= 1) {
                    flight.current = null;
                    clearTimeout(flightGuard.current);
                }
                dirty.current = true;
            } else if (Math.hypot(velocity.current.x, velocity.current.y) > MIN_VELOCITY) {
                view.current.x += velocity.current.x / view.current.zoom;
                view.current.y += velocity.current.y / view.current.zoom;
                velocity.current.x *= FRICTION;
                velocity.current.y *= FRICTION;
                dirty.current = true;
            }

            if (dirty.current) {
                clampView();
                markMoving();
                commit();
                dirty.current = false;
            }

            if (active) {
                requestAnimationFrame(step);
            } else {
                running.current = false;
            }
        };

        requestAnimationFrame(step);
    }, [clampView, commit]);

    const flyTo = useCallback(
        (target, { duration = FLIGHT_MS } = {}) => {
            const to = {
                x: clamp(target.x ?? view.current.x, PAN_LIMITS.x0, PAN_LIMITS.x1),
                y: clamp(target.y ?? view.current.y, PAN_LIMITS.y0, PAN_LIMITS.y1),
                zoom: clampZoom(target.zoom ?? view.current.zoom),
            };

            velocity.current = { x: 0, y: 0 };
            clearTimeout(flightGuard.current);

            if (reduced.current || duration === 0) {
                flight.current = null;
                view.current = to;
                commitNow();
                return;
            }

            flight.current = { from: { ...view.current }, to, start: performance.now(), duration };
            flightGuard.current = setTimeout(settleFlight, duration + 140);
            markMoving(duration + 160);
            schedule();
        },
        [commitNow, markMoving, schedule, settleFlight]
    );

    /** Positive dx moves the camera right, matching what the arrow key says. */
    const panByScreen = useCallback(
        (dxPx, dyPx) => {
            flight.current = null;
            clearTimeout(flightGuard.current);
            velocity.current = { x: 0, y: 0 };
            view.current.x += dxPx / view.current.zoom;
            view.current.y += dyPx / view.current.zoom;
            commitNow();
        },
        [commitNow]
    );

    const zoomByFactor = useCallback(
        (factor, sx, sy) => {
            flight.current = null;
            clearTimeout(flightGuard.current);
            const s = size.current;
            const anchorX = sx ?? s.w / 2;
            const anchorY = sy ?? s.h / 2;
            view.current = zoomAbout(view.current, s, anchorX, anchorY, view.current.zoom * factor);
            commitNow();
        },
        [commitNow]
    );

    const subscribe = useCallback((fn) => {
        subscribers.current.add(fn);
        fn(view.current, size.current);
        return () => subscribers.current.delete(fn);
    }, []);

    const getView = useCallback(() => ({ ...view.current }), []);
    const getSize = useCallback(() => ({ ...size.current }), []);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => {
            reduced.current = query.matches;
        };
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    /**
     * Measure the root rather than wait to be told about it. A ResizeObserver is
     * the right primary signal, but it is not guaranteed to have delivered
     * before the first paint, and some embedded renderers never deliver at all,
     * which would otherwise pin the viewport to its placeholder size.
     */
    const measure = useCallback(() => {
        const root = rootRef.current;
        if (!root?.clientWidth) return false;
        if (root.clientWidth === size.current.w && root.clientHeight === size.current.h) return false;
        size.current = { w: root.clientWidth, h: root.clientHeight };
        return true;
    }, []);

    useIsomorphicLayoutEffect(() => {
        measure();
    }, [measure]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const sync = () => {
            if (measure()) commitNow();
        };

        const observer = new ResizeObserver(sync);
        observer.observe(root);
        window.addEventListener('resize', sync);
        window.addEventListener('orientationchange', sync);
        sync();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', sync);
            window.removeEventListener('orientationchange', sync);
        };
    }, [commitNow, measure]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const localPoint = (event) => {
            const rect = root.getBoundingClientRect();
            return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        };

        const onWheel = (event) => {
            event.preventDefault();
            const point = localPoint(event);
            // Trackpad pinch arrives as ctrl+wheel; both paths zoom, at different gains.
            const intensity = event.ctrlKey ? 0.012 : 0.0022;
            const factor = Math.exp(-event.deltaY * intensity);
            flight.current = null;
            clearTimeout(flightGuard.current);
            velocity.current = { x: 0, y: 0 };
            view.current = zoomAbout(view.current, size.current, point.x, point.y, view.current.zoom * factor);
            commitNow();
        };

        const onPointerDown = (event) => {
            if (event.button !== undefined && event.button !== 0) return;
            // Controls layered over the plane own their own gestures.
            if (event.target?.closest?.('.apparatus, .palette')) return;

            const point = localPoint(event);
            pointers.current.set(event.pointerId, point);
            dragged.current = false;

            if (pointers.current.size === 1) {
                flight.current = null;
                clearTimeout(flightGuard.current);
                velocity.current = { x: 0, y: 0 };
                setIsDragging(true);
            }

            if (pointers.current.size === 2) {
                const [a, b] = [...pointers.current.values()];
                pinch.current = {
                    distance: Math.hypot(a.x - b.x, a.y - b.y),
                    zoom: view.current.zoom,
                };
            }
        };

        const onPointerMove = (event) => {
            const previous = pointers.current.get(event.pointerId);
            if (!previous) return;
            const point = localPoint(event);
            pointers.current.set(event.pointerId, point);

            if (pointers.current.size >= 2 && pinch.current) {
                const [a, b] = [...pointers.current.values()];
                const distance = Math.hypot(a.x - b.x, a.y - b.y);
                if (pinch.current.distance > 0) {
                    const midX = (a.x + b.x) / 2;
                    const midY = (a.y + b.y) / 2;
                    const target = pinch.current.zoom * (distance / pinch.current.distance);
                    view.current = zoomAbout(view.current, size.current, midX, midY, target);
                    dragged.current = true;
                    commitNow();
                }
                return;
            }

            const dx = point.x - previous.x;
            const dy = point.y - previous.y;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) dragged.current = true;

            view.current.x -= dx / view.current.zoom;
            view.current.y -= dy / view.current.zoom;
            velocity.current = { x: -dx * 0.85, y: -dy * 0.85 };
            commitNow();
        };

        const endPointer = (event) => {
            pointers.current.delete(event.pointerId);
            if (pointers.current.size < 2) pinch.current = null;
            if (pointers.current.size === 0) {
                setIsDragging(false);
                if (!reduced.current && dragged.current) schedule();
                else velocity.current = { x: 0, y: 0 };
            }
        };

        /**
         * Focusing a station outside the viewport makes the browser scroll the
         * root to reveal it, which shifts the whole interface because position
         * comes from a transform, not from scroll. Refuse the scroll; the focus
         * handler flies the camera there instead.
         */
        const onScroll = () => {
            if (root.scrollLeft !== 0) root.scrollLeft = 0;
            if (root.scrollTop !== 0) root.scrollTop = 0;
        };

        root.addEventListener('scroll', onScroll, { passive: true });
        root.addEventListener('wheel', onWheel, { passive: false });
        root.addEventListener('pointerdown', onPointerDown);
        root.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', endPointer);
        window.addEventListener('pointercancel', endPointer);

        return () => {
            root.removeEventListener('scroll', onScroll);
            root.removeEventListener('wheel', onWheel);
            root.removeEventListener('pointerdown', onPointerDown);
            root.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', endPointer);
            window.removeEventListener('pointercancel', endPointer);
        };
    }, [commitNow, schedule]);

    useEffect(() => {
        commitNow();
        return () => {
            clearTimeout(flightGuard.current);
            clearTimeout(movingTimer.current);
        };
    }, [commitNow]);

    return {
        rootRef,
        planeRef,
        tier,
        activeSheet,
        isDragging,
        wasDragged: dragged,
        flyTo,
        panByScreen,
        zoomByFactor,
        subscribe,
        getView,
        getSize,
        limits: { ZOOM_MIN, ZOOM_MAX },
    };
}
