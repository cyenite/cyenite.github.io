import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { SHEETS, STATIONS, STATION_BY_ID, TOOL_COUNTS } from '../../data/survey';
import { NorthArrow, ScaleBar, SheetIndex, StatusBar, TitleBlock, ZoomControls } from './Apparatus';
import SearchPalette from './SearchPalette';
import Station from './Station';
import TerrainCanvas from './TerrainCanvas';
import { ControlSheet, LegendSheet, SectionSheet, SurveySheet } from './sheets';
import { usePlane } from './usePlane';

/** useLayoutEffect warns during SSR; on the server there is no layout to read. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const STATION_ZOOM = 2.2;
const NARROW = 1200;
const FIT_MIN = 0.22;
const FIT_MAX = 1.15;

/** Room the apparatus occupies, so a fitted sheet lands in clear space. */
const SAFE = { top: 96, right: 282, bottom: 112, left: 242 };
const SAFE_NARROW = { top: 60, right: 14, bottom: 106, left: 14 };

/**
 * Frame a sheet from its rendered box rather than an authored camera position.
 * `offsetLeft` on a sheet is already in world units, because the plane is its
 * offset parent and CSS transforms do not affect offset geometry.
 */
function fitToSheet(id, size, fallback) {
    const el = typeof document === 'undefined' ? null : document.getElementById(`sheet-el-${id}`);
    if (!el || !el.offsetWidth || !size.w) return fallback;

    const narrow = size.w < NARROW;
    const pad = narrow ? SAFE_NARROW : SAFE;
    const availableW = Math.max(240, size.w - pad.left - pad.right);
    const availableH = Math.max(240, size.h - pad.top - pad.bottom);

    // Fit on width alone. Shrinking a sheet to fit its height costs legibility
    // on every glyph, and the plane is pannable by design, so a sheet taller
    // than the viewport is framed from the top and scrolled into instead.
    const raw = availableW / el.offsetWidth;

    // Landing a prose sheet on exactly 1:1 keeps its type at native resolution;
    // any fractional scale puts every glyph on fractional pixels.
    const fitted = Math.min(FIT_MAX, Math.max(FIT_MIN, raw));
    const zoom = Math.abs(fitted - 1) < 0.16 ? 1 : fitted;

    // When a sheet is larger than the room available, frame where it starts
    // rather than its middle: on the activities sheet that means landing on the
    // row labels and the earliest work, then panning forward through time.
    const shownW = Math.min(el.offsetWidth, availableW / zoom);
    const shownH = Math.min(el.offsetHeight, availableH / zoom);

    return {
        x: el.offsetLeft + shownW / 2 - (pad.left - pad.right) / 2 / zoom,
        y: el.offsetTop + shownH / 2 - (pad.top - pad.bottom) / 2 / zoom,
        zoom,
    };
}

function readHash() {
    if (typeof window === 'undefined') return null;
    const match = /^#\/(sheet|station)\/([\w-]+)$/.exec(window.location.hash);
    if (!match) return null;
    return { type: match[1], id: match[2] };
}

export default function Survey() {
    // Initial state must be identical on server and client, so the deep link and
    // the measured fit are both applied after mount rather than during render.
    const plane = usePlane({ initialView: SHEETS[0].view, sheets: SHEETS });
    const [openStation, setOpenStation] = useState(null);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [activeTool, setActiveTool] = useState(null);
    const [openBand, setOpenBand] = useState(null);
    const [readingOpen, setReadingOpen] = useState(false);
    const [cell, setCell] = useState(40);
    const focusFlight = useRef(null);

    /**
     * The first fit runs in a layout effect, before the plane's ResizeObserver
     * exists, so the viewport is measured from the root element rather than
     * taken from the hook's not-yet-populated size.
     */
    const liveSize = useCallback(() => {
        const el = plane.rootRef.current;
        if (el?.clientWidth) return { w: el.clientWidth, h: el.clientHeight };
        return plane.getSize();
    }, [plane]);


    useEffect(() => {
        // A coarser field on small screens keeps the one-off contour trace cheap.
        const narrow = window.innerWidth < NARROW;
        setCell(narrow ? 56 : 40);
        setReadingOpen(!narrow);
    }, []);

    // The authored view is only a pre-measure default; correct it before first paint.
    useIsomorphicLayoutEffect(() => {
        const target = readHash();

        if (target?.type === 'station') {
            const station = STATION_BY_ID[target.id];
            if (station) {
                plane.flyTo({ x: station.x + 110, y: station.y + 30, zoom: STATION_ZOOM }, { duration: 0 });
                setOpenStation(station.id);
                return;
            }
        }

        const sheetId = target?.type === 'sheet' && SHEETS.some((s) => s.id === target.id)
            ? target.id
            : 'control';
        const fallback = SHEETS.find((s) => s.id === sheetId) ?? SHEETS[0];

        const settle = () => plane.flyTo(fitToSheet(sheetId, liveSize(), fallback.view), { duration: 0 });
        settle();
        document.fonts?.ready.then(settle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setHash = useCallback((value) => {
        if (typeof window === 'undefined') return;
        const next = value ? `#${value}` : ' ';
        window.history.replaceState(null, '', value ? next : window.location.pathname);
    }, []);

    const flyToSheet = useCallback(
        (sheet, options) => {
            plane.flyTo(fitToSheet(sheet.id, liveSize(), sheet.view), options);
            setOpenStation(null);
            setHash(`/sheet/${sheet.id}`);
        },
        [liveSize, plane, setHash]
    );

    const flyToStation = useCallback(
        (station) => {
            plane.flyTo({ x: station.x + 110, y: station.y + 30, zoom: STATION_ZOOM });
            setOpenStation(station.id);
            setHash(`/station/${station.id}`);
        },
        [plane, setHash]
    );

    const pickTool = useCallback(
        (tool) => {
            const next = activeTool === tool ? null : tool;
            setActiveTool(next);
            if (next && plane.activeSheet !== 'survey') {
                const sheet = SHEETS.find((item) => item.id === 'survey');
                plane.flyTo(fitToSheet('survey', liveSize(), sheet.view));
                setHash(`/sheet/survey`);
            }
        },
        [activeTool, liveSize, plane, setHash]
    );

    const toggleBand = useCallback((id) => {
        setOpenBand((current) => (current === id ? null : id));
    }, []);

    const toggleStation = useCallback(
        (station) => {
            if (plane.wasDragged.current) return;
            if (openStation === station.id) {
                setOpenStation(null);
                setHash(null);
                return;
            }
            flyToStation(station);
        },
        [flyToStation, openStation, plane.wasDragged, setHash]
    );

    // Focus moving to an off-screen station must bring the viewport with it.
    const onPlaneFocus = useCallback(
        (event) => {
            const host = event.target.closest?.('.station');
            if (!host) return;
            const id = host.querySelector('[id^="station-body-"]')?.id?.replace('station-body-', '');
            const station = id ? STATION_BY_ID[id] : null;
            if (!station) return;

            const current = plane.getView();
            const size = liveSize();
            const sx = (station.x - current.x) * current.zoom + size.w / 2;
            const sy = (station.y - current.y) * current.zoom + size.h / 2;
            const inside = sx > 120 && sx < size.w - 220 && sy > 90 && sy < size.h - 150;

            if (!inside) {
                clearTimeout(focusFlight.current);
                focusFlight.current = setTimeout(() => {
                    plane.flyTo({
                        x: station.x + 110,
                        y: station.y + 30,
                        zoom: Math.max(current.zoom, 1.2),
                    });
                }, 40);
            }
        },
        [liveSize, plane]
    );

    useEffect(() => {
        const onKeyDown = (event) => {
            const tag = event.target?.tagName;
            const typing = tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable;

            if (event.key === '/' && !typing) {
                event.preventDefault();
                setPaletteOpen(true);
                return;
            }
            if (event.key === 'Escape') {
                if (paletteOpen) return;
                if (openBand) {
                    setOpenBand(null);
                    return;
                }
                if (activeTool) {
                    setActiveTool(null);
                    return;
                }
                if (openStation) {
                    setOpenStation(null);
                    setHash(null);
                }
                return;
            }
            if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

            const step = 110;
            switch (event.key) {
                case 'ArrowLeft': event.preventDefault(); plane.panByScreen(-step, 0); break;
                case 'ArrowRight': event.preventDefault(); plane.panByScreen(step, 0); break;
                case 'ArrowUp': event.preventDefault(); plane.panByScreen(0, -step); break;
                case 'ArrowDown': event.preventDefault(); plane.panByScreen(0, step); break;
                case '+': case '=': event.preventDefault(); plane.zoomByFactor(1.45); break;
                case '-': case '_': event.preventDefault(); plane.zoomByFactor(1 / 1.45); break;
                case '0': event.preventDefault(); flyToSheet(SHEETS[0]); break;
                default: break;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [activeTool, flyToSheet, openBand, openStation, paletteOpen, plane, setHash]);

    const stations = useMemo(() => STATIONS, []);

    return (
        <>
            <a className="skip" href="#sheet-index-title">
                Skip to sheet index
            </a>

            <div
                className="survey-root"
                ref={plane.rootRef}
                data-dragging={plane.isDragging ? 'true' : undefined}
                data-tier={plane.tier}
            >
                <TerrainCanvas
                    stations={stations}
                    sheets={SHEETS}
                    plane={plane}
                    activeSheet={plane.activeSheet}
                    cell={cell}
                />

                <div className="plane" ref={plane.planeRef} onFocus={onPlaneFocus}>
                    <ControlSheet />
                    <SurveySheet
                        count={stations.length}
                        openBand={openBand}
                        onToggleBand={toggleBand}
                    />
                    <SectionSheet />
                    <LegendSheet activeTool={activeTool} onPickTool={pickTool} />

                    <div className="stations">
                        {stations.map((station) => (
                            <Station
                                key={station.id}
                                station={station}
                                activeTool={activeTool}
                                isOpen={openStation === station.id}
                                onOpen={toggleStation}
                                onPickTool={pickTool}
                            />
                        ))}
                    </div>
                </div>

                <div className="apparatus">
                    <div className="apparatus__tl">
                        <NorthArrow />
                        <div className="apparatus__stack">
                            <SheetIndex activeSheet={plane.activeSheet} onSelect={flyToSheet} />

                            {plane.activeSheet === 'survey' ? (
                                <details
                                    className="reading"
                                    open={readingOpen}
                                    onToggle={(event) => setReadingOpen(event.currentTarget.open)}
                                >
                                    <summary className="reading__summary">How to read this</summary>
                                    <ul className="reading__list">
                                        <li>
                                            <b>Left to right</b> is time: 2018 at the left edge, 2026 at
                                            the right.
                                        </li>
                                        <li>
                                            <b>Each row</b> is a kind of work. Click a row name to see
                                            what it covers.
                                        </li>
                                        <li>
                                            <b>The contour lines</b> are drawn from the work itself:
                                            tighter rings mean a busier stretch.
                                        </li>
                                        <li>
                                            <b>Click any marker</b> for what it is, what it was built
                                            with, and where to find it.
                                        </li>
                                    </ul>
                                </details>
                            ) : null}
                        </div>
                    </div>

                    <div className="apparatus__tr">
                        <button
                            type="button"
                            className="finder"
                            onClick={() => setPaletteOpen(true)}
                            aria-haspopup="dialog"
                        >
                            <span className="finder__label">Search the survey</span>
                            <kbd>/</kbd>
                        </button>
                        <ZoomControls plane={plane} />
                    </div>

                    {activeTool ? (
                        <div className="apparatus__filter">
                            <p className="filterchip">
                                <span className="filterchip__key">Showing</span>
                                <span className="filterchip__value">{activeTool}</span>
                                <span className="filterchip__count">
                                    {TOOL_COUNTS[activeTool]} of {stations.length}
                                </span>
                                <button
                                    type="button"
                                    className="filterchip__clear"
                                    onClick={() => setActiveTool(null)}
                                >
                                    Clear
                                </button>
                            </p>
                        </div>
                    ) : null}

                    <div className="apparatus__bl">
                        <StatusBar plane={plane} />
                    </div>

                    <div className="apparatus__bc">
                        <ScaleBar plane={plane} />
                    </div>

                    <div className="apparatus__br">
                        <TitleBlock activeSheet={plane.activeSheet} stationCount={stations.length} />
                    </div>
                </div>
            </div>

            <SearchPalette
                open={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                onPickSheet={flyToSheet}
                onPickStation={flyToStation}
            />
        </>
    );
}
