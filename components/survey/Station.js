import { useCallback } from 'react';

import Glyph from './Glyph';

const LINK_LABEL = {
    'pub.dev': 'View package',
    'github.com': 'View repository',
    'tradingview.com': 'View published script',
    'ctrader.com': 'View product page',
    'marketplace.visualstudio.com': 'View marketplace listing',
    'plugins.jetbrains.com': 'View marketplace listing',
};

function linkLabel(href) {
    if (!href) return null;
    const match = Object.keys(LINK_LABEL).find((host) => href.includes(host));
    return match ? LINK_LABEL[match] : 'Open live site';
}

export default function Station({ station, activeTool, isOpen, onOpen, onPickTool }) {
    const { blurb, date, glyph, id, kindLabel, link, name, order, stack, x, y } = station;
    const label = linkLabel(link);
    const matches = activeTool ? stack.includes(activeTool) : null;

    const handleActivate = useCallback(() => onOpen(station), [onOpen, station]);

    return (
        <article
            className="station"
            data-order={order}
            data-open={isOpen ? 'true' : undefined}
            data-match={matches === true ? 'true' : undefined}
            data-dim={matches === false ? 'true' : undefined}
            style={{ left: `${x}px`, top: `${y}px` }}
        >
            <div className="station__pin">
                <button
                    type="button"
                    className="station__hit"
                    aria-expanded={isOpen}
                    aria-controls={`station-body-${id}`}
                    onClick={handleActivate}
                >
                    <Glyph shape={glyph} />
                    <span className="station__name">{name}</span>
                    <span className="station__meta">
                        <span className="station__date">{date}</span>
                        <span className="station__kind">{kindLabel}</span>
                    </span>
                </button>

                <div className="station__stack" aria-hidden="true">
                    {stack.slice(0, 2).map((item) => (
                        <span key={item} className="tag">
                            {item}
                        </span>
                    ))}
                    {stack.length > 2 ? <span className="tag tag--more">+{stack.length - 2}</span> : null}
                </div>

                <div className="station__body" id={`station-body-${id}`} hidden={!isOpen}>
                    <p className="station__what">{kindLabel}</p>
                    <p className="station__blurb">{blurb}</p>

                    <div className="station__built">
                        <span className="station__built-label">Built with</span>
                        <span className="station__built-list">
                            {stack.map((item, index) => (
                                <button
                                    key={item}
                                    type="button"
                                    className="tag tag--action"
                                    data-lead={index === 0 ? 'true' : undefined}
                                    aria-pressed={activeTool === item}
                                    onClick={() => onPickTool(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </span>
                    </div>

                    {link ? (
                        <a className="station__link" href={link} target="_blank" rel="noreferrer noopener">
                            {label}
                            <span aria-hidden="true"> ↗</span>
                        </a>
                    ) : (
                        <p className="station__unpublished">Never published</p>
                    )}
                </div>
            </div>
        </article>
    );
}
