import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SHEETS, STATIONS } from '../../data/survey';
import Glyph from './Glyph';

/** Name prefix beats name substring beats stack beats kind, which is what people expect. */
function score(station, query) {
    const name = station.name.toLowerCase();
    if (name.startsWith(query)) return 0;
    if (name.includes(query)) return 1;
    if (station.stack.some((item) => item.toLowerCase().startsWith(query))) return 2;
    if (station.stack.some((item) => item.toLowerCase().includes(query))) return 3;
    if (station.kindLabel.toLowerCase().includes(query)) return 4;
    if (station.date.toLowerCase().includes(query)) return 5;
    if (station.blurb.toLowerCase().includes(query)) return 6;
    return -1;
}

export default function SearchPalette({ open, onClose, onPickStation, onPickSheet }) {
    const dialogRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const [query, setQuery] = useState('');
    const [cursor, setCursor] = useState(0);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) {
            return [
                ...SHEETS.map((sheet) => ({ type: 'sheet', key: `sheet-${sheet.id}`, sheet })),
                ...STATIONS.filter((s) => s.order === 1).map((station) => ({
                    type: 'station',
                    key: station.id,
                    station,
                })),
            ];
        }

        const sheetHits = SHEETS.filter(
            (sheet) => sheet.name.toLowerCase().includes(q) || sheet.note.toLowerCase().includes(q)
        ).map((sheet) => ({ type: 'sheet', key: `sheet-${sheet.id}`, sheet }));

        const stationHits = STATIONS.map((station) => ({ station, rank: score(station, q) }))
            .filter((hit) => hit.rank >= 0)
            .sort((a, b) => a.rank - b.rank || b.station.year - a.station.year)
            .map((hit) => ({ type: 'station', key: hit.station.id, station: hit.station }));

        return [...sheetHits, ...stationHits];
    }, [query]);

    useEffect(() => {
        setCursor(0);
    }, [query]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
            setQuery('');
            requestAnimationFrame(() => inputRef.current?.focus());
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    useEffect(() => {
        const item = listRef.current?.querySelector('[data-active="true"]');
        item?.scrollIntoView({ block: 'nearest' });
    }, [cursor, results]);

    const commit = useCallback(
        (result) => {
            if (!result) return;
            if (result.type === 'sheet') onPickSheet(result.sheet);
            else onPickStation(result.station);
            onClose();
        },
        [onClose, onPickSheet, onPickStation]
    );

    const onKeyDown = useCallback(
        (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setCursor((c) => Math.min(results.length - 1, c + 1));
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                commit(results[cursor]);
            }
        },
        [commit, cursor, results]
    );

    return (
        <dialog
            className="palette"
            ref={dialogRef}
            aria-label="Search the survey"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === dialogRef.current) onClose();
            }}
        >
            <div className="palette__inner">
                <div className="palette__field">
                    <label className="palette__prompt" htmlFor="palette-input">
                        Find
                    </label>
                    <input
                        id="palette-input"
                        ref={inputRef}
                        className="palette__input"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="station, stack, or sheet"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={onKeyDown}
                        aria-describedby="palette-hint"
                        aria-controls="palette-results"
                    />
                    <span className="palette__count">
                        {results.length} {results.length === 1 ? 'match' : 'matches'}
                    </span>
                </div>

                <ul className="palette__results" id="palette-results" ref={listRef}>
                    {results.map((result, index) => (
                        <li key={result.key}>
                            <button
                                type="button"
                                className="palette__result"
                                data-active={index === cursor ? 'true' : undefined}
                                onMouseEnter={() => setCursor(index)}
                                onClick={() => commit(result)}
                            >
                                {result.type === 'sheet' ? (
                                    <>
                                        <span className="palette__badge">{result.sheet.code}</span>
                                        <span className="palette__label">{result.sheet.name}</span>
                                        <span className="palette__meta">{result.sheet.note}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="palette__badge palette__badge--glyph">
                                            <Glyph shape={result.station.glyph} size={13} />
                                        </span>
                                        <span className="palette__label">{result.station.name}</span>
                                        <span className="palette__meta">
                                            {result.station.date} · {result.station.stack.slice(0, 3).join(', ')}
                                        </span>
                                    </>
                                )}
                            </button>
                        </li>
                    ))}
                    {results.length === 0 ? (
                        <li className="palette__empty">
                            Nothing plotted under that term. Try a language, a year, or a sheet name.
                        </li>
                    ) : null}
                </ul>

                <p className="palette__hint" id="palette-hint">
                    <kbd>↑</kbd>
                    <kbd>↓</kbd>
                    to move
                    <kbd>↵</kbd>
                    to fly there
                    <kbd>Esc</kbd>
                    to close
                </p>
            </div>
        </dialog>
    );
}
