import { useEffect, useRef } from 'react';

import { SHEETS } from '../../data/survey';
import { formatEasting, formatNorthing, scaleBar } from './viewport';

/** 1 CSS pixel is about 0.2646 mm, so zoom converts to a printed map scale. */
const MM_PER_PX = 25.4 / 96;
const denominatorFor = (zoom) => Math.round(1000 / (zoom * MM_PER_PX) / 100) * 100;

export function StatusBar({ plane }) {
    const eastingRef = useRef(null);
    const northingRef = useRef(null);
    const scaleRef = useRef(null);
    const zoomRef = useRef(null);

    useEffect(
        () =>
            plane.subscribe((view) => {
                if (eastingRef.current) eastingRef.current.textContent = formatEasting(view.x);
                if (northingRef.current) northingRef.current.textContent = formatNorthing(view.y);
                if (scaleRef.current) {
                    scaleRef.current.textContent = `1:${denominatorFor(view.zoom).toLocaleString('en')}`;
                }
                if (zoomRef.current) zoomRef.current.textContent = `${view.zoom.toFixed(2)}×`;
            }),
        [plane]
    );

    return (
        <div className="status" role="status" aria-live="off" aria-label="Viewport position readout">
            <span className="status__field">
                <span className="status__key">E</span>
                <span className="status__value" ref={eastingRef} />
            </span>
            <span className="status__field">
                <span className="status__key">N</span>
                <span className="status__value" ref={northingRef} />
            </span>
            <span className="status__field status__field--scale">
                <span className="status__key">Scale</span>
                <span className="status__value" ref={scaleRef} />
            </span>
            <span className="status__field status__field--zoom">
                <span className="status__key">Zoom</span>
                <span className="status__value" ref={zoomRef} />
            </span>
        </div>
    );
}

export function ScaleBar({ plane }) {
    const barRef = useRef(null);
    const labelRef = useRef(null);

    useEffect(
        () =>
            plane.subscribe((view) => {
                const bar = scaleBar(view.zoom);
                if (barRef.current) barRef.current.style.width = `${bar.width}px`;
                if (labelRef.current) labelRef.current.textContent = bar.label;
            }),
        [plane]
    );

    return (
        <div className="scalebar" aria-hidden="true">
            <div className="scalebar__rule" ref={barRef}>
                <span className="scalebar__tick" />
                <span className="scalebar__tick scalebar__tick--mid" />
                <span className="scalebar__tick" />
            </div>
            <span className="scalebar__label" ref={labelRef} />
        </div>
    );
}

export function NorthArrow() {
    return (
        <div className="north" aria-hidden="true">
            <svg viewBox="0 0 24 44" width="20" height="37" focusable="false">
                <path d="M12 1 L 19 30 L 12 24 L 5 30 Z" className="north__needle" />
                <path d="M12 24 L 12 43" className="north__stem" />
            </svg>
            <span className="north__label">N</span>
        </div>
    );
}

export function TitleBlock({ activeSheet, stationCount }) {
    const sheet = SHEETS.find((item) => item.id === activeSheet) ?? SHEETS[0];

    return (
        <div className="titleblock">
            <div className="titleblock__row titleblock__row--lead">
                <span className="titleblock__field">Sheet</span>
                <span className="titleblock__value">
                    {sheet.code} of {String(SHEETS.length).padStart(2, '0')} &mdash; {sheet.name}
                </span>
            </div>
            <div className="titleblock__row">
                <span className="titleblock__field">Survey</span>
                <span className="titleblock__value">Aaron Rono, 2018&ndash;2026</span>
            </div>
            <div className="titleblock__row">
                <span className="titleblock__field">Stations</span>
                <span className="titleblock__value">{stationCount} observed</span>
            </div>
            <div className="titleblock__row">
                <span className="titleblock__field">Projection</span>
                <span className="titleblock__value">Career transverse, zone 37S</span>
            </div>
        </div>
    );
}

export function SheetIndex({ activeSheet, onSelect }) {
    return (
        <nav className="index" aria-label="Sheet index">
            <h2 className="index__title" id="sheet-index-title">
                Sheet index
            </h2>
            <ul className="index__list">
                {SHEETS.map((sheet) => (
                    <li key={sheet.id}>
                        <button
                            type="button"
                            className="index__item"
                            aria-current={activeSheet === sheet.id ? 'true' : undefined}
                            onClick={() => onSelect(sheet)}
                        >
                            <span className="index__code">{sheet.code}</span>
                            <span className="index__name">{sheet.name}</span>
                            <span className="index__note">{sheet.note}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export function ZoomControls({ plane }) {
    return (
        <div className="zoomer">
            <button type="button" className="zoomer__button" onClick={() => plane.zoomByFactor(1.5)} aria-label="Zoom in">
                <span aria-hidden="true">+</span>
            </button>
            <button type="button" className="zoomer__button" onClick={() => plane.zoomByFactor(1 / 1.5)} aria-label="Zoom out">
                <span aria-hidden="true">&minus;</span>
            </button>
        </div>
    );
}
