import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

import CandleChart from './CandleChart';
import useRecord from './useRecord';
import { Headline, RangeControls, Readout } from './Readings';
import { MIN_SPAN, clamp } from '../../lib/record';

const DEFAULT_SPAN = 90;

function BackLink() {
    return (
        <Link className="record__back" href="/">
            <span aria-hidden="true">&larr;</span> The Survey
        </Link>
    );
}

function RecordBody({ record }) {
    const total = record.days.length;
    const last = total - 1;
    const [end, setEnd] = useState(last);
    const [span, setSpan] = useState(Math.min(DEFAULT_SPAN, total));
    const [replay, setReplay] = useState(0);
    const [cursor, setCursor] = useState(null);

    const view = useMemo(() => ({ start: Math.max(0, end - span + 1), end }), [end, span]);

    const pan = useCallback((target) => setEnd(clamp(Math.round(target), span - 1, last)), [span, last]);

    const zoom = useCallback(
        (factor, anchor) => {
            const next = clamp(Math.round(span * factor), MIN_SPAN, total);
            setSpan(next);
            setEnd(clamp(Math.round(anchor + ((end - anchor) * next) / span), next - 1, last));
        },
        [span, end, total, last]
    );

    const moveCursor = useCallback(
        (index, follow = false) => {
            if (index === null) {
                setCursor(null);
                return;
            }
            const next = clamp(index, 0, last);
            setCursor(next);
            if (follow && next < view.start) setEnd(clamp(next + span - 1, span - 1, last));
            if (follow && next > view.end) setEnd(clamp(next, span - 1, last));
        },
        [last, view, span]
    );

    const selectRange = (next) => {
        setSpan(Math.min(next, total));
        setEnd(last);
        setCursor(null);
        setReplay((count) => count + 1);
    };

    const day = record.days[cursor ?? last];

    return (
        <>
            <Headline record={record} />
            <div className="record__controls">
                <RangeControls span={span} isAtEnd={end === last} onSelect={selectRange} />
                <Readout id="record-readout" day={day} isToday={day.index === last} />
            </div>
            <CandleChart
                days={record.days}
                view={view}
                cursor={cursor}
                repos={record.repos}
                tone={record.momentum === null || record.momentum >= 0 ? 'up' : 'down'}
                replay={replay}
                onCursor={moveCursor}
                onPan={pan}
                onZoom={zoom}
                describedBy="record-readout"
            />
        </>
    );
}

export default function ActivityRecord() {
    const { status, record } = useRecord();

    return (
        <div className="record">
            <main className="record__sheet" id="main">
                <BackLink />
                {status === 'loading' && <p className="record__state">Reading the record&hellip;</p>}
                {status === 'error' && (
                    <p className="record__state">
                        The record could not be read just now. The same counts are on{' '}
                        <a href="https://github.com/cyenite">github.com/cyenite</a>.
                    </p>
                )}
                {status === 'ready' && <RecordBody record={record} />}
            </main>
        </div>
    );
}
