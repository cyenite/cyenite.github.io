import { useMemo } from 'react';

import {
    BAND_COUNTS,
    BAND_LABELS,
    CONTACT,
    HORIZON,
    KINDS,
    OBSERVER,
    PROFILE,
    TOOL_INDEX,
    YEAR_TICKS,
} from '../../data/survey';
import Glyph from './Glyph';

/**
 * Sheet geometry lives in CSS so a narrow viewport can reflow a sheet into a
 * column that stays legible. Flights measure the rendered box at runtime, so
 * nothing here needs a hand-tuned camera position.
 */

function SheetHeader({ code, name, note }) {
    return (
        <header className="sheet__header">
            <span className="sheet__code">{code}</span>
            <h2 className="sheet__title" id={`sheet-${code}-title`}>
                {name}
            </h2>
            <p className="sheet__note">{note}</p>
        </header>
    );
}

export function ControlSheet() {
    return (
        <section className="sheet sheet--control" id="sheet-el-control" aria-labelledby="sheet-01-title">
            <div className="plate">
                <SheetHeader code="01" name="Control" note="Primary station and observer" />

                <p className="plate__eyeline">
                    <span className="plate__handle">{OBSERVER.handle}</span>
                    <span className="plate__datum">{OBSERVER.datum}</span>
                </p>

                <h1 className="plate__name">
                    Aaron
                    <br />
                    Rono
                </h1>

                <p className="plate__role">{OBSERVER.role}</p>
                <p className="plate__post">
                    <a href={OBSERVER.postLink} target="_blank" rel="noreferrer noopener">
                        {OBSERVER.post}
                        <span aria-hidden="true"> ↗</span>
                    </a>
                </p>

                <p className="plate__summary">{OBSERVER.summary}</p>
            </div>

            <div className="origin-mark" aria-hidden="true">
                <svg viewBox="0 0 64 64" width="44" height="44" focusable="false">
                    <circle cx="32" cy="32" r="15" />
                    <circle cx="32" cy="32" r="2.4" className="origin-mark__core" />
                    <path d="M32 2 V 17 M32 47 V 62 M2 32 H 17 M47 32 H 62" />
                </svg>
                <p className="origin-mark__label">
                    <span>STN 0</span>
                    origin
                </p>
            </div>

            <div className="observations">
                <h3 className="observations__title">Field notes</h3>
                <ul className="observations__list">
                    {OBSERVER.lines.map((line, index) => (
                        <li key={line}>
                            <span className="observations__index" aria-hidden="true">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            {line}
                        </li>
                    ))}
                </ul>
                <p className="observations__hint">
                    Drag to traverse, scroll to change scale, press <kbd>/</kbd> to search.
                </p>
            </div>
        </section>
    );
}

const SURVEY_ORIGIN = { x: 1060, y: -1240 };

export function SurveySheet({ count, openBand, onToggleBand }) {
    return (
        <section
            className="sheet sheet--survey"
            id="sheet-el-survey"
            aria-labelledby="sheet-02-title"
            style={{
                left: `${SURVEY_ORIGIN.x}px`,
                top: `${SURVEY_ORIGIN.y}px`,
                width: '3360px',
                height: '2500px',
            }}
        >
            <div className="survey__plate">
                <SheetHeader code="02" name="Activities" note={`${count} things built, 2018 to 2026`} />
            </div>

            <div className="survey__axis">
                <span className="survey__axis-name" aria-hidden="true">
                    when it shipped
                </span>
                {YEAR_TICKS.map((tick) => (
                    <span
                        key={tick.year}
                        className="survey__tick"
                        aria-hidden="true"
                        style={{ left: `${tick.x - SURVEY_ORIGIN.x}px` }}
                    >
                        <span className="survey__tick-label">{tick.year}</span>
                    </span>
                ))}
            </div>

            {BAND_LABELS.map((band) => (
                <div
                    key={band.id}
                    className="survey__band"
                    style={{ top: `${band.y - SURVEY_ORIGIN.y}px` }}
                >
                    <div className="survey__band-label">
                        <button
                            type="button"
                            className="survey__band-button"
                            aria-expanded={openBand === band.id}
                            aria-controls={`band-about-${band.id}`}
                            onClick={() => onToggleBand(band.id)}
                        >
                            <span className="survey__band-name">{band.name}</span>
                            <span className="survey__band-count">{BAND_COUNTS[band.id] ?? 0}</span>
                            <span className="survey__band-note">{band.note}</span>
                        </button>
                        <p
                            className="survey__band-about"
                            id={`band-about-${band.id}`}
                            hidden={openBand !== band.id}
                        >
                            {band.about}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}

const SECTION_FLOOR = 2014;
const MAX_DEPTH = HORIZON - SECTION_FLOOR;
const LABEL_GAP = 14;

/**
 * A borehole log. Depth is years before the present, so a stratum's top is when
 * that period ended. Concurrent periods genuinely overlap in depth, so they are
 * assigned to lanes the way a draughtsman splits a log into parallel columns,
 * and labels are pushed down to clear one another.
 */
function layoutSection(entries) {
    const depthOf = (year) => ((HORIZON - year) / MAX_DEPTH) * 100;
    const lanes = [];

    const bands = entries.map((entry) => {
        const top = depthOf(entry.to);
        const bottom = depthOf(entry.from);

        let lane = 0;
        while (lanes[lane]?.some((other) => top < other.bottom && bottom > other.top)) lane += 1;
        const band = { ...entry, top, bottom, lane };
        if (!lanes[lane]) lanes[lane] = [];
        lanes[lane].push(band);

        return band;
    });

    let cursor = -Infinity;
    for (const band of [...bands].sort((a, b) => a.top - b.top)) {
        band.labelTop = Math.max(band.top, cursor + LABEL_GAP);
        cursor = band.labelTop;
    }

    return { bands, laneCount: lanes.length };
}

const DEPTH_TICKS = [0, 2, 4, 6, 8, 10, 12];

function spanLabel({ from, to }) {
    if (to >= HORIZON) return `${Math.floor(from)} to now`;
    const start = Math.floor(from);
    const end = Math.floor(to);
    return start === end ? String(start) : `${start}\u2013${end}`;
}

export function SectionSheet() {
    const { bands, laneCount } = useMemo(() => layoutSection(PROFILE), []);

    return (
        <section className="sheet sheet--section" id="sheet-el-section" aria-labelledby="sheet-03-title">
            <div className="section__plate">
                <SheetHeader code="03" name="Section" note="Where the training came from" />
            </div>

            <div className="section__drawing">
                <div className="section__depth" aria-hidden="true">
                    {DEPTH_TICKS.map((depth) => (
                        <span
                            key={depth}
                            className="section__depth-tick"
                            style={{ top: `${(depth / MAX_DEPTH) * 100}%` }}
                        >
                            {depth}
                        </span>
                    ))}
                    <span className="section__depth-unit">yr bp</span>
                </div>

                <div className="section__core" style={{ '--lanes': laneCount }} aria-hidden="true">
                    {bands.map((band) => (
                        <div
                            key={band.id}
                            className="core-band"
                            data-kind={band.kind}
                            style={{
                                top: `${band.top}%`,
                                height: `${band.bottom - band.top}%`,
                                left: `calc(${band.lane} * (100% / var(--lanes)))`,
                                width: `calc(100% / var(--lanes))`,
                            }}
                        />
                    ))}
                </div>

                <ol className="section__log">
                    {bands.map((band) => (
                        <li key={band.id} className="log-entry" style={{ top: `${band.labelTop}%` }}>
                            <span className="log-entry__span">{spanLabel(band)}</span>
                            <h3>{band.name}</h3>
                            <p className="log-entry__detail">{band.detail}</p>
                            <p className="log-entry__note">{band.note}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export function LegendSheet({ activeTool, onPickTool }) {
    return (
        <section className="sheet sheet--legend" id="sheet-el-legend" aria-labelledby="sheet-04-title">
            <div className="legend__plate">
                <SheetHeader code="04" name="Legend" note="Key, tools, and how to reach me" />
            </div>

            <div className="legend__grid">
                <div className="legend__box legend__box--symbols">
                    <h3 className="legend__heading">What the markers mean</h3>
                    <ul className="symbology">
                        {Object.entries(KINDS).map(([key, value]) => (
                            <li key={key}>
                                <Glyph shape={value.glyph} size={15} />
                                <span>{value.label}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="legend__gloss">
                        The contour lines are computed from the plotted work, not drawn: each line
                        encloses ground where more was shipped. Shape carries the meaning, so the
                        key still reads in greyscale.
                    </p>
                </div>

                <div className="legend__box legend__box--tools">
                    <h3 className="legend__heading">Tools</h3>
                    <p className="legend__lede">
                        Grouped by what they are, sized by how often they were used. Pick one to see
                        everything built with it.
                    </p>
                    {TOOL_INDEX.map((group) => (
                        <div className="toolgroup" key={group.id}>
                            <h4 className="toolgroup__name">{group.name}</h4>
                            <ul className="toolgroup__list">
                                {group.items.map((item) => (
                                    <li key={item.name}>
                                        <button
                                            type="button"
                                            className="tool"
                                            data-weight={
                                                item.count >= 7 ? 'high' : item.count >= 3 ? 'mid' : 'low'
                                            }
                                            aria-pressed={activeTool === item.name}
                                            onClick={() => onPickTool(item.name)}
                                        >
                                            <span className="tool__name">{item.name}</span>
                                            <span className="tool__count">{item.count}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="legend__box legend__box--contact">
                    <h3 className="legend__heading">Sheet contact</h3>
                    <ul className="contact">
                        <li>
                            <span className="contact__field">Email</span>
                            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                        </li>
                        <li>
                            <span className="contact__field">GitHub</span>
                            <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">
                                github.com/cyenite
                            </a>
                        </li>
                        <li>
                            <span className="contact__field">LinkedIn</span>
                            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer noopener">
                                linkedin.com/in/aaronkip
                            </a>
                        </li>
                        <li>
                            <span className="contact__field">Resume</span>
                            <a href={CONTACT.resume} target="_blank" rel="noreferrer noopener">
                                cyenite-resume.pdf
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
