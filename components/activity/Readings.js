import { RANGES, formatFull, formatValue } from '../../lib/record';

export function Headline({ record }) {
    const { momentum } = record;
    const isUp = momentum === null || momentum >= 0;
    const updated = record.updated.replace('T', ' ').slice(0, 16);

    return (
        <div className="headline">
            <div className="headline__lead">
                <h1 className="headline__login">{record.login}</h1>
                <p className="headline__caption">GitHub contributions, daily</p>
                <p className="headline__live">
                    <span className="headline__dot" aria-hidden="true" />
                    <b>Live</b> · Updated {updated} UTC
                </p>
            </div>
            <div className="headline__figure">
                <p className="headline__total">{record.total.toLocaleString('en')}</p>
                <p className="headline__caption">Contributions in the last year</p>
                <p className="headline__trend" data-up={isUp}>
                    {momentum === null
                        ? 'No prior data'
                        : `${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}${(momentum * 100).toFixed(1)}% vs previous 4 weeks`}
                </p>
            </div>
        </div>
    );
}

export function RangeControls({ span, isAtEnd, onSelect }) {
    return (
        <div className="ranges" role="group" aria-label="Range">
            {RANGES.map((range) => (
                <button
                    key={range.label}
                    type="button"
                    className="ranges__button"
                    aria-pressed={isAtEnd && span === range.span}
                    onClick={() => onSelect(range.span)}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}

export function Readout({ id, day, isToday }) {
    const values = [
        ['O', day.open],
        ['H', day.high],
        ['L', day.low],
        ['C', day.close],
        ['MA20', day.ma20],
    ];

    return (
        <p className="readout" id={id} aria-live="polite">
            <span className="readout__date">
                {formatFull(day.date)}
                {isToday && <span className="readout__today"> · Today</span>}
            </span>
            <span className="readout__pair">
                <span className="readout__key">Contributions</span> {day.count}
            </span>
            {values.map(([key, value]) => (
                <span key={key} className="readout__pair" data-key={key}>
                    <span className="readout__key">{key}</span> {formatValue(value)}
                </span>
            ))}
        </p>
    );
}
